-- CreateTable
CREATE TABLE "vaccination_points" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(12) NOT NULL,
    "document" VARCHAR(50) NOT NULL,
    "availability" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" VARCHAR(500) NOT NULL,
    "addressNumber" INTEGER NOT NULL,
    "vaccinationPointId" VARCHAR(50) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "vaccination_points.phone_unique" ON "vaccination_points"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "vaccination_points.document_unique" ON "vaccination_points"("document");

-- CreateIndex
CREATE UNIQUE INDEX "vaccination_points_coordinates" ON "locations"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "locations_vaccinationPointId_unique" ON "locations"("vaccinationPointId");

-- AddForeignKey
ALTER TABLE "locations" ADD FOREIGN KEY ("vaccinationPointId") REFERENCES "vaccination_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;
