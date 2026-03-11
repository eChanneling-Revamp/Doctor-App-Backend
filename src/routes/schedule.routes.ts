import { Router } from "express";
import { createSchedule, generateSlots } from "../controllers/schedule.controller";

const router = Router();

router.post("/", createSchedule);
router.post("/:id/generate-slots", generateSlots);

export default router;