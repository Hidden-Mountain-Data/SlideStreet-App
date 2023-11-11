import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ProxyDeviceManagerService } from '../proxy/services/proxy-device-manager.service';
import {
  DeviceGatewayClientsResponse,
  DevicesResponse,
} from './types/device-manager';

@Controller('device-manager')
export class DeviceManagerController {
  private readonly logger = new Logger(DeviceManagerController.name);

  constructor(
    private readonly deviceManagerProxyService: ProxyDeviceManagerService,
  ) { }

  @Get('devices')
  async getDevices(): Promise<DevicesResponse> {
    return await this.deviceManagerProxyService.proxyRequest(
      'GET',
      '/api/devices/',
    );
  }

  @Post('access-token')
  async getAccessToken(
    @Body() body: AccessTokenRequest,
  ): Promise<AccessTokenResponse> {
    const data = {
      ...body,
      grant_type: 'password',
    };

    return await this.deviceManagerProxyService.proxyRequest(
      'POST',
      '/oauth2/access_token',
      data,
    );
  }

  @Get('devices/:deviceId/gateway/clients')
  async getDeviceClients(
    @Param('deviceId') deviceId: string,
  ): Promise<DeviceGatewayClientsResponse> {
    return await this.deviceManagerProxyService.proxyRequest(
      'GET',
      `/api/devices/${deviceId}/gateway/clients`,
    );
  }

  @Post('refresh-token')
  async handleRefreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return await this.deviceManagerProxyService.requestNewTokenWithRefreshToken(
      refreshToken,
    );
  }
}
