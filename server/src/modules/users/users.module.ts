import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileService } from '../../services/file.service';
import { PrismaService } from '../../services/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserProvider } from './user.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [
    UsersService,
    PrismaService,
    JwtStrategy,
    JwtService,
    UserProvider,
    FileService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
