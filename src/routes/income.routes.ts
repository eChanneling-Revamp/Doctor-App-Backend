import { Router } from "express";
import {
  getIncomeSummary,
  getIncomeTrends,
  getTransactions
} from "../controllers/income.controller";

const router = Router();

router.get("/summary", getIncomeSummary);
router.get("/trends", getIncomeTrends);
router.get("/transactions", getTransactions);

export default router;
