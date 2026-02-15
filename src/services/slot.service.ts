import { prisma } from "../config/prisma";


const DAY_MAP: Record<string, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 0,
};

// Convert "09:00 AM" → minutes
function timeToMinutes(t: string): number {
  const [_, hh, mm, ampm] = t.match(/(\d+):(\d+) (\w+)/)!;
  let hours = Number(hh);
  const minutes = Number(mm);

  if (ampm.toLowerCase() === "pm" && hours !== 12) hours += 12;
  if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export const generateSlotsForSchedule = async (scheduleId: number) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) return;

  const workingDays = schedule.workingDays as any;
  const start = timeToMinutes(schedule.startTime);
  const end = timeToMinutes(schedule.endTime);
  const interval = 30; // 30 mins slots

  const today = new Date();
  const next7 = [...Array(7).keys()].map((i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  for (const date of next7) {
    const day = date.getDay(); // 0–6

    const isWorkingDay = Object.entries(workingDays).some(
      ([key, val]) => val && DAY_MAP[key] === day
    );

    if (!isWorkingDay) continue;

    for (let t = start; t < end; t += interval) {
      const hours = Math.floor(t / 60);
      const mins = t % 60;

      const timeString = `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;

      await prisma.slot.create({
        data: {
          scheduleId,
          date,
          time: timeString,
        },
      });
    }
  }
};
