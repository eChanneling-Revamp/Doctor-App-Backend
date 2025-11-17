// src/utils/slotGenerator.ts
import { prisma } from "../config/prisma";
import { WorkingDays } from "../modules/schedule/schedule.dto";
import { addMinutes, format, parse, isBefore, addDays, startOfDay } from "date-fns";

/**
 * Helpers to map workingDays object to day index
 * date-fns: Sunday = 0, Monday = 1 ... Saturday = 6
 */
const weekdayMap = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function isWorkingDay(date: Date, workingDays: WorkingDays) {
  const dow = date.getDay(); // 0..6
  // map
  for (const [k, v] of Object.entries(weekdayMap)) {
    if (v === dow) {
      return Boolean((workingDays as any)[k]);
    }
  }
  return false;
}

/**
 * Parse time "HH:mm" into Date object with same day as baseDate
 */
function parseTimeToDate(baseDate: Date, timeStr: string) {
  // timeStr = "09:30" or "09:00"
  const [hh, mm] = timeStr.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hh, mm, 0, 0);
  return d;
}

/**
 * Generates slots for a schedule between startDate..endDate inclusive
 * slotDuration in minutes
 */
export async function generateSlotsForSchedule({
  scheduleId,
  startDate,
  endDate,
  slotDurationMins = 30,
}: {
  scheduleId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  slotDurationMins?: number;
}) {
  // load schedule to read workingDays/startTime/endTime
  const sched = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  if (!sched) throw new Error("Schedule not found");

  const workingDays: WorkingDays = sched.workingDays as any;
  const startTime = sched.startTime; // "09:00"
  const endTime = sched.endTime;     // "17:00"

  // iterate dates
  let curr = startOfDay(new Date(startDate));
  const last = startOfDay(new Date(endDate));

  const createOps: { scheduleId: number; date: Date; time: string }[] = [];

  while (curr <= last) {
    if (isWorkingDay(curr, workingDays)) {
      // create slots for this date
      const startDT = parseTimeToDate(curr, startTime);
      const endDT = parseTimeToDate(curr, endTime);

      let pointer = new Date(startDT);

      while (pointer < endDT) {
        const timeStr = format(pointer, "HH:mm"); // store as "14:30"
        createOps.push({
          scheduleId,
          date: new Date(pointer.getFullYear(), pointer.getMonth(), pointer.getDate()),
          time: timeStr,
        });
        pointer = addMinutes(pointer, slotDurationMins);
      }
    }

    curr = addDays(curr, 1);
  }

  // bulk create but avoid duplicates: check existing slots for same date+time
  const created: any[] = [];

  for (const op of createOps) {
    const exists = await prisma.slot.findFirst({
      where: {
        scheduleId: op.scheduleId,
        date: op.date,
        time: op.time,
      },
    });

    if (!exists) {
      const s = await prisma.slot.create({
        data: {
          scheduleId: op.scheduleId,
          date: op.date,
          time: op.time,
        },
      });
      created.push(s);
    }
  }

  return created;
}
