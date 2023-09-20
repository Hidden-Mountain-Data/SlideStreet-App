import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DimUser } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class UserProvider {
  get user(): DimUser {
    return this.req.user;
  }

  constructor(@Inject(REQUEST) private readonly req) {}
}
