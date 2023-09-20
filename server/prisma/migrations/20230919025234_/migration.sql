/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `business_user_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `business_user_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `business_user_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `device_locations` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `device_locations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `device_locations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `dim_dates` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `dim_dates` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `dim_devices` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `dim_devices` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `dim_devices` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `fact_data_usages` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `fact_data_usages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `fact_data_usages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `boxId` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `serialNumber` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `apiKey` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address_id]` on the table `businesses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial_number]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_line_1` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_line_2` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `business_user_mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `device_locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `dim_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `dim_devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `fact_data_usages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serial_number` to the `stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `stocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_productId_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_orderId_fkey";

-- DropIndex
DROP INDEX "businesses_addressId_idx";

-- DropIndex
DROP INDEX "businesses_addressId_key";

-- DropIndex
DROP INDEX "items_orderId_idx";

-- DropIndex
DROP INDEX "items_productId_idx";

-- DropIndex
DROP INDEX "stocks_orderId_idx";

-- DropIndex
DROP INDEX "stocks_serialNumber_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "address_line_1" VARCHAR(50) NOT NULL,
ADD COLUMN     "address_line_2" VARCHAR(50) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "business_user_mappings" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "addressId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "device_locations" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "dim_dates" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "dim_devices" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "fact_data_usages" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "files" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "orderId",
DROP COLUMN "productId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "order_id" INTEGER NOT NULL,
ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "boxId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "orderId",
DROP COLUMN "serialNumber",
DROP COLUMN "updatedAt",
ADD COLUMN     "box_id" VARCHAR(200),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "order_id" INTEGER,
ADD COLUMN     "serial_number" VARCHAR(100) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "apiKey",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "api_key" VARCHAR(200),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "stripe_customer_id" VARCHAR(200),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "businesses_address_id_key" ON "businesses"("address_id");

-- CreateIndex
CREATE INDEX "businesses_address_id_idx" ON "businesses"("address_id");

-- CreateIndex
CREATE INDEX "items_order_id_idx" ON "items"("order_id");

-- CreateIndex
CREATE INDEX "items_product_id_idx" ON "items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_serial_number_key" ON "stocks"("serial_number");

-- CreateIndex
CREATE INDEX "stocks_order_id_idx" ON "stocks"("order_id");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;
