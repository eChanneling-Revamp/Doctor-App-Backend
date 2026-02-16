import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  logout
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

router.post("/logout", authMiddleware,logout);
export default router;

