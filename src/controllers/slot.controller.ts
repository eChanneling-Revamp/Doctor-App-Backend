import { Request, Response } from "express";
import  prisma  from "../config/prisma";

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



/*
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
*/
/*
export const bookSlot = async (req: Request, res: Response) => {
  try {
    const slotId = Number(req.params.slotId);
    const { patientName, patientEmail, doctorId, type } = req.body;

    // 1. Check slot exists
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { schedule: true }
    });

    if (!slot) return res.status(404).json({ error: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ error: "Slot already booked" });

    // 2. Create or find patient
    const patient = await prisma.patient.upsert({
      where: { email: patientEmail || "" },
      create: {
        name: patientName,
        email: patientEmail
      },
      update: {}
    });

    // 3. Create real Appointment
    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId: patient.id,
        sessionId: null, // or schedule.sessionId if linked
      }
    });

    // 4. Update slot + add SlotAppointment
    await prisma.slot.update({
      where: { id: slotId },
      data: {
        isBooked: true,
        appointment: {
          create: {
           
            patientName,
            type
          }
        }
      }
    });

    res.json({
      message: "Slot successfully booked",
      appointmentId: appointment.id, // IMPORTANT
      patientId: patient.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to book slot" });
  }
};
*/
export const bookSlot = async (req: Request, res: Response) => {
  try {
    const { slotId, patientName, type, doctorId, patientId } = req.body;

    // 1. Validate slot
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { schedule: true },
    });

    if (!slot) return res.status(404).json({ error: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ error: "Slot already booked" });

    // 2. Create SlotAppointment (existing logic)
    const slotAppointment = await prisma.slotAppointment.create({
      data: {
        slotId,
        patientName,
        type,
      },
    });

    // 3. Automatically create REAL Appointment entry
    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        sessionId: null, // OR slot.schedule.sessionId if sessions are linked
      },
    });

    // 4. Mark slot as booked
    await prisma.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    res.json({
      message: "Slot booked successfully",
      slotAppointment,
      appointment,
    });
  } catch (error) {
    console.error("Book Slot Error:", error);
    res.status(500).json({ error: "Failed to book slot" });
  }
};
