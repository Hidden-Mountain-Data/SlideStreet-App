import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from '@prisma/client';

interface IRequestWithUser extends Request {
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class UserProvider {
  get user(): User {
    return this.req.user;
  }

  constructor(@Inject(REQUEST) private readonly req: IRequestWithUser) {}
}
