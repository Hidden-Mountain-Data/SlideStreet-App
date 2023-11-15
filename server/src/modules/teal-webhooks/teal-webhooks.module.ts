import { Module } from '@nestjs/common';
import { TealWebhooksController } from './teal-webhooks.controller';
import { TealPollingService } from '../../services/teal-polling.service';
import { SimsService } from '../sims/sims.service';
import { DataUsageService } from '../data-usage/data-usage.service';
import { DataUsageModule } from '../data-usage/data-usage.module'; // Import the DataUsageModule
import { PrismaService } from '../../services/prisma.service';

@Module({
    imports: [DataUsageModule],
    controllers: [TealWebhooksController],
    providers: [TealPollingService, SimsService, DataUsageService, PrismaService],
})
export class TealWebhooksModule { }
