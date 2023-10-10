import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../session/session.service';

@Injectable()
export class HttpHelpers {
  private readonly logger = new Logger(HttpHelpers.name);

  constructor(private readonly sessionService: SessionService) {}

  getUserIdAndThrowIfUnauthorized(req: Request): number {
    const userId = this.sessionService.getUserIdFromSession(req);
    if (!userId) {
      this.logger.warn('User ID not found in session');
      throw new NotFoundException('User ID not found in session');
    }
    return userId;
  }

  async executeSafely<T>(
    operation: () => Promise<T>,
    errorMessage: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error during executeSafely: ${error.message}`);
        throw new InternalServerErrorException(error.message);
      } else {
        this.logger.error(`Error during executeSafely: ${errorMessage}`);
        throw new InternalServerErrorException(errorMessage);
      }
    }
  }
}
