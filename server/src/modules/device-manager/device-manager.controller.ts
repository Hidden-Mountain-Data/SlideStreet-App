import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ProxyDeviceManagerService } from '../proxy/services/proxy-device-manager.service';

@Controller('device-manager')
export class DeviceManagerController {
  private readonly logger = new Logger(DeviceManagerController.name);

  constructor(
    private readonly deviceManagerProxyService: ProxyDeviceManagerService,
  ) {}

  @Get('devices')
  async getDevices() {
    this.logger.log('getDevices called.');

    try {
      return await this.deviceManagerProxyService.proxyRequest(
        'GET',
        '/api/devices/',
      );
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(
        `Error getDevices() in DeviceManagerController: ${errorMessage}`,
      );
      throw error;
    }
  }

  @Post('access-token')
  async getAccessToken(
    @Body() body: AccessTokenRequest,
  ): Promise<AccessTokenResponse> {
    const data = {
      ...body,
      grant_type: 'password',
    };

    try {
      return await this.deviceManagerProxyService.proxyRequest(
        'POST',
        '/oauth2/access_token',
        data,
      );
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(
        `Error getAccessToken() in DeviceManagerController: ${errorMessage}`,
      );
      throw error;
    }
  }

  @Get('devices/:deviceId/gateway/clients')
  async getDeviceClients(@Param('deviceId') deviceId: string) {
    this.logger.log('getDeviceClients called.');

    try {
      return await this.deviceManagerProxyService.proxyRequest(
        'GET',
        `/api/devices/${deviceId}/gateway/clients`,
      );
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(
        `Error getDeviceClients() in DeviceManagerController: ${errorMessage}`,
      );
      throw error;
    }
  }

  @Post('refresh-token')
  async handleRefreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    this.logger.log(
      'handleRefreshToken called. Refresh token: ' + refreshToken,
    );

    try {
      return await this.deviceManagerProxyService.requestNewTokenWithRefreshToken(
        refreshToken,
      );
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(
        `Error handleRefreshToken() in DeviceManagerController: ${errorMessage}`,
      );
      throw error;
    }
  }
}
