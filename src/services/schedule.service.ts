import prisma from "../config/prisma";



// UPDATE SCHEDULE SERVICE

export const updateScheduleService = async (data: any) => {

  const { doctorId, location, workingDays, startTime, endTime } = data;

  const existingSchedule = await prisma.schedule.findFirst({
    where: { doctorId }
  });

  let schedule;

  if (existingSchedule) {

    schedule = await prisma.schedule.update({
      where: { id: existingSchedule.id },
      data: {
        location,
        workingDays,
        startTime,
        endTime
      }
    });

  } else {

    schedule = await prisma.schedule.create({
      data: {
        doctorId,
        location,
        workingDays,
        startTime,
        endTime
      }
    });

  }

  return schedule;

};


// WEEK VIEW SERVICE

export const getWeekScheduleService = async (doctorId: string) => {

  const slots = await prisma.slot.findMany({
    where: {
      schedule: {
        doctorId
      }
    },
    include: {
      appointment: true
    }
  });

  const totalSlots = slots.length;

  const booked = slots.filter((s: { isBooked: boolean }) => s.isBooked).length;

  const available = totalSlots - booked;

  return {
    totalSlots,
    booked,
    available,
    slots
  };

};



// DAILY VIEW SERVICE

export const getDailyScheduleService = async (
  doctorId: string,
  date: string
) => {

  const slots = await prisma.slot.findMany({
    where: {
      schedule: {
        doctorId
      },
      date: new Date(date)
    },
    include: {
      appointment: true
    }
  });

  return slots;

};

export const createScheduleService = async (data: any) => {

  const { doctorId, location, workingDays, startTime, endTime } = data;

  const schedule = await prisma.schedule.create({
    data: {
      doctorId,
      location,
      workingDays,
      startTime,
      endTime
    }
  });

  return schedule;
};

export const generateSlotsService = async (scheduleId: number) => {

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId }
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  const slots: any[] = [];

  let start = new Date(`1970-01-01T${schedule.startTime}:00`);
  let end = new Date(`1970-01-01T${schedule.endTime}:00`);

  while (start < end) {

    const time = start.toTimeString().slice(0,5);

    slots.push({
      scheduleId,
      date: new Date(),
      time
    });

    start.setMinutes(start.getMinutes() + 30);

  }

  await prisma.slot.createMany({
    data: slots
  });

  return slots;
};