import prisma from "../config/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

/*interface BookAppointmentData {
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
*/
interface BookAppointmentData {
  slotId: number;
  patientName: string;
  type: string;
  doctorId: number;
  patientId: number;
}

export const bookAppointmentService = async (data: BookAppointmentData) => {
  const { slotId, patientName, type, doctorId, patientId } = data;

  // 1️⃣ Check if slot exists
  const slot = await prisma.slot.findUnique({
    where: { id: slotId }
  });

  if (!slot) throw new ApiError(404, "Slot not found");
  if (slot.isBooked) throw new ApiError(400, "Slot already booked");

  // 2️⃣ Transaction: create slotAppointment, appointment, update slot
  const result = await prisma.$transaction(async (tx) => {

    // Create SlotAppointment
    const slotAppointment = await tx.slotAppointment.create({
      data: { slotId, patientName, type }
    });

    // Create Appointment (only fields your DB supports)
    const appointment = await tx.appointment.create({
      data: {
        doctorId,
        patientId
      }
    });

    // Mark slot booked
    await tx.slot.update({
      where: { id: slotId },
      data: { isBooked: true }
    });

    return { slotAppointment, appointment };
  });

  return {
    message: "Slot booked successfully",
    ...result
  };
};