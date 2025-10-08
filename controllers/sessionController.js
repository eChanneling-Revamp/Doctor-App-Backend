import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create new session
export const createSession = async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, location } = req.body;

    const session = await prisma.session.create({
      data: { doctorId, date: new Date(date), startTime, endTime, location },
    });

    res.status(201).json({ message: "Session created", session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sessions by doctor
export const getSessionsByDoctor = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const sessions = await prisma.session.findMany({
      where: { doctorId },
      include: { doctor: true },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transfer session to another doctor
export const transferSession = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const { newDoctorId } = req.body;

    const updated = await prisma.session.update({
      where: { id: sessionId },
      data: { doctorId: newDoctorId, status: "Transferred" },
    });

    res.json({ message: "Session transferred", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete  session
export const deleteSession = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    await prisma.session.delete({ where: { id: sessionId } });
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
