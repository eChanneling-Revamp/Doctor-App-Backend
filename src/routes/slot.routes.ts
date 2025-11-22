import { Router } from "express";
import {
  getSlotsBySchedule,
  getSlotsByDate,
  bookSlot,
} from "../controllers/slot.controller";

const router = Router();

router.get("/schedule/:scheduleId", getSlotsBySchedule);
router.get("/date", getSlotsByDate);
router.post("/:slotId/book", bookSlot);

export default router;