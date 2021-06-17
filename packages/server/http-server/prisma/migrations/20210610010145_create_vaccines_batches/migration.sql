-- CreateTable
CREATE TABLE "vaccine_batches" (
    "id" VARCHAR(50) NOT NULL,
    "expiration_date" DATE NOT NULL,
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vaccine_id" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vaccine_batches" ADD FOREIGN KEY ("vaccine_id") REFERENCES "vaccines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
