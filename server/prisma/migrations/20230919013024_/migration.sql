/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `token` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `first_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `last_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - A unique constraint covering the columns `[userId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `full_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'RETURNED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('WHITE', 'BLACK', 'GRAY');

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "image_url",
DROP COLUMN "roles",
DROP COLUMN "updated_at",
ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "apiKey" VARCHAR(200),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "refresh_token" VARCHAR(200),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "stripeCustomerId" VARCHAR(200),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "token" DROP NOT NULL,
ALTER COLUMN "token" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "full_name" SET NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "fact_data_usages" (
    "data_usage_id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "date_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "data_usage" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "fact_data_usages_pkey" PRIMARY KEY ("data_usage_id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "business_id" SERIAL NOT NULL,
    "addressId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("business_id")
);

-- CreateTable
CREATE TABLE "dim_dates" (
    "date_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "day_of_year" INTEGER NOT NULL,
    "week_of_year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dim_dates_pkey" PRIMARY KEY ("date_id")
);

-- CreateTable
CREATE TABLE "dim_devices" (
    "device_id" SERIAL NOT NULL,
    "business_id" INTEGER,
    "user_id" INTEGER,
    "device_ip" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "imei" VARCHAR(50) NOT NULL,
    "sim" VARCHAR(50) NOT NULL,
    "notes" VARCHAR(500) NOT NULL,
    "iccid" VARCHAR(200) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "dim_devices_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "business_user_mappings" (
    "businessUserMappingId" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "business_user_mappings_pkey" PRIMARY KEY ("businessUserMappingId")
);

-- CreateTable
CREATE TABLE "device_locations" (
    "locationId" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "device_logitude" DOUBLE PRECISION NOT NULL,
    "device_latitude" DOUBLE PRECISION NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "device_locations_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "addresses" (
    "addressId" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "addressLine1" VARCHAR(50) NOT NULL,
    "addressLine2" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "zip" INTEGER NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "categories" (
    "categoryId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" "Color" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "files" (
    "file_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "files_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "items" (
    "itemId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "items_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "orders" (
    "orderId" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "products" (
    "productId" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "vendor" VARCHAR(100) NOT NULL,
    "stock" DOUBLE PRECISION NOT NULL,
    "committed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "onHand" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "stocks" (
    "stockId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER,
    "imei" VARCHAR(50) NOT NULL,
    "iccid" VARCHAR(200) NOT NULL,
    "serialNumber" VARCHAR(100) NOT NULL,
    "sku" VARCHAR(200) NOT NULL,
    "boxId" VARCHAR(200),
    "status" "StockStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("stockId")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "fact_data_usages_business_id_idx" ON "fact_data_usages"("business_id");

-- CreateIndex
CREATE INDEX "fact_data_usages_date_id_idx" ON "fact_data_usages"("date_id");

-- CreateIndex
CREATE INDEX "fact_data_usages_device_id_idx" ON "fact_data_usages"("device_id");

-- CreateIndex
CREATE INDEX "fact_data_usages_user_id_idx" ON "fact_data_usages"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_addressId_key" ON "businesses"("addressId");

-- CreateIndex
CREATE INDEX "businesses_addressId_idx" ON "businesses"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "dim_dates_date_key" ON "dim_dates"("date");

-- CreateIndex
CREATE INDEX "dim_dates_date_idx" ON "dim_dates"("date");

-- CreateIndex
CREATE UNIQUE INDEX "dim_devices_business_id_key" ON "dim_devices"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "dim_devices_user_id_key" ON "dim_devices"("user_id");

-- CreateIndex
CREATE INDEX "dim_devices_business_id_idx" ON "dim_devices"("business_id");

-- CreateIndex
CREATE INDEX "dim_devices_user_id_idx" ON "dim_devices"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_user_mappings_business_id_key" ON "business_user_mappings"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_user_mappings_user_id_key" ON "business_user_mappings"("user_id");

-- CreateIndex
CREATE INDEX "business_user_mappings_business_id_idx" ON "business_user_mappings"("business_id");

-- CreateIndex
CREATE INDEX "business_user_mappings_user_id_idx" ON "business_user_mappings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_locations_device_id_key" ON "device_locations"("device_id");

-- CreateIndex
CREATE INDEX "device_locations_device_id_idx" ON "device_locations"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_business_id_key" ON "addresses"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_user_id_key" ON "addresses"("user_id");

-- CreateIndex
CREATE INDEX "addresses_business_id_idx" ON "addresses"("business_id");

-- CreateIndex
CREATE INDEX "addresses_user_id_idx" ON "addresses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_categoryId_key" ON "categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "files_file_id_key" ON "files"("file_id");

-- CreateIndex
CREATE INDEX "files_product_id_idx" ON "files"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "items_itemId_key" ON "items"("itemId");

-- CreateIndex
CREATE INDEX "items_orderId_idx" ON "items"("orderId");

-- CreateIndex
CREATE INDEX "items_productId_idx" ON "items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_business_id_key" ON "orders"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_user_id_key" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "orders_business_id_idx" ON "orders"("business_id");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_productId_key" ON "products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_stockId_key" ON "stocks"("stockId");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_imei_key" ON "stocks"("imei");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_iccid_key" ON "stocks"("iccid");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_serialNumber_key" ON "stocks"("serialNumber");

-- CreateIndex
CREATE INDEX "stocks_orderId_idx" ON "stocks"("orderId");

-- CreateIndex
CREATE INDEX "stocks_productId_idx" ON "stocks"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_addressId_key" ON "users"("addressId");

-- CreateIndex
CREATE INDEX "user_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_address_key" ON "users"("addressId");

-- AddForeignKey
ALTER TABLE "fact_data_usages" ADD CONSTRAINT "fact_data_usages_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("business_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fact_data_usages" ADD CONSTRAINT "fact_data_usages_date_id_fkey" FOREIGN KEY ("date_id") REFERENCES "dim_dates"("date_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fact_data_usages" ADD CONSTRAINT "fact_data_usages_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "dim_devices"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fact_data_usages" ADD CONSTRAINT "fact_data_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dim_devices" ADD CONSTRAINT "dim_devices_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("business_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dim_devices" ADD CONSTRAINT "dim_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_user_mappings" ADD CONSTRAINT "business_user_mappings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("business_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_user_mappings" ADD CONSTRAINT "business_user_mappings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_locations" ADD CONSTRAINT "device_locations_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "dim_devices"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("business_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("business_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
