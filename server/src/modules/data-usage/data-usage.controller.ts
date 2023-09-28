import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DataUsages } from '@prisma/client';
import { DataUsageService } from './data-usage.service';
import { DataUsageDto } from './dto/data-usage.dto';

@Controller('data-usage')
export class DataUsageController {
  constructor(private readonly dataUsageService: DataUsageService) {}

  @Post()
  async create(@Body() createDataUsageDto: DataUsageDto): Promise<DataUsages> {
    try {
      return await this.dataUsageService.create(createDataUsageDto);
    } catch (error) {
      console.error('Error creating data usage:', error);
      throw new HttpException(
        'Failed to create data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<DataUsages[]> {
    try {
      return await this.dataUsageService.findAll();
    } catch (error) {
      console.error('Error finding data usages:', error);
      throw new HttpException(
        'Failed to find data usages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DataUsages | null> {
    try {
      return await this.dataUsageService.findOne(+id);
    } catch (error) {
      console.error('Error finding data usage:', error);
      throw new HttpException(
        'Failed to find data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDataUsageDto: DataUsageDto,
  ): Promise<DataUsages> {
    try {
      return await this.dataUsageService.update(+id, updateDataUsageDto);
    } catch (error) {
      console.error('Error updating data usage:', error);
      throw new HttpException(
        'Failed to update data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.dataUsageService.remove(+id);
    } catch (error) {
      console.error('Error removing data usage:', error);
      throw new HttpException(
        'Failed to remove data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
