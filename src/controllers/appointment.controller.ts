import { Request, Response } from "express";
import { createAppointmentService, getAppointmentsService } from "../services/appointment.service";

export const createAppointment = async (req: Request, res: Response) => {

  try {

    const appointment = await createAppointmentService(req.body);

    res.status(201).json(appointment);

  } catch (error:any) {

    res.status(400).json({ error: error.message });

  }
};

export const getAppointments = async (req: Request, res: Response) => {

  try {

    const appointments = await getAppointmentsService();

    res.json(appointments);

  } catch {

    res.status(500).json({ error: "Failed to fetch appointments" });

  }
};