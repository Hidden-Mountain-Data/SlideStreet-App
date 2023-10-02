import { PrismaClient } from '@prisma/client';
import { seedDates } from './dates';
import { seedRouters } from './routers';
import { seedUsers } from './users';
import { seedDataUsages } from './dataUsage';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  let everythingSeeded = true;

  try {
    const userSeedResult = await seedUsers();

    if (userSeedResult) {
      const { userId } = userSeedResult;
      await seedDates();
      await seedRouters(userId);
      await seedDataUsages(userId);
    } else {
      console.error('User seeding returned null, skipping further seeding.');
      everythingSeeded = false;
    }

    if (everythingSeeded) {
      console.log('Everything seeded successfully!');
    }
  } catch (error) {
    console.error('Something went wrong:', error);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Seeding failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
