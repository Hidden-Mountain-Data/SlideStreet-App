import { Module } from '@nestjs/common';
import { TealWebhooksController } from './teal-webhooks.controller';
import { TealPollingService } from '../tasks/tasks.service';
import { SimsService } from '../sims/sims.service';
import { DataUsageService } from '../data-usage/data-usage.service';
import { DataUsageModule } from '../data-usage/data-usage.module'; // Import the DataUsageModule
import { UserProvider } from '../users/user.provider';
import { PlansService } from '../plans/plans.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    imports: [DataUsageModule],
    controllers: [TealWebhooksController],
    providers: [TealPollingService, SimsService, DataUsageService, PrismaService, UserProvider, PlansService],
})
export class TealWebhooksModule { }
