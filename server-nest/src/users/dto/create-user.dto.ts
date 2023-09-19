import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { Role } from '../../rbac/role.enum';

export class CreateUserDto {
  
  @IsNotEmpty()
  @IsEmail()
  
  email: string;

  @IsNotEmpty()
  @Expose({ name: 'first_name' })
  firstName: string;

  @IsNotEmpty()
  @Expose({ name: 'last_name' })
  lastName: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Expose({ name: 'full_name' })
  fullName: string;
}