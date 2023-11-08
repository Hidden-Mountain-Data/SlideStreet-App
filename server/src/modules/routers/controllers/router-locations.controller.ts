import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RouterLocations } from '@prisma/client';
import { RouterLocation } from '../../../types/router-types';
import { AuthGuard } from '../../auth/auth.guard';
import { RouterLocationDto } from '../dto/create-router-location.dto';
import { UpdateRouterLocationDto } from '../dto/update-router-location.dto';
import { RouterLocationsService } from '../services/router-locations.service';

@Controller('router-locations')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class RouterLocationsController {
  private readonly logger = new Logger(RouterLocationsController.name);

  constructor(
    private readonly routerLocationsService: RouterLocationsService,
  ) {}

  @Post(':routerId')
  async addInitialLocation(
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() routerLocationDto: RouterLocationDto,
  ): Promise<RouterLocation> {
    return await this.routerLocationsService.saveInitialRouterLocation(
      routerId,
      routerLocationDto,
    );
  }

  @Get('user/:userId/locations')
  async findAllLocationsByUserId(): Promise<RouterLocations[]> {
    return await this.routerLocationsService.getAllLocationsByUserId();
  }

  @Get('router/:routerId/location')
  async findOneLocation(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<RouterLocation> {
    return await this.routerLocationsService.findOneRouterLocation(routerId);
  }

  @Patch(':routerId')
  async updateInternalLocationByRouterId(
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() updateRouterLocationDto: UpdateRouterLocationDto,
  ): Promise<RouterLocation> {
    return await this.routerLocationsService.updateRouterLocationByRouterId(
      routerId,
      updateRouterLocationDto,
    );
  }

  @Delete(':locationId')
  async deleteRouterLocation(
    @Param('locationId', new ParseIntPipe()) locationId: number,
  ): Promise<void> {
    await this.routerLocationsService.deleteRouterLocationByLocationId(
      locationId,
    );
  }

  @Delete('clear-router/:routerId')
  async deleteAllRouterLocations(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<void> {
    await this.routerLocationsService.deleteAllLocationsByRouterId(routerId);
  }
}
