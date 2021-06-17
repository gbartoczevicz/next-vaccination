-- CreateTable
CREATE TABLE "patients" (
    "id" VARCHAR(50) NOT NULL,
    "birthday" DATE NOT NULL,
    "document" VARCHAR(11) NOT NULL,
    "avatar" VARCHAR(50),
    "ticket" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients.document_unique" ON "patients"("document");

-- CreateIndex
CREATE UNIQUE INDEX "patients.user_id_unique" ON "patients"("user_id");

-- AddForeignKey
ALTER TABLE "patients" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
