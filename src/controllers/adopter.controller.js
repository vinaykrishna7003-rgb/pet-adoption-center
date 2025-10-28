import Adopter from '../models/adopter.model.js';

// Get all adopters
export const getAllAdoters = async (req, res) => {
  try {
    const adopters = await Adopter.findAll();
    res.status(200).json({
      success: true,
      count: adopters.length,
      data: adopters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adopters',
      error: error.message
    });
  }
};

// Get single adopter by ID
export const getAdopterById = async (req, res) => {
  try {
    const { id } = req.params;
    const adopter = await Adopter.findById(id);
    
    if (!adopter) {
      return res.status(404).json({
        success: false,
        message: 'Adopter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: adopter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adopter',
      error: error.message
    });
  }
};

// Create new adopter
export const createAdopter = async (req, res) => {
  try {
    const adopterData = req.body;
    
    // Check if email already exists
    const existingAdopter = await Adopter.findByEmail(adopterData.email);
    if (existingAdopter) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    const newAdopter = await Adopter.create(adopterData);
    res.status(201).json({
      success: true,
      message: 'Adopter created successfully',
      data: newAdopter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating adopter',
      error: error.message
    });
  }
};

// Update adopter
export const updateAdopter = async (req, res) => {
  try {
    const { id } = req.params;
    const adopterData = req.body;
    
    const updatedAdopter = await Adopter.update(id, adopterData);
    
    if (!updatedAdopter) {
      return res.status(404).json({
        success: false,
        message: 'Adopter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Adopter updated successfully',
      data: updatedAdopter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating adopter',
      error: error.message
    });
  }
};

// Delete adopter
export const deleteAdopter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdopter = await Adopter.delete(id);
    
    if (!deletedAdopter) {
      return res.status(404).json({
        success: false,
        message: 'Adopter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Adopter deleted successfully',
      data: deletedAdopter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting adopter',
      error: error.message
    });
  }
};

// Get adopter with their applications
export const getAdopterWithApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const adopter = await Adopter.getAdopterWithApplications(id);
    
    if (!adopter) {
      return res.status(404).json({
        success: false,
        message: 'Adopter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: adopter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adopter applications',
      error: error.message
    });
  }
};

// Get adopter with their adoptions
export const getAdopterWithAdoptions = async (req, res) => {
  try {
    const { id } = req.params;
    const adopter = await Adopter.getAdopterWithAdoptions(id);
    
    if (!adopter) {
      return res.status(404).json({
        success: false,
        message: 'Adopter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: adopter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adopter adoptions',
      error: error.message
    });
  }
};