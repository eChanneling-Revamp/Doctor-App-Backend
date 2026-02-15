<<<<<<< Updated upstream:src/services/schedule.service.ts
// src/modules/schedule/schedule.service.ts
import { prisma } from "../config/prisma";
=======
import prisma from "../config/prisma";
>>>>>>> Stashed changes:src/services/schedule.services.ts
import { CreateScheduleDTO } from "../module/schedule/schedule.dto";
import { generateSlotsForSchedule } from "../utils/slotGenerator";

class ScheduleService {

  // ---------------- CREATE SCHEDULE ----------------
  async createSchedule(dto: CreateScheduleDTO) {

    const schedule = await prisma.schedule.create({
      data: {
<<<<<<< Updated upstream:src/services/schedule.service.ts
        doctorId,
        location,
        workingDays: workingDays as any,
        startTime,
        endTime,
      },
=======
        doctorId: dto.doctorId,
        location: dto.location,
        workingDays: dto.workingDays as any,
        startTime: dto.startTime,
        endTime: dto.endTime,
        date: new Date()
      }
>>>>>>> Stashed changes:src/services/schedule.services.ts
    });

    // Generate slots if requested
    if (dto.generateSlots && dto.startDate && dto.endDate) {

      const generated = await generateSlotsForSchedule({
        scheduleId: schedule.id,
        startDate: dto.startDate,
        endDate: dto.endDate,
        slotDurationMins: dto.slotDurationMins ?? 30
      });

      return {
        schedule,
        generatedSlotsCount: generated.length
      };
    }

    return { schedule };
  }

  // ---------------- GET DOCTOR SCHEDULE ----------------
  async getScheduleForDoctor(doctorId: number) {
    return prisma.schedule.findMany({
      where: { doctorId },
      include: {
        slots: {
          orderBy: { date: "asc" }
        }
      }
    });
  }

  // ---------------- UPDATE SCHEDULE ----------------
  async updateSchedule(id: number, data: Partial<CreateScheduleDTO>) {

    return prisma.schedule.update({
      where: { id },
      data: {
        ...(data.location !== undefined && { location: data.location }),
        ...(data.workingDays !== undefined && { workingDays: data.workingDays as any }),
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime })
      }
    });

  }

}

export default new ScheduleService();
