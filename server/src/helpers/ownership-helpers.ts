import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class OwnershipHelpers {
  private readonly logger = new Logger(OwnershipHelpers.name);

  constructor(private prisma: PrismaService) {}

  async ensureRouterOwnership(routerId: number, userId: number): Promise<void> {
    const router = await this.prisma.routers.findUnique({
      where: { routerId: +routerId },
    });

    if (!router) {
      throw new HttpException(
        `routerId ${routerId} does not seem to exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (router.userId !== userId) {
      throw new HttpException(
        'This router is not accessible to the current account',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async ensureSimOwnership(simId: number, userId: number): Promise<void> {
    const sim = await this.prisma.sims.findUnique({
      where: { simId: +simId },
    });

    if (!sim) {
      throw new HttpException(
        `simId ${simId} does not seem to exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (sim.userId !== userId) {
      throw new HttpException(
        'This SIM is not accessible to the current account',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async isRouterOwnedByUser(
    routerId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const router = await this.prisma.routers.findUnique({
        where: { routerId: +routerId },
      });
      return router ? router.userId === userId : false;
    } catch (error) {
      this.logger.error(
        `Error matching router: ${routerId} and user: ${userId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not match router to account.',
      );
    }
  }

  async isSimOwnedByUser(simId: number, userId: number): Promise<boolean> {
    try {
      const sim = await this.prisma.sims.findUnique({
        where: { simId: +simId },
      });
      return sim ? sim.userId === userId : false;
    } catch (error) {
      this.logger.error(`Error matching sim: ${simId} and user: ${userId}`);
      throw new InternalServerErrorException('Could not match SIM to account.');
    }
  }
}
