import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Routers } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import { RouterAddStatus } from './router-types';

@Injectable()
export class RoutersService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(RoutersService.name);

  async addRouterToAccount(
    data: CreateRouterDto & { userId: number },
  ): Promise<RouterAddStatus | HttpException> {
    this.logger.log('Adding router to account');
    try {
      await this.prisma.routers.upsert({
        where: { userId: data.userId },
        create: {
          userId: data.userId,
          sim: data.sim,
          imei: data.imei,
          iccid: data.iccid,
        },
        update: {},
      });
      this.logger.log('Router added successfully');
      return {
        success: true,
        message: 'Router added to user account successfully!',
      };
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new HttpException(
          'User ID already has a router.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        `Unexpected error: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllRouters(params: {
    skip?: number;
    take?: number;
  }): Promise<Routers[] | HttpException> {
    const { skip, take } = params;
    this.logger.log('Fetching all routers');
    try {
      return await this.prisma.routers.findMany({
        skip,
        take,
      });
    } catch (err: any) {
      this.logger.error(`Error adding router: ${err.message}`);
      throw new HttpException(
        `Error adding router to user account: ${err.message}`, // Include the actual error message here
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneRouter(routerId: number): Promise<Routers | HttpException> {
    try {
      const router = await this.prisma.routers.findUnique({
        where: { routerId },
      });
      if (!router) {
        throw new HttpException('Router not found', HttpStatus.NOT_FOUND);
      }
      return router;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error fetching router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRouter(
    routerId: number,
    updateRouterDto: UpdateRouterDto,
  ): Promise<Routers | HttpException> {
    try {
      const updatedRouter = await this.prisma.routers.update({
        where: { routerId },
        data: updateRouterDto,
      });
      return updatedRouter;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error updating router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeRouter(routerId: number): Promise<Routers | HttpException> {
    try {
      const deletedRouter = await this.prisma.routers.delete({
        where: { routerId },
      });
      return deletedRouter;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error removing router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
