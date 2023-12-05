/*
  Warnings:

  - You are about to drop the column `coverageCountries` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `coverageType` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `maxReliability` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `meerkatEnabled` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `minUnitPrice` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `minUnitPriceBilling` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `minUnitVolume` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `minUnitVolumeUnit` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `networkTechType` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `networkTechTypeTitle` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `networkTechTypes` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `networkType` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `profilePools` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `smsPrice` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `validityTime` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `validityTimeUnit` on the `teal_plans` table. All the data in the column will be lost.
  - You are about to drop the column `volumeUnit` on the `teal_plans` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teal_plan_id]` on the table `teal_plans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `meerkat_enabled` to the `teal_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_unit_price_billing` to the `teal_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teal_plans" DROP COLUMN "coverageCountries",
DROP COLUMN "coverageType",
DROP COLUMN "maxReliability",
DROP COLUMN "meerkatEnabled",
DROP COLUMN "minUnitPrice",
DROP COLUMN "minUnitPriceBilling",
DROP COLUMN "minUnitVolume",
DROP COLUMN "minUnitVolumeUnit",
DROP COLUMN "networkTechType",
DROP COLUMN "networkTechTypeTitle",
DROP COLUMN "networkTechTypes",
DROP COLUMN "networkType",
DROP COLUMN "profilePools",
DROP COLUMN "smsPrice",
DROP COLUMN "validityTime",
DROP COLUMN "validityTimeUnit",
DROP COLUMN "volumeUnit",
ADD COLUMN     "coverage_countries" TEXT[],
ADD COLUMN     "coverage_type" TEXT,
ADD COLUMN     "max_reliability" INTEGER,
ADD COLUMN     "meerkat_enabled" BOOLEAN NOT NULL,
ADD COLUMN     "min_unit_price" DOUBLE PRECISION,
ADD COLUMN     "min_unit_price_billing" BOOLEAN NOT NULL,
ADD COLUMN     "min_unit_volume" INTEGER,
ADD COLUMN     "min_unit_volume_unit" TEXT,
ADD COLUMN     "network_tech_type" TEXT,
ADD COLUMN     "network_tech_type_title" TEXT,
ADD COLUMN     "network_tech_types" TEXT[],
ADD COLUMN     "network_type" TEXT,
ADD COLUMN     "profile_pools" TEXT[],
ADD COLUMN     "sms_price" DOUBLE PRECISION,
ADD COLUMN     "teal_plan_id" INTEGER,
ADD COLUMN     "validity_time" INTEGER,
ADD COLUMN     "validity_time_unit" TEXT,
ADD COLUMN     "volume_unit" TEXT,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "volume" DROP NOT NULL,
ALTER COLUMN "reliability" DROP NOT NULL,
ALTER COLUMN "uuid" DROP NOT NULL,
ALTER COLUMN "credentialsType" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teal_plans_teal_plan_id_key" ON "teal_plans"("teal_plan_id");
