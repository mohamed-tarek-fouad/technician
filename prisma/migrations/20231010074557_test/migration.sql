/*
  Warnings:

  - You are about to drop the column `TechnecianId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Techncian` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `TechnicianId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_TechnecianId_fkey";

-- DropForeignKey
ALTER TABLE "Techncian" DROP CONSTRAINT "Techncian_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "TechnecianId",
ADD COLUMN     "TechnicianId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Techncian";

-- CreateTable
CREATE TABLE "Technician" (
    "_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "idImage" TEXT NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Technician_userId_key" ON "Technician"("userId");

-- AddForeignKey
ALTER TABLE "Technician" ADD CONSTRAINT "Technician_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_TechnicianId_fkey" FOREIGN KEY ("TechnicianId") REFERENCES "Technician"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
