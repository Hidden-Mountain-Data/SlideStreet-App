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
import { Sims } from '@prisma/client';
import { PlansService } from '../plans/plans.service';
import { PlanDTO } from '../plans/dto/plan.dto';


@Controller('teal-webhooks')
export class TealWebhooksController {

    private readonly logger = new Logger(TealWebhooksController.name);

    constructor(
        private readonly tealPollingService: TealPollingService,
        private readonly dataUsageService: DataUsageService,
        private readonly simsService: SimsService,
        private readonly plansService: PlansService
    ) { }

    @Get('update-data-usage')
    @HttpCode(200)
    async updateEsimDataUsage(@Query('requestId') requestId: any) {
        try {
            requestId = requestId[1];
            const response = await this.tealPollingService.tealAxiosInstance.get('/api/v1/operation-result', {
                params: {
                    requestId
                }
            })
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
    @Get('esims')
    @HttpCode(200)
    async updateEsims(@Query('requestId') requestId: any) {
        try {
            console.log("got esims request", requestId);

            const response = await this.tealPollingService.tealAxiosInstance.get('/api/v1/operation-result', {
                params: {
                    requestId
                }
            })
            const entries = response.data.entries;
            entries.map(async (entry: any) => {
                const { simId } = await this.simsService.getSimByEid(entry.eid);
                const { ssPlanId } = await this.plansService.getSSPlanByTealPlanId(entry.planId);
                //get teal plan Id using planId once we have them
                const { id, planId, suspended, deviceStatus, ...rest } = entry;
                const tealPlanId = planId;
                const active = entry.suspended === 'false' ? true : false;
                const status = entry.deviceStatus;
                if(simId) {
                    this.simsService.updateSimById(simId, { ...rest, tealPlanId, active, status });
                }
            })

            return { statusCode: 200, message: 'Success' };
        } catch(error) {
            this.logger.error('Error updating esims:', error);
            throw error;
        }
    }
    @Get('plans')
    @HttpCode(200)
    async updatePlans(@Query('requestId') requestId: any) {
        try {
            console.log("got plans request", requestId);

            const response = await this.tealPollingService.tealAxiosInstance.get('/api/v1/operation-result', {
                params: {
                    requestId
                }
            })
            const entries = response.data.entries;
            console.log("entries", entries.length);
            // console.log("next", response.data._links.operationResult);
            this.plansService.upsertPlans(entries);
            console.log("next", response.data._links.next.href);
            if(entries.length) {
                const url = response.data._links.next.href
                const params = new URLSearchParams(url.split('?')[1]);

                const offset = params.get('offset');
                const limit = params.get('limit');
                const nextRequestId = requestId + `${offset}`;
                console.log('nextRequestId:', nextRequestId);

                console.log('Offset:', offset);
                console.log('Limit:', limit);
                await this.tealPollingService.getTealPlans(nextRequestId, +offset, +limit);
                // const nextResponse = await this.tealPollingService.tealAxiosInstance.get('/api/v1/plans', {
                //     params: {
                //         requestId: nextRequestId,
                //         offset: offset,
                //         limit: limit,
                //         callbackUrl: process.env.TEAL_CALLBACK_URL + '/plans',
                //     }
                // });
                // console.log("next Response", nextResponse)
                // if(nextResponse.status === 200) {
                //     this.logger.log('Successfully sent get NEXT PAGE Plans request to Teal API');
                // } else {
                //     throw new Error('Error sending get NEXT PAGE Plans request to Teal API' + nextResponse);
                // }
            }

            return { statusCode: 200, message: 'Success' };
        } catch(error) {
            this.logger.error('Error updating plans:', error);
            throw error;
        }
    }
}
