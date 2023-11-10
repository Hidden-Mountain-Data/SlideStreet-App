import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataUsageService } from '../modules/data-usage/data-usage.service';
import axios from 'axios';

@Injectable()
export class TealPollingService {
    constructor(private readonly dataUsageService: DataUsageService) { }

    @Cron(CronExpression.EVERY_HOUR)
    async pollTealApi() {
        try {
            const response = await axios.get('https://tealapi.io/api/v1/data');
            const data = response.data;

            // Save data to database using DataUsageService
            await this.dataUsageService.saveData(data);
        } catch(error) {
            console.error('Error polling Teal API:', error);
        }
    }
}
