import { Router } from "express";
import * as sessionCtrl from "../controllers/session.controller";


const router = Router();


router.post("/", sessionCtrl.createSession);
router.get("/", sessionCtrl.listSessions);
router.put("/:id", sessionCtrl.updateSession);
router.delete("/:id", sessionCtrl.deleteSession);

export default router;
