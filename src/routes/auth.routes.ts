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
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema
} from "../validations/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOTPSchema), verifyOTP);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.post("/logout", authMiddleware, logout);

export default router;
