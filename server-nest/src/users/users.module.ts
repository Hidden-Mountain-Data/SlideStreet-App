import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/services/prisma.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from './user.provider';
import { FileService } from 'src/services/file.service';

@Module({
  providers: [UsersService, PrismaService, JwtStrategy, JwtService, UserProvider, FileService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
