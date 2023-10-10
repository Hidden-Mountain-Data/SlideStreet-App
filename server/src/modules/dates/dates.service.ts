import { Injectable } from '@nestjs/common';
import { Dates } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { CreateDateDto } from './dto/create-date.dto';

@Injectable()
export class DatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDate(dateData: CreateDateDto): Promise<Dates> {
    return await this.prisma.dates.create({
      data: dateData,
    });
  }

  findAll(): Promise<Dates[]> {
    return this.prisma.dates.findMany();
  }

  findOne(id: number): Promise<Dates> {
    return this.prisma.dates.findUnique({
      where: { dateId: id },
    });
  }
}
