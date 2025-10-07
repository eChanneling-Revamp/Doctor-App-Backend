import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAppointment = async (req, res) => {
  try {
    const { date, time, doctorId, patientId } = req.body;
    const appointment = await prisma.appointment.create({
      data: { date: new Date(date), time, doctorId, patientId },
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { doctor: true, patient: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
      include: { doctor: true, patient: true },
    });
    if (!appointment) return res.status(404).json({ message: "Not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
