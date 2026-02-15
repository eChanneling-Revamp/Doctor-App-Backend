import { Request, Response } from "express";
<<<<<<< Updated upstream
import { prisma } from "../config/prisma";
import { generateSlotsForSchedule } from "../services/slot.service";
=======
import prisma from "../config/prisma";
import { generateSlotsForSchedule } from "../services/slot.services";
>>>>>>> Stashed changes

// -------------------- Create Schedule --------------------
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { doctorId, location, workingDays, startTime, endTime } = req.body;

    if (!doctorId || !location || !workingDays || !startTime || !endTime) {
      return res.status(400).json({
        message: "Missing required schedule fields",
      });
    }

    // doctorId is string in Prisma schema
    const schedule = await prisma.schedule.create({
      data: {
        doctorId,
        location,
        workingDays,
        startTime,
        endTime,
<<<<<<< Updated upstream
      },
    });

    // auto-generate the next 7 days slots
=======
        date: new Date(),
      },
    });

    // Generate slots
>>>>>>> Stashed changes
    await generateSlotsForSchedule(schedule.id);

    res.status(201).json({
      message: "Schedule created successfully",
      schedule,
    });
  } catch (err: any) {
    console.error("Create Schedule Error:", err);
    res.status(500).json({ error: "Failed to create schedule" });
  }
};

// -------------------- Update Schedule --------------------
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.id);
    if (isNaN(scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }

    const { workingDays, startTime, endTime, location } = req.body;

    const schedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        ...(workingDays && { workingDays }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(location && { location }),
      },
    });

    res.json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (err: any) {
    console.error("Update Schedule Error:", err);
    res.status(500).json({ error: "Failed to update schedule" });
  }
};

// -------------------- Get Doctor Schedules --------------------
export const getDoctorSchedules = async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.doctorId; // string matches Prisma schema

    const schedules = await prisma.schedule.findMany({
      where: { doctorId },
      include: {
        slots: true,
      },
    });

    res.json(schedules);
  } catch (err: any) {
    console.error("Get Doctor Schedules Error:", err);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
};

// -------------------- Get Schedule By ID --------------------
export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.id);
    if (isNaN(scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { slots: true },
    });

    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    res.json(schedule);
  } catch (err: any) {
    console.error("Get Schedule By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
};

<<<<<<< Updated upstream
// -------------------- Regenerate Slots for next 7 days --------------------
export const regenerateSlots = async (req: Request, res: Response) => {
=======
// -------------------- Book Slot --------------------
export const bookSlot = async (req: Request, res: Response) => {
>>>>>>> Stashed changes
  try {
    const slotId = Number(req.params.slotId);
    if (isNaN(slotId)) {
      return res.status(400).json({ message: "Invalid slot ID" });
    }

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ message: "Slot already booked" });

    const booked = await prisma.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    res.json(booked);
  } catch (err: any) {
    console.error("Book Slot Error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};
<<<<<<< Updated upstream
=======

// -------------------- Regenerate Slots --------------------
export const regenerateSlots = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.id);
    if (isNaN(scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }

    // Delete slot appointments first
    await prisma.slotAppointment.deleteMany({
      where: { slot: { scheduleId } },
    });

    // Delete slots
    await prisma.slot.deleteMany({
      where: { scheduleId },
    });

    // Generate new slots
    await generateSlotsForSchedule(scheduleId);

    res.json({ message: "Slots regenerated successfully" });
  } catch (err: any) {
    console.error("Regenerate Slots Error:", err);
    res.status(500).json({ error: "Failed to regenerate slots" });
  }
};
>>>>>>> Stashed changes
