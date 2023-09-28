import { IsNotEmpty, IsNumber } from 'class-validator';

export class DataUsageDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  dateId: number;

  @IsNotEmpty()
  @IsNumber()
  routerId: number;

  @IsNotEmpty()
  @IsNumber()
  simId: number;

  @IsNotEmpty()
  @IsNumber()
  dataUsage: bigint;

  constructor(partial: Partial<DataUsageDto> = {}) {
    Object.assign(this, partial);
  }
}
