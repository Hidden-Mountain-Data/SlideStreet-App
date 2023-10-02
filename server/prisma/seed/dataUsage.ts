import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDataUsages(userId: number): Promise<void> {
  const existingDataUsage = await prisma.dataUsages.findFirst();
  if (existingDataUsage) {
    console.log('DataUsages already exist, skipping seed function.');
    return;
  }

  const routers = await prisma.routers.findMany({
    where: { userId },
    include: { sims: true },
  });

  if (!routers || routers.length === 0) {
    console.log("No routers found for the user, can't seed DataUsages.");
    return;
  }

  const someDate = await prisma.dates.findFirst();

  if (!someDate) {
    console.log("No date found, can't seed DataUsages.");
    return;
  }

  const dataUsagesToCreate = [];

  for (const router of routers) {
    const sim = router.sims[0];
    if (!sim) {
      console.log(`No sim found for router ${router.routerId}, skipping.`);
      continue;
    }

    const dataUsage = BigInt(Math.floor(Math.random() * 5000) + 1000);
    const dateId = someDate.dateId;

    const dataUsageRecord = {
      userId,
      dateId,
      routerId: router.routerId,
      simId: sim.simId,
      dataUsage,
    };

    dataUsagesToCreate.push(dataUsageRecord);
  }

  await prisma.dataUsages.createMany({
    data: dataUsagesToCreate,
  });

  console.log('DataUsages created successfully!', dataUsagesToCreate);
}
