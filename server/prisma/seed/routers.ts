import { PrismaClient } from '@prisma/client';
import { seedSims } from './sims';

export async function seedRouters(userId: number): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const createdRouter = await prisma.routers.create({
      data: {
        userId,
        name: 'CoolRouter',
        imei: 'some-imei',
      },
    });

    if (createdRouter) {
      console.log(
        '\x1b[36m%s\x1b[0m',
        'Router created successfully:',
        createdRouter,
      );

      const routerId = createdRouter.routerId;
      await seedSims(userId, routerId);
    }
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Error seeding Routers:', error);
  } finally {
    await prisma.$disconnect();
  }
}
