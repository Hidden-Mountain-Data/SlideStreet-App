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

  @Cron('*/5 * * * *')
  async updateTealDataUsage() {
    if(process.env.stage === 'dev') {
      return
    }
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
        sims.map(async (sim: Sims) => {
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
              callbackUrl: process.env.TEAL_CALLBACK_URL + '/update-data-usage',
            }
          });

          this.logger.log('Sent get request to Teal API for data usage', requestId, eid);
          // console.log('Response: ', response);

          // response should be 200 ok if the request was successful
          if(response.status === 200) {
            this.logger.log('Successfully sent get request to Teal API for data usage');
          } else {
            throw new Error('Error sending get request to Teal API for data usage' + response);
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
  @Cron('*/30 * * * *')
  async geteSIMS() {
    if(process.env.stage === 'dev') {
      return
    }
    try {

      const requestId = this.generateUUID()
      this.logger.log('Get eSims from Teal API')

      const response = await this.tealAxiosInstance.get('/api/v1/esims', {
        params: {
          requestId,
          // limit: 100,
          callbackUrl: process.env.TEAL_CALLBACK_URL + '/esims',
        }
      });

      // response should be 200 ok if the request was successful
      if(response.status === 200) {
        this.logger.log('Successfully sent get request to Teal API');
      } else {
        throw new Error('Error sending get request to Teal API' + response);
      }

    } catch(error) {
      this.logger.log('Error polling Teal API:', error);
    }
  }
  @Cron('0 24 * * *')
  async getTealPlans(nextRequestId: string | null, offset: number | null, limit: number | null) {
    if(process.env.stage === 'dev') {
      return
    }
    try {

      let requestId = this.generateUUID()
      if(nextRequestId != null) {
        // requestId = nextRequestId
        console.log('requestId:', requestId);
        console.log('Offset:', offset);
        console.log('Limit:', limit);
      }
      this.logger.log('Get Plans from Teal API', requestId, offset, limit)

      const response = await this.tealAxiosInstance.get('/api/v1/plans', {
        params: {
          requestId,
          limit: limit ? limit : 50,
          offset: offset ? offset : 0,
          callbackUrl: process.env.TEAL_CALLBACK_URL + '/plans',
        }
      });



      // response should be 200 ok if the request was successful
      if(response.status === 200) {
        this.logger.log('Successfully sent get Plans request to Teal API');
      } else {
        throw new Error('Error sending get Plans request to Teal API' + response);
      }

    } catch(error) {
      this.logger.log('Error polling Teal API for get PLans:', error);
    }
  }


  //Generates a UUID for the Teal API request id
  generateUUID() {
    return uuidv4().replace(/-/g, '').replace(/,/g, '');
  }
}
