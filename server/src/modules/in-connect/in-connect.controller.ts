import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InConnectService } from './in-connect.service';
import { CreateInConnectDto } from './dto/create-in-connect.dto';
import { UpdateInConnectDto } from './dto/update-in-connect.dto';

@Controller('in-connect')
export class InConnectController {
  constructor(private readonly inConnectService: InConnectService) {}

  @Post()
  create(@Body() createInConnectDto: CreateInConnectDto) {
    return this.inConnectService.create(createInConnectDto);
  }

  @Get()
  findAll() {
    return this.inConnectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inConnectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInConnectDto: UpdateInConnectDto) {
    return this.inConnectService.update(+id, updateInConnectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inConnectService.remove(+id);
  }
}
