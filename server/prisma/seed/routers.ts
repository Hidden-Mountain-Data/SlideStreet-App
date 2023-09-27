import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRouters(userId: number): Promise<void> {
  const existingRouter = await prisma.routers.findFirst();
  const existingSim = await prisma.sims.findFirst();

  if (existingRouter || existingSim) {
    console.log('Routers or Sims already exist, skipping seed function.');
    return;
  }

  const routers = [];
  const routerData = {
    userId,
    imei: `IMEI_${Math.floor(Math.random() * 1000)}`,
    simId: null,
  };
  const createdRouter = await prisma.routers.create({
    data: routerData,
  });
  routers.push(createdRouter);

  for (const router of routers) {
    const simData = {
      iccid: `ICCID_${Math.floor(Math.random() * 1000)}`,
      userId: router.userId,
      routerId: router.routerId,
    };

    await prisma.sims.create({
      data: simData,
    });
  }

  const simData = {
    routerId: null,
    iccid: `ICCID_${Math.floor(Math.random() * 1000)}`,
    imei: '5678',
  };

  await prisma.sims.create({
    data: simData,
  });
}
