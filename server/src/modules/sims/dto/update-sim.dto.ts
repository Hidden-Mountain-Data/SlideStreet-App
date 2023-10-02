import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateSimDto } from './create-sim.dto';
import { SimStatus } from '@prisma/client';

export class UpdateSimDto extends PartialType(CreateSimDto) {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  routerId: number;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  ipAddress: string;

  @IsOptional()
  @IsEnum(SimStatus)
  status: SimStatus;

  @IsOptional()
  @IsBoolean()
  embedded: boolean;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  imei: string;
}
