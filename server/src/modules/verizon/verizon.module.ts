import { Module } from '@nestjs/common';
import { VerizonService } from './verizon.service';
import { VerizonController } from './verizon.controller';

@Module({
  controllers: [VerizonController],
  providers: [VerizonService]
})
export class VerizonModule {}
