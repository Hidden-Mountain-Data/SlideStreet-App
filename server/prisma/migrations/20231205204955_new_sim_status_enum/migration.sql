/*
  Warnings:

  - The `status` column on the `sims` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TealSimStatus" AS ENUM ('ONLINE', 'STOPPED', 'WAITING', 'UNACTIVATED', 'ACTIVATING', 'DEACTIVATED', 'DEACTIVATING');

-- DropForeignKey
ALTER TABLE "data_usages" DROP CONSTRAINT "data_usages_router_id_fkey";

-- DropForeignKey
ALTER TABLE "data_usages" DROP CONSTRAINT "data_usages_user_id_fkey";

-- AlterTable
ALTER TABLE "sims" DROP COLUMN "status",
ADD COLUMN     "status" "TealSimStatus" NOT NULL DEFAULT 'ONLINE';
