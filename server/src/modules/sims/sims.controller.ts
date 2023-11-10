import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Sims } from '@prisma/client';
import { OwnershipHelpers } from '../../helpers/ownership-helpers';
import { SimAndRouterInfo } from '../../types/sim-types';
import { AuthGuard } from '../auth/auth.guard';
import { Router } from '../routers/entities/router.entity';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';
import { SimsService } from './sims.service';

@Controller('sims')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SimsController {
  private readonly logger = new Logger(SimsController.name);

  constructor(
    private readonly simsService: SimsService,
    private readonly ownershipHelpers: OwnershipHelpers,
  ) {}

  @Post(':userId')
  public async addSim(
    @Body() createSimDto: CreateSimDto,
  ): Promise<Sim | HttpException> {
    return await this.simsService.addSimToAccount(createSimDto);
  }

  @Patch(':simId/:routerId')
  async connectToRouter(
    @Param('simId', new ParseIntPipe()) simId: number,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<SimAndRouterInfo | HttpException> {
    await this.ownershipHelpers.ensureSimOwnership(simId);
    await this.ownershipHelpers.ensureRouterOwnership(routerId);

    return this.simsService.connectSimToRouter(simId, routerId);
  }

  @Get(':userId')
  async findAllByUserId(): Promise<Sims[] | HttpException> {
    return await this.simsService.findAllSimsByUserId();
  }

  @Get('router/:simId')
  async findRouterInfoBySimId(
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<Router | HttpException> {
    await this.ownershipHelpers.ensureSimOwnership(simId);
    return await this.simsService.findRouterInfoBySimId(simId);
  }

  @Get('sim-info/:simId')
  async findSimInfoBySimId(
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<Sim | HttpException> {
    await this.ownershipHelpers.ensureSimOwnership(simId);
    return this.simsService.findSimInfoBySimId(simId);
  }

  @Patch(':simId')
  async updateSim(
    @Param('simId', new ParseIntPipe()) simId: number,
    @Body() updateSimDto: UpdateSimDto,
  ): Promise<Sim | HttpException> {
    return await this.simsService.updateSimById(simId, updateSimDto);
  }

  @Delete(':simId')
  async removeSim(
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<void | HttpException> {
    await this.ownershipHelpers.ensureSimOwnership(simId);
    await this.simsService.removeSimById(simId);
  }
}
