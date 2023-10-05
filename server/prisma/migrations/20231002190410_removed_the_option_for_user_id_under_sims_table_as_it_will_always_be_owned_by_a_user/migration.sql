/*
  Warnings:

  - Made the column `user_id` on table `sims` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "sims" DROP CONSTRAINT "sims_user_id_fkey";

-- AlterTable
ALTER TABLE "sims" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "sims" ADD CONSTRAINT "sims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
