import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class CreateRouterDto {
  // @IsNotEmpty()
  // @Expose({ name: 'user_id' })
  // userId: number;

  @IsNotEmpty()
  @IsString()
  sim: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  imei: string;

  @IsNotEmpty()
  @IsString()
  iccid: string;

  constructor(partial: Partial<CreateRouterDto> = {}) {
    Object.assign(this, partial);
  }
}
