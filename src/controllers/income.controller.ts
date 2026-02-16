
import { PrismaClient, PaymentStatus } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// ----------------- Helper: Get Start Date from Filter -----------------
function getDateRange(filter: string) {
  const now = new Date();
  let start: Date;

  switch (filter) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "this_week":
      start = new Date();
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case "last_week":
      start = new Date();
      start.setDate(now.getDate() - 14);
      start.setHours(0, 0, 0, 0);
      break;
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    default:
      start = new Date(0); // all time
  }

  return start;
}

// ----------------- SUMMARY CARDS -----------------
export const getIncomeSummary = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.query.doctorId); // Prisma expects string
    const filter = String(req.query.filter || "this_month");
    const startDate = getDateRange(filter);

    const payments = await prisma.payments.findMany({
      where: {
        doctorId,
        createdAt: { gte: startDate },
        status: PaymentStatus.COMPLETED, // ✅ use COMPLETED
      },
    });

    const totalIncome = payments.reduce((sum: number, p) => sum + Number(p.amount), 0);

    const normalIncome = payments
      .filter((p) => p.sessionType === "Normal")
      .reduce((sum: number, p) => sum + Number(p.amount), 0);

    const teleIncome = payments
      .filter((p) => p.sessionType === "Teleconsultation")
      .reduce((sum: number, p) => sum + Number(p.amount), 0);

    const avgPerSession = payments.length > 0 ? totalIncome / payments.length : 0;

    res.json({
      totalIncome,
      normalIncome,
      teleIncome,
      avgPerSession,
      sessions: payments.length,
    });
  } catch (error) {
    console.error("Income Summary Error:", error);
    res.status(500).json({ error: "Failed to fetch income summary" });
  }
};

// ----------------- INCOME TRENDS -----------------
export const getIncomeTrends = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.query.doctorId);

    const payments = await prisma.payments.findMany({
      where: {
        doctorId,
        status: PaymentStatus.COMPLETED,
      },
      orderBy: { createdAt: "asc" },
    });

    const trends = payments.map((p) => ({
      date: p.createdAt,
      amount: Number(p.amount),
      type: p.sessionType,
    }));

    res.json(trends);
  } catch (error) {
    console.error("Income Trends Error:", error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
};

// ----------------- TRANSACTIONS LIST -----------------
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.query.doctorId);

    const transactions = await prisma.payments.findMany({
      where: { doctorId },
      include: {
        appointments: { // ✅ use correct relation name from schema
          include: {
            patient: true,
            session: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    console.error("Transactions Error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
