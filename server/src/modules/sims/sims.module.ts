import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Router } from '../routers/entities/router.entity';
import { SimsController } from './sims.controller';
import { SimsService } from './sims.service';

@Module({
  controllers: [SimsController],
  providers: [SimsService, Router, PrismaService],
})
export class SimsModule {}
