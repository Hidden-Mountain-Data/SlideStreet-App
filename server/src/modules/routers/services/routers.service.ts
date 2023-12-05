import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Routers, Users } from '@prisma/client';
import { PrismaService } from '../../../services/prisma.service';
import { Sim } from '../../sims/entities/sim.entity';
import { UserProvider } from '../../users/user.provider';
import { CreateRouterDto } from '../dto/create-router.dto';
import { UpdateRouterDto } from '../dto/update-router.dto';
import { Router } from '../entities/router.entity';

@Injectable()
export class RoutersService {
  private readonly logger = new Logger(RoutersService.name);

  constructor(
    private prisma: PrismaService,
    private readonly userProvider: UserProvider,
  ) { }

  private currentUser(): Users {
    return this.userProvider.user;
  }

  async addRouterToAccount(
    createRouterData: CreateRouterDto,
  ): Promise<Router | HttpException> {
    const user = await this.prisma.users.findUnique({
      where: { userId: this.currentUser().userId },
    });

    try {
      const newRouter = await this.prisma.routers.create({
        data: {
          imei: createRouterData.imei,
          iccid: createRouterData.iccid,
          serialNumber: createRouterData.serialNumber,
          userId: user.userId,
          name: createRouterData.name || null,
          notes: createRouterData.notes || null,
        },
      });

      const newSim = (await this.createRouterWithEmbeddedSim(
        newRouter.routerId,
      )) as unknown as Prisma.SimsWhereUniqueInput;

      if(newSim instanceof HttpException) {
        throw newSim;
      }

      const updatedRouter = await this.prisma.routers.update({
        where: {
          routerId: newRouter.routerId,
        },
        data: {
          simId: newSim.simId,
        },
        include: {
          sims: true,
        },
      });

      return {
        success: true,
        message: 'Router with embedded SIM added successfully!',
        router: updatedRouter,
      };
    } catch(error) {
      this.logger.error(
        `Error adding router to account for user: ${user.userId
        }. DTO: ${JSON.stringify(createRouterData)}`,
        error instanceof Error ? error.stack : 'unknown error',
      );
      throw new InternalServerErrorException('Could not update the sim');
    }
  }

  async createRouterWithEmbeddedSim(
    routerId: number,
  ): Promise<Sim | HttpException> {
    const user = await this.prisma.users.findUnique({
      where: { userId: this.currentUser().userId },
    });

    try {
      const newSim = await this.prisma.sims.create({
        data: {
          userId: user.userId,
          routerId,
          iccid: 'some-sim-iccid', // TODO: Adjust accordingly
          active: true,
          status: 'ONLINE',
          embedded: true,
        },
      });

      return newSim;
    } catch(error) {
      this.logger.error(
        `Error creating embedded sim for routerId: ${routerId}`,
        error,
      );
      throw new InternalServerErrorException('Could not embed sim');
    }
  }

  async findAllRouters(params: {
    skip?: number;
    take?: number;
  }): Promise<Routers[] | HttpException> {
    const { skip, take } = params;

    try {
      return await this.prisma.routers.findMany({
        skip,
        take,
      });
    } catch(error) {
      this.logger.error('Error finding All Routers:', error);
      throw new InternalServerErrorException('Could not find All Routers');
    }
  }

  async findAllRoutersByUserId(): Promise<Routers[]> {
    const user = await this.prisma.users.findUnique({
      where: { userId: this.currentUser().userId },
    });

    try {
      const routers = await this.prisma.routers.findMany({
        where: { userId: +user.userId },
        include: { routerLocation: true, sims: true },
      });

      return routers;
    } catch(error) {
      this.logger.error(
        `Error finding All Routers by userId: ${user.userId}`,
        error,
      );
      throw new InternalServerErrorException('Could not find All User Routers');
    }
  }

  async findOneRouterDetails(routerId: number): Promise<Router | null> {
    try {
      const router = await this.prisma.routers.findUnique({
        where: { routerId },
        include: { routerLocation: true, sims: true },
      });
      if(!router) {
        throw new NotFoundException('Router not found');
      }

      return router;
    } catch(error) {
      this.logger.error(
        `Error finding details for routerId: ${routerId}`,
        error,
      );
      throw new InternalServerErrorException('Could not find router details');
    }
  }

  async findSimByRouterId(routerId: number): Promise<Sim | HttpException> {
    try {
      const sim = this.prisma.sims.findMany({
        where: { routerId },
      });

      if(!sim) {
        throw new NotFoundException('Sim not found');
      }

      return sim;
    } catch(error) {
      this.logger.error(`Error finding sim by routerId: ${routerId}`, error);
      throw new InternalServerErrorException('Could not find sim by routerId');
    }
  }

  async updateRouter(
    routerId: number,
    updateRouterDto: UpdateRouterDto,
  ): Promise<Routers | HttpException> {
    try {
      const existingRouter = await this.prisma.routers.findUnique({
        where: { routerId },
      });

      if(!existingRouter) {
        this.logger.warn(`Router with ID ${routerId} not found`);
        throw new NotFoundException(`Router with ID ${routerId} not found`);
      }

      const updatedRouter = await this.prisma.routers.update({
        where: { routerId },
        data: {
          name: updateRouterDto.name,
          notes: updateRouterDto.notes,
        },
      });

      return updatedRouter;
    } catch(error) {
      this.logger.error(
        `Error updating sim with routerId: ${routerId}. DTO: ${JSON.stringify(
          updateRouterDto,
        )}`,
        error instanceof Error ? error.stack : 'unknown error',
      );
      throw new InternalServerErrorException('Could not update the sim');
    }
  }

  async removeRouterById(routerId: number): Promise<void | HttpException> {
    const routerDetails = await this.prisma.routers.findUnique({
      where: { routerId },
      select: { simId: true },
    });

    if(!routerDetails) {
      this.logger.error(`Router with ID ${routerId} does not exist.`);
      throw new NotFoundException('Router not found');
    }

    const simDetails = await this.prisma.sims.findUnique({
      where: { simId: routerDetails.simId },
      select: { embedded: true },
    });

    if(!simDetails) {
      this.logger.error(`Sim with ID ${routerDetails.simId} does not exist.`);
      throw new NotFoundException('Sim not found');
    }

    try {
      await this.prisma.routerLocations.deleteMany({
        where: { routerId },
      });

      if(simDetails && simDetails.embedded) {
        await this.prisma.sims.delete({
          where: { simId: routerDetails.simId },
        });
      }

      await this.prisma.routers.delete({
        where: { routerId },
      });
    } catch(error) {
      this.logger.error('Error deleting router:', error);
      throw new InternalServerErrorException('Could not delete router');
    }
  }
}
