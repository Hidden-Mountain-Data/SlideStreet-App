/*
  Warnings:

  - You are about to drop the column `created_at` on the `dates` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `dates` table. All the data in the column will be lost.
  - You are about to drop the `Sims` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sims" DROP CONSTRAINT "Sims_router_id_fkey";

-- DropForeignKey
ALTER TABLE "data_usages" DROP CONSTRAINT "data_usages_sim_id_fkey";

-- AlterTable
CREATE SEQUENCE dates_date_id_seq;
ALTER TABLE "dates" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ALTER COLUMN "date_id" SET DEFAULT nextval('dates_date_id_seq');
ALTER SEQUENCE dates_date_id_seq OWNED BY "dates"."date_id";

-- DropTable
DROP TABLE "Sims";

-- CreateTable
CREATE TABLE "sims" (
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

    CONSTRAINT "sims_pkey" PRIMARY KEY ("sim_id")
);

-- CreateIndex
CREATE INDEX "sims_sim_id_idx" ON "sims"("sim_id");

-- CreateIndex
CREATE INDEX "sims_router_id_idx" ON "sims"("router_id");

-- AddForeignKey
ALTER TABLE "data_usages" ADD CONSTRAINT "data_usages_sim_id_fkey" FOREIGN KEY ("sim_id") REFERENCES "sims"("sim_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sims" ADD CONSTRAINT "sims_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "routers"("router_id") ON DELETE RESTRICT ON UPDATE CASCADE;
