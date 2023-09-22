import { PrismaClient, Routers } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash('test1234', roundsOfHashing);

  const createdUser = await prisma.users.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      fullName: 'John Smith',
      email: 'test@gmail.com',
      password: hashedPassword,
      token: '',
      //image_url: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
    },
  });

  const token = jwt.sign(
    { userId: createdUser.userId },
    process.env.SECRET_KEY,
    {
      expiresIn: '1h',
    },
  );

  console.log(`User created. Token is ${token}`);

  const userId: number = createdUser.userId;

  await prisma.routers.create({
    data: {
      sim: '1234',
      imei: '5678',
      iccid: '91011',
      userId,
    } as unknown as Routers,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
