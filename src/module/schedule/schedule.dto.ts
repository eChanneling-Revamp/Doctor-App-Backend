// src/modules/schedule/schedule.dto.ts
export type WorkingDays = {
  mon?: boolean;
  tue?: boolean;
  wed?: boolean;
  thu?: boolean;
  fri?: boolean;
  sat?: boolean;
  sun?: boolean;
};

export interface CreateScheduleDTO {
  doctorId: number;
  location: string;
  workingDays: WorkingDays;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  // optional: auto-generate params
  generateSlots?: boolean;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  slotDurationMins?: number; // e.g., 30
}
