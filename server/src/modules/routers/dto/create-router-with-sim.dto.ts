import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateRouterDto } from './create-router.dto';

export class CreateRouterAndSimDto extends CreateRouterDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  iccid: string;
}
