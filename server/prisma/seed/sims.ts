import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSims(
  userId: number,
  routerId?: number,
): Promise<void> {
  try {
    const existingSimWithRouter =
      routerId !== undefined
        ? await prisma.sims.findFirst({
            where: { routerId },
          })
        : null;

    const existingStandaloneSim = await prisma.sims.findFirst({
      where: { routerId: null },
    });

    if (existingSimWithRouter && existingStandaloneSim) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        'Both types of Sims already exist, skipping seed function.',
      );
      return;
    }

    let createdRouterSimId: number | null = null;

    if (!existingSimWithRouter && routerId !== undefined) {
      const simWithRouter = await prisma.sims.create({
        data: {
          userId,
          routerId,
          iccid: 'some-iccid-1',
          active: true,
          status: 'ACTIVE',
          embedded: true,
        },
      });

      createdRouterSimId = simWithRouter.simId;

      console.log(
        '\x1b[36m%s\x1b[0m',
        'Sim with router created! Here it is: ',
        simWithRouter,
      );
    }

    if (!existingStandaloneSim) {
      const standaloneSim = await prisma.sims.create({
        data: {
          userId,
          iccid: 'some-iccid-2',
          active: true,
          status: 'ACTIVE',
          embedded: true,
        },
      });
      console.log(
        '\x1b[36m%s\x1b[0m',
        'Standalone Sim created! Here it is: ',
        standaloneSim,
      );
    }

    if (createdRouterSimId !== null && routerId !== undefined) {
      await prisma.routers.update({
        where: { routerId },
        data: { simId: createdRouterSimId },
      });

      console.log(
        '\x1b[36m%s\x1b[0m',
        `Router with id ${routerId} updated with simId ${createdRouterSimId}`,
      );
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error seeding Sims: ', error);
  } finally {
    await prisma.$disconnect();
  }
}
