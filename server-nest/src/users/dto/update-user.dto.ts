import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { Role } from '../../rbac/role.enum';

export class UpdateUserDto {
  
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Expose({ name: 'first_name' })
  firstName: string;

  @IsOptional()
  @Expose({ name: 'last_name' })
  lastName: string;

  @IsOptional()
  password: string;

  @Expose({ name: 'full_name' })
  @IsOptional()
  fullName: string;

  @IsOptional()
  image: string;

  @Expose({ name: 'is_active' })
  @IsOptional()
  isActive: boolean;
}