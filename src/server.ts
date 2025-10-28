import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// You can also import other routes here (appointmentRoutes, sessionRoutes, etc.)

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes

// Root route
app.get("/", (req, res) => {
  res.send("Doctor Appointment Backend Running with Prisma + PostgreSQL (TypeScript)");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
