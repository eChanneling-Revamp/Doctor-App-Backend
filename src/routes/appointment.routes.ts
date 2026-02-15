import { Router } from "express";
import {
  bookAppointment,
  getAppointmentsByPatient,
  updateAppointmentStatus,
  getAllAppointments,
} from "../controllers/appointment.controller";

const router = Router();

<<<<<<< Updated upstream
router.post("/book", bookAppointment);
router.get("/patient/:patientId", getAppointmentsByPatient);
router.patch("/:appointmentId/status", updateAppointmentStatus);
router.get("/", getAllAppointments);
=======
// Book appointment
router.post("/book", bookAppointment);
>>>>>>> Stashed changes

export default router;
