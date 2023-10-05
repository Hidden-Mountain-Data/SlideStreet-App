import { All, Controller, Logger, Req } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Request } from 'express';
import { DeviceManagerProxyService } from './services/proxy-device-manager.service';
import { InConnectProxyService } from './services/proxy-in-connect.service';

@Controller('proxy')
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(
    private readonly inConnectService: InConnectProxyService,
    private readonly deviceManagerService: DeviceManagerProxyService,
  ) {}

  @All('inconnect/*')
  async handleInConnect(@Req() req: Request): Promise<AxiosResponse> {
    try {
      const method = req.method.toLowerCase();
      return await this.inConnectService.proxyRequest(
        method,
        req.url,
        req.body,
      );
    } catch (error) {
      this.logger.error(`Failed to proxy request to ${req.url}`, error);
      throw error;
    }
  }

  @All('devicemanager/*')
  async handleDeviceManager(@Req() req: Request): Promise<AxiosResponse> {
    try {
      const method = req.method.toLowerCase();
      return await this.deviceManagerService.proxyRequest(
        method,
        req.url,
        req.body,
      );
    } catch (error) {
      this.logger.error(`Failed to proxy request to ${req.url}`, error);
      throw error;
    }
  }
}
