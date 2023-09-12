import { NextFunction, Request, Response } from 'express';
import { CustomSession } from '../types/customSessionTypes';

const customSessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  (req.session as CustomSession).accessToken = (
    req.session as CustomSession
  )?.accessToken;
  next();
};

export default customSessionMiddleware;
