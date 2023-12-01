import { UserAbility } from "@/plugins/casl/AppAbility";


interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  token: string;
  refreshToken: string;
  updatedAt: Date;
  imageUrl: string;
  abilities: UserAbility[];
}
