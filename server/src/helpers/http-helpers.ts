import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../session/session.service';

// TODO: ACTUALLY USE THIS
@Injectable()
export class HttpHelpers {
  constructor(private readonly sessionService: SessionService) {}

  getUserIdAndThrowIfUnauthorized(req: Request): number {
    console.log('Inside getUserIdAndThrowIfUnauthorized');
    const userId = this.sessionService.getUserIdFromSession(req);
    if (!userId) {
      console.log('User ID not found, throwing HttpException');
      this.throwHttpException(
        'User ID not found in session',
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log(`User ID found: ${userId}`);
    return userId;
  }

  throwHttpException(message: string, status: HttpStatus): void {
    console.log(
      `Throwing HttpException with message: ${message} and status: ${status}`,
    );
    throw new HttpException(message, status);
  }

  async executeSafely<T>(
    operation: () => Promise<T>,
    errorMessage: string,
  ): Promise<T> {
    console.log('Inside executeSafely');
    try {
      return await operation();
    } catch (error: unknown) {
      console.log('Caught error in executeSafely');
      if (error instanceof Error) {
        this.throwHttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        this.throwHttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
