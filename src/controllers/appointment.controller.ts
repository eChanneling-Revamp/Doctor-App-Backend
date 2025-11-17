import { Request, Response } from "express";
import * as appointmentService from "../services/appointment.services";

export const bookAppointment = async (req: Request, res: Response) => {
  const result = await appointmentService.bookAppointment(req.body);
  res.json(result);
};

export const getAppointmentsByPatient = async (req: Request, res: Response) => {
 const patientId = req.params.patientId; // string by default
if (!patientId) return res.status(400).json({ message: "Invalid patientId" });
const result = await appointmentService.getAppointmentsByPatient(patientId);

};


export const updateAppointmentStatus = async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const result = await appointmentService.updateStatus(Number(appointmentId), status);
  res.json(result);
};

export const getAllAppointments = async (req: Request, res: Response) => {
  const result = await appointmentService.getAllAppointments();
  res.json(result);
};
