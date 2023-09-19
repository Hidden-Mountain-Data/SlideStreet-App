import { Expose } from "class-transformer";

export class User {
    @Expose({ name: 'user_id' })
    userId: number;
  
    @Expose({ name: 'first_name' })
    firstName: string;
  
    @Expose({ name: 'last_name' })
    lastName: string;
  
    @Expose({ name: 'full_name' })
    fullName: string;
  }