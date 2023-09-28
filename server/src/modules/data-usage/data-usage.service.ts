import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataUsages } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { DataUsageDto } from './dto/data-usage.dto';

@Injectable()
export class DataUsageService {
  constructor(private prisma: PrismaService) {}

  async create(data: DataUsageDto): Promise<DataUsages> {
    try {
      return await this.prisma.dataUsages.create({ data });
    } catch (error) {
      console.error('Error creating data usage:', error);
      throw new HttpException(
        'Failed to create data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<DataUsages[]> {
    try {
      return await this.prisma.dataUsages.findMany();
    } catch (error) {
      console.error('Error finding data usages:', error);
      throw new HttpException(
        'Failed to find data usages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(dataUsageId: number): Promise<DataUsages | null> {
    try {
      return await this.prisma.dataUsages.findUnique({
        where: { dataUsageId },
      });
    } catch (error) {
      console.error('Error finding data usage:', error);
      throw new HttpException(
        'Failed to find data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    dataUsageId: number,
    updateDataUsageDto: DataUsageDto,
  ): Promise<DataUsages> {
    try {
      return await this.prisma.dataUsages.update({
        where: { dataUsageId },
        data: updateDataUsageDto,
      });
    } catch (error) {
      console.error('Error updating data usage:', error);
      throw new HttpException(
        'Failed to update data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(dataUsageId: number): Promise<void> {
    try {
      await this.prisma.dataUsages.delete({
        where: { dataUsageId },
      });
    } catch (error) {
      console.error('Error removing data usage:', error);
      throw new HttpException(
        'Failed to remove data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
