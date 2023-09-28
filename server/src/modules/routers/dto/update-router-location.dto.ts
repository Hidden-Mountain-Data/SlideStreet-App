import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateRouterLocationDto {
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsDateString()
  dateTime?: Date;
}
