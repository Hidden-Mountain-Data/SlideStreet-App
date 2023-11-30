import { Module } from '@nestjs/common';
import { DeviceActionsService } from './device-actions.service';
import { PrismaService } from 'src/services/prisma.service';
import { UserProvider } from '../users/user.provider';
import { TealService } from '../teal/teal.service';
import { UsersModule } from '../users/users.module';
import { DeviceActionsController } from './device-actions.controller';

@Module({
  imports: [
    UsersModule,
  ],
  controllers: [DeviceActionsController],
  providers: [
    DeviceActionsService,
    PrismaService,
    UserProvider,
    TealService,
  ],
  exports: [DeviceActionsService],
})
export class DeviceActionsModule { }
