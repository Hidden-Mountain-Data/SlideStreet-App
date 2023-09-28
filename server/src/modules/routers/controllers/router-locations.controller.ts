import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RouterLocationDto } from '../dto/create-router-location.dto';
import { UpdateRouterLocationDto } from '../dto/update-router-location.dto';
import { RouterLocationsService } from '../services/router-locations.service';

@Controller('router-locations')
export class RouterLocationsController {
  constructor(
    private readonly routerLocationsService: RouterLocationsService,
  ) {}

  @Post('_internal/add-location')
  @UseGuards(JwtAuthGuard)
  async addInternalLocation(
    @Body() routerLocationDto: RouterLocationDto,
  ): Promise<RouterLocationDto> {
    try {
      return await this.routerLocationsService.saveRouterLocation(
        routerLocationDto,
      );
    } catch (error) {
      console.error('Error adding new location:', error);
      throw new Error('Could not add new location');
    }
  }

  @Get('find-all')
  async findAllLocations(
    @Query('routerId') routerId: number,
  ): Promise<RouterLocationDto[]> {
    try {
      return await this.routerLocationsService.findAllRouterLocations(routerId);
    } catch (error) {
      console.error('Error fetching all locations:', error);
      throw new Error('Could not fetch all locations');
    }
  }

  @Get('find-one')
  async findOneLocation(
    @Query('routerId') routerId: string,
  ): Promise<RouterLocationDto> {
    try {
      const numericRouterId = parseInt(routerId, 10);
      if (isNaN(numericRouterId)) {
        throw new Error('Invalid routerId');
      }
      return await this.routerLocationsService.findOneRouterLocation(
        numericRouterId,
      );
    } catch (error) {
      console.error('Error fetching router by ID:', error);
      throw new Error('Could not fetch router by ID');
    }
  }

  @Patch('_internal/update-location/:locationId')
  @UseGuards(JwtAuthGuard)
  async updateInternalLocation(
    @Param('locationId') locationId: string,
    @Body() updateRouterLocationDto: UpdateRouterLocationDto,
  ): Promise<RouterLocationDto> {
    try {
      const numericLocationId = parseInt(locationId, 10);
      if (isNaN(numericLocationId)) {
        throw new Error('Invalid routerId');
      }
      return await this.routerLocationsService.updateRouterLocation(
        numericLocationId,
        updateRouterLocationDto,
      );
    } catch (error) {
      console.error('Error updating location:', error);
      throw new Error('Could not update location');
    }
  }
}
