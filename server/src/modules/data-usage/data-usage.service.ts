import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataUsages } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { AddDataUsageDto } from './dto/add-data-usage.dto';
import { UpdateDataUsageDto } from './dto/update-data-usage.dto';
import { DataUsage } from './entities/data-usage.entity';

@Injectable()
export class DataUsageService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(DataUsageService.name);

  async createDateUsage(data: AddDataUsageDto): Promise<DataUsage> {
    // console.log('Attempting to create data usage with:', data);
    try {
      data.dataUsage = BigInt(data.dataUsage);
      const createdData = await this.prisma.dataUsages.create({ data });

      (createdData.dataUsage as unknown) = createdData.dataUsage.toString();
      return createdData;
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
  // TODO: Figure out how to pass userId, simId, and dateId to this function as Params
  // async createDateUsage(
  //   userId: number,
  //   simId: number,
  //   dateId: number,
  //   data: AddDataUsageDto,
  // ): Promise<DataUsage> {
  //   this.logger.log(
  //     `Service: Received params - userId: ${userId}, simId: ${simId}, dateId: ${dateId}`,
  //   );

  //   try {
  //     this.logger.log('Trying to create data in DB');

  //     const completeData = {
  //       ...data,
  //       userId,
  //       simId,
  //       dateId,
  //       dataUsage: BigInt(data.dataUsage),
  //     };

  //     const createdData = await this.prisma.dataUsages.create({
  //       data: completeData,
  //     });
  //     this.logger.log('Data successfully created in DB');

  //     return createdData;
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error('Error Stack:', error.stack);
  //     } else {
  //       console.error('An unknown error occurred:', error);
  //     }
  //     throw new HttpException(
  //       'Failed to create data usage',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async findAllDataUsage(): Promise<DataUsages[]> {
    try {
      const foundData = await this.prisma.dataUsages.findMany();

      return foundData.map((data) => ({
        ...data,
        dataUsage: data.dataUsage.toString(),
      })) as unknown as DataUsages[];
    } catch (error) {
      console.error('Error finding data usages:', error);
      throw new HttpException(
        'Failed to find data usages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findDataUsageBySimId(simId: number): Promise<DataUsages[]> {
    try {
      const foundDataArray = await this.prisma.dataUsages.findMany({
        where: { simId },
      });

      if (foundDataArray.length === 0) {
        console.log(`No data usage records found for simId ${simId}`);
        return [];
      }

      return foundDataArray.map((data) => ({
        ...data,
        dataUsage: data.dataUsage.toString(),
      })) as unknown as DataUsages[];
    } catch (error) {
      console.error('Error finding data usage:', error);
      throw new HttpException(
        'Failed to find data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDataUsage(
    dataUsageId: number,
    updateDataUsageDto: UpdateDataUsageDto,
  ): Promise<DataUsage> {
    const existingData = await this.prisma.dataUsages.findUnique({
      where: { dataUsageId },
    });

    if (!existingData) {
      return null;
    }

    try {
      updateDataUsageDto.dataUsage = BigInt(updateDataUsageDto.dataUsage);
      const updatedData = await this.prisma.dataUsages.update({
        where: { dataUsageId },
        data: updateDataUsageDto,
      });

      (updatedData.dataUsage as unknown) = updatedData.dataUsage.toString();
      return updatedData;
    } catch (error: unknown) {
      console.error('Error updating data usage:', error);
      throw new HttpException(
        'Failed to update data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeOneDataUsage(dataUsageId: number): Promise<void | HttpException> {
    const existingData = await this.prisma.dataUsages.findUnique({
      where: { dataUsageId },
    });

    if (!existingData) {
      return null;
    }

    try {
      await this.prisma.dataUsages.delete({
        where: { dataUsageId },
      });
    } catch (error: unknown) {
      console.error('Error removing data usage:', error);
      throw new HttpException(
        'Failed to remove data usage',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
