import { IsString } from 'class-validator';

export class CreateTealRequestDto {
  @IsString()
  type: string;

  constructor(init?: Partial<CreateTealRequestDto>) {
    Object.assign(this, init);
  }
}
