/*
  Warnings:

  - Added the required column `iccid` to the `routers` table without a default value. This is not possible if the table is not empty.
  - Made the column `serial_number` on table `routers` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('TEAL');

-- AlterTable
ALTER TABLE "routers" ADD COLUMN     "iccid" VARCHAR(50) NOT NULL,
ALTER COLUMN "serial_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "sims" ADD COLUMN     "eid" VARCHAR(50),
ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'TEAL';
