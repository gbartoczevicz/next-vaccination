-- CreateTable
CREATE TABLE "conclusions" (
    "id" VARCHAR(50) NOT NULL,
    "vaccinated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appointment_id" VARCHAR(50) NOT NULL,
    "vaccinated_by_id" VARCHAR(50) NOT NULL,
    "vaccine_batch_id" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conclusions" ADD FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conclusions" ADD FOREIGN KEY ("vaccinated_by_id") REFERENCES "health_professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conclusions" ADD FOREIGN KEY ("vaccine_batch_id") REFERENCES "vaccine_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
