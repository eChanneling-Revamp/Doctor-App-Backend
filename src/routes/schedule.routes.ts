import express from "express";
import {
  createSchedule,
  generateSlots,
  updateSchedule,
  getWeekSchedule,
  getDailySchedule
} from "../controllers/schedule.controller";

const router = express.Router();

router.post("/create", createSchedule);

router.post("/generate-slots/:id", generateSlots);

router.put("/update", updateSchedule);

router.get("/week/:doctorId", getWeekSchedule);

router.get("/day", getDailySchedule);

export default router;