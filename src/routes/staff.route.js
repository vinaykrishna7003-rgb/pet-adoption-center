import express from 'express';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffByShelter,
  getStaffByRole,
  getStaffStatsByRole,
  getStaffWithShelterDetails
} from '../controllers/staff.controller.js';

const router = express.Router();

// Statistics route (before :id routes)
router.get('/stats/role', getStaffStatsByRole);

// Basic CRUD routes
router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

// Additional routes
router.get('/shelter/:shelterId', getStaffByShelter);
router.get('/role/:role', getStaffByRole);
router.get('/:id/details', getStaffWithShelterDetails);

export default router;