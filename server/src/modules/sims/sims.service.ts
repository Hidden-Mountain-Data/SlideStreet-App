import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SimStatus } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { Router } from '../routers/entities/router.entity';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';

@Injectable()
export class SimsService {
  constructor(private prisma: PrismaService) {}

  async connectToRouter(simId: number, routerId: number): Promise<Sim> {
    try {
      const updatedSim = await this.prisma.sims.update({
        where: { simId },
        data: { routerId },
      });
      console.log('Successfully connected Sim to Router', updatedSim);
      return updatedSim;
    } catch (error) {
      console.error('Failed to connect Sim to Router', error);
      throw new HttpException(
        'Failed to connect Sim to Router',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRouterBySimId(simId: number): Promise<Router> {
    const simRecord = await this.prisma.sims.findUnique({
      where: { simId },
      include: {
        router: true,
      },
    });

    if (!simRecord || !simRecord.router) {
      throw new HttpException(
        'Router not found for the given SIM ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return simRecord.router;
  }

  async addSim(createSimData: CreateSimDto): Promise<Sim | HttpException> {
    try {
      const createdSim = await this.prisma.sims.create({
        data: {
          iccid: createSimData.iccid,
          userId: createSimData.userId,
          status: SimStatus.ACTIVE,
        },
      });

      console.log('simId:', createdSim);

      return createdSim;
    } catch (error) {
      throw new Error(`Failed to create a new Sim: ${error}`);
    }
  }

  findAll() {
    return `This action returns all sims`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sim`;
  }

  async update(
    simId: number,
    updateSimDto: UpdateSimDto,
  ): Promise<Sim | HttpException> {
    try {
      const updatedData = Object.fromEntries(
        Object.entries(updateSimDto).filter((entry) => entry[1] !== undefined),
      );

      return await this.prisma.sims.update({
        where: { simId },
        data: updatedData,
      });
    } catch (error) {
      throw new HttpException(
        'Error updating sim',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} sim`;
  }
}
