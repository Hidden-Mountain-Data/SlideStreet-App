import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { DataUsageController } from './data-usage.controller';
import { DataUsageService } from './data-usage.service';

@Module({
  controllers: [DataUsageController],
  providers: [DataUsageService, PrismaService],
})
export class DataUsageModule {}
