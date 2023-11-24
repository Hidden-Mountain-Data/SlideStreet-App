import {
    Controller,
    Get,
    HttpCode,
    Query
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TealPollingService } from '../tasks/tasks.service';
import { DataUsage } from 'src/types/teal-types';
import { DataUsageService } from '../data-usage/data-usage.service';
import { SimsService } from '../sims/sims.service';


@Controller('teal-webhooks')
export class TealWebhooksController {

    private readonly logger = new Logger(TealWebhooksController.name);

    constructor(
        private readonly tealPollingService: TealPollingService,
        private readonly dataUsageService: DataUsageService,
        private readonly simsService: SimsService
    ) { }

    @Get('update-data-usage')
    @HttpCode(200)
    async updateEsimDataUsage(@Query('requestId') requestId: any) {
        try {
            requestId = requestId[1];
            this.logger.log('Updating data usage from requestId=', requestId);
            const response = await this.tealPollingService.tealAxiosInstance.get('/api/v1/operation-result', {
                params: {
                    requestId
                }
            })
            console.log('Response from Teal API: ', response.data.entries);
            const entries: DataUsage[] = response.data.entries as DataUsage[];

            entries.map(async (entry: DataUsage) => {
                const { eid, usage, period } = entry;
                const dateId = Number(period.slice(0, 4) + period.slice(5, 7) + period.slice(8, 10));
                const sim = await this.simsService.getSimByEid(eid);
                const { simId, userId } = sim;
                this.dataUsageService.upsertDataUsageBySimIdAndDateId(userId, simId, dateId, usage);
            })

            return { statusCode: 200, message: 'Success' };
        } catch(error) {
            this.logger.error('Error updating data usage:', error);
            throw error;
        }
    }
    //TODO Additional teal webhook endpoints
}
