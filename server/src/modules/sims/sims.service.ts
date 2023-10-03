import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Sims } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { SimAndRouterInfo } from '../../types/sim-types';
import { Router } from '../routers/entities/router.entity';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';

@Injectable()
export class SimsService {
  constructor(private prisma: PrismaService) {}

  async addSimToAccount(
    createSimData: CreateSimDto,
    userId: number,
  ): Promise<Sim | HttpException> {
    console.log(
      'Inside addSimToAccount userId: ',
      userId,
      'createSimData',
      createSimData,
    );
    try {
      const createdSim = await this.prisma.sims.create({
        data: {
          userId,
          iccid: createSimData.iccid,
          embedded: false,
        },
      });

      // console.log('createdSim:', createdSim);
      // console.log('simId:', createdSim.simId);

      return createdSim;
    } catch (error) {
      throw new Error(`Failed to create a new Sim: ${error}`);
    }
  }

  async isSimOwnedByUser(simId: number, userId: number): Promise<boolean> {
    try {
      const sim = await this.prisma.sims.findUnique({
        where: { simId: +simId },
      });

      return sim?.userId === userId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'An unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async connectSimToRouter(
    simId: number,
    routerId: number,
  ): Promise<SimAndRouterInfo> {
    const existingSim = await this.prisma.sims.findUnique({ where: { simId } });
    const existingRouter = await this.prisma.routers.findUnique({
      where: { routerId },
      include: {
        sims: true,
      },
    });

    if (!existingSim || !existingRouter) {
      console.log('Either Sim or Router does not exist');
      throw new HttpException(
        'Either Sim or Router does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasEmbeddedSim = existingRouter.sims.some((sim) => sim.embedded);
    if (hasEmbeddedSim && existingSim.embedded) {
      console.log(
        'Cannot add an embedded Sim to a router that already has one',
      );
      throw new HttpException(
        'Cannot add an embedded Sim to a router that already has one',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const [updatedSim, updatedRouter] = await this.prisma.$transaction([
        this.prisma.sims.update({
          where: { simId },
          data: { routerId },
        }),
        this.prisma.routers.update({
          where: { routerId },
          data: { simId },
        }),
      ]);
      console.log('Successfully connected Sim to Router', updatedSim);

      return { sim: updatedSim, router: updatedRouter };
    } catch (error) {
      console.log('Transaction failed', error);
      throw new HttpException(
        'Failed to connect Sim to Router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllSimsByUserId(userId: number): Promise<Sims[]> {
    try {
      console.log('Trying to find sim by userId:', userId);
      const sims = await this.prisma.sims.findMany({
        where: { userId: +userId },
      });
      console.log('Found sims:', sims);
      return sims;
    } catch (error) {
      console.log(
        'Error finding sims by userId:',
        error,
        userId,
        typeof userId,
      );
      throw new HttpException(
        'Failed to fetch Sims',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRouterInfoBySimId(simId: number): Promise<Router> {
    const simRecord = await this.prisma.sims.findUnique({
      where: { simId },
      include: {
        router: {
          include: { routerLocation: true },
        },
      },
    });

    if (!simRecord || !simRecord.router) {
      throw new HttpException(
        'Router not found for the given SIM ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return simRecord.router;
  }

  async findRouterAndSimInfoBySimId(
    simId: number,
  ): Promise<Sims | HttpException> {
    console.log(`Fetching data for simId: ${simId}`);

    const simRecord = await this.prisma.sims.findUnique({
      where: { simId },
      include: {
        router: {
          include: { routerLocation: true },
        },
      },
    });

    console.log('Sim Record:', simRecord);

    if (!simRecord || !simRecord.router) {
      throw new HttpException(
        'Router not found for the given SIM ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return simRecord;
  }

  async findSimInfoBySimId(simId: number): Promise<Sims | HttpException> {
    console.log(`Fetching data usage for simId: ${simId}`);

    const simRecord = await this.prisma.sims.findUnique({
      where: { simId },
      include: {
        dataUsageEntries: true,
        router: {
          include: { routerLocation: true },
        },
      },
    });

    if (!simRecord || !simRecord.dataUsageEntries) {
      throw new HttpException(
        'Router not found for the given SIM ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const sanitizedSimRecord = JSON.parse(
      JSON.stringify(simRecord, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      }),
    );

    console.log('Sanitized Sim Record:', sanitizedSimRecord);
    return sanitizedSimRecord;
  }

  async updateSimById(
    simId: number,
    updateSimDto: UpdateSimDto,
  ): Promise<Sim | HttpException> {
    try {
      const updatedSim = await this.prisma.sims.update({
        where: { simId },
        data: updateSimDto,
      });
      return updatedSim;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'An unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async removeSimById(
    simId: number,
    userId: number,
  ): Promise<void | HttpException> {
    const isOwned = await this.isSimOwnedByUser(simId, userId);
    if (!isOwned) {
      throw new HttpException(
        'Router not found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }

    const simRecord = await this.prisma.sims.findUnique({
      where: { simId },
    });

    console.log('Fetched simRecord:', simRecord);

    if (simRecord?.embedded) {
      throw new HttpException(
        'Cannot remove an embedded SIM',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (simRecord && !simRecord.embedded) {
      try {
        await this.prisma.dataUsages.deleteMany({
          where: { simId },
        });

        await this.prisma.sims.delete({ where: { simId } });
      } catch (error) {
        console.error('Deletion Error:', error);
        throw new HttpException(
          'Failed to remove Sim',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
