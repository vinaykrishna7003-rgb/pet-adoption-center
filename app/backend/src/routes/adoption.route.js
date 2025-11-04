import express from 'express';
import {
  getAllAdoptions,
  getAdoptionById,
  createAdoption,
  updateAdoption,
  deleteAdoption,
  getAdoptionsByAdopter,
  getAdoptionsByPet,
  updateAdoptionStatus,
  getAdoptionStats,
  getAdoptionsByMonth,
  getRecentAdoptions
} from '../controllers/adoption.controller.js';

const router = express.Router();

// Statistics and special routes (before :id routes)
router.get('/stats', getAdoptionStats);
router.get('/recent', getRecentAdoptions);
router.get('/month/:year', getAdoptionsByMonth);

// Basic CRUD routes
router.get('/', getAllAdoptions);
router.get('/:id', getAdoptionById);
router.post('/', createAdoption);
router.put('/:id', updateAdoption);
router.delete('/:id', deleteAdoption);

// Additional routes
router.get('/adopter/:adopterId', getAdoptionsByAdopter);
router.get('/pet/:petId', getAdoptionsByPet);
router.patch('/:id/status', updateAdoptionStatus);

export default router;