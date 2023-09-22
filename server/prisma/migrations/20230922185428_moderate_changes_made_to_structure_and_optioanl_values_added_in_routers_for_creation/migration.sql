/*
  Warnings:

  - You are about to drop the column `business_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `imageUuid` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `full_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_user_mappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `businesses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `device_locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dim_dates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dim_devices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fact_data_usages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocks` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_business_id_fkey";

-- DropForeignKey
ALTER TABLE "business_user_mappings" DROP CONSTRAINT "business_user_mappings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "business_user_mappings" DROP CONSTRAINT "business_user_mappings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "device_locations" DROP CONSTRAINT "device_locations_device_id_fkey";

-- DropForeignKey
ALTER TABLE "dim_devices" DROP CONSTRAINT "dim_devices_business_id_fkey";

-- DropForeignKey
ALTER TABLE "dim_devices" DROP CONSTRAINT "dim_devices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fact_data_usages" DROP CONSTRAINT "fact_data_usages_business_id_fkey";

-- DropForeignKey
ALTER TABLE "fact_data_usages" DROP CONSTRAINT "fact_data_usages_date_id_fkey";

-- DropForeignKey
ALTER TABLE "fact_data_usages" DROP CONSTRAINT "fact_data_usages_device_id_fkey";

-- DropForeignKey
ALTER TABLE "fact_data_usages" DROP CONSTRAINT "fact_data_usages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_product_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_business_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_order_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_product_id_fkey";

-- DropIndex
DROP INDEX "addresses_business_id_idx";

-- DropIndex
DROP INDEX "addresses_business_id_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "business_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "imageUrl",
DROP COLUMN "imageUuid",
ADD COLUMN     "image_url" VARCHAR(250),
ADD COLUMN     "image_uuid" VARCHAR(36),
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "full_name" DROP NOT NULL,
ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(100),
DROP COLUMN "role",
ADD COLUMN     "role" "Roles" DEFAULT 'USER';

-- DropTable
DROP TABLE "_CategoryToProduct";

-- DropTable
DROP TABLE "business_user_mappings";

-- DropTable
DROP TABLE "businesses";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "device_locations";

-- DropTable
DROP TABLE "dim_dates";

-- DropTable
DROP TABLE "dim_devices";

-- DropTable
DROP TABLE "fact_data_usages";

-- DropTable
DROP TABLE "files";

-- DropTable
DROP TABLE "items";

-- DropTable
DROP TABLE "orders";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "stocks";

-- DropEnum
DROP TYPE "Color";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "StockStatus";

-- CreateTable
CREATE TABLE "data_usages" (
    "data_usage_id" SERIAL NOT NULL,
    "date_id" INTEGER NOT NULL,
    "router_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "data_usage" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "data_usages_pkey" PRIMARY KEY ("data_usage_id")
);

-- CreateTable
CREATE TABLE "dates" (
    "date_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "day_of_year" INTEGER NOT NULL,
    "week_of_year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dates_pkey" PRIMARY KEY ("date_id")
);

-- CreateTable
CREATE TABLE "routers" (
    "router_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "router_ip" VARCHAR(50),
    "name" VARCHAR(200),
    "imei" VARCHAR(50) NOT NULL,
    "sim" VARCHAR(50) NOT NULL,
    "notes" VARCHAR(500),
    "iccid" VARCHAR(200) NOT NULL,
    "active" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "routers_pkey" PRIMARY KEY ("router_id")
);

-- CreateTable
CREATE TABLE "router_locations" (
    "location_id" SERIAL NOT NULL,
    "router_id" INTEGER NOT NULL,
    "router_logitude" DOUBLE PRECISION NOT NULL,
    "router_latitude" DOUBLE PRECISION NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "router_locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateIndex
CREATE INDEX "data_usages_date_id_idx" ON "data_usages"("date_id");

-- CreateIndex
CREATE INDEX "data_usages_router_id_idx" ON "data_usages"("router_id");

-- CreateIndex
CREATE INDEX "data_usages_user_id_idx" ON "data_usages"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dates_date_key" ON "dates"("date");

-- CreateIndex
CREATE INDEX "dates_date_idx" ON "dates"("date");

-- CreateIndex
CREATE UNIQUE INDEX "routers_user_id_key" ON "routers"("user_id");

-- CreateIndex
CREATE INDEX "routers_user_id_idx" ON "routers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "router_locations_router_id_key" ON "router_locations"("router_id");

-- CreateIndex
CREATE INDEX "router_locations_router_id_idx" ON "router_locations"("router_id");

-- AddForeignKey
ALTER TABLE "data_usages" ADD CONSTRAINT "data_usages_date_id_fkey" FOREIGN KEY ("date_id") REFERENCES "dates"("date_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_usages" ADD CONSTRAINT "data_usages_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "routers"("router_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_usages" ADD CONSTRAINT "data_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routers" ADD CONSTRAINT "routers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "router_locations" ADD CONSTRAINT "router_locations_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "routers"("router_id") ON DELETE RESTRICT ON UPDATE CASCADE;
