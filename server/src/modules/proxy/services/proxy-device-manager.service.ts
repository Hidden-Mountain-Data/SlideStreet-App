import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProxyDeviceManagerService {
  private readonly logger = new Logger(ProxyDeviceManagerService.name);

  private accessToken: string;
  private accessTokenExpiry: number;
  private refreshToken: string;
  private refreshTokenTimeout: NodeJS.Timeout;

  private clientId: string = process.env.CLIENT_ID;
  private clientSecret: string = process.env.CLIENT_SECRET;

  private pingInterval: NodeJS.Timeout;
  private pingDuration: number = 1.5 * 60 * 1000;

  private currentTime = new Date(Date.now()).toLocaleString();

  constructor(private readonly httpService: HttpService) {}

  private startPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      const tokenRefreshTime = new Date(
        this.accessTokenExpiry,
      ).toLocaleString();
      this.logger.debug(
        `Ping! Current time is ${new Date(
          this.currentTime,
        ).toLocaleString()} and token will be refreshed at: ${tokenRefreshTime}`,
      );
    }, this.pingDuration);
  }

  private async initializeTokens(): Promise<void> {
    this.logger.debug('initializeTokens called.');

    const tokenEndpoint = `${process.env.IOT_ENDPOINT}/oauth2/access_token`;

    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${this.accessToken}`,
      },
      url: tokenEndpoint,
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.CLIENT_ID || '',
        client_secret: process.env.CLIENT_SECRET || '',
        refresh_token: '836f359621706ba3d914e438d73ed66b',
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.request(requestConfig),
      );
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      const expiresInMilliseconds = response.data.expires_in
        ? response.data.expires_in * 1000
        : 15 * 60 * 1000;

      this.accessTokenExpiry = Date.now() + expiresInMilliseconds;

      this.scheduleTokenRefresh();
      this.startPingInterval();

      this.logger.debug('accessToken in initializeTokens:', this.accessToken);
      this.logger.debug('refreshToken in initializeTokens:', this.refreshToken);
      this.logger.debug(
        'expiresInMilliseconds in initializeTokens:',
        expiresInMilliseconds,
      );
      this.logger.debug(
        'accessTokenExpiry in initializeTokens:',
        this.accessTokenExpiry,
      );
    } catch (error) {
      this.logger.error(
        'Failed to initialize tokens for Device Manager',
        error,
      );
      throw error;
    }
  }

  private scheduleTokenRefresh(): void {
    this.logger.debug(
      'scheduleTokenRefresh called at:',
      new Date().toLocaleString(),
    );

    const expiresInMilliseconds = this.accessTokenExpiry - Date.now();
    const tokenRefreshTime = new Date(this.accessTokenExpiry).toLocaleString();

    this.logger.debug(
      `Token will be refreshed exactly at: ${tokenRefreshTime}`,
    );

    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    const bufferTime = 1 * 60 * 1000;

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshAccessToken(this.refreshToken);
    }, expiresInMilliseconds - bufferTime);
  }

  private async ensureTokenIsValid(): Promise<void> {
    if (
      !this.accessToken ||
      this.accessTokenExpiry - Date.now() < 1 * 60 * 1000
    ) {
      await this.initializeTokens();
    }
  }

  async proxyRequest(method: string, url: string, data?: any) {
    this.logger.debug('proxyRequest for accessToken called at: ', Date.now());
    await this.ensureTokenIsValid();

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(this.accessToken
        ? { Authorization: `Bearer ${this.accessToken}` }
        : {}),
    };
    const requestConfig: AxiosRequestConfig = {
      method,
      headers,
    };
    let params = {};

    if (data) {
      const { username, password, grant_type: grantType } = data;
      params = {
        username,
        password,
        grant_type: grantType,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };
    }

    const requestUrl = `${process.env.IOT_ENDPOINT}${url}`;

    this.logger.debug('requestUrl: ' + requestUrl);
    this.logger.debug('params: ' + JSON.stringify(params));

    try {
      const response = await lastValueFrom(
        this.httpService.request({ ...requestConfig, url: requestUrl, params }),
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError?.response) {
        this.logger.error('Error Response from External Service:', {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          data: axiosError.response.data,
        });
      } else {
        const errorMessage = (error as Error).message;
        this.logger.error('Error:', errorMessage);
      }

      if (axiosError?.response?.status === 401) {
        this.logger.debug('in the 401 response');
        await this.refreshAccessToken(this.refreshToken);
        return this.proxyRequest(method, url, data);
      }

      this.logger.error('Failed to proxy request to Device Manager');
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      this.logger.debug('refreshAccessToken called at:', Date.now());
      const tokenEndpoint = `${process.env.IOT_ENDPOINT}/oauth2/access_token`;

      const response = await lastValueFrom(
        this.httpService.post(tokenEndpoint, null, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          params: {
            grant_type: 'refresh_token',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: refreshToken,
          },
        }),
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      this.scheduleTokenRefresh();

      clearInterval(this.pingInterval);
      this.logger.debug('Token has been refreshed, stopping the ping!');

      return {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      };
    } catch (error) {
      this.logger.error('Failed to refresh token for Device Manager', error);
      throw error;
    }
  }

  async requestNewTokenWithRefreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const tokenEndpoint = `${process.env.IOT_ENDPOINT}/oauth2/access_token`;

    const data = {
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    };

    this.logger.debug(
      '${process.env.IOT_ENDPOINT} in requestNewTokenWithRefreshToken in service:',
      process.env.IOT_ENDPOINT,
    );
    this.logger.debug(
      'data in requestNewTokenWithRefreshToken in service:',
      data,
    );

    try {
      const response = await lastValueFrom(
        this.httpService.post(tokenEndpoint, null, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          params: data,
        }),
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      this.scheduleTokenRefresh();

      return {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      };
    } catch (error) {
      this.logger.error('Failed to get a new token with refresh token', error);
      throw error;
    }
  }
}
