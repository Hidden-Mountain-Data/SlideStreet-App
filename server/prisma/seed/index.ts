import { PrismaClient } from "@prisma/client"
import { seedDataUsages } from './dataUsage';
import { seedDates } from './dates';
import { seedRouters } from './routers';
import { seedUsers } from './users';
import seedSims from "./sims";

const prisma = new PrismaClient();

async function main() {
  await seedUsers()
  await seedDates()
  await seedRouters(prisma)
  await seedSims(prisma)
  await seedDataUsages(prisma)

  

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })

  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })
