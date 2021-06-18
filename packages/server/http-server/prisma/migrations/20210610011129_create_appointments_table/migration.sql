-- CreateTable
CREATE TABLE "appointments" (
    "id" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vaccination_point_id" VARCHAR(50) NOT NULL,
    "patient_id" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointments" ADD FOREIGN KEY ("vaccination_point_id") REFERENCES "vaccination_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
