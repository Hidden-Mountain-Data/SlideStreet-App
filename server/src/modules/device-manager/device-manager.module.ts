import { Module } from '@nestjs/common';
import { ProxyModule } from '../proxy/proxy.module';
import { DeviceManagerController } from './device-manager.controller';
import { DeviceManagerService } from './device-manager.service';

@Module({
  imports: [ProxyModule],
  controllers: [DeviceManagerController],
  providers: [DeviceManagerService],
})
export class DeviceManagerModule {}
