import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Routers } from '@prisma/client'
@Injectable()
export class DeviceActionsService {

  constructor(
    private prisma: PrismaService,
  ) { }

  async getDevices(): Promise<Routers[]> {
    const routers = await this.prisma.routers.findMany();
    return routers
  }
  async getDevicesByUserId(userId: number): Promise<Routers[]> {
    const routers = await this.prisma.routers.findMany({
      where: {
        userId: userId
      }
    });
    return routers
  }

  async getDeviceDetails(simId: number): Promise<Routers> {
    const router = await this.prisma.routers.findFirst({
      where: {
        simId: simId
      }
    })
    return router
  }


}
