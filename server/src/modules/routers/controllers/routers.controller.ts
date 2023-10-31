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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Routers } from '@prisma/client';
import { Request } from 'express';
import { HttpHelpers } from '../../../helpers/http-helpers';
import { OwnershipHelpers } from '../../../helpers/ownership-helpers';
import { AuthGuard } from '../../auth/auth.guard';
import { Sim } from '../../sims/entities/sim.entity';
import { CreateRouterDto } from '../dto/create-router.dto';
import { UpdateRouterDto } from '../dto/update-router.dto';
import { Router } from '../entities/router.entity';
import { RoutersService } from '../services/routers.service';

@Controller('routers')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
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
    return await this.routersService.addRouterToAccount(createRouterDto);
  }

  @Get()
  public async findAllRouters(): Promise<Routers[] | HttpException> {
    return await this.routersService.findAllRouters({});
  }

  @Get(':userId')
  async findAllRoutersByUserId(): Promise<Routers[] | HttpException> {
    return await this.routersService.findAllRoutersByUserId();
  }

  @Get('router-details/:routerId')
  public async findRouterDetails(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Router | HttpException> {
    await this.ownershipHelpers.ensureRouterOwnership(routerId);
    return await this.routersService.findOneRouterDetails(routerId);
    // return await this.httpHelper.executeSafely(
    //   () => this.routersService.findOneRouterDetails(routerId),
    //   'Error fetching router with location',
    // );
  }

  @Get('sim/:routerId')
  public async findSimsByRouterId(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Sim> {
    await this.ownershipHelpers.ensureRouterOwnership(routerId);
    return await this.routersService.findSimByRouterId(routerId);
  }

  @Patch(':routerId')
  async updateRouter(
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() updateRouterDto: UpdateRouterDto,
  ): Promise<Router | HttpException> {
    await this.ownershipHelpers.ensureRouterOwnership(routerId);
    return await this.routersService.updateRouter(routerId, updateRouterDto);
  }

  @Delete(':routerId')
  public async removeRouter(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<void> {
    await this.ownershipHelpers.ensureRouterOwnership(routerId);
    await this.routersService.removeRouterById(routerId);
  }
}
