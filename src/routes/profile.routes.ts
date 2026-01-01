import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
  toggleBiometric,
  uploadImage
} from "../controllers/profile.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/biometric", authMiddleware, toggleBiometric);
router.post("/upload-image", authMiddleware, upload.single("image"), uploadImage);

export default router;
