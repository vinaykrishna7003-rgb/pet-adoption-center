import Adoption from '../models/adoption.model.js';

// Get all adoptions
export const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.findAll();
    res.status(200).json({
      success: true,
      count: adoptions.length,
      data: adoptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adoptions',
      error: error.message
    });
  }
};

// Get single adoption by ID
export const getAdoptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const adoption = await Adoption.findById(id);
    
    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: adoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adoption',
      error: error.message
    });
  }
};

// Create new adoption
export const createAdoption = async (req, res) => {
  try {
    const adoptionData = req.body;
    const newAdoption = await Adoption.create(adoptionData);
    
    res.status(201).json({
      success: true,
      message: 'Adoption recorded successfully',
      data: newAdoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating adoption',
      error: error.message
    });
  }
};

// Update adoption
export const updateAdoption = async (req, res) => {
  try {
    const { id } = req.params;
    const adoptionData = req.body;
    
    const updatedAdoption = await Adoption.update(id, adoptionData);
    
    if (!updatedAdoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Adoption updated successfully',
      data: updatedAdoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating adoption',
      error: error.message
    });
  }
};

// Delete adoption
export const deleteAdoption = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdoption = await Adoption.delete(id);
    
    if (!deletedAdoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Adoption deleted successfully',
      data: deletedAdoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting adoption',
      error: error.message
    });
  }
};

// Get adoptions by adopter
export const getAdoptionsByAdopter = async (req, res) => {
  try {
    const { adopterId } = req.params;
    const adoptions = await Adoption.findByAdopter(adopterId);
    
    res.status(200).json({
      success: true,
      count: adoptions.length,
      data: adoptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adoptions by adopter',
      error: error.message
    });
  }
};

// Get adoptions by pet
export const getAdoptionsByPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const adoptions = await Adoption.findByPet(petId);
    
    res.status(200).json({
      success: true,
      count: adoptions.length,
      data: adoptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adoptions by pet',
      error: error.message
    });
  }
};

// Update adoption status
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedAdoption = await Adoption.updateStatus(id, status);
    
    if (!updatedAdoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Adoption status updated successfully',
      data: updatedAdoption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating adoption status',
      error: error.message
    });
  }
};

// Get adoption statistics
export const getAdoptionStats = async (req, res) => {
  try {
    const stats = await Adoption.getAdoptionStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adoption statistics',
      error: error.message
    });
  }
};

// Get adoptions by month
export const getAdoptionsByMonth = async (req, res) => {
  try {
    const { year } = req.params;
    const adoptions = await Adoption.getAdoptionsByMonth(year);
    
    res.status(200).json({
      success: true,
      data: adoptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adoptions by month',
      error: error.message
    });
  }
};

// Get recent adoptions
export const getRecentAdoptions = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const adoptions = await Adoption.getRecentAdoptions(limit);
    
    res.status(200).json({
      success: true,
      count: adoptions.length,
      data: adoptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent adoptions',
      error: error.message
    });
  }
};