import prisma from "../config/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

interface BookAppointmentData {
  scheduleId: number;  // ID of the schedule
  date: string;        // Date of the slot (YYYY-MM-DD)
  time: string;        // Time of the slot (e.g., "10:00")
  patientName: string;
  type: string;        // Teleconsult / In-Person
}

export const bookAppointment = async (data: BookAppointmentData) => {
  const { scheduleId, date, time, patientName, type } = data;

  // 1️⃣ Check if the schedule exists
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    throw new ApiError(404, "Schedule not found");
  }

  // 2️⃣ Check if a slot already exists for this schedule, date & time
  let slot = await prisma.slot.findFirst({
    where: {
      scheduleId,
      date: new Date(date),
      time,
    },
    include: { appointment: true },
  });

  // 3️⃣ Create slot if it doesn't exist
  if (!slot) {
    slot = await prisma.slot.create({
      data: {
        scheduleId,
        date: new Date(date),
        time,
      },
      include: { appointment: true },
    });
  }

  // 4️⃣ Check if slot is already booked
  if (slot.isBooked || slot.appointment) {
    throw new ApiError(400, "Slot already booked");
  }

  // 5️⃣ Create the appointment
  const appointment = await prisma.slotAppointment.create({
    data: {
      slotId: slot.id,
      patientName,
      type,
      status: "Pending",
    },
  });

  // 6️⃣ Mark slot as booked
  await prisma.slot.update({
    where: { id: slot.id },
    data: { isBooked: true },
  });

  return new ApiResponse(201, appointment, "Appointment booked successfully");
};
