import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import prescriptionRoutes from "./routes/prescription.routes";
import sessionRoutes from "./routes/session.routes";
import scheduleRoutes from "./routes/schedule.routes";
import slotRoutes from "./routes/slot.routes";
import appointmentRoutes from "./routes/appointment.routes";

import incomeRoutes from "./routes/income.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import helpRoutes from "./routes/help.routes";

// ✅ Load env FIRST
dotenv.config();

const app = express();

// ✅ Single Prisma instance (best practice)
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/help", helpRoutes);

// ---------------- ROOT ----------------
app.get("/", (_req, res) => {
  res.send("Doctor Appointment Backend Running with Prisma + PostgreSQL (TypeScript)");
});

// ---------------- SERVER ----------------
const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();