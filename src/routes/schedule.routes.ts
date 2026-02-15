import { Router } from "express";
import {
  createSchedule,
  updateSchedule,
  getDoctorSchedules,
  getScheduleById,
  regenerateSlots,
  bookSlot
} from "../controllers/schedule.controller";

const router = Router();

router.post("/", createSchedule);
router.put("/:id", updateSchedule);
router.get("/doctor/:doctorId", getDoctorSchedules);
router.get("/:id", getScheduleById);
router.post("/:id/regenerate", regenerateSlots);
router.post("/:slotId/book", bookSlot);

export default router;
