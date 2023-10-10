/*
  Warnings:

  - You are about to drop the column `active` on the `routers` table. All the data in the column will be lost.
  - You are about to drop the column `iccid` on the `routers` table. All the data in the column will be lost.
  - You are about to drop the column `router_ip` on the `routers` table. All the data in the column will be lost.
  - You are about to drop the column `sim` on the `routers` table. All the data in the column will be lost.
  - Added the required column `sim_id` to the `data_usages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sim_id` to the `routers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SimStatus" AS ENUM ('ACTIVE', 'DEACTIVATED', 'SUSPENDED', 'PREACTIVE', 'PENDING', 'UNKNOWN');

-- AlterTable
ALTER TABLE "data_usages" ADD COLUMN     "sim_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "routers" DROP COLUMN "active",
DROP COLUMN "iccid",
DROP COLUMN "router_ip",
DROP COLUMN "sim",
ADD COLUMN     "sim_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Sims" (
    "sim_id" SERIAL NOT NULL,
    "router_id" INTEGER NOT NULL,
    "iccid" VARCHAR(50) NOT NULL,
    "active" BOOLEAN,
    "ip_address" VARCHAR(50),
    "status" "SimStatus" NOT NULL DEFAULT 'ACTIVE',
    "embedded" BOOLEAN DEFAULT true,
    "notes" VARCHAR(500),
    "imei" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Sims_pkey" PRIMARY KEY ("sim_id")
);

-- CreateIndex
CREATE INDEX "data_usages_sim_id_idx" ON "data_usages"("sim_id");

-- AddForeignKey
ALTER TABLE "data_usages" ADD CONSTRAINT "data_usages_sim_id_fkey" FOREIGN KEY ("sim_id") REFERENCES "Sims"("sim_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sims" ADD CONSTRAINT "Sims_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "routers"("router_id") ON DELETE RESTRICT ON UPDATE CASCADE;
