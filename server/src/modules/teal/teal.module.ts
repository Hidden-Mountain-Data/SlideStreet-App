import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { TealController } from './teal.controller';
import { TealService } from './teal.service';

@Module({
  controllers: [TealController],
  providers: [TealService, PrismaService],
})
export class TealModule {}
