import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [],
  providers: [
    PlansService,
    PrismaService,
  ],
  exports: [PlansService],
})
export class PlansModule { }
