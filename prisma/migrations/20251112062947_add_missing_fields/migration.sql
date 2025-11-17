/*
  Warnings:

  - Made the column `appointmentId` on table `Prescription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "patientEmail" TEXT,
ADD COLUMN     "refNo" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Active';

-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Prescription" ALTER COLUMN "appointmentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PrescriptionMed" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialNote" TEXT;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
