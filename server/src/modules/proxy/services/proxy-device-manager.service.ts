import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'; // Added Logger for logging
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyDeviceManagerService implements OnModuleInit {
  private readonly logger = new Logger(ProxyDeviceManagerService.name);

  private readonly deviceManagerUrl: string = 'https://iot.inhandnetworks.com';

  private accessToken: string;
  private refreshToken: string;

  constructor(private readonly httpService: HttpService) {
    this.initializeTokens();
  }

  async onModuleInit() {
    await this.initializeTokens();
  }

  private async initializeTokens() {
    this.logger.debug('initializeTokens called.');
    try {
      const tokenEndpoint = `${this.deviceManagerUrl}/oauth2/access_token`;

      const response = await this.httpService
        .post(tokenEndpoint, null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            grant_type: 'refresh_token',
            client_id: '000017953450251798098136',
            client_secret: '08E9EC6793345759456CB8BAE52615F3',
            refresh_token: '836f359621706ba3d914e438d73ed66b',
          },
        })
        .toPromise();

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    } catch (error) {
      this.logger.error(
        'Failed to initialize tokens for Device Manager',
        error,
      );
      throw error;
    }
  }

  async proxyRequest(method: string, url: string, data?: any) {
    this.logger.debug('proxyRequest called.');
    try {
      const decodedData = {
        ...data,
        username: decodeURIComponent(data.username),
      };
      this.logger.debug('decodedData: ' + JSON.stringify(decodedData));
      const queryString = new URLSearchParams(decodedData).toString();

      this.logger.debug('queryString: ' + queryString); // ! THIS LOGS clarence@cannon.cloud

      const requestConfig = {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        url: `${this.deviceManagerUrl}${url}?${queryString}`,
      };

      this.logger.debug('requestConfig: ' + JSON.stringify(requestConfig)); // ! THIS LOGS: clarence%40cannon.cloud

      const response$ = this.httpService.request(requestConfig);
      return await firstValueFrom(response$);
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
        await this.refreshAccessToken();
        return this.proxyRequest(method, url, data);
      }

      this.logger.error('Failed to proxy request to Device Manager');
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      const tokenEndpoint = `${this.deviceManagerUrl}/oauth2/access_token`;

      const response = await this.httpService
        .post(tokenEndpoint, null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            grant_type: 'refresh_token',
            client_id: '000017953450251798098136',
            client_secret: '08E9EC6793345759456CB8BAE52615F3',
            refresh_token: this.refreshToken,
          },
        })
        .toPromise();

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    } catch (error) {
      this.logger.error('Failed to refresh token for Device Manager', error);
      throw error;
    }
  }
}
