/*
  Warnings:

  - Added the required column `vaccination_point_id` to the `health_professionals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "health_professionals" ADD COLUMN     "vaccination_point_id" VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE "health_professionals" ADD FOREIGN KEY ("vaccination_point_id") REFERENCES "vaccination_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;
