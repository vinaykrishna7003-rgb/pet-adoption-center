import express from 'express';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetsByStatus,
  getPetsBySpecies,
  getPetsByShelter,
  updatePetStatus,
  searchPets,
  getPetStatistics
} from '../controllers/pet.controller.js';

const router = express.Router();

// Search and statistics routes (should be before :id routes)
router.get('/search', searchPets);
router.get('/statistics', getPetStatistics);

// Basic CRUD routes
router.get('/', getAllPets);
router.get('/:id', getPetById);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

// Additional routes
router.get('/status/:status', getPetsByStatus);
router.get('/species/:species', getPetsBySpecies);
router.get('/shelter/:shelterId', getPetsByShelter);
router.patch('/:id/status', updatePetStatus);

export default router;