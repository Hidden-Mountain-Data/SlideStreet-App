import { DataUsages, PrismaClient } from '@prisma/client';

const testDataUsages: DataUsages[] = [
  {
    dataUsageId: 1,
    routerId: 1,
    simId: 1,
    userId: 1,
    dataUsage: 1015n,
    dateId: 20231115,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    dataUsageId: 2,
    routerId: 2,
    simId: 2,
    userId: 1,
    dataUsage: 4023n,
    dateId: 20251115,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    dataUsageId: 3,
    routerId: 3,
    simId: 3,
    userId: 1,
    dataUsage: 769n,
    dateId: 20231215,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    dataUsageId: 4,
    routerId: 4,
    simId: 4,
    userId: 1,
    dataUsage: 2425n,
    dateId: 20231115,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    dataUsageId: 5,
    routerId: 5,
    simId: 5,
    userId: 1,
    dataUsage: 3072n,
    dateId: 20231115,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    dataUsageId: 6,
    routerId: 6,
    simId: 6,
    userId: 1,
    dataUsage: 2784n,
    dateId: 20231116,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export async function seedDataUsages(prisma: PrismaClient) {
  const dataUsages = await prisma.dataUsages.createMany({
    data: testDataUsages,
    skipDuplicates: true,
  });
}