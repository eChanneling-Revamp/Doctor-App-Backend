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

export const bookSlot = async (req: Request, res: Response) => {
  try {
    const {
      slotId,
      sessionId,          // ✅ MUST come from frontend
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      patientId,
      consultationFee,
      totalAmount,
      type,
    } = req.body;

    // 1️⃣ Check slot
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot)
      return res.status(404).json({ error: "Slot not found" });

    if (slot.isBooked)
      return res.status(400).json({ error: "Slot already booked" });

    // 2️⃣ Create SlotAppointment
    const slotAppointment = await prisma.slotAppointment.create({
      data: {
        slotId,
        patientName,
        type,
      },
    });

    // 3️⃣ Create REAL Appointment
    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber: `APT-${Date.now()}`,
        patientName,
        patientEmail,
        patientPhone,
        doctorId,
        patientId: Number(patientId),
        sessionId, // ✅ required
        consultationFee,
        totalAmount,
        // ❗ do NOT set status (default CONFIRMED will apply)
        // ❗ do NOT set paymentStatus (default PENDING will apply)
      },
    });

    // 4️⃣ Mark slot booked
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