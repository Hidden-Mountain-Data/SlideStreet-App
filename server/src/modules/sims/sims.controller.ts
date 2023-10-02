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
} from '@nestjs/common';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';
import { SimsService } from './sims.service';

@Controller('sims')
export class SimsController {
  constructor(private readonly simsService: SimsService) {}

  @Post()
  async addSim(
    @Body() createSimDto: CreateSimDto,
  ): Promise<Sim | HttpException> {
    try {
      const newSim = await this.simsService.create(createSimDto);
      return newSim;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll() {
    return this.simsService.findAll();
  }

  @Patch('connect/:simId/:routerId')
  connectToRouter(
    @Param('simId', new ParseIntPipe()) simId: number,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ) {
    return this.simsService.connectToRouter(simId, routerId);
  }

  @Get('router/:simId')
  async findRouterBySimId(@Param('simId') simId: string): Promise<any> {
    let router;
    try {
      router = await this.simsService.findRouterBySimId(Number(simId));
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }

    if (!router) {
      throw new HttpException(
        'Router not found for the given SIM ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return router;
  }

  @Get(':simId')
  findOne(@Param('simId') simId: string) {
    return this.simsService.findOne(+simId);
  }

  @Patch(':simId')
  update(@Param('simId') simId: string, @Body() updateSimDto: UpdateSimDto) {
    return this.simsService.update(+simId, updateSimDto);
  }

  @Delete(':simId')
  remove(@Param('simId') simId: string) {
    return this.simsService.remove(+simId);
  }
}
