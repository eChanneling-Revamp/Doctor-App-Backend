// import { Request, Response } from "express";
// import prisma from "../config/prisma"; // ✅ your PrismaClient instance

// export async function createSession(req: Request, res: Response) {
//   const doctorId = (req as any).doctorId;
//   const { hospitalName, patientCapacity, startTime, endTime, sessionType } = req.body;
//   const session = await prisma.session.create({
//     data: { doctorId, hospitalName, patientCapacity, startTime: new Date(startTime), endTime: new Date(endTime), sessionType }
//   });
//   res.status(201).json(session);
// }

// export async function listSessions(req: Request, res: Response) {
//   const doctorId = (req as any).doctorId;
//   const sessions = await prisma.session.findMany({ where: { doctorId }});
//   res.json(sessions);
// }

// export async function updateSession(req: Request, res: Response) {
//   const doctorId = (req as any).doctorId;
//   const { id } = req.params;
//   const session = await prisma.session.update({ where: { id: Number(id) }, data: req.body });
//   res.json(session);
// }

// export async function deleteSession(req: Request, res: Response) {
//   const { id } = req.params;
//   await prisma.session.delete({ where: { id: Number(id) }});
//   res.json({ message: "Deleted" });
// }


import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function createSession(req: Request, res: Response) {
  try {
    const { doctorId, hospitalName, patientCapacity, startTime, endTime, sessionType } = req.body;

    if (!doctorId) {
      return res.status(400).json({ error: "doctorId is required" });
    }

    const session = await prisma.session.create({
      data: {
        doctorId,
        hospitalName,
        patientCapacity,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        sessionType,
      },
    });

    res.status(201).json(session);
  } catch (error: any) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function listSessions(req: Request, res: Response) {
  try {
    const { doctorId } = req.query; // you can also filter via ?doctorId=1
    const sessions = await prisma.session.findMany({
      where: doctorId ? { doctorId: Number(doctorId) } : {},
    });
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const session = await prisma.session.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.session.delete({ where: { id: Number(id) } });
    res.json({ message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

