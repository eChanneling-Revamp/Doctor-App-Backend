-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_sessionId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "sessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
