import { IsNotEmpty, IsEmail } from 'class-validator';
import { Role } from '../../rbac/role.enum';

export class UserDto {
  @IsNotEmpty()
  id: number;

  token: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  roles: Role[];

  picture?: string;

  created_at?: Date;

  updated_at?: Date;
}