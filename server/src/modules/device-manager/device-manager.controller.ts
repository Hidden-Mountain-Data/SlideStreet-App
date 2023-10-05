import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
  async getAccessToken(@Body() body: any) {
    this.logger.log('getAccessToken called with body:', body);
    const data = {
      grant_type: 'password',
      username: body.email,
      password: body.password,
      password_type: '1',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    this.logger.debug(`username: ${data.username}`);
    this.logger.debug(`password: ${data.password}`);
    this.logger.debug(`Client ID: ${data.client_id}`);
    this.logger.debug(`Client Secret: ${data.client_secret}`);

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
  async refreshAccessToken(@Query() query: any) {
    this.logger.log('getDeviceClients called.');

    try {
      const endpoint = `/oauth2/access_token?grant_type=${query.grant_type}&client_id=${query.client_id}&client_secret=${query.client_secret}&refresh_token=${query.refresh_token}`;
      return await this.deviceManagerProxyService.proxyRequest(
        'POST',
        endpoint,
      );
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(
        `Error refreshAccessToken() in DeviceManagerController: ${errorMessage}`,
      );
      throw error;
    }
  }
}
