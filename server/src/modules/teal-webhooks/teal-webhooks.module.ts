import { Module } from '@nestjs/common';
import { TealWebhooksController } from './teal-webhooks.controller';
import { TealPollingService } from '../tasks/tasks.service';
import { SimsService } from '../sims/sims.service';
import { DataUsageService } from '../data-usage/data-usage.service';
import { DataUsageModule } from '../data-usage/data-usage.module'; // Import the DataUsageModule
import { PrismaService } from '../../services/prisma.service';
import { UserProvider } from '../users/user.provider';

@Module({
    imports: [DataUsageModule],
    controllers: [TealWebhooksController],
    providers: [TealPollingService, SimsService, DataUsageService, PrismaService, UserProvider],
})
export class TealWebhooksModule { }
