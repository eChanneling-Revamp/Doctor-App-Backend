
import { Router } from "express";
import {
  searchActiveAppointments,
  viewAppointmentDetails,
  searchMedicines,
  viewMedicineDetails,
  addFavoriteMedicine,
  removeFavoriteMedicine,       // correct
  createPrescription,
  addMedicineToPrescription,
  updateMedicineInPrescription,
  deleteMedicineFromPrescription,
  generatePrescriptionPDF,
  sendToPatient,
} from "../controllers/prescription.controller";

const router = Router();

// Example routes
router.get("/appointments/search", searchActiveAppointments);
router.get("/appointments/:id", viewAppointmentDetails);

router.get("/medicines/search", searchMedicines);
router.get("/medicines/:medId", viewMedicineDetails);

router.post("/medicines/favorite", addFavoriteMedicine);
router.delete("/medicines/favorite/:id", removeFavoriteMedicine);

router.post("/prescriptions", createPrescription);
router.post("/prescriptions/:id/medicines", addMedicineToPrescription);
router.put("/prescriptions/medicines/:medId", updateMedicineInPrescription);
router.delete("/prescriptions/medicines/:medId", deleteMedicineFromPrescription);

router.get("/prescriptions/:prescriptionId/pdf", generatePrescriptionPDF);
router.post("/prescriptions/:id/send",  sendToPatient,);

export default router;
