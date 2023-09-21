import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash('test1234', roundsOfHashing);

  await prisma.user.create({
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
