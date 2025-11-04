import express from 'express';
import {
  getAllAdopters,
  getAdopterById,
  createAdopter,
  updateAdopter,
  deleteAdopter,
  getAdopterWithApplications,
  getAdopterWithAdoptions
} from '../controllers/adopter.controller.js';

const router = express.Router();

// Basic CRUD routes
router.get('/', getAllAdopters);
router.get('/:id', getAdopterById);
router.post('/', createAdopter);
router.put('/:id', updateAdopter);
router.delete('/:id', deleteAdopter);

// Additional routes
router.get('/:id/applications', getAdopterWithApplications);
router.get('/:id/adoptions', getAdopterWithAdoptions);

export default router;
