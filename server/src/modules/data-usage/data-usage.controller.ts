import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DataUsages } from '@prisma/client';
import { Request } from 'express';
import { OwnershipHelpers } from '../../helpers/ownership-helpers';
import { AuthGuard } from '../auth/auth.guard';
import { DataUsageService } from './data-usage.service';
import { AddDataUsageDto } from './dto/add-data-usage.dto';
import { UpdateDataUsageDto } from './dto/update-data-usage.dto';
import { DataUsage } from './entities/data-usage.entity';

@Controller('data-usage')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DataUsageController {
  constructor(
    private readonly dataUsageService: DataUsageService,
    private readonly ownershipHelpers: OwnershipHelpers,
  ) {}

  @Post(':simId')
  async addDataUsage(
    @Body() createDataUsageDto: AddDataUsageDto,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<DataUsage | HttpException> {
    return await this.dataUsageService.addDateUsageToSim(
      createDataUsageDto,
      simId,
    );
  }

  @Get()
  async findAllDataUsages(): Promise<DataUsages[] | HttpException> {
    return await this.dataUsageService.findAllDataUsagesByUserId();
  }

  @Get(':simId')
  async findSimsDataUsage(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<DataUsages[] | HttpException> {
    await this.ownershipHelpers.ensureSimOwnership(simId);
    return await this.dataUsageService.findDataUsageBySimId(simId);
  }

  @Patch(':dataUsageId')
  async update(
    @Param('dataUsageId', new ParseIntPipe()) dataUsageId: number,
    @Body() updateDataUsageDto: UpdateDataUsageDto,
  ): Promise<DataUsage | HttpException> {
    return await this.dataUsageService.updateDataUsage(
      dataUsageId,
      updateDataUsageDto,
    );
    // if (!updatedData) {
    //   this.logger.warn(`Data usage with id ${dataUsageId} not found.`);
    //   throw new HttpException(
    //     `Data usage with id ${dataUsageId} not found`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    // return updatedData;
  }

  @Delete(':dataUsageId')
  async remove(
    @Param('dataUsageId', new ParseIntPipe()) dataUsageId: number,
  ): Promise<void | HttpException> {
    return await this.dataUsageService.removeOneDataUsage(dataUsageId);
  }
}
