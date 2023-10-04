import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddDataUsageDto {
  @IsNotEmpty()
  @IsNumber()
  dateId: number;

  @IsNotEmpty()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  dataUsage: bigint;

  constructor(partial: Partial<AddDataUsageDto> = {}) {
    Object.assign(this, partial);
  }
}
