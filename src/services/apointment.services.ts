import  prisma from "../config/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

/* ============================================================
   BOOK SLOT APPOINTMENT
   ============================================================ */
export const bookAppointment = async (data: {
  slotId: number;
  patientName: string;
  type: string;
}) => {
  const { slotId, patientName, type } = data;

  // Check slot exists
  const slot = await prisma.slot.findUnique({
  where: { id: slotId },
  include: { appointment: true }, // `appointment` is correct: SlotAppointment?
});


  if (!slot) throw new ApiError(404, "Slot not found");

  if (slot.isBooked || slot.appointment)
    throw new ApiError(400, "Slot already booked");

  const appointment = await prisma.slotAppointment.create({
    data: {
      slotId,
      patientName,
      type,
      status: "Pending",
    },
  });

  await prisma.slot.update({
    where: { id: slotId },
    data: { isBooked: true },
  });

  return new ApiResponse(201, appointment, "Appointment booked successfully");
};

/* ============================================================
   GET APPOINTMENTS BY PATIENT NAME
   ============================================================ */
export const getAppointmentsByPatient = async (patientName: string) => {
  const list = await prisma.slotAppointment.findMany({
    where: { patientName },
    include: { slot: true },
  });

  return new ApiResponse(200, list);
};

/* ============================================================
   UPDATE STATUS
   ============================================================ */
export const updateStatus = async (appointmentId: number, status: string) => {
  const updated = await prisma.slotAppointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  return new ApiResponse(200, updated, "Status updated");
};

/* ============================================================
   GET ALL APPOINTMENTS
   ============================================================ */
export const getAllAppointments = async () => {
  const list = await prisma.slotAppointment.findMany({
    include: { slot: true },
  });

  return new ApiResponse(200, list);
};
