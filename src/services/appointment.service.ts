import prisma from "../config/prisma";

export const createAppointmentService = async (data: any) => {

  const slot = await prisma.slot.findUnique({
    where: { id: data.slotId }
  });

  if (!slot || slot.isBooked) {
    throw new Error("Slot unavailable");
  }

  const appointment = await prisma.slotAppointment.create({
    data: {
      slotId: data.slotId,
      patientName: data.patientName,
      type: data.type
    }
  });

  await prisma.slot.update({
    where: { id: data.slotId },
    data: { isBooked: true }
  });

  return appointment;
};

export const getAppointmentsService = async () => {

  return prisma.slotAppointment.findMany({
    include: {
      slot: true
    }
  });
};