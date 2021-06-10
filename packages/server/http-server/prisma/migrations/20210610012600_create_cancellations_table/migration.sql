/*
  Warnings:

  - A unique constraint covering the columns `[appointment_id]` on the table `conclusions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "cancellations" (
    "id" VARCHAR(50) NOT NULL,
    "reason" TEXT NOT NULL,
    "canceled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appointment_id" VARCHAR(50) NOT NULL,
    "cancelated_by_id" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conclusions_appointment_id_unique" ON "conclusions"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "cancellations.cancelated_by_id_unique" ON "cancellations"("cancelated_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "cancellations_appointment_id_unique" ON "cancellations"("appointment_id");

-- AddForeignKey
ALTER TABLE "cancellations" ADD FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancellations" ADD FOREIGN KEY ("cancelated_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
