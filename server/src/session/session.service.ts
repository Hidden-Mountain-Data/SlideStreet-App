import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../modules/users/entities/user';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getUserInfo(userId: number): Promise<User> {
    return this.getUserById(userId);
  }

  getUserIdFromSession(req: any): number {
    return req.session.userId;
  }
}
