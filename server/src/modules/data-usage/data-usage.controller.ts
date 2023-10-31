import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DataUsages } from '@prisma/client';
import { Request } from 'express';
import { HttpHelpers } from '../../helpers/http-helpers';
import { OwnershipHelpers } from '../../helpers/ownership-helpers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DataUsageService } from './data-usage.service';
import { AddDataUsageDto } from './dto/add-data-usage.dto';
import { UpdateDataUsageDto } from './dto/update-data-usage.dto';
import { DataUsage } from './entities/data-usage.entity';

@Controller('data-usage')
@UseGuards(JwtAuthGuard)
export class DataUsageController {
  private readonly logger = new Logger(DataUsageController.name);

  constructor(
    private readonly dataUsageService: DataUsageService,
    private readonly httpHelper: HttpHelpers,
    private readonly ownershipHelpers: OwnershipHelpers,
  ) {}

  @Post(':simId')
  async addDataUsage(
    @Req() req: Request,
    @Body() createDataUsageDto: AddDataUsageDto,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<DataUsage | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      return await this.dataUsageService.addDateUsageToSim(
        createDataUsageDto,
        simId,
        userId,
      );
    } catch (error) {
      this.logger.error(`Error creating data usage for simId: ${simId}`, error);
      throw error;
    }
  }

  @Get()
  async findAllDataUsages(
    @Req() req: Request,
  ): Promise<DataUsages[] | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    try {
      return await this.dataUsageService.findAllDataUsagesByUserId(userId);
    } catch (error) {
      this.logger.error(
        `Failed to find data usages for userId: ${userId}`,
        error,
      );
      throw error;
    }
  }

  @Get(':simId')
  async findSimsDataUsage(
    @Req() req: Request,
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<DataUsages[] | HttpException> {
    const userId = this.httpHelper.getUserIdAndThrowIfUnauthorized(req);
    await this.ownershipHelpers.ensureSimOwnership(simId, userId);

    try {
      const result = await this.dataUsageService.findDataUsageBySimId(simId);
      if (!result.length) {
        this.logger.warn(`Data usage for simId ${simId} not found.`);
        throw new HttpException(
          `Data usage for simId ${simId} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      this.logger.error(`Failed to find data usage for simId: ${simId}`, error);
      throw error;
    }
  }

  @Patch(':dataUsageId')
  async update(
    @Param('dataUsageId', new ParseIntPipe()) dataUsageId: number,
    @Body() updateDataUsageDto: UpdateDataUsageDto,
  ): Promise<DataUsage | HttpException> {
    try {
      const updatedData = await this.dataUsageService.updateDataUsage(
        dataUsageId,
        updateDataUsageDto,
      );
      if (!updatedData) {
        this.logger.warn(`Data usage with id ${dataUsageId} not found.`);
        throw new HttpException(
          `Data usage with id ${dataUsageId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedData;
    } catch (error) {
      this.logger.error(
        `Could not update data usage with id ${dataUsageId}`,
        error,
      );
      throw error;
    }
  }

  @Delete(':dataUsageId')
  async remove(
    @Param('dataUsageId', new ParseIntPipe()) dataUsageId: number,
  ): Promise<void | HttpException> {
    try {
      const result = await this.dataUsageService.removeOneDataUsage(
        dataUsageId,
      );
      if (!result) {
        this.logger.warn(`Data usage with id ${dataUsageId} not found.`);
        throw new HttpException(
          `Data usage with id ${dataUsageId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error removing data usage with id ${dataUsageId}`,
        error,
      );
      throw error;
    }
  }
}
