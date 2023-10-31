import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
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
@UseGuards(JwtAuthGuard)
export class RoutersController {
  private readonly logger = new Logger(RoutersController.name);

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
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      return await this.routersService.addRouterToAccount(
        createRouterDto,
        userId,
      );
    } catch (error) {
      this.logger.error(`Error adding router for user: ${userId}`, error);
      throw error;
    }
  }

  @Get()
  public async findAllRouters(): Promise<Routers[] | HttpException> {
    try {
      return await this.routersService.findAllRouters({});
    } catch (error) {
      this.logger.error(`Error fetching all routers`, error);
      throw error;
    }
  }

  @Get(':userId')
  async findAllRoutersByUserId(
    @Req() req: Request,
  ): Promise<Routers[] | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      return await this.routersService.findAllRoutersByUserId(userId);
    } catch (error) {
      this.logger.error(`Error fetching routers by user: ${userId}`, error);
      throw error;
    }
  }

  @Get('router-details/:routerId')
  public async findRouterDetails(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Router | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
      await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);

      return await this.httpHelper.executeSafely(
        () => this.routersService.findOneRouterDetails(routerId),
        'Error fetching router with location',
      );
    } catch (error) {
      this.logger.error(`Error finding details for router: ${routerId}`, error);
      throw error;
    }
  }

  @Get('sim/:routerId')
  public async findSimsByRouterId(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Sim> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);
      return await this.routersService.findSimByRouterId(routerId);
    } catch (error) {
      this.logger.error(`Error fetching sim by router: ${routerId}`, error);
      throw error;
    }
  }

  @Patch(':routerId')
  async updateRouter(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() updateRouterDto: UpdateRouterDto,
  ): Promise<Router | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);
      return await this.routersService.updateRouter(routerId, updateRouterDto);
    } catch (error) {
      this.logger.error(`Error updating router: ${routerId}`, error);
      throw error;
    }
  }

  @Delete(':routerId')
  public async removeRouter(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<void> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);
      await this.routersService.removeRouterById(routerId);
    } catch (error) {
      this.logger.error(`Error removing router: ${routerId}`, error);
      throw error;
    }
  }
}
