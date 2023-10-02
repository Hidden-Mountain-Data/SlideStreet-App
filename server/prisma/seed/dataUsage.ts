import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDataUsages(userId: number): Promise<void> {
  const existingDataUsage = await prisma.dataUsages.findFirst();
  if (existingDataUsage) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'DataUsages already exist, skipping seed function.',
    );
    return;
  }

  const routers = await prisma.routers.findMany({
    where: { userId },
    include: { sims: true },
  });

  if (!routers || routers.length === 0) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      "No routers found for the user, can't seed DataUsages.",
    );
    return;
  }

  const someDate = await prisma.dates.findFirst();

  if (!someDate) {
    console.error('\x1b[31m%s\x1b[0m', "No date found, can't seed DataUsages.");
    return;
  }

  const dataUsagesToCreate = [];

  for (const router of routers) {
    const sim = router.sims[0];
    if (!sim) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        `No sim found for router ${router.routerId}, skipping.`,
      );
      continue;
    }

    const dataUsage = BigInt(Math.floor(Math.random() * 5000) + 1000);
    const dateId = someDate.dateId;

    const dataUsageRecord = {
      userId,
      dateId,
      simId: sim.simId,
      dataUsage,
    };

    dataUsagesToCreate.push(dataUsageRecord);
  }

  await prisma.dataUsages.createMany({
    data: dataUsagesToCreate,
  });

  console.log(
    '\x1b[36m%s\x1b[0m',
    'DataUsages created successfully!',
    dataUsagesToCreate,
  );
}
