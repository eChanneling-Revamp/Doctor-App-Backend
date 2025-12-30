import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
  toggleBiometric
} from "../controllers/profile.controller";

const router = Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/biometric", authMiddleware, toggleBiometric);

export default router;
