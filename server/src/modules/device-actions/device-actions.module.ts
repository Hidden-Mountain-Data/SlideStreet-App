import { Module } from '@nestjs/common';
import { DeviceActionsService } from './device-actions.service';

@Module({
  providers: [DeviceActionsService]
})
export class DeviceActionsModule {}
