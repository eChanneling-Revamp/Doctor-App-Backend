import { Router } from "express";
import {
  createSession,
  listSessions,
  updateSession,
  deleteSession,
} from "../controllers/session.controller";

const router = Router();

// CREATE SESSION
router.post("/", createSession);

// LIST ALL SESSIONS (Optionally filter by doctorId)
router.get("/", listSessions);

// UPDATE SESSION
router.put("/:id", updateSession);

// DELETE SESSION
router.delete("/:id", deleteSession);

export default router;
