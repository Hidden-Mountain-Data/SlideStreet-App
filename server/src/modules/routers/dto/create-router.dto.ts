import { Optional } from '@nestjs/common';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateSimDto {
  @IsNotEmpty()
  @IsString()
  iccid: string;
}

export class CreateRouterDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsAlphanumeric()
  imei: string;

  sims: CreateSimDto;

  @Optional()
  name: string;

  @Optional()
  notes: string;

  constructor(partial: Partial<CreateRouterDto> = {}) {
    Object.assign(this, partial);
  }
}
