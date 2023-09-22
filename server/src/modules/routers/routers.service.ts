import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Routers } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { User } from '../users/entities/user';
import { UserProvider } from '../users/user.provider';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import { RouterAddStatus } from './router-types';

@Injectable()
export class RoutersService {
  constructor(
    private prisma: PrismaService,
    private readonly userProvider: UserProvider,
  ) {}

  private readonly logger = new Logger(RoutersService.name);

  private currentUser(): User {
    return this.userProvider.user;
  }

  async addRouterToAccount(
    data: CreateRouterDto,
  ): Promise<RouterAddStatus | HttpException> {
    try {
      this.logger.log('data value::: ' + JSON.stringify(data));
      await this.prisma.routers.create({
        data: {
          userId: this.currentUser().userId,
          sim: data.sim,
          imei: data.imei,
          iccid: data.iccid,
        },
      });
      return {
        success: true,
        message: 'Router added to user account successfully!',
      };
    } catch (err: any) {
      console.log('Catch block triggered!');
      console.error('Full error: ', err);
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
    this.logger.log('skip value::: ' + skip);
    this.logger.log('take value::: ' + take);
    this.logger.log('params value::: ' + JSON.stringify(params));
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
