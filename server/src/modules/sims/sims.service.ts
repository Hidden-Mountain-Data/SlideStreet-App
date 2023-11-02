import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Sims, User } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { SimAndRouterInfo } from '../../types/sim-types';
import { Router } from '../routers/entities/router.entity';
import { UserProvider } from '../users/user.provider';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';

@Injectable()
export class SimsService {
  private readonly logger = new Logger(SimsService.name);

  constructor(
    private prisma: PrismaService,
    private readonly userProvider: UserProvider,
  ) {}

  private currentUser(): User {
    return this.userProvider.user;
  }

  async addSimToAccount(createSimData: CreateSimDto): Promise<Sim> {
    const user = await this.prisma.user.findUnique({
      where: { userId: this.currentUser().userId },
    });

    try {
      return await this.prisma.sims.create({
        data: {
          userId: user.userId,
          iccid: createSimData.iccid,
          embedded: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error adding sim to account for user: ${
          user.userId
        }. DTO: ${JSON.stringify(createSimData)}`,
        error instanceof Error ? error.stack : 'unknown error',
      );
      throw new InternalServerErrorException('Could not update the sim');
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
      this.logger.warn(
        `Either Sim with simId: ${simId} or Router with routerId: ${routerId} does not exist`,
      );
      throw new HttpException(
        'Either Sim or Router does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasEmbeddedSim = existingRouter.sims.some((sim) => sim.embedded);
    if (hasEmbeddedSim && existingSim.embedded) {
      this.logger.warn(
        `Cannot add an embedded Sim with simId: ${simId} to a router with routerId: ${routerId} that already has one`,
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

      return { sim: updatedSim, router: updatedRouter };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to connect Sim with simId: ${simId} to Router with routerId: ${routerId}`,
        error instanceof Error ? error.stack : 'unknown error',
      );
      throw new HttpException(
        'Failed to connect Sim to Router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllSimsByUserId(): Promise<Sims[]> {
    const user = await this.prisma.user.findUnique({
      where: { userId: this.currentUser().userId },
    });

    try {
      const sims = await this.prisma.sims.findMany({
        where: { userId: +user.userId },
      });

      return sims;
    } catch (error) {
      this.logger.error(
        `Error fetching all sims for userId: ${user.userId}`,
        error,
      );
      throw new InternalServerErrorException('Could not find All User Routers');
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
    try {
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

      return simRecord;
    } catch (error) {
      this.logger.error(`Error finding details for simId: ${simId}`, error);
      throw new InternalServerErrorException('Could not find sim details');
    }
  }

  async findSimInfoBySimId(simId: number): Promise<Sims | HttpException> {
    try {
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
        throw new NotFoundException(`Router not found for simId: ${simId}`);
      }

      const sanitizedSimRecord = JSON.parse(
        JSON.stringify(simRecord, (key, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        }),
      );

      return sanitizedSimRecord;
    } catch (error) {
      this.logger.error(`Error finding sim info for simId: ${simId}`, error);
      throw new InternalServerErrorException('Could not find sim by simId');
    }
  }

  async updateSimById(
    simId: number,
    updateSimDto: UpdateSimDto,
  ): Promise<Sim | HttpException> {
    try {
      const existingSim = await this.prisma.sims.update({
        where: { simId },
        data: updateSimDto,
      });

      if (!existingSim) {
        this.logger.warn(`Sim with ID ${simId} not found`);
        throw new NotFoundException(`Sim with ID ${simId} not found`);
      }

      return existingSim;
    } catch (error) {
      this.logger.error(
        `Error updating sim with simId: ${simId}. DTO: ${JSON.stringify(
          updateSimDto,
        )}`,
        error instanceof Error ? error.stack : 'unknown error',
      );
      throw new InternalServerErrorException('Could not update the sim');
    }
  }

  async removeSimById(simId: number): Promise<void> {
    const simRecord = await this.prisma.sims.findUnique({ where: { simId } });

    if (simRecord?.embedded) {
      throw new HttpException(
        'Cannot remove an embedded SIM',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (simRecord && !simRecord.embedded) {
      try {
        await this.prisma.dataUsages.deleteMany({ where: { simId } });
        await this.prisma.sims.delete({ where: { simId } });
      } catch (error: unknown) {
        this.logger.error(`Failed to remove Sim with simId: ${simId}`, error);
        throw new HttpException(
          'Failed to remove Sim',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
