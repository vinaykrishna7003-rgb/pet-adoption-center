import Pet from '../models/pet.model.js';

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

// Search pets with filters
export const searchPets = async (req, res) => {
  try {
    const filters = req.query;
    const pets = await Pet.searchPets(filters);
    
    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets
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