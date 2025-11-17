import { Router } from "express";
import {
  bookAppointment,
  getAppointmentsByPatient,
  updateAppointmentStatus,
  getAllAppointments,
} from "../controllers/appointment.controller";

const router = Router();

router.post("/book", bookAppointment);
router.get("/patient/:patientId", getAppointmentsByPatient);
router.patch("/:appointmentId/status", updateAppointmentStatus);
router.get("/", getAllAppointments);

export default router;
