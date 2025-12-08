import { Request, Response } from "express";
import  prisma  from "../config/prisma";
import { generateSlotsForSchedule } from "../services/slot.services";

// -------------------- Create Schedule --------------------
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { doctorId, location, workingDays, startTime, endTime } = req.body;

    const schedule = await prisma.schedule.create({
  data: {
    location,
    workingDays,
    startTime,
    endTime,
    date: new Date(),
    doctor: {
      connect: { id: doctorId }, // 👈 Prisma expects this if not unchecked
    },
  },
});


    // auto-generate the next 7 days slots
    await generateSlotsForSchedule(schedule.id);

    res.json({ message: "Schedule created", schedule });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Update Schedule --------------------
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { workingDays, startTime, endTime, location } = req.body;

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        workingDays,
        startTime,
        endTime,
        location,
      },
    });

    res.json({ message: "Schedule updated", schedule });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Get Doctor Schedules --------------------
export const getDoctorSchedules = async (req: Request, res: Response) => {
  try {
    const doctorId = Number(req.params.doctorId);

    const schedules = await prisma.schedule.findMany({
      where: { doctorId },
      include: { slots: true },
    });

    res.json(schedules);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Get Schedule By ID --------------------
export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.id);

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        slots: true,
      },
    });

    res.json(schedule);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Regenerate Slots for next 7 days --------------------



/*export const regenerateSlots = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.id);

    await prisma.slot.deleteMany({ where: { scheduleId } });

    await generateSlotsForSchedule(scheduleId);

    res.json({ message: "Slots regenerated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
*/

export const regenerateSlots = async (req: Request, res: Response) => {
  try {
    const scheduleId = Number(req.params.id);

    //  Delete appointments under this schedule
    await prisma.slotAppointment.deleteMany({
      where: {
        slot: {
          scheduleId: scheduleId,
        },
      },
    });

    //  Delete slots
    await prisma.slot.deleteMany({
      where: { scheduleId },
    });

    //  Generate fresh slots
    await generateSlotsForSchedule(scheduleId);

    res.json({ message: "Slots regenerated successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
