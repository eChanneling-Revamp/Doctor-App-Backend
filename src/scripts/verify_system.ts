
import prisma from "../config/prisma";
import { register, login } from "../controllers/auth.controller";
import { bookAppointment } from "../controllers/appointment.controller";
import { ReminderService } from "../services/reminder.service";
import { NotificationService } from "../services/notification.service";
import { Request, Response } from "express";

// Mock Express Request and Response
const mockRequest = (body: any, params: any = {}, query: any = {}) => ({
  body,
  params,
  query,
  headers: {},
} as unknown as Request);

const mockResponse = () => {
  const res: any = {};
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: any) => {
    res.body = data;
    return res;
  };
  return res as Response & { statusCode: number; body: any };
};

const runVerification = async () => {
  console.log("Starting System Verification...");

  const timestamp = Date.now();
  const email = `testuser${timestamp}@example.com`;
  const password = "password123";
  const phone = `+1${timestamp}`; // ensure unique phone

  // 1. Register User
  console.log("\n1. Testing Registration...");
  const reqRegister = mockRequest({
    fullName: "Test User",
    email,
    phone,
    password,
    medicalSpec: "None",
    hospital: "Test Hospital",
    slmcNumber: 12345
  });
  const resRegister = mockResponse();
  await register(reqRegister, resRegister);

  if (resRegister.statusCode !== 200) {
    console.error("Registration failed:", resRegister.body);
    process.exit(1);
  }
  console.log("Registration successful.");

  // Verify OTP Email
  const otpLog = await prisma.notification_logs.findFirst({
    where: { recipient: email, type: "OTP" },
    orderBy: { createdAt: "desc" }
  });

  if (!otpLog) {
    console.error("❌ OTP Email NOT logged!");
  } else {
    console.log("✅ OTP Email logged:", otpLog.id);
  }


  // 2. Login User
  console.log("\n2. Testing Login...");
  const reqLogin = mockRequest({ email, password });
  const resLogin = mockResponse();
  await login(reqLogin, resLogin);

  if (resLogin.statusCode !== 200) {
    console.error("Login failed:", resLogin.body);
    process.exit(1);
  }
  const token = resLogin.body.token;
  const user = resLogin.body.user;
  console.log("Login successful. Token received.");


  // 3. Setup Data for Appointment (Doctor, Session, Slot)
  console.log("\n3. Setting up Appointment Data...");

  // Create Doctor
  const doctor = await prisma.doctor.create({
    data: {
      name: "Dr. Test",
      email: `doctor${timestamp}@example.com`,
      specialization: "General",
      qualification: "MBBS",
      experience: 10,
      phonenumber: "1234567890",
      consultationFee: 500,
      availableDays: ["Monday", "Tuesday"],
    }
  });

  // Create Hospital
  const hospital = await prisma.hospital.create({
      data: {
          name: "Test Hospital",
          address: "123 Street",
          city: "Test City",
          district: "Test District",
          contactNumber: "1234567890",
          email: `hospital${timestamp}@example.com`
      }
  });

  // Create Nurse
  const nurse = await prisma.nurse_Detail.create({
      data: {
          name: "Nurse Test",
          email: `nurse${timestamp}@example.com`,
          experience: 5,
          phonenumber: "1234567890",
          hospitalId: hospital.id
      }
  });


  // Create Session (Scheduled for TOMORROW for reminder test)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const session = await prisma.session.create({
    data: {
      doctorId: doctor.id,
      nurseId: nurse.id,
      hospitalId: hospital.id,
      location: "Room 1",
      scheduledAt: tomorrow,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 3600000), // 1 hour later
      hospitalName: hospital.name,
      patientCapacity: 10,
      sessionType: "Regular"
    }
  });

  // Create Slot
  const schedule = await prisma.schedule.create({
      data: {
          doctorId: doctor.id,
          location: "Room 1",
          workingDays: ["Monday"],
          startTime: "10:00",
          endTime: "11:00",
          date: tomorrow
      }
  });

  const slot = await prisma.slot.create({
      data: {
          scheduleId: schedule.id,
          date: tomorrow,
          time: "10:00",
          isBooked: false
      }
  });


  // 4. Book Appointment
  console.log("\n4. Testing Appointment Booking...");
  const reqBook = mockRequest({
    slotId: slot.id,
    patientName: "Test User",
    patientEmail: email,
    patientPhone: phone,
    type: "In-Person",
    doctorId: doctor.id,
    patientId: 123, // Dummy patient ID, or create one if needed
    sessionId: session.id,
    consultationFee: 500,
    totalAmount: 500
  });

  // Note: patientId is Int in schema, but User.id is String (CUID).
  // Appointment.patientId refers to `patients` table (Int ID).
  // I need to create a patient in `patients` table first?
  // Let's check schema.
  // `patient patients @relation(fields: [patientId], references: [id])`
  // Yes.

  const patient = await prisma.patients.create({
      data: {
          patient_name: "Test User",
          phone: phone,
          session_id: session.id,
          running_number: 1,
          source: "App",
          status: "Active",
          email: email
      }
  });

  reqBook.body.patientId = patient.id;

  const resBook = mockResponse();
  await bookAppointment(reqBook, resBook);

  if (resBook.statusCode !== 200) {
      console.error("Booking failed:", resBook.body);
      // Clean up?
  } else {
      console.log("Booking successful.");
  }

  // Verify Confirmation Email
  const confLog = await prisma.notification_logs.findFirst({
    where: { recipient: email, type: "APPOINTMENT_CONFIRMED" }, // Adjust type if needed
    orderBy: { createdAt: "desc" }
  });

  if (!confLog) {
    console.error("❌ Confirmation Email NOT logged!");
  } else {
    console.log("✅ Confirmation Email logged:", confLog.id);
  }


  // 5. Test Reminders
  console.log("\n5. Testing Reminders...");
  // Since session is scheduled for tomorrow, processReminders should pick it up.
  await ReminderService.processReminders();

  // Verify Reminder Email
  const remLog = await prisma.notification_logs.findFirst({
    where: { recipient: email, type: "REMINDER" },
    orderBy: { createdAt: "desc" }
  });

  if (!remLog) {
    console.error("❌ Reminder Email NOT logged!");
  } else {
    console.log("✅ Reminder Email logged:", remLog.id);
  }

  console.log("\nVerification Complete.");
};

runVerification().catch(console.error).finally(async () => {
    await prisma.$disconnect();
});
