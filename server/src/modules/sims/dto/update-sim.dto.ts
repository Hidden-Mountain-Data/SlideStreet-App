import { PartialType } from '@nestjs/mapped-types';
import { SimStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateSimDto } from './create-sim.dto';

export class UpdateSimDto extends PartialType(CreateSimDto) {
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
