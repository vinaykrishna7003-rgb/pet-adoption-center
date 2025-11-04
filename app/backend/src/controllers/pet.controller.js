import Pet from '../models/pet.model.js';
import pool from '../database/db.js';

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pets',
      error: error.message
    });
  }
};

// Get single pet by ID
export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pet',
      error: error.message
    });
  }
};

// Create new pet
export const createPet = async (req, res) => {
  try {
    const petData = req.body;
    const newPet = await Pet.create(petData);
    
    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      data: newPet
    });
  } catch (error) {
    if (error.message.includes('at full capacity')) {
      return res.status(400).json({
        success: false,
        message: 'Shelter is at full capacity',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating pet',
      error: error.message
    });
  }
};

// Update pet
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const petData = req.body;
    
    const updatedPet = await Pet.update(id, petData);
    
    if (!updatedPet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      data: updatedPet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating pet',
      error: error.message
    });
  }
};

// Delete pet
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPet = await Pet.delete(id);
    
    if (!deletedPet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully',
      data: deletedPet
    });
  } catch (error) {
    if (error.message.includes('active adoption')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete pet with active adoption records',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting pet',
      error: error.message
    });
  }
};

// Get pets by status
export const getPetsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const pets = await Pet.findByStatus(status);
    
    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pets by status',
      error: error.message
    });
  }
};

// Get pets by species
export const getPetsBySpecies = async (req, res) => {
  try {
    const { species } = req.params;
    const pets = await Pet.findBySpecies(species);
    
    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pets by species',
      error: error.message
    });
  }
};

// Get pets by shelter
export const getPetsByShelter = async (req, res) => {
  try {
    const { shelterId } = req.params;
    const pets = await Pet.findByShelter(shelterId);
    
    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pets by shelter',
      error: error.message
    });
  }
};

// Update pet status
export const updatePetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedPet = await Pet.updateStatus(id, status);
    
    if (!updatedPet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Pet status updated successfully',
      data: updatedPet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating pet status',
      error: error.message
    });
  }
};

// Search pets with filters (using function)
export const searchPets = async (req, res) => {
  try {
    const { species, size } = req.query;
    
    const result = await pool.query(
      'SELECT * FROM get_available_pets_by_criteria($1, $2)',
      [species || null, size || null]
    );
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching pets',
      error: error.message
    });
  }
};

// Get pet statistics
export const getPetStatistics = async (req, res) => {
  try {
    const stats = await Pet.getPetStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pet statistics',
      error: error.message
    });
  }
};

// Transfer pet between shelters
export const transferPet = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_shelter_id } = req.body;
    
    await pool.query('CALL transfer_pet($1, $2)', [parseInt(id), parseInt(new_shelter_id)]);
    
    const updatedPet = await Pet.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Pet transferred successfully',
      data: updatedPet
    });
  } catch (error) {
    if (error.message.includes('does not exist')) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
        error: error.message
      });
    }
    if (error.message.includes('adopted pet')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer adopted pet',
        error: error.message
      });
    }
    if (error.message.includes('full capacity')) {
      return res.status(400).json({
        success: false,
        message: 'Target shelter is at full capacity',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error transferring pet',
      error: error.message
    });
  }
};

// Get pet status history
export const getPetStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM Pet_Status_Log WHERE pet_id = $1 ORDER BY changed_at DESC',
      [parseInt(id)]
    );
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pet status history',
      error: error.message
    });
  }
};