import Shelter from '../models/shelter.model.js';
import pool from '../database/db.js';

// Get all shelters
export const getAllShelters = async (req, res) => {
  try {
    const shelters = await Shelter.findAll();
    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelters',
      error: error.message
    });
  }
};

// Get single shelter by ID
export const getShelterById = async (req, res) => {
  try {
    const { id } = req.params;
    const shelter = await Shelter.findById(id);
    
    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: shelter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelter',
      error: error.message
    });
  }
};

// Create new shelter
export const createShelter = async (req, res) => {
  try {
    const shelterData = req.body;
    const newShelter = await Shelter.create(shelterData);
    
    res.status(201).json({
      success: true,
      message: 'Shelter created successfully',
      data: newShelter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating shelter',
      error: error.message
    });
  }
};

// Update shelter
export const updateShelter = async (req, res) => {
  try {
    const { id } = req.params;
    const shelterData = req.body;
    
    const updatedShelter = await Shelter.update(id, shelterData);
    
    if (!updatedShelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Shelter updated successfully',
      data: updatedShelter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating shelter',
      error: error.message
    });
  }
};

// Delete shelter
export const deleteShelter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShelter = await Shelter.delete(id);
    
    if (!deletedShelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Shelter deleted successfully',
      data: deletedShelter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting shelter',
      error: error.message
    });
  }
};

// Get shelters by city
export const getSheltersByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const shelters = await Shelter.findByCity(city);
    
    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelters by city',
      error: error.message
    });
  }
};

// Get shelter with pets
export const getShelterWithPets = async (req, res) => {
  try {
    const { id } = req.params;
    const shelter = await Shelter.getShelterWithPets(id);
    
    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: shelter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelter with pets',
      error: error.message
    });
  }
};

// Get shelter with staff
export const getShelterWithStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const shelter = await Shelter.getShelterWithStaff(id);
    
    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: shelter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelter with staff',
      error: error.message
    });
  }
};

// Get shelter capacity info using functions
export const getShelterCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const petCountResult = await pool.query('SELECT get_shelter_pet_count($1) as pet_count', [parseInt(id)]);
    const atCapacityResult = await pool.query('SELECT is_shelter_at_capacity($1) as at_capacity', [parseInt(id)]);
    const shelterResult = await pool.query('SELECT capacity FROM Shelter WHERE shelter_id = $1', [parseInt(id)]);
    
    if (shelterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        shelter_id: parseInt(id),
        current_pet_count: petCountResult.rows[0].pet_count,
        max_capacity: shelterResult.rows[0].capacity,
        at_capacity: atCapacityResult.rows[0].at_capacity,
        available_space: shelterResult.rows[0].capacity - petCountResult.rows[0].pet_count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelter capacity',
      error: error.message
    });
  }
};

// Get all shelters with statistics
export const getAllSheltersWithStats = async (req, res) => {
  try {
    const shelters = await Shelter.getAllSheltersWithStats();
    
    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shelters with stats',
      error: error.message
    });
  }
};

// Generate shelter report using stored procedure
export const generateShelterReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('CALL generate_shelter_report($1)', [parseInt(id)]);
    
    const shelter = await Shelter.findById(id);
    const petCount = await pool.query('SELECT get_shelter_pet_count($1) as pet_count', [parseInt(id)]);
    const availablePets = await pool.query('SELECT COUNT(*) as count FROM Pet WHERE shelter_id = $1 AND status = $2', [parseInt(id), 'Available']);
    const adoptedPets = await pool.query('SELECT COUNT(*) as count FROM Pet WHERE shelter_id = $1 AND status = $2', [parseInt(id), 'Adopted']);
    const staffCount = await pool.query('SELECT COUNT(*) as count FROM Staff WHERE shelter_id = $1', [parseInt(id)]);
    
    res.status(200).json({
      success: true,
      message: 'Shelter report generated successfully',
      data: {
        shelter: shelter,
        total_pets: petCount.rows[0].pet_count,
        available_pets: availablePets.rows[0].count,
        adopted_pets: adoptedPets.rows[0].count,
        staff_members: staffCount.rows[0].count
      }
    });
  } catch (error) {
    if (error.message.includes('does not exist')) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error generating shelter report',
      error: error.message
    });
  }
};

// Check if shelter is at capacity
export const checkShelterCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT is_shelter_at_capacity($1) as at_capacity', [parseInt(id)]);
    
    res.status(200).json({
      success: true,
      data: {
        shelter_id: parseInt(id),
        at_capacity: result.rows[0].at_capacity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking shelter capacity',
      error: error.message
    });
  }
};