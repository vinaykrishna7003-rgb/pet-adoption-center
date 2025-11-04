import Staff from '../models/staff.model.js';

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching staff',
      error: error.message
    });
  }
};

// Get single staff by ID
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching staff',
      error: error.message
    });
  }
};

// Create new staff
export const createStaff = async (req, res) => {
  try {
    const staffData = req.body;
    
    // Check if email already exists
    const existingStaff = await Staff.findByEmail(staffData.email);
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    const newStaff = await Staff.create(staffData);
    
    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: newStaff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating staff',
      error: error.message
    });
  }
};

// Update staff
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staffData = req.body;
    
    const updatedStaff = await Staff.update(id, staffData);
    
    if (!updatedStaff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Staff updated successfully',
      data: updatedStaff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating staff',
      error: error.message
    });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaff = await Staff.delete(id);
    
    if (!deletedStaff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Staff deleted successfully',
      data: deletedStaff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting staff',
      error: error.message
    });
  }
};

// Get staff by shelter
export const getStaffByShelter = async (req, res) => {
  try {
    const { shelterId } = req.params;
    const staff = await Staff.findByShelter(shelterId);
    
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching staff by shelter',
      error: error.message
    });
  }
};

// Get staff by role
export const getStaffByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const staff = await Staff.findByRole(role);
    
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching staff by role',
      error: error.message
    });
  }
};

// Get staff statistics by role
export const getStaffStatsByRole = async (req, res) => {
  try {
    const stats = await Staff.getStaffStatsByRole();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching staff statistics',
      error: error.message
    });
  }
};

// Get staff with shelter details
export const getStaffWithShelterDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.getStaffWithShelterDetails(id);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching staff with shelter details',
      error: error.message
    });
  }
};