import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import appointmentRoutes from "./routes/appointmentRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import prescriptionRoutes from './routes/prescriptionRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/sessions", sessionRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Doctor Appointment Backend Running with Prisma + PostgreSQL");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
