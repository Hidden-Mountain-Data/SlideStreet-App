/*
  Warnings:

  - A unique constraint covering the columns `[sim_id,date_id]` on the table `data_usages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eid]` on the table `sims` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "data_usages_sim_id_date_id_key" ON "data_usages"("sim_id", "date_id");

-- CreateIndex
CREATE UNIQUE INDEX "sims_eid_key" ON "sims"("eid");
