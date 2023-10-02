import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

  @Post(':routerId')
  @UseGuards(JwtAuthGuard)
  async addInternalLocation(
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() routerLocationDto: RouterLocationDto,
  ): Promise<RouterLocationDto> {
    try {
      return await this.routerLocationsService.saveRouterLocation(
        routerId,
        routerLocationDto,
      );
    } catch (error) {
      console.error('Error adding new location:', error);
      throw new Error('Could not add new location');
    }
  }

  // TODO: find a better way to do this
  // @Get('find-all')
  // async findAllLocations(
  //   @Param('userId', new ParseIntPipe()) userId: number,
  // ): Promise<RouterLocationDto[]> {
  //   try {
  //     return await this.routerLocationsService.findAllRouterLocations(userId);
  //   } catch (error) {
  //     console.error('Error fetching all locations:', error);
  //     throw new Error('Could not fetch all locations');
  //   }
  // }

  @Get(':routerId')
  async findOneLocation(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<RouterLocationDto> {
    try {
      return await this.routerLocationsService.findOneRouterLocation(routerId);
    } catch (error) {
      console.error('Error fetching router by ID:', error);
      throw new Error('Could not fetch router by ID');
    }
  }

  @Patch(':routerId')
  @UseGuards(JwtAuthGuard)
  async updateInternalLocationByRouterId(
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() updateRouterLocationDto: UpdateRouterLocationDto,
  ): Promise<RouterLocationDto> {
    console.log(
      'Attempting to update router location with routerId:',
      routerId,
      typeof routerId,
    );

    try {
      return await this.routerLocationsService.updateRouterLocationByRouterId(
        routerId,
        updateRouterLocationDto,
      );
    } catch (error) {
      console.error('Error details:', error);
      throw new Error('Could not update location');
    }
  }
}
