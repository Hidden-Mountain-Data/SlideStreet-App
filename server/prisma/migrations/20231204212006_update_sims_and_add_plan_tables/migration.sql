-- AlterTable
ALTER TABLE "sims" ADD COLUMN     "batch_number" TEXT,
ADD COLUMN     "bootstrap_iccid" TEXT,
ADD COLUMN     "bootstrap_imsi" TEXT,
ADD COLUMN     "cap" INTEGER DEFAULT 0,
ADD COLUMN     "capped" BOOLEAN DEFAULT false,
ADD COLUMN     "client_change_timestamp" TEXT,
ADD COLUMN     "client_id" INTEGER,
ADD COLUMN     "client_name" TEXT,
ADD COLUMN     "client_title" TEXT,
ADD COLUMN     "client_uuid" TEXT,
ADD COLUMN     "device_group_name" TEXT,
ADD COLUMN     "device_name" TEXT,
ADD COLUMN     "flow_type" TEXT,
ADD COLUMN     "imsi" VARCHAR(50),
ADD COLUMN     "initial_bootstrap_iccid" TEXT,
ADD COLUMN     "last_connected_network" JSONB,
ADD COLUMN     "meerkat_ip_entries" TEXT,
ADD COLUMN     "meerkat_private_ip_enabled" BOOLEAN DEFAULT false,
ADD COLUMN     "meerkat_public_ip_enabled" BOOLEAN DEFAULT false,
ADD COLUMN     "msisdn" VARCHAR(50),
ADD COLUMN     "plan_change_status" TEXT,
ADD COLUMN     "plan_name" TEXT,
ADD COLUMN     "plan_price" TEXT,
ADD COLUMN     "plan_uuid" TEXT,
ADD COLUMN     "plan_volume_unit" TEXT,
ADD COLUMN     "profile_change_status" TEXT,
ADD COLUMN     "profile_only" BOOLEAN DEFAULT false,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "ss_plan_id" INTEGER,
ADD COLUMN     "teal_plan_id" INTEGER,
ADD COLUMN     "usage" INTEGER DEFAULT 0,
ALTER COLUMN "ip_address" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "teal_plans" (
    "plan_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "smsPrice" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "volumeUnit" TEXT NOT NULL,
    "validityTime" INTEGER NOT NULL,
    "validityTimeUnit" TEXT NOT NULL,
    "maxReliability" INTEGER NOT NULL,
    "reliability" INTEGER NOT NULL,
    "networkTechType" TEXT NOT NULL,
    "networkTechTypeTitle" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "profilePools" TEXT[],
    "skus" TEXT[],
    "minUnitPriceBilling" BOOLEAN NOT NULL,
    "minUnitPrice" DOUBLE PRECISION,
    "minUnitVolume" INTEGER,
    "minUnitVolumeUnit" TEXT,
    "coverageCountries" TEXT[],
    "meerkatEnabled" BOOLEAN NOT NULL,
    "networkTechTypes" TEXT[],
    "coverageType" TEXT NOT NULL,
    "credentialsType" TEXT NOT NULL,
    "networkType" TEXT NOT NULL,

    CONSTRAINT "teal_plans_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "ss_plans" (
    "plan_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cap" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "teal_plan_id" INTEGER,

    CONSTRAINT "ss_plans_pkey" PRIMARY KEY ("plan_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teal_plans_name_key" ON "teal_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ss_plans_name_key" ON "ss_plans"("name");

-- AddForeignKey
ALTER TABLE "ss_plans" ADD CONSTRAINT "ss_plans_teal_plan_id_fkey" FOREIGN KEY ("teal_plan_id") REFERENCES "teal_plans"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sims" ADD CONSTRAINT "sims_ss_plan_id_fkey" FOREIGN KEY ("ss_plan_id") REFERENCES "ss_plans"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;
