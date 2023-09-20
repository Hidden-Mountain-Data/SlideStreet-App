import { Expose } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';

// * Commented out in order to push
// TODO: May use IsNotEmpty?
// import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

// TODO: May need Role?
// import { Role } from '../../../rbac/role.enum';

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

  @IsOptional()
  phone: string;

  @IsOptional()
  @Expose({ name: 'stripe_customer_id' })
  stripeCustomerId: string;
}
