import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Routers, Model } from '@prisma/client'
import { RouterDto } from './dto/router.dto';
@Injectable()
export class DeviceActionsService {

  constructor(
    private prisma: PrismaService,
  ) { }

  async getDevices(): Promise<RouterDto[]> {
    const routers = await this.prisma.routers.findMany({
      include: {
        sims: true,
        dataUsageEntries: true
      }
    });

    const routersConversion = routers.map((router) => {
      const totalDataUsage = router.dataUsageEntries.reduce((total, entry) => {
        return total + Number(entry.dataUsage)
      }, 0);

      return {
        routerId: router.routerId,
        simId: router.simId,
        userId: router.userId,
        name: router.name,
        model: router.model,
        notes: router.notes,
        imei: router.imei,
        iccid: router.iccid,
        serialNumber: router.serialNumber,
        createdAt: router.createdAt,
        updatedAt: router.updatedAt,
        deletedAt: router.deletedAt,
        //This assumes that there is only one sim per router
        eid: router.sims[0].eid,
        active: router.sims[0].active,
        embedded: router.sims[0].embedded,
        provider: router.sims[0].provider,
        dataUsage: totalDataUsage.toString(),
        //NOTE Needed fields
        //Activation Date
        //Network Plan and Rate
        // Contract Term
        // Auto notes?
        //Data cap
        //status?
      };
    });

    return routersConversion;
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
