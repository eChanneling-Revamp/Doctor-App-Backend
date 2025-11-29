import { Request, Response } from "express";
import prisma from "../config/prisma";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

/* =======================================================
    SEARCH ACTIVE APPOINTMENTS
========================================================== */
export const searchActiveAppointments = async (req: Request, res: Response) => {
  try {
    const query =
      typeof req.query.query === "string" ? req.query.query.trim() : "";

    const appointments = await prisma.appointment.findMany({
      where: {
        status: "Scheduled",  // or "Active" if that is your status
        patient: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      include: {
        patient: true,
        doctor: true,
        session: true,
        prescriptions: true,
      },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

/* =======================================================
    VIEW APPOINTMENT DETAILS
========================================================== */
export const viewAppointmentDetails = async (req: Request, res: Response) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
      include: { prescriptions: true },
    });

    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

/* =======================================================
    SEARCH MEDICINES
========================================================== */
export const searchMedicines = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : "";

    const medicines = await prisma.medicine.findMany({
      where: { name: { contains: search, mode: "insensitive" } },
    });

    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search medicines" });
  }
};

/* =======================================================
    ADD FAVORITE MEDICINE
========================================================== */
export const addFavoriteMedicine = async (req: Request, res: Response) => {
  try {
    const { name, dosage, frequency, duration } = req.body;

    const med = await prisma.medicine.create({
      data: {
        name,
        defaultDosage: dosage ?? null,
        defaultFreq: frequency ?? null,
        defaultDur: duration ?? null,
      },
    });

    res.json(med);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add favorite medicine" });
  }
};

/* =======================================================
    REMOVE FAVORITE MEDICINE
========================================================== */
export const removeFavoriteMedicine = async (req: Request, res: Response) => {
  try {
    await prisma.medicine.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Favorite removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove favorite medicine" });
  }
};

/* =======================================================
    CREATE PRESCRIPTION
========================================================== */

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId)
      return res.status(400).json({ error: "appointmentId is required" });

    // Get appointment so we know patientId
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(appointmentId) },
    });

    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        patientId: appointment.patientId, // FIXED
      },
    });

    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create prescription" });
  }
};

/* =======================================================
    ADD MEDICINE TO PRESCRIPTION
========================================================== */
export const addMedicineToPrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { medicineName, dosage, frequency, duration, specialNote, isFavorite } = req.body;

    if (!medicineName) {
      return res.status(400).json({ error: "medicineName is required" });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: Number(id) },
    });

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    const med = await prisma.prescriptionMed.create({
      data: {
        prescriptionId: Number(id),
        medicineName,
        dosage,
        frequency,
        duration,
        specialNote: specialNote ?? null,
        isFavorite: Boolean(isFavorite),
      },
    });

    res.json(med);
  } catch (error: any) {
    console.error("Add Medicine Error:", error);
    res.status(500).json({
      error: "Failed to add medicine to prescription",
      details: error.message,
    });
  }
};

