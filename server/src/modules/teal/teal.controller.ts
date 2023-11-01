import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { Teal } from './entities/teal.entity';
import { TealService } from './teal.service';

@Controller('teal')
export class TealController {
  constructor(private readonly tealService: TealService) {}

  // @Get('esims')
  // async getTealEsims(): Promise<Teal | HttpException> {
  //   return await this.tealService.getTealEsimsRequestId();
  // }
  @Get('esims')
  async getEsimRequestId(): Promise<Teal | HttpException> {
    return await this.tealService.getTealEsimsRequestId('esims');
  }

  @Get('plans')
  async getPlanRequestId(): Promise<Teal | HttpException> {
    return await this.tealService.getTealEsimsRequestId('plans');
  }

  @Get('callback-test/:id')
  async callbackTest(@Param('id') id: string): Promise<Teal | HttpException> {
    console.log('IN callbackTest id', id);
    return await this.tealService.callbackTest(id);
  }
}
