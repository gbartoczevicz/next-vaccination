/*
  Warnings:

  - You are about to drop the column `vaccinationPointId` on the `locations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vaccination_point_id]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vaccination_point_id` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_vaccinationPointId_fkey";

-- DropIndex
DROP INDEX "locations_vaccinationPointId_unique";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "vaccinationPointId",
ADD COLUMN     "vaccination_point_id" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "locations_vaccination_point_id_unique" ON "locations"("vaccination_point_id");

-- AddForeignKey
ALTER TABLE "locations" ADD FOREIGN KEY ("vaccination_point_id") REFERENCES "vaccination_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;
