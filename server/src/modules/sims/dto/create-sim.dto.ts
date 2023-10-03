import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSimDto {
  @IsNotEmpty()
  @IsString()
  iccid: string;

  constructor(partial: Partial<CreateSimDto> = {}) {
    Object.assign(this, partial);
  }
}
