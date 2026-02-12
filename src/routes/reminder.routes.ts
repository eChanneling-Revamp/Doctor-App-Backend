import { Router } from "express";
import { createReminder, getReminders, updateReminder, deleteReminder } from "../controllers/reminder.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Protect all routes
router.use(authMiddleware);

router.post("/", createReminder);
router.get("/", getReminders);
router.patch("/:id", updateReminder);
router.delete("/:id", deleteReminder);

export default router;
