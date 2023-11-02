import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../services/prisma.service';
import { UsersModule } from '../users/users.module';
import { TealController } from './teal.controller';
import { TealService } from './teal.service';

@Module({
  imports: [UsersModule],
  controllers: [TealController],
  providers: [JwtService, TealService, PrismaService],
})
export class TealModule {}
