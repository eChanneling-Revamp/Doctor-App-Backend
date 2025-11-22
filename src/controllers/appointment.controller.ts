import { Request, Response } from "express";
import * as appointmentService from "../services/apointment.services";

export const bookAppointment = async (req: Request, res: Response) => {
  const result = await appointmentService.bookAppointment(req.body);
  return res.status(result.statusCode).json(result);
};

export const getAppointmentsByPatient = async (req: Request, res: Response) => {
  const patientName = req.params.patientName;

  if (!patientName) {
    return res.status(400).json({ message: "Invalid patientName" });
  }

  const result = await appointmentService.getAppointmentsByPatient(patientName);
  return res.status(result.statusCode).json(result);
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const result = await appointmentService.updateStatus(Number(appointmentId), status);
  return res.status(result.statusCode).json(result);
};

export const getAllAppointments = async (_req: Request, res: Response) => {
  const result = await appointmentService.getAllAppointments();
  return res.status(result.statusCode).json(result);
};
