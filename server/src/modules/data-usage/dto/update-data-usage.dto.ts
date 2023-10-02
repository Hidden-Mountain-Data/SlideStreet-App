import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDataUsageDto {
  @IsNotEmpty()
  @IsNumber()
  dataUsage: bigint;

  constructor(partial: Partial<UpdateDataUsageDto> = {}) {
    Object.assign(this, partial);
  }
}
