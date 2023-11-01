import { HttpException, Injectable } from '@nestjs/common';
import * as superagent from 'superagent';
import { PrismaService } from '../../services/prisma.service';
import { Teal } from './entities/teal.entity';

@Injectable()
export class TealService {
  private readonly tealApiKey = process.env.TEAL_API_KEY;
  private readonly tealSecret = process.env.TEAL_SECRET_KEY;
  private readonly tealCallbackUrl = process.env.TEAL_CALLBACK_URL;

  constructor(private readonly prisma: PrismaService) {}

  async getTealEsimsRequestId(
    type: 'esims' | 'plans',
  ): Promise<Teal | HttpException> {
    const createRequest = await this.prisma.tealRequest.create({
      data: { type },
    });

    console.log('createRequest: ', createRequest);
    const requestId = createRequest.requestId;

    console.log('requestId: ', requestId);
    try {
      const response = await superagent
        .get(
          `https://integrationapi.teal.global/api/v1/${type}?callbackUrl=${this.tealCallbackUrl}`,
        )
        .set('ApiKey', this.tealApiKey)
        .set('ApiSecret', this.tealSecret)
        .set('RequestID', requestId);

      return response.body;
    } catch (error) {
      console.error('Error in getTealEsims', error);
      throw new Error('An error occurred');
    }
  }

  async callbackTest(requestId: string): Promise<Teal | HttpException> {
    console.log('this.tealApiKey::: ', this.tealApiKey);
    console.log('this.tealSecret::: ', this.tealSecret);
    console.log('requestId::: ', requestId);
    const requestUpdate = await superagent
      .get(
        `http://integrationapi.teal.global/api/v1/operation-result?requestId=${requestId}`,
      )
      .set('ApiKey', this.tealApiKey)
      .set('ApiSecret', this.tealSecret);

    console.log('update::: ', requestUpdate);

    return requestUpdate.body.entries;
  }
}
