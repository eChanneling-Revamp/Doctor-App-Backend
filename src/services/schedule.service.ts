import prisma from "../config/prisma";
import { generateSlots } from "../utils/slotGenerator";

export const createScheduleService = async (data: any) => {

  return await prisma.schedule.create({
    data: {
      doctorId: data.doctorId,
      location: data.location,
      workingDays: data.workingDays,
      startTime: data.startTime,
      endTime: data.endTime
    }
  });

};
export const generateSlotsService = async (scheduleId: number) => {

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId }
  });

  if (!schedule) throw new Error("Schedule not found");

  const slots = generateSlots(schedule.startTime, schedule.endTime);

  return prisma.slot.createMany({
    data: slots.map((time) => ({
      scheduleId,
      time,
      date: new Date()
    }))
  });
};