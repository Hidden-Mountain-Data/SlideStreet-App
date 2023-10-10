import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Users } from '@prisma/client';

interface IRequestWithUser extends Request {
  user: Users;
}

@Injectable({ scope: Scope.REQUEST })
export class UserProvider {
  get user(): Users {
    return this.req.user;
  }

  constructor(@Inject(REQUEST) private readonly req: IRequestWithUser) {}
}
