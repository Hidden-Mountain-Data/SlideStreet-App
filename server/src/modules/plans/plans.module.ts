import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { PrismaService } from 'src/services/prisma.service';
import { UserProvider } from '../users/user.provider';
import { FileService } from 'src/services/file.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import { HttpHelpers } from 'src/helpers/http-helpers';
import { OwnershipHelpers } from 'src/helpers/ownership-helpers';

@Module({
  imports: [UsersModule],
  controllers: [PlansController],
  providers: [
    PlansService,
    JwtService,
    PrismaService,
    UserProvider,
    SessionService,
    HttpHelpers,
    OwnershipHelpers,
  ],
  exports: [PlansService],
})
export class PlansModule { }
