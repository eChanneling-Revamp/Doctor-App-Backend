import { Request, Response } from "express";
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
