import { Request } from 'express';
import { Session, SessionData } from 'express-session';

export interface CustomSession extends Session {
  user?: { email: string };
  accessToken?: string;
  refreshToken?: string;
}

export interface CustomSessionRequest extends Request {
  session: CustomSession & Partial<SessionData>;
}
