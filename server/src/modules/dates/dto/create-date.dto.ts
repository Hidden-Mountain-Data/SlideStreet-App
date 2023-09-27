import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class CreateDateDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsInt()
  @IsNotEmpty()
  day: number;

  @IsInt()
  @IsNotEmpty()
  dayOfWeek: number;

  @IsInt()
  @IsNotEmpty()
  dayOfYear: number;

  @IsInt()
  @IsNotEmpty()
  weekOfYear: number;

  @IsInt()
  @IsNotEmpty()
  month: number;

  @IsInt()
  @IsNotEmpty()
  quarter: number;

  @IsInt()
  @IsNotEmpty()
  year: number;
}
