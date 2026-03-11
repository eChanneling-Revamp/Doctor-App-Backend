import { Request, Response } from "express";
import { createScheduleService, generateSlotsService } from "../services/schedule.service";

export const createSchedule = async (req: Request, res: Response) => {

  try {

    const schedule = await createScheduleService(req.body);

    res.status(201).json(schedule);

  } catch (error) {

  console.error(error);

  res.status(500).json({
    error: "Schedule creation failed",
    details: error
  });

}
};

export const generateSlots = async (req: Request, res: Response) => {

  try {

    const scheduleId = Number(req.params.id);

    const slots = await generateSlotsService(scheduleId);

    res.json(slots);

  } catch (error) {

    res.status(500).json({ error: "Slot generation failed" });

  }
};