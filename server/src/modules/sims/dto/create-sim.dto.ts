import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSimDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  iccid: string;

  constructor(partial: Partial<CreateSimDto> = {}) {
    Object.assign(this, partial);
  }
}
