import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Routers } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import { RouterStatus } from './router-types';

@Injectable()
export class RoutersService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(RoutersService.name);

  async addRouterToAccount(
    createRouterData: CreateRouterDto,
  ): Promise<RouterStatus | HttpException> {
    if (!createRouterData.sims || !createRouterData.sims.iccid) {
      throw new HttpException(
        'Missing or invalid SIM data',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const existingRouter = await this.prisma.sims.findFirst({
        where: {
          AND: [
            { iccid: createRouterData.sims.iccid },
            { router: { userId: createRouterData.userId } },
          ],
        },
      });

      if (existingRouter) {
        throw new HttpException(
          'User already has a router with this ICCID',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dummyRouter = await this.prisma.routers.create({
        data: {
          imei: 'DUMMY',
          userId: createRouterData.userId,
          simId: -1,
        },
      });

      const doesRouterExist = await this.prisma.routers.findUnique({
        where: { routerId: dummyRouter.routerId },
      });

      if (!doesRouterExist) {
        throw new HttpException(
          'Router ID does not exist, cannot proceed.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const createdSim = await this.prisma.sims.create({
        data: {
          iccid: createRouterData.sims.iccid,
          routerId: dummyRouter.routerId,
        },
      });

      const updatedRouter = await this.prisma.routers.update({
        where: { routerId: dummyRouter.routerId },
        data: {
          imei: createRouterData.imei,
          simId: createdSim.simId,
        },
      });

      console.log('Updated Router: ', updatedRouter);

      return {
        success: true,
        message: 'Router and SIM added to user account successfully!',
      };
    } catch (err: any) {
      throw new HttpException(
        `Unexpected error: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isRouterOwnedByUser(
    routerId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const router = await this.prisma.routers.findUnique({
        where: { routerId: +routerId },
      });
      this.logger.debug(
        `Router data for ID ${routerId}: ${JSON.stringify(router)}`,
      );
      return router?.userId === userId;
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

  async findAllRouters(params: {
    skip?: number;
    take?: number;
    userId?: number;
  }): Promise<Routers[] | HttpException> {
    const { skip, take, userId } = params;
    this.logger.log('Fetching all routers');
    this.logger.log('skip value::: ' + skip);
    this.logger.log('take value::: ' + take);
    this.logger.log('userId value::: ' + userId);
    this.logger.log('params value::: ' + JSON.stringify(params));
    try {
      return await this.prisma.routers.findMany({
        skip,
        take,
      });
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

  async findAllRoutersByUserId(userId: number): Promise<Routers[]> {
    try {
      this.logger.debug(
        `Incoming userId type: ${typeof userId}, value: ${userId}`,
      );

      this.logger.debug(`Fetching routers for user ID: ${userId}`);

      const routers = await this.prisma.routers.findMany({
        where: { userId: +userId },
      });

      this.logger.debug(`Fetched routers: ${JSON.stringify(routers)}`);
      return routers;
    } catch (error) {
      this.logger.error(`Error fetching routers: ${error}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneRouter(routerId: number): Promise<Routers> {
    const router = await this.prisma.routers.findUnique({
      where: { routerId },
    });
    if (!router) {
      throw new HttpException('Router not found', HttpStatus.NOT_FOUND);
    }
    return router;
  }

  async updateRouter(
    routerId: number,
    updateRouterDto: UpdateRouterDto,
  ): Promise<Routers | HttpException> {
    try {
      const updatedData: Partial<Routers> = {};

      if (updateRouterDto.name !== undefined) {
        updatedData.name = updateRouterDto.name;
      }

      if (updateRouterDto.notes !== undefined) {
        updatedData.notes = updateRouterDto.notes;
      }

      return await this.prisma.routers.update({
        where: { routerId },
        data: updatedData,
      });
    } catch (error) {
      this.logger.error(`Error updating router: ${error}`);
      throw new HttpException(
        'Error updating router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeRouter(
    routerId: number,
    userId: number,
  ): Promise<void | HttpException> {
    const isOwned = await this.isRouterOwnedByUser(routerId, userId);
    if (!isOwned) {
      throw new HttpException(
        'Router not found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }

    const routerDetails = await this.prisma.routers.findUnique({
      where: { routerId },
      select: { simId: true },
    });

    if (!routerDetails) {
      throw new HttpException('Router not found', HttpStatus.NOT_FOUND);
    }

    const simDetails = await this.prisma.sims.findUnique({
      where: { simId: routerDetails.simId },
      select: { embedded: true },
    });

    if (!simDetails) {
      throw new HttpException('Sim not found', HttpStatus.NOT_FOUND);
    }

    try {
      if (simDetails.embedded) {
        await this.prisma.sims.delete({
          where: { simId: routerDetails.simId },
        });
      }

      await this.prisma.routers.delete({
        where: { routerId },
      });
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
}
