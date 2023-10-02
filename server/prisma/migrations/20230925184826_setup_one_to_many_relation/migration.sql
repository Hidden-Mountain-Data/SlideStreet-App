/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "data_usages" DROP CONSTRAINT "data_usages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "routers" DROP CONSTRAINT "routers_user_id_fkey";

-- DropIndex
DROP INDEX "routers_user_id_key";

-- DropIndex
DROP INDEX "users_user_id_key";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "data_usages" ADD CONSTRAINT "data_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routers" ADD CONSTRAINT "routers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
