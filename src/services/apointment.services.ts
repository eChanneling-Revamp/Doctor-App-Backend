import prisma from "../config/prisma";
import ApiError from "../utils/ApiError";

export interface BookAppointmentData {
  slotId: number;
  patientName: string;
  type: string;
  doctorId: number;
  patientId: number;
}

export const bookAppointmentService = async (data: BookAppointmentData) => {
  const { slotId, patientName, type, doctorId, patientId } = data;

  // 1️⃣ Validate slot exists
  const slot = await prisma.slot.findUnique({ where: { id: slotId } });

  if (!slot) throw new ApiError(404, "Slot not found");
  if (slot.isBooked) throw new ApiError(400, "Slot already booked");

  // 2️⃣ Explicitly type tx as Prisma transaction client
  const result = await prisma.$transaction(async (tx: typeof prisma) => {
    const slotAppointment = await tx.slotAppointment.create({
      data: { slotId, patientName, type },
    });

    const appointment = await tx.appointment.create({
      data: {
        doctorId,
        patientId,
        sessionId: null,
      },
    });

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
