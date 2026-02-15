import { Request, Response } from "express";
<<<<<<< Updated upstream
import { prisma } from "../config/prisma";
=======
import prisma from "../config/prisma";
>>>>>>> Stashed changes

// ---------------- GET Slots By Schedule ----------------
export const getSlotsBySchedule = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.scheduleId);

    if (isNaN(scheduleId)) {
      return res.status(400).json({ message: "Invalid scheduleId" });
    }

    const slots = await prisma.slot.findMany({
      where: { scheduleId },
      orderBy: { date: "asc" },
    });

    res.json(slots);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch slots" });
  }
};

// ---------------- GET Slots By Date ----------------
export const getSlotsByDate = async (req: Request, res: Response) => {
  try {
    const dateParam = req.params.date;

    if (!dateParam) {
      return res.status(400).json({ message: "Date is required" });
    }

    const date = new Date(dateParam);

    const slots = await prisma.slot.findMany({
      where: {
        date: date,
      },
      orderBy: { startTime: "asc" },
    });

    res.json(slots);
<<<<<<< Updated upstream
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
=======
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch slots by date" });
  }
};

// ---------------- BOOK SLOT ----------------
export const bookSlot = async (req: Request, res: Response) => {
  try {
    const slotId = Number(req.params.slotId); // slot.id is number
    if (isNaN(slotId)) return res.status(400).json({ message: "Invalid slot ID" });

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ message: "Slot already booked" });

    const updatedSlot = await prisma.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    res.json({ message: "Slot booked successfully", slot: updatedSlot });
  } catch (err: any) {
    console.error("Book Slot Error:", err);
    res.status(500).json({ message: "Failed to book slot" });
  }
};

  
>>>>>>> Stashed changes
