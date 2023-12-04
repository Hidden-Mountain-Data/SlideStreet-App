-- CreateEnum
CREATE TYPE "Model" AS ENUM ('CR202', 'FWA02');

-- AlterTable
ALTER TABLE "routers" ADD COLUMN     "model" "Model" NOT NULL DEFAULT 'CR202';
