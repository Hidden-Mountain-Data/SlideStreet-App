import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddDataUsageDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  dateId: number;

  @IsNotEmpty()
  @IsNumber()
  simId: number;

  @IsNotEmpty()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  dataUsage: bigint;

  constructor(partial: Partial<AddDataUsageDto> = {}) {
    Object.assign(this, partial);
  }
}
