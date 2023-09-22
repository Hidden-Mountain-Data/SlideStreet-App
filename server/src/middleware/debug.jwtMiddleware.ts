import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1] || null;

    if (token) {
      try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.user = decoded;
        next();
      } catch (err) {
        res.status(401).send({ message: 'Invalid token' });
        return;
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' });
    }
  }
}
