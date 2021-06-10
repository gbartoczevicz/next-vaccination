-- CreateTable
CREATE TABLE "vaccines" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vaccines.name_unique" ON "vaccines"("name");
