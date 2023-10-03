import { Optional } from '@nestjs/common';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class CreateRouterDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  imei: string;

  // @ValidateNested({ each: true })
  // @Type(() => CreateSimDto)
  // sims: CreateSimDto;

  @Optional()
  name: string;

  @Optional()
  notes: string;

  constructor(partial: Partial<CreateRouterDto> = {}) {
    Object.assign(this, partial);
  }
}
