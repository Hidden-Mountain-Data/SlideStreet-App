import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { Sims } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class TealPollingService {

  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(TealPollingService.name);
  public readonly tealAxiosInstance = axios.create({
    baseURL: 'https://integrationapi.teal.global',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'ApiKey': process.env.TEAL_API_KEY,
      'ApiSecret': process.env.TEAL_SECRET_KEY,
    },
  });

  @Cron('*/2 * * * *')
  async updateTealDataUsage() {

    try {
      // Get current time which will be in Pacific Time
      const currentTime = new Date();

      // if the current time is before 1 am then we need to get data usage from the previous day at 11:59:59 pm
      if(currentTime.getHours() < 1) {
        // Set the current time to 11:59:59 pm
        currentTime.setHours(23, 59, 59, 0);
        // Set the current time to the previous day
        currentTime.setDate(currentTime.getDate() - 1);
      }

      // Format the current time as yyyy-mm-dd hh:mm:ss
      const periodEnd = currentTime.toISOString().slice(0, 19).replace('T', ' ');

      // Time at the beginning of today in Pacific Time
      currentTime.setHours(0, 0, 0, 0);
      // Format the beginning of today as yyyy-mm-dd hh:mm:ss
      const periodStart = currentTime.toISOString().slice(0, 19).replace('T', ' ');

      this.logger.log('Polling Teal API for data usage at ' + periodEnd);
      let sims: Sims[] = [];
      try {
        // Get all sims from database
        sims = await this.prisma.sims.findMany();

      } catch(error) {
        //Handle error
        this.logger.log('Error getting sims from database: ', error);
        throw error;
      }

      try {
        [sims[0]].map(async (sim: Sims) => {
          const { eid } = sim;
          //Generate a random alphanumeric uuid for the request id of 32 characters
          const requestId = this.generateUUID();

          const response = await this.tealAxiosInstance.get('/api/v1/data-consumption/data', {
            params: {
              requestId,
              limit: 100,
              eid,
              dataType: 'DAILY',
              periodStart: periodStart,
              periodEnd: periodEnd,
              callbackUrl: process.env.TEAL_DATAUSAGE_CALLBACK_URL,
            }
          });

          this.logger.log('Sent get request to Teal API', requestId);
          // console.log('Response: ', response);

          // response should be 200 ok if the request was successful
          if(response.status === 200) {
            this.logger.log('Successfully sent get request to Teal API');
          } else {
            throw new Error('Error sending get request to Teal API' + response);
          }

        });
      } catch(error) {
        this.logger.log('Error sending get request: ', error);
        throw error;
      }

    } catch(error) {
      this.logger.log('Error polling Teal API:', error);
    }
  }

  //Generates a UUID for the Teal API request id
  generateUUID() {
    return uuidv4().replace(/-/g, '').replace(/,/g, '');
  }
}
