import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Routers } from '@prisma/client';
import { PrismaService } from '../../../services/prisma.service';
import { Sim } from '../../sims/entities/sim.entity';
import { CreateRouterDto } from '../dto/create-router.dto';
import { UpdateRouterDto } from '../dto/update-router.dto';
import { Router } from '../entities/router.entity';
import { SimsService } from './../../sims/sims.service';

@Injectable()
export class RoutersService {
  constructor(
    private prisma: PrismaService,
    private simsService: SimsService,
  ) {}

  async addRouterToAccount(
    createRouterData: CreateRouterDto,
    userId: number,
  ): Promise<Router | HttpException> {
    console.log('Received data in service:', createRouterData);
    if (!createRouterData.sims || !createRouterData.sims.iccid) {
      throw new HttpException(
        'Missing or invalid SIM data',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const createdSim = await this.simsService.addSim({
        userId,
        iccid: createRouterData.sims.iccid,
      });

      // TODO: Figure out how to get simId off the created SIM
      const simId = createdSim.simId;

      const newRouter = await this.prisma.routers.create({
        data: {
          userId: userId,
          imei: createRouterData.imei || '123',
          simId: createdSim.simId,
          name: createRouterData.name,
          notes: createRouterData.notes,
        },
      });

      return newRouter;
    } catch (err: any) {
      console.log('Error:', err);
      throw new HttpException(
        `Unexpected error: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // async addRouterToAccount(
  //   createRouterData: CreateRouterDto,
  //   userId: number,
  // ): Promise<Router | HttpException> {
  //   console.log('Received data in service:', createRouterData);

  //   if (!createRouterData.sims || !createRouterData.sims.iccid) {
  //     throw new HttpException(
  //       'Missing or invalid SIM data',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   try {
  //     const createSimDto = {
  //       iccid: createRouterData.sims.iccid,
  //       userId,
  //       status: SimStatus.ACTIVE,
  //     };

  //     const createdSim = await this.simsService.addSim(createSimDto);
  //     console.log('createdSim:', createdSim);

  //     // Type check to appease TypeScript and logically segregate errors.
  //     if ('simId' in createdSim) {
  //       const simWithId = createdSim as unknown as { simId: number }; // Type casting
  //       const newRouter = await this.prisma.routers.create({
  //         data: {
  //           userId,
  //           imei: createRouterData.imei || '123',
  //           simId: simWithId.simId,
  //           name: createRouterData.name,
  //           notes: createRouterData.notes,
  //         },
  //       });

  //       return newRouter;
  //     } else {
  //       // Handle HttpException case here if needed
  //       throw new HttpException(
  //         'Failed to create SIM',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   } catch (err: any) {
  //     console.log('Error:', err);
  //     throw new HttpException(
  //       `Unexpected error: ${err.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async isRouterOwnedByUser(
    routerId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const router = await this.prisma.routers.findUnique({
        where: { routerId: +routerId },
      });

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
  }): Promise<Routers[] | HttpException> {
    const { skip, take } = params;

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
      console.log('Trying to find routers by userId:', userId);
      const routers = await this.prisma.routers.findMany({
        where: { userId: +userId },
      });
      console.log('Found routers:', routers);
      return routers;
    } catch (error) {
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
    console.log('Found routers:', router);
    if (!router) {
      throw new HttpException('Router not found', HttpStatus.NOT_FOUND);
    }
    return router;
  }

  async findOneRouterWithLocation(routerId: number): Promise<Routers | null> {
    try {
      const router = await this.prisma.routers.findUnique({
        where: { routerId },
        include: { routerLocation: true },
      });
      if (!router) {
        throw new HttpException('Router not found', HttpStatus.NOT_FOUND);
      }
      return router;
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

  async findSimByRouterId(routerId: number): Promise<Sim | HttpException> {
    try {
      const sim = this.prisma.sims.findMany({
        where: { routerId },
      });
      if (!sim) {
        throw new HttpException('Sim not found', HttpStatus.NOT_FOUND);
      }
      return sim;
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
