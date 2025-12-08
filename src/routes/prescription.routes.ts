import express from "express";
import {
  searchActiveAppointments,
  viewAppointmentDetails,
  searchMedicines,
  viewMedicineDetails,
  addFavoriteMedicine,
  removeFavoriteMedicine,
  createPrescription,
  addMedicineToPrescription,
  updateMedicineInPrescription,
  deleteMedicineFromPrescription,
  toggleFavoriteMedicine,
  
  sendToPatient
} from "../controllers/prescription.controller";

const router = express.Router();

// Appointment
router.get("/appointments/active", searchActiveAppointments);
router.get("/appointments/:id", viewAppointmentDetails);

// Medicines
router.get("/medicines", searchMedicines);
// View single medicine details
router.get("/medicine/:medId", viewMedicineDetails);

router.delete("/medicine/:medId", deleteMedicineFromPrescription);
router.put("/:id/medicines/:medId", updateMedicineInPrescription);

router.post("/favorites", addFavoriteMedicine);
router.delete("/favorites/:id", removeFavoriteMedicine);

// Prescription CRUD
router.post("/", createPrescription);
router.post("/:id/medicines", addMedicineToPrescription);
router.put("/:id/medicines/:medId", updateMedicineInPrescription);
router.delete("/:id/medicines/:medId", deleteMedicineFromPrescription);
router.patch("/favorite/:medId", toggleFavoriteMedicine);

// Share and Send

router.post("/:id/send", sendToPatient);

export default router;
