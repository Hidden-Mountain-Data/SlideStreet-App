import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RouterLocations } from '@prisma/client';
import { Request } from 'express';
import { HttpHelpers } from '../../../helpers/http-helpers';
import { RouterLocation } from '../../../types/router-types';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RouterLocationDto } from '../dto/create-router-location.dto';
import { UpdateRouterLocationDto } from '../dto/update-router-location.dto';
import { RouterLocationsService } from '../services/router-locations.service';

@Controller('router-locations')
// @UseGuards(JwtAuthGuard, SessionUserGuard) // TODO: Figure out if this needs to be guarded or left alone
export class RouterLocationsController {
  private readonly logger = new Logger(RouterLocationsController.name);

  constructor(
    private readonly routerLocationsService: RouterLocationsService,
    private readonly httpHelper: HttpHelpers, // private readonly ownershipHelpers: OwnershipHelpers, // TODO: May implement later.
  ) {}

  @Post(':routerId')
  async addInitialLocation(
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() routerLocationDto: RouterLocationDto,
  ): Promise<RouterLocation> {
    try {
      return await this.routerLocationsService.saveInitialRouterLocation(
        routerId,
        routerLocationDto,
      );
    } catch (error) {
      this.logger.error('Error adding new location:', error);
      throw new HttpException(
        'Could not add new location',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId/locations')
  async findAllLocationsByUserId(
    @Req() req: Request,
  ): Promise<RouterLocations[]> {
    try {
      const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
      return await this.routerLocationsService.getAllLocationsByUserId(userId);
    } catch (error) {
      this.logger.error('Error fetching all locations:', error);
      throw new HttpException(
        'Error fetching all locations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('router/:routerId/location')
  async findOneLocation(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<RouterLocation> {
    try {
      return await this.routerLocationsService.findOneRouterLocation(routerId);
    } catch (error) {
      this.logger.error('Error fetching router by ID:', error);
      throw new HttpException(
        'Could not fetch router by ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':routerId')
  async updateInternalLocationByRouterId(
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() updateRouterLocationDto: UpdateRouterLocationDto,
  ): Promise<RouterLocation> {
    try {
      return await this.routerLocationsService.updateRouterLocationByRouterId(
        routerId,
        updateRouterLocationDto,
      );
    } catch (error) {
      this.logger.error('Error updating location:', error);
      throw new HttpException(
        'Could not update location',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':locationId')
  async deleteRouterLocation(
    @Param('locationId', new ParseIntPipe()) locationId: number,
  ): Promise<void> {
    try {
      await this.routerLocationsService.deleteRouterLocationByLocationId(
        locationId,
      );
    } catch (error) {
      this.logger.error('Error deleting location by locationId:', error);
      throw new HttpException(
        'Could not delete location by locationId',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('clear-router/:routerId')
  @UseGuards(JwtAuthGuard)
  async deleteAllRouterLocations(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<void> {
    try {
      await this.routerLocationsService.deleteAllLocationsByRouterId(routerId);
    } catch (error) {
      this.logger.error('Error deleting all locations for router:', error);
      throw new HttpException(
        'Could not delete all locations for router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
