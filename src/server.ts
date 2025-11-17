import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Import all route files
import prescriptionRoutes from "./routes/prescription.routes";
import sessionRoutes from "./routes/session.routes";
import scheduleRoutes from "./routes/schedule.routes";
import slotRoutes from "./routes/slot.routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

/* ============================
       ROUTE REGISTRATIONS
   ============================ */

// Sessions
app.use("/api/sessions", sessionRoutes);

// Prescriptions
app.use("/api/prescriptions", prescriptionRoutes);

// Schedule Manager System
app.use("/api/schedules", scheduleRoutes);
app.use("/api/slots", slotRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Doctor Appointment Backend Running with Prisma + PostgreSQL (TypeScript)");
});

// Server PORT
const PORT = Number(process.env.PORT) || 5432;

/* ============================
   START SERVER + DB CONNECTION
   ============================ */

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown (optional)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔌 Prisma disconnected. Server shutting down.");
  process.exit(0);
});
