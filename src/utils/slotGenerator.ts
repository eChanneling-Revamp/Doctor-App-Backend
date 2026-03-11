// src/utils/slotGenerator.ts
import  prisma  from "../config/prisma";
import { addMinutes, format, parse, isBefore, addDays, startOfDay } from "date-fns";

/**
 * Helpers to map workingDays object to day index
 * date-fns: Sunday = 0, Monday = 1 ... Saturday = 6
 */
export const generateSlots = (start: string, end: string, interval = 30) => {

  const slots: string[] = [];

  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {

    const time =
      `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    slots.push(time);

    minute += interval;

    if (minute >= 60) {
      hour++;
      minute = minute % 60;
    }
  }

  return slots;
};