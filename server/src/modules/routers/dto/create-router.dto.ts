import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsAlphanumeric, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateSimDto } from '../../sims/dto/create-sim.dto';

export class CreateRouterDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  imei: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSimDto)
  sims: CreateSimDto;

  @Optional()
  name: string;

  @Optional()
  notes: string;

  constructor(partial: Partial<CreateRouterDto> = {}) {
    Object.assign(this, partial);
  }
}
