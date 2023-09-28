import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RouterLocationDto } from '../dto/router-location.dto';
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
    const newLocation = await this.routerLocationsService.saveRouterLocation(
      routerLocationDto,
    );
    return newLocation;
  }
}
