import { Router } from "express";
import { bookAppointment } from "../controllers/appointment.controller";

const router = Router();

// Book a slot appointment
router.post("/book", bookAppointment);

// The following routes are commented out because services are not fully implemented yet
// router.get("/patient/:patientName", getAppointmentsByPatient);
// router.patch("/:appointmentId/status", updateAppointmentStatus);
// router.get("/", getAllAppointments);

export default router;
