/*
  Warnings:

  - The `meerkat_ip_entries` column on the `sims` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "sims" DROP COLUMN "meerkat_ip_entries",
ADD COLUMN     "meerkat_ip_entries" TEXT[];
