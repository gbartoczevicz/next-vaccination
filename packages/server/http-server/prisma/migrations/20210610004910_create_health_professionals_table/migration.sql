-- CreateTable
CREATE TABLE "health_professionals" (
    "id" VARCHAR(50) NOT NULL,
    "document" VARCHAR(50) NOT NULL,
    "responsible" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "health_professionals.document_unique" ON "health_professionals"("document");

-- CreateIndex
CREATE UNIQUE INDEX "health_professionals.user_id_unique" ON "health_professionals"("user_id");

-- AddForeignKey
ALTER TABLE "health_professionals" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
