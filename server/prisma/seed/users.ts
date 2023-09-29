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
    console.log('User already exists, skipping seed function.');
    return null;
  }

  const password = 'test1234';
  const roundsOfHashing = 10;

  const hashedPassword = await bcrypt
    .hash(password, roundsOfHashing)
    .catch((err) => {
      console.error('Debug - Error hashing:', err);
      return null;
    });

  // console.log('Debug - Hashed Password:', hashedPassword);

  const createdUser = await prisma.users
    .upsert({
      where: { email: 'john@email.com' },
      update: {},
      create: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@email.com',
        password: hashedPassword!,
      },
    })
    .catch((err) => {
      console.error('Debug - Error creating/updating user:', err);
      return null;
    });

  if (!createdUser) return null;

  console.log('Debug - User created successfully!', createdUser);

  const userId: number = createdUser.userId;
  const sessionSecret = process.env.SESSION_SECRET;
  const token = jwt.sign({ userId }, sessionSecret!, { expiresIn: '1h' });

  return { userId, token };
}
