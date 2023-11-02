import { PartialType } from '@nestjs/mapped-types';
import { CreateTealDto } from './create-teal.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTealDto extends PartialType(CreateTealDto) {
  @IsOptional()
  @IsString()
  deviceName?: string | null;
}
