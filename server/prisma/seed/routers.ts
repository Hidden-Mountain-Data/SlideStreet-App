import { Routers,Model, PrismaClient } from '@prisma/client';

const testRouters: Routers[] = [
{
  routerId: 1,
  userId: 1,
  name: 'CoolRouter1',
  notes: 'Very Cool Router',
  imei: '869257030328633',
  iccid: 'sim-1',
  serialNumber: 'CR2022313SCIWHO',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  model: Model.CR202,
  simId: 1,
},
{
  routerId: 2,
  userId: 1,
  name: 'HMD-Router1',
  notes: 'HMD-Router',
  imei: '869257030328633',
  iccid: '89148000008305885109',
  serialNumber: 'CR2022313SCIWHO',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  model: Model.CR202,
  simId: 2,
},
{
  routerId: 3,
  userId: 1,
  name: 'SlideStreet-Router-1',
  notes: 'This router belongs to Slide Street',
  imei: '869257030328633',
  iccid: '89148000008305885109',
  serialNumber: 'CR2022313SCIWHO',
  createdAt: new Date(),
  updatedAt: new Date(),
  model: Model.FWA02,
  deletedAt: null,
  simId: 3,
},
{
  routerId: 4,
  userId: 1,
  name: 'SlideStreet-Router-2',
  notes: 'This router belongs to Slide Street',
  imei: '869257030328633',
  iccid: '89148000008305885109',
  serialNumber: 'CR2022313SCIWHO',
  createdAt: new Date(),
  updatedAt: new Date(),
  model: Model.FWA02,
  deletedAt: null,
  simId: 4,
},
{
  routerId: 5,
  userId: 1,
  name: 'SlideStreet-Router-3',
  notes: 'This router belongs to Slide Street',
  imei: '869257030328633',
  iccid: '89148000008305885109',
  serialNumber: 'CR2022313SCIWHO',
  createdAt: new Date(),
  updatedAt: new Date(),
  model: Model.CR202,
  deletedAt: null,
  simId: 5,
},
{
  routerId: 6,
  userId: 1,
  name: 'SlideStreet-Router-4',
  notes: 'This router belongs to Slide Street',
  imei: '869257030328633',
  iccid: '89148000008305885109',
  serialNumber: 'CR2022313SCIWHO',
  createdAt: new Date(),
  updatedAt: new Date(),
  model: Model.CR202,
  deletedAt: null,
  simId: 6,
}
]

export async function seedRouters(prisma: PrismaClient){
  const routers = await prisma.routers.createMany({
    data: testRouters,
    skipDuplicates: true,
  });
}