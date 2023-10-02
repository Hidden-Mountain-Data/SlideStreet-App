import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DataUsages } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DataUsageService } from './data-usage.service';
import { AddDataUsageDto } from './dto/add-data-usage.dto';
import { UpdateDataUsageDto } from './dto/update-data-usage.dto';
import { DataUsage } from './entities/data-usage.entity';

@Controller('data-usage')
export class DataUsageController {
  constructor(private readonly dataUsageService: DataUsageService) {}

  // TODO: Figure out how to pass userId, simId, and dateId to this function as Params like this:
  // @Post(':userId/:simId/:dateId')
  // @UseGuards(JwtAuthGuard)
  // async create(
  //   @Param('userId', new ParseIntPipe()) userId: number,
  //   @Param('simId', new ParseIntPipe()) simId: number,
  //   @Param('dateId', new ParseIntPipe()) dateId: number,
  //   @Body() createDataUsageDto: AddDataUsageDto,
  // ): Promise<DataUsages> {
  //   console.log(
  //     `Controller: Received params - userId: ${userId}, simId: ${simId}, dateId: ${dateId}`,
  //   );
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDataUsageDto: AddDataUsageDto,
  ): Promise<DataUsage> {
    try {
      const createdData = await this.dataUsageService.createDateUsage(
        createDataUsageDto,
      );

      return createdData as unknown as DataUsages;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error Stack:', error.stack);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw new HttpException(
        'Failed to create data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<DataUsages[]> {
    try {
      return await this.dataUsageService.findAllDataUsage();
    } catch (error) {
      console.error('Error finding data usages:', error);
      throw new HttpException(
        'Failed to find data usages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':simId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('simId', new ParseIntPipe()) simId: number,
  ): Promise<DataUsages[] | null> {
    console.log(`Trying to find data usage by simId: ${simId}`);
    try {
      const result = await this.dataUsageService.findDataUsageBySimId(simId);

      if (result.length === 0) {
        console.log(`Data usage for simId ${simId} not found.`);
        return null;
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error Stack in FindOne:', error.stack);
      } else {
        console.error('An unknown error occurred while finding:', error);
      }
      throw new HttpException(
        'Failed to find data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':dataUsageId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('dataUsageId', new ParseIntPipe()) dataUsageId: number,
    @Body() updateDataUsageDto: UpdateDataUsageDto,
  ): Promise<DataUsage> {
    const updatedData = await this.dataUsageService.updateDataUsage(
      dataUsageId,
      updateDataUsageDto,
    );
    if (!updatedData) {
      throw new HttpException(
        `Data usage with id ${dataUsageId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedData;
  }

  @Delete(':dataUsageId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('dataUsageId', new ParseIntPipe()) dataUsageId: number,
  ): Promise<void> {
    const result = await this.dataUsageService.removeOneDataUsage(dataUsageId);
    if (result === null) {
      throw new HttpException(
        `Data usage with id ${dataUsageId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
