import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateRouterDto } from './create-router.dto';

export class UpdateRouterDto extends PartialType(CreateRouterDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  notes: string;
}
