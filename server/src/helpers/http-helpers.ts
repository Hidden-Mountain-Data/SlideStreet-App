import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SessionService } from '../session/session.service';

@Injectable()
export class HttpHelpers {
  private readonly logger = new Logger(HttpHelpers.name);

  constructor(private readonly sessionService: SessionService) {}

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
