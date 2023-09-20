/*
  Warnings:

  - The primary key for the `addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `addressId` on the `addresses` table. All the data in the column will be lost.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `categories` table. All the data in the column will be lost.
  - The primary key for the `device_locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `locationId` on the `device_locations` table. All the data in the column will be lost.
  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `items` table. All the data in the column will be lost.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderId` on the `orders` table. All the data in the column will be lost.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `products` table. All the data in the column will be lost.
  - The primary key for the `stocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `stocks` table. All the data in the column will be lost.
  - You are about to drop the column `stockId` on the `stocks` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `addressId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[item_id]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stock_id]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `stocks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "business_user_mappings" DROP CONSTRAINT "business_user_mappings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "dim_devices" DROP CONSTRAINT "dim_devices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fact_data_usages" DROP CONSTRAINT "fact_data_usages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_product_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_orderId_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_productId_fkey";

-- DropIndex
DROP INDEX "categories_categoryId_key";

-- DropIndex
DROP INDEX "items_itemId_key";

-- DropIndex
DROP INDEX "orders_orderId_key";

-- DropIndex
DROP INDEX "products_productId_key";

-- DropIndex
DROP INDEX "stocks_productId_idx";

-- DropIndex
DROP INDEX "stocks_stockId_key";

-- DropIndex
DROP INDEX "user_address_key";

-- DropIndex
DROP INDEX "users_addressId_key";

-- DropIndex
DROP INDEX "users_userId_key";

-- AlterTable
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_pkey",
DROP COLUMN "addressId",
ADD COLUMN     "address_id" SERIAL NOT NULL,
ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("address_id");

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "categoryId",
ADD COLUMN     "category_id" SERIAL NOT NULL,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id");

-- AlterTable
ALTER TABLE "device_locations" DROP CONSTRAINT "device_locations_pkey",
DROP COLUMN "locationId",
ADD COLUMN     "location_id" SERIAL NOT NULL,
ADD CONSTRAINT "device_locations_pkey" PRIMARY KEY ("location_id");

-- AlterTable
ALTER TABLE "items" DROP CONSTRAINT "items_pkey",
DROP COLUMN "itemId",
ADD COLUMN     "item_id" SERIAL NOT NULL,
ADD CONSTRAINT "items_pkey" PRIMARY KEY ("item_id");

-- AlterTable
ALTER TABLE "orders" DROP CONSTRAINT "orders_pkey",
DROP COLUMN "orderId",
ADD COLUMN     "order_id" SERIAL NOT NULL,
ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id");

-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "productId",
ADD COLUMN     "product_id" SERIAL NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("product_id");

-- AlterTable
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_pkey",
DROP COLUMN "productId",
DROP COLUMN "stockId",
ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "stock_id" SERIAL NOT NULL,
ADD CONSTRAINT "stocks_pkey" PRIMARY KEY ("stock_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "addressId",
DROP COLUMN "userId",
ADD COLUMN     "address_id" VARCHAR(50),
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_id_key" ON "categories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "items_item_id_key" ON "items"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_id_key" ON "orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_id_key" ON "products"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_stock_id_key" ON "stocks"("stock_id");

-- CreateIndex
CREATE INDEX "stocks_product_id_idx" ON "stocks"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_address_id_key" ON "users"("address_id");

-- CreateIndex
CREATE INDEX "user_address_key" ON "users"("address_id");

-- AddForeignKey
ALTER TABLE "fact_data_usages" ADD CONSTRAINT "fact_data_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dim_devices" ADD CONSTRAINT "dim_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_user_mappings" ADD CONSTRAINT "business_user_mappings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
