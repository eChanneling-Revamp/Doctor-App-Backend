import { Request, Response } from "express";
import {
  createScheduleService,
  generateSlotsService,
  updateScheduleService,
  getWeekScheduleService,
  getDailyScheduleService
} from "../services/schedule.service";

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



// NEW: Update Schedule (used by Schedule Edit UI)

export const updateSchedule = async (req: Request, res: Response) => {

  try {

    const schedule = await updateScheduleService(req.body);

    res.json(schedule);

  } catch (error) {

    res.status(500).json({
      error: "Schedule update failed"
    });

  }

};



// NEW: Week View

export const getWeekSchedule = async (req: Request, res: Response) => {

  try {

    const doctorId = req.params.doctorId;

    const result = await getWeekScheduleService(doctorId);

    res.json(result);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch week schedule"
    });

  }

};



// NEW: Daily View

export const getDailySchedule = async (req: Request, res: Response) => {

  try {

    const { doctorId, date } = req.query;

    const result = await getDailyScheduleService(
      String(doctorId),
      String(date)
    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch daily schedule"
    });

  }

};

