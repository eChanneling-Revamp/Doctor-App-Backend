import express from 'express';
import {
  createPrescription,
  getPrescriptions
} from '../controllers/prescriptionController.js';

const router = express.Router();

router.get('/', getPrescriptions);
router.post('/', createPrescription);

export default router;
