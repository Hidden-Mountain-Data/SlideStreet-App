import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataUsages } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { AddDataUsageDto } from './dto/add-data-usage.dto';
import { UpdateDataUsageDto } from './dto/update-data-usage.dto';
import { DataUsage } from './entities/data-usage.entity';

@Injectable()
export class DataUsageService {
  private readonly logger = new Logger(DataUsageService.name);

  constructor(private prisma: PrismaService) {}

  async addDateUsageToSim(
    dataUsagePayload: AddDataUsageDto,
    simId: number,
    userId: number,
  ): Promise<DataUsage> {
    try {
      const simExists = await this.prisma.sims.findUnique({
        where: { simId },
      });

      if (!simExists) {
        this.logger.error(`Router with ID ${simId} does not exist.`);
        throw new HttpException(
          `Router with ID ${simId} does not exist.`,
          HttpStatus.NOT_FOUND,
        );
      }

      dataUsagePayload.dataUsage = BigInt(dataUsagePayload.dataUsage);
      const createdData = await this.prisma.dataUsages.create({
        data: {
          ...dataUsagePayload,
          simId,
          userId,
        },
      });

      (createdData.dataUsage as unknown) = createdData.dataUsage.toString();
      return createdData;
    } catch (error: unknown) {
      this.logger.error(
        `Error creating data usage for userId: ${userId} and simId: ${simId}`,
        error,
      );
      throw new InternalServerErrorException('Could not create data usage');
    }
  }

  async findAllDataUsagesByUserId(userId: number): Promise<DataUsages[]> {
    try {
      const foundData = await this.prisma.dataUsages.findMany({
        where: { userId: +userId },
      });

      return foundData.map((data) => ({
        ...data,
        dataUsage: data.dataUsage.toString(),
      })) as unknown as DataUsages[];
    } catch (error) {
      this.logger.error(
        `Error finding data usages for userId: ${userId}`,
        error,
      );
      throw new InternalServerErrorException(`Could not find data usages`);
    }
  }

  async findDataUsageBySimId(simId: number): Promise<DataUsages[]> {
    try {
      const foundDataArray = await this.prisma.dataUsages.findMany({
        where: { simId },
      });

      if (!foundDataArray.length) {
        this.logger.warn(`No data usage records found for simId ${simId}`);
        return;
      }

      return foundDataArray.map((data) => ({
        ...data,
        dataUsage: data.dataUsage.toString(),
      })) as unknown as DataUsages[];
    } catch (error: unknown) {
      this.logger.error(`Error finding data usage by simId: ${simId}`, error);
      throw new InternalServerErrorException(
        'Failed to find data usage for this sim',
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
      this.logger.warn(`DataUsage with ID ${dataUsageId} does not exist.`);
      throw new NotFoundException(
        `DataUsage with ID ${dataUsageId} does not exist.`,
      );
    }

    try {
      updateDataUsageDto.dataUsage = BigInt(updateDataUsageDto.dataUsage);
      const updatedData = await this.prisma.dataUsages.update({
        where: { dataUsageId },
        data: updateDataUsageDto,
      });

      return {
        ...updatedData,
        dataUsage: updatedData.dataUsage.toString(),
      };
    } catch (error: unknown) {
      this.logger.error(
        `Error updating data usage with ID: ${dataUsageId}`,
        error,
      );
      throw new InternalServerErrorException('Failed to update data usage');
    }
  }

  async removeOneDataUsage(dataUsageId: number): Promise<void | HttpException> {
    const existingData = await this.prisma.dataUsages.findUnique({
      where: { dataUsageId },
    });

    if (!existingData) {
      this.logger.warn(`DataUsage with ID ${dataUsageId} does not exist.`);
      throw new NotFoundException(
        `DataUsage with ID ${dataUsageId} does not exist.`,
      );
    }

    try {
      await this.prisma.dataUsages.delete({
        where: { dataUsageId },
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error removing data usage with ID: ${dataUsageId}`,
        error,
      );
      throw new InternalServerErrorException('Failed to remove data usage');
    }
  }
}
