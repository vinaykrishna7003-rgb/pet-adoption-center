import express from 'express';
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationsByAdopter,
  getApplicationsByStatus,
  updateApplicationStatus,
  getApplicationStats,
  getPendingApplications
} from '../controllers/application.controller.js';

const router = express.Router();

// Statistics and special routes (before :id routes)
router.get('/stats', getApplicationStats);
router.get('/pending', getPendingApplications);

// Basic CRUD routes
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

// Additional routes
router.get('/adopter/:adopterId', getApplicationsByAdopter);
router.get('/status/:status', getApplicationsByStatus);
router.patch('/:id/status', updateApplicationStatus);

export default router;