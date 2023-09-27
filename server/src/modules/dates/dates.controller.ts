import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DatesService } from './dates.service';
import { CreateDateDto } from './dto/create-date.dto';

@Controller('dates')
export class DatesController {
  constructor(private readonly datesService: DatesService) {}

  @Post()
  async createDate(@Body() dateData: CreateDateDto) {
    return await this.datesService.createDate(dateData);
  }

  @Get()
  findAll() {
    return this.datesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datesService.findOne(+id);
  }
}
