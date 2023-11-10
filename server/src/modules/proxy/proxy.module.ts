import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProxyDeviceManagerService } from './services/proxy-device-manager.service';
import { ProxyInConnectService } from './services/proxy-in-connect.service';

@Module({
  imports: [HttpModule],
  providers: [ProxyInConnectService, ProxyDeviceManagerService],
  exports: [ProxyInConnectService, ProxyDeviceManagerService],
})
export class ProxyModule {}
