import { PrismaClient } from '@prisma/client';
import { seedDataUsages } from './dataUsage';
import { seedDates } from './dates';
import { seedRouters } from './routers';
import { seedSims } from './sims';
import { seedUsers } from './users';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  let everythingSeeded = true;

  try {
    const userSeedResult = await seedUsers();

    if (userSeedResult) {
      const { userId } = userSeedResult;
      await seedDates();

      // * This will also seed a Sim linked to a router
      await seedRouters(userId);

      await seedDataUsages(userId);

      // * Seed a Sim that's not linked to any router
      await seedSims(userId);
    } else {
      console.error(
        '\x1b[31m%s\x1b[0m',
        'User seeding returned null, skipping further seeding.',
      );
      everythingSeeded = false;
    }

    if (everythingSeeded) {
      console.log('\x1b[36m%s\x1b[0m', 'Everything seeded successfully!');
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Something went wrong:', error);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('\x1b[31m%s\x1b[0m', 'Seeding failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
