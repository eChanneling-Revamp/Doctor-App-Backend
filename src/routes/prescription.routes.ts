import express from "express";
import {
  createPrescription,
  getPrescriptions,
} from "../controllers/prescription.controller";

const router = express.Router();

router.get("/", getPrescriptions);
router.post("/", createPrescription);

export default router;