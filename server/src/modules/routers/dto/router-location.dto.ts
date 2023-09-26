import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class RouterLocationDto {
  @IsNotEmpty()
  @IsNumber()
  locationId: number;

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

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @IsOptional()
  @IsDateString()
  updatedAt: Date;

  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  constructor(partial: Partial<RouterLocationDto> = {}) {
    Object.assign(this, partial);
  }
}
