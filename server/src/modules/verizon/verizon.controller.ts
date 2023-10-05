import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerizonService } from './verizon.service';
import { CreateVerizonDto } from './dto/create-verizon.dto';
import { UpdateVerizonDto } from './dto/update-verizon.dto';

@Controller('verizon')
export class VerizonController {
  constructor(private readonly verizonService: VerizonService) {}

  @Post()
  create(@Body() createVerizonDto: CreateVerizonDto) {
    return this.verizonService.create(createVerizonDto);
  }

  @Get()
  findAll() {
    return this.verizonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.verizonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVerizonDto: UpdateVerizonDto) {
    return this.verizonService.update(+id, updateVerizonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verizonService.remove(+id);
  }
}
