/*
  Warnings:

  - You are about to drop the column `addressNumber` on the `locations` table. All the data in the column will be lost.
  - Added the required column `address_number` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" DROP COLUMN "addressNumber",
ADD COLUMN     "address_number" INTEGER NOT NULL;
