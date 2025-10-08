import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create prescription
export const createPrescription = async (req, res) => {
  try {
    const { patientId, medicines } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        medicines: {
          create: medicines.map(med => ({
            medicine: {
              connectOrCreate: {
                where: { name: med.name },
                create: { name: med.name },
              },
            },
            dosage: med.dosage,
            frequency: med.frequency,
            period: med.period,
            specialNote: med.specialNote,
          })),
        },
      },
      include: { medicines: { include: { medicine: true } } },
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all prescriptions
export const getPrescriptions = async (req, res) => {
  const prescriptions = await prisma.prescription.findMany({
    include: {
      patient: true,
      medicines: { include: { medicine: true } },
    },
  });
  res.json(prescriptions);
};
