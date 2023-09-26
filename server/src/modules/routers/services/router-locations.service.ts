import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { RouterLocationDto } from '../dto/router-location.dto';

@Injectable()
export class RouterLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveRouterLocation(dto: RouterLocationDto): Promise<RouterLocationDto> {
    const { routerId, longitude, latitude, dateTime } = dto;

    const newLocation = await this.prisma.routerLocations.create({
      data: {
        routerId,
        longitude,
        latitude,
        dateTime,
      },
    });

    return newLocation;
  }
}
