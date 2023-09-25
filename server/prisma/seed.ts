import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main(): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash('test1234', roundsOfHashing);

    const createdUser = await prisma.users.create({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@email.com',
        password: hashedPassword,
      },
    });

    const userId: number = createdUser.userId;

    const token = jwt.sign({ userId }, process.env.SESSION_SECRET!, {
      expiresIn: '1h',
    });

    const createdSim = await prisma.sims.create({
      data: {
        iccid: '91011',
        imei: '5678',
        routerId: 0,
      },
    });

    const simId: number = createdSim.simId;

    const createdRouter = await prisma.routers.create({
      data: {
        imei: '5678',
        userId: userId,
        simId: simId,
      },
    });

    const routerId: number = createdRouter.routerId;

    await prisma.sims.update({
      where: { simId: simId },
      data: { routerId: routerId },
    });

    console.log('User, Router, and Sim created successfully!', {
      createdUser,
      createdRouter,
      createdSim,
      token,
    });
  } catch (error) {
    console.error('Something exploded:', error);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Seeding failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
