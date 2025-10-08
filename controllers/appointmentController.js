import prisma from "../config/db.js";
import { notifyPatientCancellation } from "../services/notificationService.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { sessionId, patientId } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        sessionId: Number(sessionId),
        patientId: Number(patientId),
        status: "Scheduled"
      },
      include: {
        session: { include: { doctor: true } },
        patient: true
      }
    });

    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { session: { include: { doctor: true } }, patient: true },
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
      include: { session: { include: { doctor: true } }, patient: true }
    });

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status: "Cancelled" },
      include: { patient: true }
    });

    if (appointment?.patient?.email) {
      await notifyPatientCancellation(appointment.patient.email, appointment.id);
    }

    res.json({ success: true, message: `Appointment #${appointment.id} cancelled and patient notified.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get upcoming appointments for a doctor
export const getUpcomingAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await prisma.appointment.findMany({
      where: {
        session: {
          doctorId: Number(doctorId),
          date: { gte: new Date() }
        },
        status: "Scheduled"
      },
      include: { session: true, patient: true },
      orderBy: { "session.date": "asc" }
    });

    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
