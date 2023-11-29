import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TealService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(TealService.name);
  public readonly tealAxiosInstance = axios.create({
    baseURL: 'https://integrationapi.teal.global',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'ApiKey': process.env.TEAL_API_KEY,
      'ApiSecret': process.env.TEAL_SECRET_KEY,
    },
  });

  async activateeSIMs(esims: number[]) {
    try {
      const requestId = this.generateUUID();
      const response = await this.tealAxiosInstance.post('/api/v1/esims/enable', {
        requestId,
        callbackUrl: process.env.TEAL_CALLBACK_URL + '/esims/enable',
        esims,
      });
    } catch(error) {
      this.logger.log(error)
    }
  }

  generateUUID() {
    return uuidv4().replace(/-/g, '').replace(/,/g, '');
  }
}
