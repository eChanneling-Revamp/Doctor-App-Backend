<<<<<<< Updated upstream
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


=======
/*
>>>>>>> Stashed changes
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

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
      where: { id: (id) },
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
    await prisma.session.delete({ where: { id: (id) } });
    res.json({ message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

<<<<<<< Updated upstream
=======

*/


import { Request, Response } from "express";
import prisma from "../config/prisma";

// ================= CREATE SESSION =================
export async function createSession(req: Request, res: Response) {
  try {
    const {
      doctorId,
      hospitalName,
      patientCapacity,
      startTime,
      endTime,
      sessionType,
      location,
      scheduledAt,
      nurse_details,
    } = req.body;

    if (!doctorId) {
      return res.status(400).json({ error: "doctorId is required" });
    }

    // Create session with all required fields
   const session = await prisma.session.create({
  data: {
    doctorId: String(doctorId),
    hospitalId: String(req.body.hospitalId),   // required!
    nurseId: String(req.body.nurseId),         // required!
    hospitalName: hospitalName || "",
    patientCapacity: patientCapacity || 0,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    sessionType: sessionType || "",
    location: location || "",
    scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
    nurse_details: nurse_details || "",
  },
});


        // If doctors/hospitals are relations, you can connect like:
        // doctors: { connect: { id: String(doctorId) } },
        // hospitals: { connect: { name: hospitalName } },
     
    res.status(201).json(session);
  } catch (error: any) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: error.message });
  }
}

// ================= LIST SESSIONS =================
export async function listSessions(req: Request, res: Response) {
  try {
    const { doctorId } = req.query;

    const sessions = await prisma.session.findMany({
      where: doctorId ? { doctorId: String(doctorId) } : {},
    });

    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// ================= UPDATE SESSION =================
export async function updateSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      hospitalName,
      patientCapacity,
      startTime,
      endTime,
      sessionType,
      location,
      scheduledAt,
      nurse_details,
    } = req.body;

    const session = await prisma.session.update({
      where: { id: String(id) },
      data: {
        hospitalName,
        patientCapacity,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        sessionType,
        location,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        nurse_details,
      },
    });

    res.json(session);
  } catch (error: any) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: error.message });
  }
}

// ================= DELETE SESSION =================
export async function deleteSession(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id: String(id) },
    });

    res.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: error.message });
  }
}
>>>>>>> Stashed changes
