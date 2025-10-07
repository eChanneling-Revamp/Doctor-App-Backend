import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("Doctor Appointment Backend Running with Prisma + PostgreSQL");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
