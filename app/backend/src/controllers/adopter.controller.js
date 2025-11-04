import Adopter from '../models/adopter.model.js';
import pool from '../database/db.js'; // Assuming you have a database pool configured

// Get adopter's adoption count using database function
const getAdopterAdoptionCount = async (adopterId) => {
  try {
    const result = await pool.query(
      'SELECT get_adopter_adoption_count($1) as adoption_count',
      [adopterId]
    );
    return result.rows[0].adoption_count;
  } catch (error) {
    console.error('Error getting adoption count:', error);
    return 0;
  }
};

// Get all adopters
export const getAllAdopters = async (req, res) => {
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

// Get single adopter by ID with adoption statistics
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

    // Get adoption count using database function
    const adoptionCount = await getAdopterAdoptionCount(id);
    
    res.status(200).json({
      success: true,
      data: {
        ...adopter,
        total_completed_adoptions: adoptionCount
      }
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
// Note: trg_validate_adopter_contact trigger will automatically validate phone and email
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

    // Check if phone already exists
    const existingPhone = await Adopter.findByPhone(adopterData.phone);
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }
    
    // Create adopter - trigger will validate contact info automatically
    const newAdopter = await Adopter.create(adopterData);
    
    res.status(201).json({
      success: true,
      message: 'Adopter created successfully',
      data: newAdopter
    });
  } catch (error) {
    // Handle trigger validation errors
    if (error.message.includes('Phone number must be at least 10 digits')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must be at least 10 digits.',
        error: error.message
      });
    }
    
    if (error.message.includes('Invalid email format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating adopter',
      error: error.message
    });
  }
};

// Update adopter
// Note: trg_validate_adopter_contact trigger will automatically validate phone and email
export const updateAdopter = async (req, res) => {
  try {
    const { id } = req.params;
    const adopterData = req.body;
    
    // If email is being updated, check if it's already in use by another adopter
    if (adopterData.email) {
      const existingAdopter = await Adopter.findByEmail(adopterData.email);
      if (existingAdopter && existingAdopter.adopter_id != id) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered to another adopter'
        });
      }
    }

    // If phone is being updated, check if it's already in use
    if (adopterData.phone) {
      const existingPhone = await Adopter.findByPhone(adopterData.phone);
      if (existingPhone && existingPhone.adopter_id != id) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already registered to another adopter'
        });
      }
    }
    
    // Update adopter - trigger will validate contact info automatically
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
    // Handle trigger validation errors
    if (error.message.includes('Phone number must be at least 10 digits')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must be at least 10 digits.',
        error: error.message
      });
    }
    
    if (error.message.includes('Invalid email format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating adopter',
      error: error.message
    });
  }
};

// Delete adopter
// Note: CASCADE delete will handle related applications and adoptions
export const deleteAdopter = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if adopter has any completed adoptions
    const adoptionCount = await getAdopterAdoptionCount(id);
    
    if (adoptionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete adopter with ${adoptionCount} completed adoption(s). Consider deactivating instead.`
      });
    }

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

// Get adopter with their adoptions and statistics
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

    // Get adoption count using database function
    const adoptionCount = await getAdopterAdoptionCount(id);
    
    res.status(200).json({
      success: true,
      data: {
        ...adopter,
        statistics: {
          total_completed_adoptions: adoptionCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adopter adoptions',
      error: error.message
    });
  }
};

// Get adopter statistics
export const getAdopterStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify adopter exists
    const adopter = await Adopter.findById(id);
    if (!adopter) {
      return res.status(404).json({
        success: false,
        message: 'Adopter not found'
      });
    }

    // Get adoption count using database function
    const completedAdoptions = await getAdopterAdoptionCount(id);

    // Get total applications count
    const applicationsResult = await pool.query(
      'SELECT COUNT(*) as count FROM Application WHERE adopter_id = $1',
      [id]
    );
    const totalApplications = parseInt(applicationsResult.rows[0].count);

    // Get pending applications count
    const pendingResult = await pool.query(
      'SELECT COUNT(*) as count FROM Application WHERE adopter_id = $1 AND status = $2',
      [id, 'Pending']
    );
    const pendingApplications = parseInt(pendingResult.rows[0].count);

    // Get approved applications count
    const approvedResult = await pool.query(
      'SELECT COUNT(*) as count FROM Application WHERE adopter_id = $1 AND status = $2',
      [id, 'Approved']
    );
    const approvedApplications = parseInt(approvedResult.rows[0].count);

    res.status(200).json({
      success: true,
      data: {
        adopter_id: parseInt(id),
        statistics: {
          completed_adoptions: completedAdoptions,
          total_applications: totalApplications,
          pending_applications: pendingApplications,
          approved_applications: approvedApplications
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adopter statistics',
      error: error.message
    });
  }
};

// Search adopters by criteria
export const searchAdopters = async (req, res) => {
  try {
    const { email, phone, housing_type, has_yard } = req.query;
    
    let query = 'SELECT * FROM Adopter WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (email) {
      query += ` AND email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
      paramCount++;
    }

    if (phone) {
      query += ` AND phone LIKE $${paramCount}`;
      params.push(`%${phone}%`);
      paramCount++;
    }

    if (housing_type) {
      query += ` AND housing_type = $${paramCount}`;
      params.push(housing_type);
      paramCount++;
    }

    if (has_yard !== undefined) {
      query += ` AND has_yard = $${paramCount}`;
      params.push(has_yard === 'true');
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching adopters',
      error: error.message
    });
  }
};