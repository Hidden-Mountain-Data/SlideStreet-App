import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '../../../rbac/role.enum';

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

  @IsOptional()
  @Expose({ name: 'full_name' })
  fullName: string;

  role: Role;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  @Expose({ name: 'stripe_customer_id' })
  stripeCustomerId: string;

  @IsOptional()
  @Expose({ name: 'notifications' })
  notifications: boolean;

  @IsOptional()
  @Expose({ name: 'dark_mode' })
  darkMode: boolean;

  constructor(partial: Partial<CreateUserDto> = {}) {
    Object.assign(this, partial);
  }
}
