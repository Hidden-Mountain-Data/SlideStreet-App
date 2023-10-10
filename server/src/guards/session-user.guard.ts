import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { SessionService } from '../session/session.service';

@Injectable()
export class SessionUserGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userId = this.sessionService.getUserIdFromSession(request);

    if (!userId) {
      throw new UnauthorizedException('User ID not found in session');
    }

    request.userId = userId;

    return true;
  }
}
