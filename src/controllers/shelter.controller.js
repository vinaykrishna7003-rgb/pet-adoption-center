import Shelter from '../models/shelter.model.js';

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

// Get shelter capacity info
export const getShelterCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const capacity = await Shelter.getShelterCapacity(id);
    
    if (!capacity) {
      return res.status(404).json({
        success: false,
        message: 'Shelter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: capacity
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