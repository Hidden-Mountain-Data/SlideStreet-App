import { HttpException, Injectable } from '@nestjs/common';
import { TealRequest } from '@prisma/client';
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

    // console.log('createRequest: ', createRequest);
    const requestId = createRequest.requestId;

    // console.log('requestId: ', requestId);
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

  // ! WIP
  async getTealEsimsInfo(requestId: string): Promise<Teal | HttpException> {
    try {
      const response = await superagent
        .get(
          `https://integrationapi.teal.global/api/v1/esims/info?callbackUrl=${this.tealCallbackUrl}&limit=3&requestId=${requestId}`,
        )
        .set('ApiKey', this.tealApiKey)
        .set('ApiSecret', this.tealSecret)
        .set('RequestID', requestId);

      console.log('######## res', response);

      return response.body;
    } catch (error) {
      console.error('Error in getTealEsims', error);
      throw new Error('An error occurred');
    }
  }

  async changeTealDeviceName(
    requestId: string,
    deviceName: string | null,
    eid: string,
  ): Promise<any> {
    try {
      const entries = [
        {
          eid: eid,
          deviceName: deviceName,
        },
      ];

      const response = await superagent
        .post(
          `https://integrationapi.teal.global/api/v1/esims/change-device-name?callbackUrl=${this.tealCallbackUrl}&limit=3&requestId=${requestId}`,
        )
        .set('ApiKey', this.tealApiKey)
        .set('ApiSecret', this.tealSecret)
        .set('RequestID', requestId)
        .send({ entries });

      return response.body;
    } catch (error) {
      console.error('Error in changeTealDeviceName', error);
      throw new Error('An error occurred');
    }
  }

  async tealCallBack(data: any) {
    console.group(
      '###############################################################################################################',
    );
    console.log('data in tealCallback', data);

    const requestId = data.requestId;
    const request = await this.findTealRequest(requestId);

    console.log('requestId', requestId);
    console.log('request', request);
    console.groupEnd();

    if (request.type === 'plans') {
      const plans = await this.getPlansToSave(requestId);
      return plans;
    }
    if (request.type === 'esims') {
      const esims = await this.getEsimsToSave(requestId);
      return esims;
    }
    console.log('requestId==>', requestId);
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

  private getRouterById(id) {
    return this.prisma.routers.findUnique({
      where: { routerId: id },
    });
  }

  private async createEsims(esims) {
    await this.prisma.sims.upsert({
      where: { iccid: esims.iccid },
      update: {
        iccid: esims.iccid,
        eid: esims.eid,
        imei: esims.imei,
        status: esims.status,
        plan: { connect: { planId: esims.planId } },
        carrier: { connect: { carrierId: esims.carrierId } },
      },
      create: {
        iccid: esims.iccid,
        eid: esims.eid,
        imei: esims.imei,
        status: esims.status,
        plan: { connect: { planId: esims.planId } },
        carrier: { connect: { carrierId: esims.carrierId } },
      },
    });
  }

  private async getEsimsToSave(requestId) {
    const requestUpdate = await superagent
      .get(
        `http://integrationapi.teal.global/api/v1/operation-result?requestId=${requestId}`,
      )
      .set('ApiKey', this.tealApiKey)
      .set('ApiSecret', this.tealSecret);

    const requestDetails = requestUpdate.body;
    const sims = requestDetails.entries;
    const returnData = [];
    for (const sim of sims) {
      const router = await this.getRouterById(sim.simId);
      if (!router) {
        sim.routerId = null;
      } else {
        sim.routerId = router.simId;
      }
      const simCreateData = {
        iccid: sim.iccid,
        eid: sim.eid,
        carrierUuid: sim.planUuid,
        imei: sim.imei,
        status: sim.deviceStatus,
        planId: sim.planId,
        carrierId: 'odZ-RGBg5AE0SF1CZKReF',
      };
      await this.createEsims(simCreateData);
      returnData.push(simCreateData);
    }
    return returnData;
  }

  private async getPlansToSave(requestId) {
    const requestUpdate = await superagent
      .get(
        `http://integrationapi.teal.global/api/v1/operation-result?requestId=${requestId}`,
      )
      .set('ApiKey', this.tealApiKey)
      .set('ApiSecret', this.tealSecret);
    const requestDetails = requestUpdate.body;
    const plans = requestDetails.entries;
    const returnData = [];
    for (const plan of plans) {
      const planCreateData = {
        carrierUuid: plan.uuid,
        planName: plan.name,
        carrierName: 'Teal',
        slideCost: plan.price,
        slideCostUnit: plan.volumeUnit,
        slideOverageCost: plan.overagePrice || 0,
        slideOverageUnit: plan.overageVolumeUnit || 'MB',
        slideDataCost: plan.price,
        slideDataUnit: plan.volumeUnit,
        slideDataAmount: plan.volume,
        slideSmsPrice: plan.smsPrice,
        network: 'Teal',
        planDescription: plan.description,
        networkType: plan.networkType,
        technology: plan.networkTechType,
        carrierId: 'odZ-RGBg5AE0SF1CZKReF',
      };
      // await this.createPlan(planCreateData);
      console.log(planCreateData);
      returnData.push(planCreateData);
    }
    return returnData;
  }

  private async findTealRequest(requestId: string): Promise<TealRequest> {
    return await this.prisma.tealRequest.findUnique({
      where: { requestId },
    });
  }
}

// Change device name GET 'https://integrationapi.teal.global/api/v1/esims/change-device-name?${this.tealCallbackUrl}&limit=3&requestId=${requestId}' \
