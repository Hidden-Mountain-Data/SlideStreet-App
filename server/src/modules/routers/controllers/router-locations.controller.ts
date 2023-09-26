import { Body, Controller, Post } from '@nestjs/common';
import { RouterLocationDto } from '../dto/router-location.dto';
import { RouterLocationsService } from '../services/router-locations.service';

@Controller('api/router-locations')
export class RouterLocationsController {
  constructor(
    private readonly routerLocationsService: RouterLocationsService,
  ) {}

  @Post('_internal/add-location')
  async addInternalLocation(
    @Body() routerLocationDto: RouterLocationDto,
  ): Promise<RouterLocationDto> {
    const newLocation = await this.routerLocationsService.saveRouterLocation(
      routerLocationDto,
    );
    return newLocation;
  }
}
