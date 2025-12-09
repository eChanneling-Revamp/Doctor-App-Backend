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
        status: "Scheduled",
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
    VIEW MEDICINE DETAILS
========================================================== */

export const viewMedicineDetails = async (req: Request, res: Response) => {
  try {
    const medId = Number(req.params.medId);
    if (isNaN(medId)) return res.status(400).json({ error: "Invalid medicine ID" });

    const medicine = await prisma.medicine.findUnique({ where: { id: medId } });

    if (!medicine) return res.status(404).json({ error: "Medicine not found" });

    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch medicine details" });
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

    if (!appointmentId) {
      return res.status(400).json({ error: "appointmentId is required" });
    }

    const id = Number(appointmentId);

    // Check if appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (!appointment.patientId) {
      return res.status(400).json({ error: "Appointment has no patient assigned" });
    }

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        appointmentId: id,
        patientId: appointment.patientId,
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
    const { medicineName, dosage, frequency, duration, specialNote, isFavorite } =
      req.body;

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
    UPDATE MEDICINE IN PRESCRIPTION
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
    GENERATE PRESCRIPTION PDF (FIXED)
========================================================== */

export const generatePrescriptionPDF = async (req: Request, res: Response) => {
  try {
    const { prescriptionId } = req.params;
    const id = Number(prescriptionId);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid prescription ID format." });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            patient: true,
            doctor: true, // assuming doctor relation exists
          },
        },
        medicines: true,
      },
    });

    if (!prescription)
      return res.status(404).json({ error: "Prescription not found" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Your Hospital Name", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
    doc.moveDown(1);

    // Doctor & Patient Info
    doc.fontSize(14).text("Prescription", { underline: true, align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Doctor: ${prescription.appointment.doctor?.name ?? "N/A"}`);
    doc.text(`Patient: ${prescription.appointment.patient.name}`);
    doc.text(`Email: ${prescription.appointment.patient.email}`);
    doc.text(`Appointment Ref: ${prescription.appointment.id}`);
    doc.moveDown();

    // Medicines Table Header
    doc.fontSize(12).text("Medicines:", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemSpacing = 20;

    // Table Columns
    const col1 = 50;   // Medicine Name
    const col2 = 200;  // Dose
    const col3 = 270;  // Frequency
    const col4 = 350;  // Duration
    const col5 = 430;  // Notes

    // Header row
    doc.font("Helvetica-Bold");
    doc.text("Medicine Name", col1, tableTop);
    doc.text("Dose", col2, tableTop);
    doc.text("Frequency", col3, tableTop);
    doc.text("Duration", col4, tableTop);
    doc.text("Notes", col5, tableTop);
    doc.moveDown(0.5);
    doc.font("Helvetica");

    // Table rows
    prescription.medicines.forEach((m: any, i: number) => {
      const y = tableTop + (i + 1) * itemSpacing;
      doc.text(m.medicineName, col1, y);
      doc.text(m.dosage ?? "N/A", col2, y);
      doc.text(m.frequency ?? "N/A", col3, y);
      doc.text(m.duration ?? "N/A", col4, y);
      doc.text(m.specialNote ?? "", col5, y);
    });

    doc.moveDown(prescription.medicines.length + 1);

    // Footer
   // doc.moveDown(2);
   // doc.text("Signature: ______________________", { align: "right" });

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
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
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
