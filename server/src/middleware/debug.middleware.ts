import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class DebugMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DebugMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    this.logger.debug(
      `Incoming Request Headers: ${JSON.stringify(req.headers)}`,
    );
    next();
  }
}
