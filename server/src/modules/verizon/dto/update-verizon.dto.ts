import { PartialType } from '@nestjs/mapped-types';
import { CreateVerizonDto } from './create-verizon.dto';

export class UpdateVerizonDto extends PartialType(CreateVerizonDto) {}
