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
import { Sims } from '@prisma/client';
import { Request } from 'express';
import { HttpHelpers } from '../../helpers/http-helpers';
import { OwnershipHelpers } from '../../helpers/ownership-helpers';
import { SimAndRouterInfo } from '../../types/sim-types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Router } from '../routers/entities/router.entity';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';
import { SimsService } from './sims.service';

@Controller('sims')
@UseGuards(JwtAuthGuard)
export class SimsController {
  private readonly logger = new Logger(SimsController.name);

  constructor(
    private readonly simsService: SimsService,
    private readonly httpHelper: HttpHelpers,
    private readonly ownershipHelpers: OwnershipHelpers,
  ) {}

  @Post(':userId')
  public async addSim(
    @Req() req: Request,
    @Body() createSimDto: CreateSimDto,
  ): Promise<Sim | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      return await this.simsService.addSimToAccount(createSimDto, userId);
    } catch (error) {
      this.logger.error(`Error adding new sim to user: ${userId}`, error);
      throw error;
    }
  }

  @Patch(':simId/:routerId')
  async connectToRouter(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<SimAndRouterInfo | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
      await this.ownershipHelpers.ensureSimOwnership(simId, userId);
      await this.ownershipHelpers.ensureRouterOwnership(routerId, userId);

      return this.simsService.connectSimToRouter(simId, routerId);
    } catch (error) {
      this.logger.error(
        `Error connectiong sim: ${simId} to router: ${routerId}`,
        error,
      );
      throw error;
    }
  }

  @Get(':userId')
  async findAllByUserId(@Req() req: Request): Promise<Sims[] | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);

      return await this.simsService.findAllSimsByUserId(userId);
    } catch (error) {
      this.logger.error(`Error fetching sims for user: `, error);
      throw error;
    }
  }

  @Get('router/:simId')
  async findRouterInfoBySimId(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<Router | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
      await this.ownershipHelpers.ensureSimOwnership(simId, userId);

      return await this.simsService.findRouterInfoBySimId(simId);
    } catch (error) {
      this.logger.error(`Error fetching router for sim: ${simId}`, error);
      throw error;
    }
  }

  @Get('sim-info/:simId')
  async findSimInfoBySimId(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<Sim | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
      await this.ownershipHelpers.ensureSimOwnership(simId, userId);

      return this.simsService.findSimInfoBySimId(simId);
    } catch (error) {
      this.logger.error(`Error finding sim info for sim: ${simId}`, error);
      throw error;
    }
  }

  @Patch(':simId')
  async updateSim(
    @Param('simId', new ParseIntPipe()) simId: number,
    @Body() updateSimDto: UpdateSimDto,
  ): Promise<Sim | HttpException> {
    try {
      return await this.simsService.updateSimById(simId, updateSimDto);
    } catch (error) {
      this.logger.error(`Error updating sim for simId: ${simId}`, error);
      throw error;
    }
  }

  @Delete(':simId')
  async removeSim(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<void | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);

    await this.ownershipHelpers.ensureSimOwnership(simId, userId);
    try {
      await this.simsService.removeSimById(simId);
    } catch (error) {
      this.logger.error(`Error removing simId: ${simId}`, error);
      throw error;
    }
  }
}
