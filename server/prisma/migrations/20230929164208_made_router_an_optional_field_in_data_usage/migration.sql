-- DropForeignKey
ALTER TABLE "data_usages" DROP CONSTRAINT "data_usages_router_id_fkey";

-- DropForeignKey
ALTER TABLE "sims" DROP CONSTRAINT "sims_router_id_fkey";

-- DropIndex
DROP INDEX "data_usages_router_id_idx";

-- AlterTable
ALTER TABLE "data_usages" ALTER COLUMN "router_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "routers" ALTER COLUMN "sim_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sims" ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "router_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "sims_user_id_idx" ON "sims"("user_id");

-- AddForeignKey
ALTER TABLE "data_usages" ADD CONSTRAINT "data_usages_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "routers"("router_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sims" ADD CONSTRAINT "sims_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "routers"("router_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sims" ADD CONSTRAINT "sims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
