import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  cancelAppointment,
  getUpcomingAppointments
} from "../controllers/appointmentController.js";

const router = express.Router();

// CRUD routes
router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.put("/cancel/:id", cancelAppointment);
router.get("/upcoming/doctor/:doctorId", getUpcomingAppointments);

export default router;
