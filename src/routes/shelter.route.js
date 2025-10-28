import express from 'express';
import {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter,
  getSheltersByCity,
  getShelterWithPets,
  getShelterWithStaff,
  getShelterCapacity,
  getAllSheltersWithStats
} from '../controllers/shelter.controller.js';

const router = express.Router();

// Statistics route (before :id routes)
router.get('/stats', getAllSheltersWithStats);

// Basic CRUD routes
router.get('/', getAllShelters);
router.get('/:id', getShelterById);
router.post('/', createShelter);
router.put('/:id', updateShelter);
router.delete('/:id', deleteShelter);

// Additional routes
router.get('/city/:city', getSheltersByCity);
router.get('/:id/pets', getShelterWithPets);
router.get('/:id/staff', getShelterWithStaff);
router.get('/:id/capacity', getShelterCapacity);

export default router;