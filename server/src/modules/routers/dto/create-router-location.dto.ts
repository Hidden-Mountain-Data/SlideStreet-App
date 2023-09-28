import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class RouterLocationDto {
  @IsNotEmpty()
  @IsNumber()
  routerId: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsDateString()
  dateTime: Date;

  constructor(partial: Partial<RouterLocationDto> = {}) {
    Object.assign(this, partial);
  }
}
