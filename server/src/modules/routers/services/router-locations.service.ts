import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { RouterLocationDto } from '../dto/create-router-location.dto';
import { UpdateRouterLocationDto } from '../dto/update-router-location.dto';

@Injectable()
export class RouterLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveRouterLocation(dto: RouterLocationDto): Promise<RouterLocationDto> {
    try {
      const { routerId, longitude, latitude, dateTime } = dto;

      const routerExists = await this.prisma.routers.findUnique({
        where: { routerId },
      });
      if (!routerExists) {
        throw new Error(`Router with ID ${routerId} does not exist.`);
      }

      return await this.prisma.routerLocations.create({
        data: {
          routerId,
          longitude,
          latitude,
          dateTime,
        },
      });
    } catch (error) {
      console.error('Error saving new location:', error);
      throw new Error('Could not save location');
    }
  }
  async findAllRouterLocations(routerId: number): Promise<RouterLocationDto[]> {
    try {
      const locations = await this.prisma.routerLocations.findMany({
        where: { routerId },
      });
      return locations.map((loc) => new RouterLocationDto(loc));
    } catch (error) {
      console.error('Error finding all locations:', error);
      throw new Error('Could not find locations');
    }
  }

  async findOneRouterLocation(
    routerId: number,
  ): Promise<RouterLocationDto | null> {
    try {
      const location = await this.prisma.routerLocations.findFirst({
        where: { routerId },
      });
      return location ? new RouterLocationDto(location) : null;
    } catch (error) {
      console.error('Error finding one location:', error);
      throw new Error('Could not find location');
    }
  }

  async updateRouterLocation(
    locationId: number,
    dto: UpdateRouterLocationDto,
  ): Promise<RouterLocationDto> {
    try {
      return await this.prisma.routerLocations.update({
        where: { locationId },
        data: dto,
      });
    } catch (error) {
      console.error('Error updating location:', error);
      throw new Error('Could not update location');
    }
  }
}
