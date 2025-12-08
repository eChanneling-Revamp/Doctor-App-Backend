/*import { Request, Response } from "express";
import { bookAppointment as bookAppointmentService } from "../services/apointment.services";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

// ---------------- Book Appointment ----------------
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const result = await bookAppointmentService(req.body);
    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};
*/

import { Request, Response } from "express";
import { bookAppointmentService } from "../services/apointment.services";
import ApiError from "../utils/ApiError";

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { slotId, patientName, type, doctorId, patientId } = req.body;

    if (!slotId || !patientName || !type || !doctorId || !patientId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await bookAppointmentService({
      slotId,
      patientName,
      type,
      doctorId,
      patientId
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Book Appointment Error:", err);
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to book appointment" });
  }
};
