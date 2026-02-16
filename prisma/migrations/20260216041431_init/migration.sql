/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prescription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW', 'RESCHEDULED', 'UNPAID');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED', 'UNPAID');

-- CreateEnum
CREATE TYPE "CommunicationMethod" AS ENUM ('EMAIL', 'SMS', 'PHONE', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('CSV', 'EXCEL', 'PDF', 'JSON');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MessageSenderType" AS ENUM ('CUSTOMER', 'AGENT', 'SYSTEM', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'TASK_ASSIGNED', 'SYSTEM_ALERT', 'REMINDER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'MOBILE_PAYMENT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('APPOINTMENT_SUMMARY', 'REVENUE_ANALYSIS', 'AGENT_PERFORMANCE', 'CUSTOMER_SATISFACTION', 'OPERATIONAL_METRICS');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('TECHNICAL', 'BILLING', 'APPOINTMENT', 'COMPLAINT', 'GENERAL', 'EMERGENCY', 'FEEDBACK');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'WAITING_AGENT', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERVISOR', 'AGENT', 'CORPORATE', 'PATIENT');

-- CreateEnum
CREATE TYPE "doctor_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "hospital_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('ACTIVE', 'REVISED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "sessionstatus" AS ENUM ('SCHEDULED', 'PAUSED', 'ONGOING', 'ENDED');

-- CreateEnum
CREATE TYPE "AgentAppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AgentPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AgentPaymentMethod" AS ENUM ('BILL_TO_PHONE', 'DEDUCT_FROM_SALARY');

-- CreateEnum
CREATE TYPE "AgentReportType" AS ENUM ('APPOINTMENTS', 'REVENUE', 'DOCTOR_PERFORMANCE', 'HOSPITAL_ANALYTICS', 'AGENT_PERFORMANCE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "session_status_list" AS ENUM ('SCHEDULED', 'ONGOING', 'PAUSED', 'ENDED');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_userId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_patientId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionMed" DROP CONSTRAINT "PrescriptionMed_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_doctorId_fkey";

-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PrescriptionMed" ALTER COLUMN "prescriptionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "doctorId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "Doctor";

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "Prescription";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "nurses" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR NOT NULL,
    "experience" TEXT,
    "createdAt" TIME(6) NOT NULL,
    "hospitalId" TEXT,
    "active" TEXT,
    "currentSession" TEXT,
    "profilePhoto" TEXT,
    "updatedAt" TIMESTAMP(6),
    "passwordChangedAt" DATE,
    "twoFactorEnabled" BOOLEAN,
    "twoFactorMethod" TEXT,
    "twoFactorUpdatedAt" DATE,
    "phone" VARCHAR(20),
    "username" TEXT,
    "age" TEXT,

    CONSTRAINT "nurses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'AGENT',
    "companyName" TEXT,
    "contactNumber" TEXT,
    "profileImage" TEXT,
    "biometric" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nicNumber" TEXT,
    "passportNumber" TEXT,
    "nationality" TEXT,
    "userType" TEXT,
    "title" TEXT,
    "isNumberVerified" BOOLEAN,
    "authUserId" UUID,
    "age" INTEGER,
    "gender" TEXT,
    "medicalSpecs" TEXT,
    "hospital" TEXT,
    "slmcNumber" INTEGER,
    "employeeId" VARCHAR(255),
    "packageId" TEXT,
    "  acceptedTerms" BOOLEAN,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_appointments" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientNIC" TEXT,
    "patientEmail" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" "AgentAppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "AgentPaymentMethod" NOT NULL DEFAULT 'BILL_TO_PHONE',
    "sltPhoneNumber" TEXT,
    "employeeNIC" TEXT,
    "notes" TEXT,
    "cancelReason" TEXT,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "AgentPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "AgentPaymentMethod" NOT NULL DEFAULT 'BILL_TO_PHONE',
    "transactionId" TEXT,
    "agentId" TEXT,
    "notes" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_reports" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" "AgentReportType" NOT NULL,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "parameters" JSONB,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_integrations" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT,
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "consultationFee" DECIMAL(10,2) NOT NULL,
    "rating" DECIMAL(3,2),
    "profileImage" TEXT,
    "description" TEXT,
    "languages" TEXT[],
    "availableDays" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "doctor_status" NOT NULL DEFAULT 'PENDING',
    "hospitalIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nurse_details" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "profileImage" TEXT,
    "availableDays" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hospitalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "age" INTEGER,
    "currentSession" TEXT,

    CONSTRAINT "nurse_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "facilities" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "hospital_status" NOT NULL DEFAULT 'PENDING',
    "profileImage" TEXT,
    "hospitalType" TEXT,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "nurseId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 5,
    "location" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "status" "sessionstatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" TIMESTAMP(6) NOT NULL,
    "startTime" TIMESTAMP(6) NOT NULL,
    "endTime" TIMESTAMP(6) NOT NULL,
    "currentRunningNumber" TEXT,
    "duration" TIMESTAMP(6),
    "hospitalName" TEXT NOT NULL,
    "patientCapacity" INTEGER NOT NULL,
    "sessionType" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "appointmentNumber" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "patientNIC" TEXT,
    "patientDateOfBirth" TIMESTAMP(3),
    "patientGender" "Gender",
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "medicalHistory" TEXT,
    "currentMedications" TEXT,
    "allergies" TEXT,
    "insuranceProvider" TEXT,
    "insurancePolicyNumber" TEXT,
    "isNewPatient" BOOLEAN NOT NULL DEFAULT true,
    "bookedById" TEXT,
    "estimatedWaitTime" INTEGER,
    "queuePosition" INTEGER,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'CONFIRMED',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "consultationFee" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "cancellationReason" TEXT,
    "cancellationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "medicalReportUrl" TEXT,
    "agentId" TEXT,
    " patientAge" INTEGER,
    "doctorId" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "prescriptionNumber" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentPrescriptionId" TEXT,
    "isLatestVersion" BOOLEAN NOT NULL DEFAULT true,
    "editReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" INTEGER,
    "note" TEXT,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255),
    "username" VARCHAR(255),
    "action" VARCHAR(100) NOT NULL,
    "resource" VARCHAR(100),
    "resource_id" VARCHAR(255),
    "details" JSONB,
    "ip_address" VARCHAR(50),
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_package_appointments" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discountApplied" DECIMAL(10,2),

    CONSTRAINT "corporate_package_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_package_benefits" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "benefitType" TEXT NOT NULL,
    "benefitDescription" TEXT NOT NULL,
    "benefitValue" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corporate_package_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_packages" (
    "id" TEXT NOT NULL,
    "packageNumber" TEXT NOT NULL,
    "corporateId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "description" TEXT,
    "totalAppointments" INTEGER NOT NULL,
    "usedAppointments" INTEGER NOT NULL DEFAULT 0,
    "remainingAppointments" INTEGER NOT NULL,
    "packageValue" DECIMAL(10,2) NOT NULL,
    "discountPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "validFromDate" DATE NOT NULL,
    "validToDate" DATE NOT NULL,
    "restrictions" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "deactivatedBy" TEXT,
    "deactivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "corporate_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "customerNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" DATE,
    "gender" "Gender",
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Sri Lanka',
    "emergencyContactName" TEXT,
    "emergencyContactRelationship" TEXT,
    "emergencyContactPhone" TEXT,
    "bloodType" TEXT,
    "allergies" TEXT[],
    "chronicConditions" TEXT[],
    "currentMedications" TEXT[],
    "insuranceProvider" TEXT,
    "insurancePolicyNumber" TEXT,
    "insuranceGroupNumber" TEXT,
    "insuranceValidUntil" DATE,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'English',
    "communicationMethod" "CommunicationMethod" NOT NULL DEFAULT 'EMAIL',
    "appointmentReminders" BOOLEAN NOT NULL DEFAULT true,
    "newsletterSubscription" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "totalAppointments" INTEGER NOT NULL DEFAULT 0,
    "lastAppointmentAt" TIMESTAMP(3),
    "nextAppointmentAt" TIMESTAMP(3),
    "customerValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "satisfaction" DECIMAL(3,2),
    "assignedAgentId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_jobs" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "fileName" TEXT NOT NULL,
    "status" "ExportStatus" NOT NULL DEFAULT 'PROCESSING',
    "exportedBy" TEXT NOT NULL,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "processedRecords" INTEGER NOT NULL DEFAULT 0,
    "filters" JSONB,
    "columns" TEXT[],
    "filePath" TEXT,
    "fileSize" INTEGER,
    "downloadUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "emailRecipients" TEXT[],
    "errorMessage" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "export_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "templateData" JSONB,
    "appointmentId" TEXT,
    "triggeredBy" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "providerResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_devices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patient_id" VARCHAR(255) NOT NULL,
    "device_token" TEXT,
    "fcm_token" TEXT,
    "device_type" VARCHAR(50),
    "device_name" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patient_id" VARCHAR(255),
    "patient_name" VARCHAR(255),
    "session_id" VARCHAR(255),
    "doctor_id" VARCHAR(255),
    "doctor_name" VARCHAR(255),
    "rating" INTEGER,
    "feedback" TEXT,
    "wait_time_rating" INTEGER,
    "service_quality_rating" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patient_id" VARCHAR(255) NOT NULL,
    "patient_name" VARCHAR(255),
    "phone" VARCHAR(50),
    "session_id" VARCHAR(255),
    "doctor_id" VARCHAR(255),
    "doctor_name" VARCHAR(255),
    "running_number" INTEGER,
    "status" VARCHAR(50),
    "source" VARCHAR(50),
    "is_extra" BOOLEAN DEFAULT false,
    "wait_time_minutes" INTEGER,
    "consultation_time_minutes" INTEGER,
    "visit_date" TIMESTAMP(6),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "patient_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "age" INTEGER,
    "emergency_contact" TEXT,
    "session_id" TEXT NOT NULL,
    "running_number" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_extra" BOOLEAN DEFAULT false,
    "wait_start_time" TIMESTAMP(6),
    "wait_end_time" TIMESTAMP(6),
    "wait_time_minutes" INTEGER,
    "cancellation_reason" TEXT,
    "cancelled_at" TIMESTAMP(6),
    "cancelled_by" VARCHAR(255),
    "consultation_start_time" TIMESTAMP(6),
    "consultation_end_time" TIMESTAMP(6),
    "consultation_time_minutes" INTEGER,
    "marked_no_show_at" TIMESTAMP(6),
    "no_show_reason" TEXT,
    "email" VARCHAR(255),
    "dateOfBirth" TIMESTAMP(6),
    "patientId" TEXT,
    "ref" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'LKR',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "gatewayResponse" JSONB,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundAmount" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "doctorId" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "parameters" JSONB,
    "filePath" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "generatedById" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "old_type" "ReportType",

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports_cache" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "report_type" VARCHAR(100) NOT NULL,
    "report_key" VARCHAR(255) NOT NULL,
    "report_data" JSONB,
    "generated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),

    CONSTRAINT "reports_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "TicketCategory" NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "assignedAgentId" TEXT,
    "assignedAgentName" TEXT,
    "estimatedResolutionAt" TIMESTAMP(3),
    "actualResolutionAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "tags" TEXT[],
    "satisfactionRating" DECIMAL(3,2),
    "resolutionNotes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_messages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "senderId" TEXT,
    "senderName" TEXT NOT NULL,
    "senderType" "MessageSenderType" NOT NULL,
    "message" TEXT NOT NULL,
    "attachments" TEXT[],
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_slots" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TIME(6) NOT NULL,
    "endTime" TIME(6) NOT NULL,
    "maxAppointments" INTEGER NOT NULL DEFAULT 20,
    "currentBookings" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "consultationFee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "context" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_hospitals" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "doctor_hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_employees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employeeid" VARCHAR(255) NOT NULL,
    "hospitalname" VARCHAR(255) NOT NULL,
    "isactive" BOOLEAN DEFAULT true,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corporate_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "packageId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_authUserId_key" ON "users"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "agents_userId_key" ON "agents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "agent_appointments_paymentId_key" ON "agent_appointments"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "agent_payments_transactionId_key" ON "agent_payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE INDEX "idx_doctors_isactive" ON "doctors"("isActive");

-- CreateIndex
CREATE INDEX "idx_doctors_name" ON "doctors"("name");

-- CreateIndex
CREATE INDEX "idx_doctors_specialization" ON "doctors"("specialization");

-- CreateIndex
CREATE INDEX "idx_doctors_status" ON "doctors"("status");

-- CreateIndex
CREATE UNIQUE INDEX "nurse_details_email_key" ON "nurse_details"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_email_key" ON "hospitals"("email");

-- CreateIndex
CREATE INDEX "idx_hospitals_district" ON "hospitals"("district");

-- CreateIndex
CREATE INDEX "idx_hospitals_hospitaltype" ON "hospitals"("hospitalType");

-- CreateIndex
CREATE INDEX "idx_hospitals_name" ON "hospitals"("name");

-- CreateIndex
CREATE INDEX "idx_sessions_doctor_id" ON "sessions"("doctorId");

-- CreateIndex
CREATE INDEX "idx_sessions_hospital_id" ON "sessions"("hospitalId");

-- CreateIndex
CREATE INDEX "idx_sessions_scheduled_at" ON "sessions"("scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_appointmentNumber_key" ON "appointments"("appointmentNumber");

-- CreateIndex
CREATE INDEX "idx_appointments_status" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "idx_appointments_patient_email" ON "appointments"("patientEmail");

-- CreateIndex
CREATE INDEX "idx_appointments_bookedbyid" ON "appointments"("bookedById");

-- CreateIndex
CREATE INDEX "idx_appointments_createdat" ON "appointments"("createdAt");

-- CreateIndex
CREATE INDEX "idx_appointments_sessionid" ON "appointments"("sessionId");

-- CreateIndex
CREATE INDEX "idx_appointments_status_createdat" ON "appointments"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_prescriptionNumber_key" ON "prescriptions"("prescriptionNumber");

-- CreateIndex
CREATE INDEX "idx_prescription_appointment" ON "prescriptions"("appointmentId");

-- CreateIndex
CREATE INDEX "idx_prescription_patient" ON "prescriptions"("patientEmail");

-- CreateIndex
CREATE INDEX "idx_prescription_doctor" ON "prescriptions"("doctorId");

-- CreateIndex
CREATE INDEX "idx_prescription_created" ON "prescriptions"("createdAt");

-- CreateIndex
CREATE INDEX "idx_prescription_parent" ON "prescriptions"("parentPrescriptionId");

-- CreateIndex
CREATE INDEX "idx_audit_logs_action" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_audit_logs_timestamp" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_package_appointments_packageId_appointmentId_key" ON "corporate_package_appointments"("packageId", "appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_packages_packageNumber_key" ON "corporate_packages"("packageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customerNumber_key" ON "customers"("customerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "export_jobs_jobId_key" ON "export_jobs"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_logs_notificationId_key" ON "notification_logs"("notificationId");

-- CreateIndex
CREATE INDEX "idx_patient_devices_active" ON "patient_devices"("is_active");

-- CreateIndex
CREATE INDEX "idx_patient_devices_patient_id" ON "patient_devices"("patient_id");

-- CreateIndex
CREATE INDEX "idx_patient_feedback_created_at" ON "patient_feedback"("created_at");

-- CreateIndex
CREATE INDEX "idx_patient_feedback_doctor_id" ON "patient_feedback"("doctor_id");

-- CreateIndex
CREATE INDEX "idx_patient_feedback_rating" ON "patient_feedback"("rating");

-- CreateIndex
CREATE INDEX "idx_patient_history_doctor_id" ON "patient_history"("doctor_id");

-- CreateIndex
CREATE INDEX "idx_patient_history_patient_id" ON "patient_history"("patient_id");

-- CreateIndex
CREATE INDEX "idx_patient_history_phone" ON "patient_history"("phone");

-- CreateIndex
CREATE INDEX "idx_patient_history_visit_date" ON "patient_history"("visit_date");

-- CreateIndex
CREATE UNIQUE INDEX "patients_patientId_key" ON "patients"("patientId");

-- CreateIndex
CREATE INDEX "idx_patients_created_at" ON "patients"("created_at");

-- CreateIndex
CREATE INDEX "idx_patients_is_extra" ON "patients"("is_extra");

-- CreateIndex
CREATE INDEX "idx_patients_running_number" ON "patients"("running_number");

-- CreateIndex
CREATE INDEX "idx_patients_session_id" ON "patients"("session_id");

-- CreateIndex
CREATE INDEX "idx_patients_status" ON "patients"("status");

-- CreateIndex
CREATE UNIQUE INDEX "patients_session_id_running_number_key" ON "patients"("session_id", "running_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE INDEX "idx_reports_cache_expires" ON "reports_cache"("expires_at");

-- CreateIndex
CREATE INDEX "idx_reports_cache_type_key" ON "reports_cache"("report_type", "report_key");

-- CreateIndex
CREATE UNIQUE INDEX "reports_cache_report_type_report_key_key" ON "reports_cache"("report_type", "report_key");

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_ticketNumber_key" ON "support_tickets"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_doctorId_date_startTime_key" ON "time_slots"("doctorId", "date", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "translations_language_module_key_key" ON "translations"("language", "module", "key");

-- CreateIndex
CREATE INDEX "idx_doctor_hospitals_doctorid" ON "doctor_hospitals"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_hospitals_hospitalid" ON "doctor_hospitals"("hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_hospitals_doctorId_hospitalId_key" ON "doctor_hospitals"("doctorId", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_employees_employeeid_key" ON "corporate_employees"("employeeid");

-- CreateIndex
CREATE UNIQUE INDEX "packages_packageId_key" ON "packages"("packageId");

-- AddForeignKey
ALTER TABLE "nurses" ADD CONSTRAINT "hospitalId" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_corporate_employees" FOREIGN KEY ("employeeId") REFERENCES "corporate_employees"("employeeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_packages" FOREIGN KEY ("packageId") REFERENCES "packages"("packageId") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_appointments" ADD CONSTRAINT "agent_appointments_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_appointments" ADD CONSTRAINT "agent_appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_appointments" ADD CONSTRAINT "agent_appointments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "agent_payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_payments" ADD CONSTRAINT "agent_payments_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_reports" ADD CONSTRAINT "agent_reports_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_integrations" ADD CONSTRAINT "agent_integrations_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "doctorId" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "hospitalId" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "nurseId" FOREIGN KEY ("nurseId") REFERENCES "nurse_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_bookedbyid_fkey" FOREIGN KEY ("bookedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "fk_appointments_agent" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_parentPrescriptionId_fkey" FOREIGN KEY ("parentPrescriptionId") REFERENCES "prescriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionMed" ADD CONSTRAINT "PrescriptionMed_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_package_appointments" ADD CONSTRAINT "corporate_package_appointments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_package_appointments" ADD CONSTRAINT "corporate_package_appointments_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "corporate_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_package_benefits" ADD CONSTRAINT "corporate_package_benefits_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "corporate_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_packages" ADD CONSTRAINT "corporate_packages_corporateId_fkey" FOREIGN KEY ("corporateId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_packages" ADD CONSTRAINT "corporate_packages_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
