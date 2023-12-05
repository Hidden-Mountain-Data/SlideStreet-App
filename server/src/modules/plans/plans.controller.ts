import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PlansService } from './plans.service';
import { SSPlans } from '@prisma/client';

@Controller('plans')
@UseGuards(AuthGuard)
export class PlansController {
  private readonly logger = new Logger(PlansController.name);
  constructor(
    private readonly plansService: PlansService,
  ) { }

  @Get()
  public async getPlans(): Promise<SSPlans[]> {
    return await this.plansService.getPlans();
  }
  @Get('tealPlanId/:id')
  public async getSSPlanByTealPlanId(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<any> {
    return await this.plansService.getSSPlanByTealPlanId(id);
  }
}
