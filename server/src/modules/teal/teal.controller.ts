import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Teal } from './entities/teal.entity';
import { TealService } from './teal.service';

@Controller('teal')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TealController {
  constructor(private readonly tealService: TealService) {}

  @Get('esims')
  async getEsimRequestId(): Promise<Teal | HttpException> {
    return await this.tealService.getTealEsimsRequestId('esims');
  }

  @Get('esim-info/:id')
  async getEsimsInfo(@Param('id') id: string): Promise<Teal | HttpException> {
    const responseData = await this.tealService.getTealEsimsInfo(id);

    return responseData;
  }

  @Post('change-device-name/:requestId')
  async changeDeviceName(
    @Param('requestId') requestId: string,
    @Body('deviceName') deviceName: string | null,
    @Body('eid') eid: string,
  ): Promise<any> {
    return await this.tealService.changeTealDeviceName(
      requestId,
      deviceName,
      eid,
    );
  }

  @Get('plans')
  async getPlanRequestId(): Promise<Teal | HttpException> {
    return await this.tealService.getTealEsimsRequestId('plans');
  }

  @Post('callback')
  tealCallBack(@Query() data: any) {
    console.log('POST callback');
    return this.tealService.tealCallBack(data);
  }

  @Get('callback/:id')
  async tealCallBackGet(@Param('id') id: string) {
    const callbackTestData = await this.tealService.callbackTest(id);
    console.log('GET callback after callbackTestData');
    return this.tealService.tealCallBack(callbackTestData);
  }

  @Get('callback-test/:id')
  async callbackTest(@Param('id') id: string): Promise<Teal | HttpException> {
    console.log('IN callbackTest id', id);
    return await this.tealService.callbackTest(id);
  }
}
