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
  startTime: string;
  endTime: string;

  generateSlots?: boolean;
<<<<<<< Updated upstream
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  slotDurationMins?: number; // e.g., 30
=======
  startDate?: string;
  endDate?: string;
  slotDurationMins?: number;
>>>>>>> Stashed changes
}
