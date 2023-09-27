import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { DatesController } from './dates.controller';
import { DatesService } from './dates.service';

@Module({
  imports: [],
  providers: [DatesService, PrismaService],
  controllers: [DatesController],
})
export class DatesModule {}
