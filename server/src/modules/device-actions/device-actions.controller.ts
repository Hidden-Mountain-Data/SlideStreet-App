import { Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { DeviceActionsService } from './device-actions.service';
import { UserProvider } from '../users/user.provider';
import { Routers } from '@prisma/client';
import { TealService } from '../teal/teal.service';

@Controller('device-actions')
export class DeviceActionsController {
  constructor(
    private readonly deviceActionsService: DeviceActionsService,
    // private readonly tealService: TealService,
    // private readonly userProvided: UserProvider
  ) { }

  private readonly logger = new Logger(DeviceActionsController.name);


  @Get('devices')
  async getDevices(): Promise<Routers[]> {
    try {
      // switch(this.userProvided.user.role) {
      //   case 'SUPER_ADMIN':
      return await this.deviceActionsService.getDevices();
      //     break;
      //   default:
      //     return await this.deviceActionsService.getDevicesByUserId(this.userProvided.user.userId);
      //     break;
      // }
    } catch(error) {
      this.logger.log(error)
      return //REVIEW Return appropriate error
    }
  }
  @Get('device-details')
  async getDeviceDetails(@Query() simId: number): Promise<Routers> {
    try {
      return await this.deviceActionsService.getDeviceDetails(simId)
    } catch(error) {
      this.logger.log(error)
      return //REVIEW return error
    }
  }
  // @Post('activate')
  // async activateDevice(@Query() sims: number[]) {
  //   try {
  //     return await this.tealService.activateeSIMs(sims)
  //   } catch(error) {
  //     this.logger.log(error)
  //   }
  // }
}
