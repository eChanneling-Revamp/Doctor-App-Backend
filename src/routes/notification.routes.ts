import { Router } from "express";
import { getNotifications, markAsRead, createNotificationHandler } from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Protect all routes
router.use(authMiddleware);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.post("/", createNotificationHandler); // Expose creation for testing/admin

export default router;