/* =======================================================
    UPDATE MEDICINE
========================================================== */
export const updateMedicineInPrescription = async (req: Request, res: Response) => {
  try {
    const { medId } = req.params;
    const { dosage, frequency, duration, specialNote } = req.body;

    const id = Number(medId);

    const existingMed = await prisma.prescriptionMed.findUnique({
      where: { id },
    });

    if (!existingMed) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    const updated = await prisma.prescriptionMed.update({
      where: { id },
      data: {
        dosage,
        frequency,
        duration,
        specialNote: specialNote ?? null,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update Medicine Error:", error);
    res.status(500).json({ error: "Failed to update medicine" });
  }
};

/* =======================================================
    DELETE MEDICINE
========================================================== */
export const deleteMedicineFromPrescription = async (req: Request, res: Response) => {
  try {
    await prisma.prescriptionMed.delete({ where: { id: Number(req.params.medId) } });
    res.json({ message: "Medicine deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete medicine" });
  }
};

/* =======================================================
    TOGGLE FAVORITE
========================================================== */
export const toggleFavoriteMedicine = async (req: Request, res: Response) => {
  try {
    const { medId } = req.params;

    const med = await prisma.prescriptionMed.update({
      where: { id: Number(medId) },
      data: { isFavorite: true },
    });

    res.json(med);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
};

/* =======================================================
    GENERATE PRESCRIPTION PDF
========================================================== 
export const sharePrescription = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        medicines: true,
        appointment: {
          include: { patient: true }, // include patient
        },
      },
    });

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Handle case when appointment or patient is missing
    const patient = prescription.appointment?.patient;
    if (!prescription.appointment || !patient) {
      return res
        .status(400)
        .json({ error: "Prescription has no linked appointment or patient" });
    }

    const pdfPath = path.join(__dirname, `../../prescription_${id}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    doc.fontSize(20).text("Healthy Life Clinic", { align: "center" });
    doc.fontSize(14).text(`Prescription ID: ${prescription.id}`, { align: "center" });
    doc.moveDown();

    doc.text(`Patient: ${patient.name}`);
    doc.text(`Email: ${patient.email ?? "N/A"}`);
    doc.text(`Patient ID: ${patient.patientId ?? "N/A"}`);
    doc.text(`Ref: ${patient.ref ?? "N/A"}`);

    doc.moveDown();
    doc.fontSize(14).text("Prescription Details", { underline: true });

    prescription.medicines.forEach((m, i) => {
      doc.moveDown();
      doc.text(`${i + 1}. ${m.medicineName}`);
      doc.text(`   Dosage: ${m.dosage ?? "N/A"}`);
      doc.text(`   Frequency: ${m.frequency ?? "N/A"}`);
      doc.text(`   Duration: ${m.duration ?? "N/A"}`);
      if (m.specialNote) doc.text(`   Note: ${m.specialNote}`);
    });

    doc.end();

    stream.on("finish", () =>
      res.json({ message: "PDF generated", pdfPath })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};*/
export const generatePrescriptionPDF = async (req: Request, res: Response) => {
  try {
    const { prescriptionId } = req.params;

    if (!prescriptionId) {
      return res.status(400).json({ error: "Prescription ID is required." });
    }

    // Convert string → number
    const id = Number(prescriptionId);

    // Validate numeric id
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid prescription ID format." });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id }, // ✔ number
      include: {
        appointment: {
          include: { patient: true }
        },
        medicines: true
      }
    });

    if (!prescription)
      return res.status(404).json({ error: "Prescription not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(16).text("Prescription", { underline: true });
    doc.moveDown();
    doc.fontSize(12);

    doc.text(`Patient: ${prescription.appointment.patient.name}`);
    doc.text(`Email: ${prescription.appointment.patient.email}`);
    doc.text(`Ref: ${prescription.appointment.id}`);
    doc.moveDown();

    // Format medicines properly
    if (prescription.medicines.length > 0) {
      doc.text("Medicines:");
      prescription.medicines.forEach((m, i) => {
        doc.text(`${i + 1}. ${m.medicineName} - ${m.dosage}`);
      });
    } else {
      doc.text("Medicines: None");
    }

    doc.moveDown();
doc.text("Notes:");
prescription.medicines.forEach((m, i) => {
  if (m.specialNote) {
    doc.text(`${i + 1}. ${m.specialNote}`);
  }
});
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
};

/* =======================================================
    SEND PRESCRIPTION TO EMAIL
========================================================== */
export const sendToPatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { patientEmail } = req.body;

    const filePath = path.join(__dirname, `../../prescription_${id}.pdf`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: "Your Prescription",
      text: "Please find your prescription attached.",
      attachments: [{ filename: `prescription_${id}.pdf`, path: filePath }],
    });

    fs.unlinkSync(filePath);

    res.json({ message: "Prescription sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send prescription" });
  }
};
