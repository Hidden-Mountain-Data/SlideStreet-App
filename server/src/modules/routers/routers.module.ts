import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { SessionService } from '../../session/session.service';
import { UserProvider } from '../users/user.provider';
import { UsersModule } from '../users/users.module';
import { RoutersController } from './routers.controller';
import { RoutersService } from './routers.service';

@Module({
  imports: [UsersModule],
  controllers: [RoutersController],
  providers: [RoutersService, PrismaService, UserProvider, SessionService],
})
export class RoutersModule {}
