import prisma from "../config/prisma";
import ApiError from "../utils/ApiError";

interface BookAppointmentData {
  slotId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  type: string;
  doctorId: string;          // ✅ string (matches schema)
  patientId: number;
  sessionId: string;         // ✅ required
  consultationFee: number;   // ✅ required
  totalAmount: number;       // ✅ required
}

export const bookAppointmentService = async (
  data: BookAppointmentData
) => {
  const {
    slotId,
    patientName,
    patientEmail,
    patientPhone,
    type,
    doctorId,
    patientId,
    sessionId,
    consultationFee,
    totalAmount,
  } = data;

  // 1️⃣ Check slot
  const slot = await prisma.slot.findUnique({
    where: { id: slotId },
  });

  if (!slot) throw new ApiError(404, "Slot not found");
  if (slot.isBooked) throw new ApiError(400, "Slot already booked");

  // 2️⃣ Transaction
  const result = await prisma.$transaction(async (tx) => {

    // Create SlotAppointment
    const slotAppointment = await tx.slotAppointment.create({
      data: {
        slotId,
        patientName,
        type,
      },
    });

    // Create REAL Appointment
    const appointment = await tx.appointment.create({
      data: {
        appointmentNumber: `APT-${Date.now()}`,
        patientName,
        patientEmail,
        patientPhone,
        doctorId,              // already string
        patientId,
        sessionId,
        consultationFee,
        totalAmount,
        // status & paymentStatus will use default values
      },
    });

    // Mark slot as booked
    await tx.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return { slotAppointment, appointment };
  });

  return {
    message: "Slot booked successfully",
    ...result,
  };
};
