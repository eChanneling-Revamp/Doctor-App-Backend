import { prisma } from "../config/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

/* ============================================================
   BOOK APPOINTMENT (SlotAppointment)
   ============================================================ */
export const bookAppointment = async (data: {
  slotId: number;
  patientName: string;
  type: string;
}) => {
  const { slotId, patientName, type } = data;

  // 1. Check slot exists
  const slot = await prisma.slot.findUnique({
    where: { id: slotId },
    include: { appointment: true },
  });

  if (!slot) throw new ApiError(404, "Slot not found");

  // 2. Check if already booked
  if (slot.isBooked || slot.appointment)
    throw new ApiError(400, "Slot already booked");

  // 3. Create appointment in SlotAppointment table
  const appointment = await prisma.slotAppointment.create({
    data: {
      slotId,
      patientName,
      type,
      status: "Pending",
    },
  });

  // 4. Mark slot as booked
  await prisma.slot.update({
    where: { id: slotId },
    data: { isBooked: true },
  });

  return new ApiResponse(201, appointment, "Appointment booked successfully");
};

/* ============================================================
   GET ALL APPOINTMENTS FOR A PATIENT (by patientName)
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
   GET ALL SLOT APPOINTMENTS
   ============================================================ */
export const getAllAppointments = async () => {
  const list = await prisma.slotAppointment.findMany({
    include: { slot: true },
  });

  return new ApiResponse(200, list);
};
