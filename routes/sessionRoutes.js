import express from "express";
import {
  createSession,
  getSessionsByDoctor,
  transferSession,
  deleteSession,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", createSession);
router.get("/:doctorId", getSessionsByDoctor);
router.put("/:sessionId/transfer", transferSession);
router.delete("/:sessionId", deleteSession);

export default router;
