import express from "express";
import {
  createAppointment,
  getAppointments,
  bookAppointment,
  getCurrentAppointments,
  getUpcomingAppointments,
  getPastAppointments
} from "../controllers/appointment.controller";

const router = express.Router();

router.post("/create", createAppointment);

router.get("/", getAppointments);

router.post("/book", bookAppointment);

router.get("/current", getCurrentAppointments);

router.get("/upcoming", getUpcomingAppointments);

router.get("/past", getPastAppointments);

export default router;