import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Router } from '../routers/entities/router.entity';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';

@Injectable()
export class SimsService {
  constructor(private prisma: PrismaService) {}

  async connectToRouter(simId: number, routerId: number) {
    return this.prisma.sims.update({
      where: { simId },
      data: { routerId },
    });
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

  async create(createSimData: CreateSimDto): Promise<Sim | HttpException> {
    try {
      const createdSim = await this.prisma.sims.create({
        data: {
          iccid: createSimData.iccid,
        },
      });

      return createdSim;
    } catch (error) {
      throw new Error(`Failed to create a new Sim: ${error.message}`);
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
