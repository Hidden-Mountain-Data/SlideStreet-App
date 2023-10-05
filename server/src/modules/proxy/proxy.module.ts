import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DeviceManagerProxyService } from './services/proxy-device-manager.service';
import { InConnectProxyService } from './services/proxy-in-connect.service';

@Module({
  imports: [HttpModule],
  providers: [InConnectProxyService, DeviceManagerProxyService],
  exports: [InConnectProxyService, DeviceManagerProxyService],
})
export class ProxyModule {}
