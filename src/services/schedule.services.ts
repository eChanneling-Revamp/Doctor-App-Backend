// src/modules/schedule/schedule.service.ts
import  prisma  from "../config/prisma";
import { CreateScheduleDTO } from "../module/schedule/schedule.dto";
import { generateSlotsForSchedule } from "../utils/slotGenerator";

class ScheduleService {
  async createSchedule(dto: CreateScheduleDTO) {
    const { doctorId, location, workingDays, startTime, endTime } = dto;
    const created = await prisma.schedule.create({
      data: {
        doctorId,
        location,
        workingDays: workingDays as any,
        startTime,
        endTime,
      },
    });

    // optional: auto-generate slots
    if (dto.generateSlots && dto.startDate && dto.endDate) {
      const generated = await generateSlotsForSchedule({
        scheduleId: created.id,
        startDate: dto.startDate,
        endDate: dto.endDate,
        slotDurationMins: dto.slotDurationMins ?? 30,
      });
      return { schedule: created, generatedSlotsCount: generated.length };
    }

    return { schedule: created };
  }

  async getScheduleForDoctor(doctorId: number) {
    return prisma.schedule.findMany({
      where: { doctorId },
      include: {
        slots: { orderBy: { date: "asc" } },
      },
    });
  }

  async updateSchedule(id: number, data: Partial<CreateScheduleDTO>) {
    return prisma.schedule.update({
      where: { id },
      data: {
        location: data.location,
        workingDays: data.workingDays as any,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
  }
}

export default new ScheduleService();