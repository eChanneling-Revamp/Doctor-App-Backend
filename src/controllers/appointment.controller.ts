import { Request, Response } from "express";
import {
  createAppointmentService,
  getAppointmentsService,
  bookAppointmentService,
  getCurrentAppointmentsService,
  getUpcomingAppointmentsService,
  getPastAppointmentsService
} from "../services/appointment.service";



export const createAppointment = async (req: Request, res: Response) => {

  try {

    const appointment = await createAppointmentService(req.body);

    res.status(201).json(appointment);

  } catch (error: any) {

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



// NEW: Book Appointment (Slot Booking)

export const bookAppointment = async (req: Request, res: Response) => {

  try {

    const appointment = await bookAppointmentService(req.body);

    res.json(appointment);

  } catch (error: any) {

    res.status(400).json({ error: error.message });

  }

};



// NEW: Current Appointments

export const getCurrentAppointments = async (req: Request, res: Response) => {

  try {

    const appointments = await getCurrentAppointmentsService();

    res.json(appointments);

  } catch {

    res.status(500).json({ error: "Failed to fetch current appointments" });

  }

};



// NEW: Upcoming Appointments

export const getUpcomingAppointments = async (req: Request, res: Response) => {

  try {

    const appointments = await getUpcomingAppointmentsService();

    res.json(appointments);

  } catch {

    res.status(500).json({ error: "Failed to fetch upcoming appointments" });

  }

};



// NEW: Past Appointments

export const getPastAppointments = async (req: Request, res: Response) => {

  try {

    const appointments = await getPastAppointmentsService();

    res.json(appointments);

  } catch {

    res.status(500).json({ error: "Failed to fetch past appointments" });

  }

};

