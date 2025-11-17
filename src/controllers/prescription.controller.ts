
import { Request, Response } from "express";
import { prisma } from "../config/prisma";  // ✅ your PrismaClient instance

// ✅ Create Prescription
export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { patientId, medicines } = req.body;

    // 🧠 Validate input early to prevent 'map' errors
    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ error: "medicines array is required" });
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        medicines: {
          create: medicines.map((med: any) => ({
            medicine: {
              connectOrCreate: {
                where: { name: med.name },
                create: { name: med.name },
              },
            },
            dosage: med.dosage ?? "",
            frequency: med.frequency ?? "",
            period: med.period ?? "",
            specialNote: med.specialNote ?? "",
          })),
        },
      },
      include: {
        medicines: {
          include: { medicine: true },
        },
      },
    });

    res.status(201).json(prescription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Prescriptions
export const getPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        patient: true,
        medicines: { include: { medicine: true } },
      },
    });

    res.json(prescriptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};