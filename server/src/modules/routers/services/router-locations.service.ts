import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RouterLocations, User } from '@prisma/client';
import { PrismaService } from '../../../services/prisma.service';
import { UserProvider } from '../../users/user.provider';
import { RouterLocationDto } from '../dto/create-router-location.dto';
import { UpdateRouterLocationDto } from '../dto/update-router-location.dto';
import { RouterLocation } from './../../../types/router-types.d';

@Injectable()
export class RouterLocationsService {
  private readonly logger = new Logger(RouterLocationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userProvider: UserProvider,
  ) {}

  private currentUser(): User {
    return this.userProvider.user;
  }

  async saveInitialRouterLocation(
    routerId: number,
    routerLocationDto: RouterLocationDto,
  ): Promise<RouterLocation> {
    // TODO: Figure out if we need to soft delate locations and save for any time or how to properly implement this. Currently, this function will only work on initial location, if any updates are needed, hit updateRouterLocationByRouterId
    try {
      const { longitude, latitude, dateTime } = routerLocationDto;
      const routerExists = await this.prisma.routers.findUnique({
        where: { routerId },
      });

      if (!routerExists) {
        this.logger.error(`Router with ID ${routerId} does not exist.`);
        throw new HttpException(
          `Router with ID ${routerId} does not exist.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return this.prisma.routerLocations.create({
        data: {
          routerId,
          longitude,
          latitude,
          dateTime,
        },
      });
    } catch (error) {
      this.logger.error('Error saving new location:', error);
      throw new InternalServerErrorException('Could not save location');
    }
  }

  async getAllLocationsByUserId(): Promise<RouterLocations[]> {
    const user = await this.prisma.user.findUnique({
      where: { userId: this.currentUser().userId },
    });

    try {
      const locations = await this.prisma.routerLocations.findMany({
        where: {
          router: {
            userId: user.userId,
          },
        },
        include: { router: true },
      });

      if (!locations || locations.length === 0) {
        throw new NotFoundException(
          `No locations found for userId ${user.userId}`,
        );
      }

      return locations;
    } catch (error) {
      this.logger.error('Error deleting all locations for routerId:', error);
      throw new InternalServerErrorException(
        'Error deleting all locations for routerId',
      );
    }
  }

  async findOneRouterLocation(
    routerId: number,
  ): Promise<RouterLocation | null> {
    try {
      const location = await this.prisma.routerLocations.findFirst({
        where: { routerId },
      });

      if (!location) {
        this.logger.error(`Router with ID ${routerId} does not exist.`);
        throw new NotFoundException(
          `Router with ID ${routerId} does not exist.`,
        );
      }

      return location;
    } catch (error) {
      this.logger.error(
        `Error deleting all locations for routerId: ${routerId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Error deleting all locations for routerId',
      );
    }
  }

  async updateRouterLocationByRouterId(
    routerId: number,
    updateRouterLocationDto: UpdateRouterLocationDto,
  ): Promise<RouterLocation> {
    try {
      const location = await this.prisma.routerLocations.findFirst({
        where: { routerId },
      });

      if (!location) {
        this.logger.error(
          `Router Location with routerId ${routerId} does not exist.`,
        );
        throw new NotFoundException(
          `Router Location with routerId ${routerId} does not exist.`,
        );
      }

      return await this.prisma.routerLocations.update({
        where: { locationId: location.locationId },
        data: updateRouterLocationDto,
      });
    } catch (error) {
      this.logger.error(
        `Error deleting all locations for routerId: ${routerId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Error deleting all locations for routerId',
      );
    }
  }

  async deleteRouterLocationByLocationId(locationId: number): Promise<void> {
    try {
      const location = await this.prisma.routerLocations.findUnique({
        where: { locationId },
      });

      if (!location) {
        this.logger.error(
          `Router Location with locationId ${locationId} does not exist.`,
        );
        throw new NotFoundException(
          `Router Location with locationId ${locationId} does not exist.`,
        );
      }

      await this.prisma.routerLocations.delete({
        where: { locationId: location.locationId },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting all locations for locationId: ${locationId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Error deleting all locations for routerId',
      );
    }
  }

  async deleteAllLocationsByRouterId(routerId: number): Promise<void> {
    try {
      await this.prisma.routerLocations.deleteMany({
        where: { routerId },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting all locations for routerId: ${routerId}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error deleting all locations for routerId`,
      );
    }
  }
}
