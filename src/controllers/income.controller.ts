/*import { PrismaClient, payments as PaymentModel } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


function getDateRange(filter: string) {
  const now = new Date();
  let start: Date;

  switch (filter) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "this_week":
      start = new Date(now.setDate(now.getDate() - 7));
      break;
    case "last_week":
      start = new Date(now.setDate(now.getDate() - 14));
      break;
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    default:
      start = new Date(0);
  }

  return start;
}

////////////////////////////////////////////////////
// SUMMARY CARDS
////////////////////////////////////////////////////
export const getIncomeSummary = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.query.doctorId);
    const filter = String(req.query.filter || "this_month");
    const startDate = getDateRange(filter);

    const payments = await prisma.payments.findMany({
      where: { doctorId, createdAt: { gte: startDate }, status: "Paid" },
    });

    const totalIncome = payments.reduce((sum: number, p: PaymentModel) => sum + p.amount, 0);

    const normalIncome = payments
      .filter((p: PaymentModel) => p.sessionType === "Normal")
      .reduce((s: number, p: PaymentModel) => s + p.amount, 0);

    const teleIncome = payments
      .filter((p: PaymentModel) => p.sessionType === "Teleconsultation")
      .reduce((s: number, p: PaymentModel) => s + p.amount, 0);

    const avgPerSession = payments.length > 0 ? totalIncome / payments.length : 0;

    res.json({ totalIncome, normalIncome, teleIncome, avgPerSession, sessions: payments.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch income summary" });
  }
};

////////////////////////////////////////////////////
// INCOME TRENDS (GRAPH)
////////////////////////////////////////////////////
export const getIncomeTrends = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.query.doctorId);

    const payments = await prisma.payments.findMany({
      where: { doctorId, status: "Paid" },
      orderBy: { createdAt: "asc" },
    });

    const trends = payments.map((p: PaymentModel) => ({
      date: p.createdAt,
      amount: p.amount,
      type: p.sessionType,
    }));

    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
};

////////////////////////////////////////////////////
// TRANSACTIONS LIST
////////////////////////////////////////////////////
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.query.doctorId);

    const transactions = await prisma.payments.findMany({
      where: { doctorId },
      include: {
        appointment: {
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
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};*/
