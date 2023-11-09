import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function seedUsers(): Promise<{
  userId: number;
  token: string;
} | null> {
  const existingUser = await prisma.users.findFirst();
  if (existingUser) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'User already exists, skipping seed function.',
    );
    return null;
  }

  const password = process.env.USER_PASSWORD;
  const roundsOfHashing = 10;

  const hashedPassword = await bcrypt
    .hash(password, roundsOfHashing)
    .catch((err) => {
      console.error('\x1b[31m%s\x1b[0m', 'Error hashing in user seed: ', err);
      return null;
    });

  const createdUser = await prisma.users
    .upsert({
      where: { email: 'joe@email.com' },
      update: {},
      create: {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@email.com',
        password: hashedPassword!,
      },
    })
    .catch((err) => {
      console.error(
        '\x1b[31m%s\x1b[0m',
        'Error creating/updating user seed: ',
        err,
      );
      return null;
    });

  if (!createdUser) return null;

  console.log(
    '\x1b[36m%s\x1b[0m',
    'User created successfully! Here is Joe: ',
    createdUser,
  );

  const userId: number = createdUser.userId;
  const sessionSecret = process.env.SESSION_SECRET;
  const token = jwt.sign({ userId }, sessionSecret!, { expiresIn: '1h' });

  return { userId, token };
}
