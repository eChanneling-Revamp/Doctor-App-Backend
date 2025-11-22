import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import prescriptionRoutes from "./routes/prescription.routes";
import sessionRoutes from "./routes/session.routes";
import scheduleRoutes from "./routes/schedule.routes";
import slotRoutes from "./routes/slot.routes";
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ Connect the session routes
app.use("/api/prescriptions",prescriptionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/slots", slotRoutes);




// Root route
app.get("/", (req, res) => {
  res.send("Doctor Appointment Backend Running with Prisma + PostgreSQL (TypeScript)");
});

const PORT = process.env.PORT || 5000;

// ✅ Function to connect DB + start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Stop the server if DB connection fails
  }
}

startServer();

