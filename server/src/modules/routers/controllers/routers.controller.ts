import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Routers } from '@prisma/client';
import { Request } from 'express';
import { SessionUserGuard } from '../../../guards/session-user.guard';
import { HttpHelpers } from '../../../helpers/http-helpers';
import { OwnershipHelpers } from '../../../helpers/ownership-helpers';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Sim } from '../../sims/entities/sim.entity';
import { CreateRouterDto } from '../dto/create-router.dto';
import { UpdateRouterDto } from '../dto/update-router.dto';
import { Router } from '../entities/router.entity';
import { RoutersService } from '../services/routers.service';

@Controller('routers')
@UseGuards(JwtAuthGuard, SessionUserGuard)
export class RoutersController {
  constructor(
    private readonly routersService: RoutersService,
    private readonly httpHelper: HttpHelpers,
    private readonly ownershipHelpers: OwnershipHelpers,
  ) {}

  @Post(':userId')
  public async addRouter(
    @Req() req: Request,
    @Body() createRouterDto: CreateRouterDto,
  ): Promise<Router | HttpException> {
    console.log('Inside addRouter. If you see this, the endpoint is hit.');
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      const newRouter = await this.routersService.addRouterToAccount(
        createRouterDto,
        userId,
      );

      return newRouter;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  public async findAllRouters(): Promise<Routers[] | HttpException> {
    return this.httpHelper.executeSafely(
      () => this.routersService.findAllRouters({}),
      'Error fetching all routers',
    );
  }

  @Get(':userId')
  async findAllRoutersByUserId(
    @Req() req: Request,
  ): Promise<Routers[] | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);

      return this.routersService.findAllRoutersByUserId(userId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('location/:routerId')
  public async findRouterDetails(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Routers | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
      await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);
      return await this.httpHelper.executeSafely(
        () => this.routersService.findOneRouterDetails(routerId),
        'Error fetching router with location',
      );
    } catch (error) {
      throw new HttpException(
        `Failed to find location on router with id: ${routerId}: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('sim/:routerId')
  public async findSimsByRouterId(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Sim> {
    return this.routersService.findSimByRouterId(routerId);
  }

  @Patch(':routerId')
  async updateRouter(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() updateRouterDto: UpdateRouterDto,
  ): Promise<Routers | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);
    return this.httpHelper.executeSafely(
      () => this.routersService.updateRouter(routerId, updateRouterDto),
      'Error updating router',
    );
  }

  @Delete(':routerId')
  public async removeRouter(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<void> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);
    await this.httpHelper.executeSafely(
      () => this.routersService.removeRouterById(routerId, userId),
      'Error removing router',
    );
  }
}
