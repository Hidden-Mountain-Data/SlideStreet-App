import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTealSimDto {
  @IsString()
  readonly type: string;

  @IsNumber()
  @IsOptional()
  readonly userId?: number;

  @IsString()
  @IsOptional()
  readonly iccid?: string;

  @IsBoolean()
  @IsOptional()
  readonly embedded?: boolean;

  constructor(init?: Partial<CreateTealSimDto>) {
    Object.assign(this, init);
  }
}
