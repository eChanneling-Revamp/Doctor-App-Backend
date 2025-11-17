import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ---------------- Get Slots By Schedule ----------------
export const getSlotsBySchedule = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.scheduleId);

    const slots = await prisma.slot.findMany({
      where: { scheduleId },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    res.json(slots);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Get Daily Slots ----------------
export const getSlotsByDate = async (req: Request, res: Response) => {
  try {
    const { scheduleId, date } = req.query;

    const parsedDate = new Date(date as string);

    const slots = await prisma.slot.findMany({
      where: {
        scheduleId: Number(scheduleId),
        date: parsedDate,
      },
      orderBy: { time: "asc" },
    });

    res.json(slots);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Book a Slot ----------------
export const bookSlot = async (req: Request, res: Response) => {
  try {
    const slotId = Number(req.params.slotId);
    const { patientName, type } = req.body;

    const slot = await prisma.slot.update({
      where: { id: slotId },
      data: {
        isBooked: true,
        appointment: {
          create: {
            patientName,
            type,
            status: "Confirmed",
          },
        },
      },
    });

    res.json({ message: "Slot booked", slot });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
