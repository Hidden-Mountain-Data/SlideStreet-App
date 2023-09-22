import { Expose } from 'class-transformer';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateRouterDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'user_id' })
  userId: number;

  @IsNotEmpty()
  @IsString()
  sim: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  imei: string;

  @IsNotEmpty()
  @IsString()
  iccid: string;

  constructor(partial: Partial<CreateRouterDto> = {}) {
    Object.assign(this, partial);
  }
}
