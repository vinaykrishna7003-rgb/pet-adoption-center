import express from 'express';
import adopterRoutes from './adopter.route.js';
import petRoutes from './pet.route.js';
import shelterRoutes from './shelter.route.js';
import applicationRoutes from './application.route.js';
import adoptionRoutes from './adoption.route.js';
import staffRoutes from './staff.route.js';

const router = express.Router();

// API routes
router.use('/adopters', adopterRoutes);
router.use('/pets', petRoutes);
router.use('/shelters', shelterRoutes);
router.use('/applications', applicationRoutes);
router.use('/adoptions', adoptionRoutes);
router.use('/staff', staffRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pet Adoption Center API is running',
    timestamp: new Date()
  });
});

export default router;