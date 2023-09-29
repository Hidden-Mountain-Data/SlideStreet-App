import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { RouterLocation } from '../../../types/router-types';
import { RouterLocationDto } from '../dto/create-router-location.dto';
import { UpdateRouterLocationDto } from '../dto/update-router-location.dto';

@Injectable()
export class RouterLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveRouterLocation(
    routerId: number,
    dto: RouterLocationDto,
  ): Promise<RouterLocation> {
    try {
      console.log(typeof routerId);
      if (typeof routerId !== 'number') {
        throw new Error('routerId should be a number');
      }
      const { longitude, latitude, dateTime } = dto;
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

  // TODO: find a better way to do this
  // async findAllRouterLocations(userId: number): Promise<RouterLocation[]> {
  //   try {
  //     const locations = await this.prisma.routerLocations.findMany({
  //       where: { userId },
  //     });

  //     return locations.map((loc) => loc as unknown as RouterLocation);
  //   } catch (error) {
  //     console.error('Error finding all locations:', error);
  //     throw new Error('Could not find locations');
  //   }
  // }

  async findOneRouterLocation(
    routerId: number,
  ): Promise<RouterLocation | null> {
    try {
      const location = await this.prisma.routerLocations.findFirst({
        where: { routerId },
      });
      return location;
    } catch (error) {
      console.error('Error finding one location:', error);
      throw new Error('Could not find location');
    }
  }

  async updateRouterLocationByRouterId(
    routerId: number,
    dto: UpdateRouterLocationDto,
  ): Promise<RouterLocation> {
    try {
      const location = await this.prisma.routerLocations.findFirst({
        where: { routerId },
      });

      if (!location) {
        throw new Error(`No location found for routerId ${routerId}`);
      }

      return await this.prisma.routerLocations.update({
        where: { locationId: location.locationId },
        data: dto,
      });
    } catch (error) {
      console.error('Error updating location by routerId:', error);
      throw new Error('Could not update location by routerId');
    }
  }
}
