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
import { Sims } from '@prisma/client';
import { Request } from 'express';
import { SessionUserGuard } from '../../guards/session-user.guard';
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
@UseGuards(JwtAuthGuard, SessionUserGuard)
export class SimsController {
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
    console.log('Inside addSim. If you see this, the endpoint is hit.');
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      const newSim = await this.simsService.addSimToAccount(
        createSimDto,
        userId,
      );

      return newSim;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
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
      console.log('Error in connectToRouter:', error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':userId')
  async findAllByUserId(@Req() req: Request): Promise<Sims[] | HttpException> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);

      return await this.simsService.findAllSimsByUserId(userId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('router/:simId')
  async findRouterInfoBySimId(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<Router | HttpException> {
    console.log('simId:', simId, 'req:', req);
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    await this.ownershipHelpers.ensureRouterOwnership(simId, userId);

    try {
      const routerBySimId = await this.httpHelper.executeSafely(
        () => this.simsService.findRouterInfoBySimId(simId),
        'Error fetching router with location using that simId',
      );

      return routerBySimId;
    } catch (error) {
      throw new HttpException(
        `Failed to find router with location for simId ${simId}: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('sim-info/:simId')
  async findSimInfoBySimId(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<Sim | HttpException> {
    console.log('simId:', simId, 'req:', req);
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
      await this.ownershipHelpers.ensureSimOwnership(simId, userId);

      return this.simsService.findSimInfoBySimId(simId);
    } catch (error) {
      throw new HttpException(
        `Failed to find router with location for simId ${simId}: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':simId')
  async updateSim(
    @Param('simId', new ParseIntPipe()) simId: number,
    @Body() updateSimDto: UpdateSimDto,
  ): Promise<Sim | HttpException> {
    try {
      const updatedSim = await this.simsService.updateSimById(
        simId,
        updateSimDto,
      );
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

  @Delete(':simId')
  async removeSim(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<void | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    await this.ownershipHelpers.ensureSimOwnership(simId, userId);
    await this.httpHelper.executeSafely(
      () => this.simsService.removeSimById(simId, userId),
      'Error removing router',
    );
  }
}
