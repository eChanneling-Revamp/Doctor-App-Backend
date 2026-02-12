import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/prisma"; // Use shared instance

import prescriptionRoutes from "./routes/prescription.routes";
import sessionRoutes from "./routes/session.routes";
import scheduleRoutes from "./routes/schedule.routes";
import slotRoutes from "./routes/slot.routes";
import appointmentRoutes from "./routes/appointment.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import helpRoutes from "./routes/help.routes";
import notificationRoutes from "./routes/notification.routes";
import reminderRoutes from "./routes/reminder.routes";

import { errorHandler } from "./utils/errorHandler";
import ApiError from "./utils/ApiError";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reminders", reminderRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Doctor Appointment Backend Running with Prisma + PostgreSQL (TypeScript)");
});

// 404 Handler
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

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
