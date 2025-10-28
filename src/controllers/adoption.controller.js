import Adoption from '../models/adoption.model.js';
import pool from '../database/db.js'; // Assuming you have a database pool configured
// Call process_adoption procedure
const processAdoptionProcedure = async (adopterId, petId, adoptionFee, notes = null) => {
  try {
    await pool.query(
      'CALL process_adoption($1, $2, $3, $4)',
      [adopterId, petId, adoptionFee, notes]
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get average adoption fee by species using database function
const getAvgAdoptionFeeBySpecies = async (species) => {
  try {
    const result = await pool.query(
      'SELECT get_avg_adoption_fee_by_species($1) as avg_fee',
      [species]
    );
    return parseFloat(result.rows[0].avg_fee);
  } catch (error) {
    console.error('Error getting average fee:', error);
    return 0;
  }
};

// Get adopter adoption count using database function
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

// Create new adoption using the process_adoption procedure
// This ensures all business logic and validations are handled by the database
export const createAdoption = async (req, res) => {
  try {
    const { adopter_id, pet_id, adoption_fee, notes } = req.body;

    // Validate required fields
    if (!adopter_id || !pet_id || adoption_fee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: adopter_id, pet_id, and adoption_fee are required'
      });
    }

    // Use the process_adoption procedure which handles:
    // - Pet availability check
    // - Approved application verification
    // - Adoption record creation
    // - Pet status update
    // - Triggers: prevent_duplicate_adoption, validate_adoption_fee, update_pet_status_on_adoption
    const result = await processAdoptionProcedure(
      adopter_id,
      pet_id,
      adoption_fee,
      notes
    );

    if (!result.success) {
      // Handle specific error cases
      if (result.error.includes('does not exist')) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
          error: result.error
        });
      }
      
      if (result.error.includes('not available')) {
        return res.status(400).json({
          success: false,
          message: 'Pet is not available for adoption',
          error: result.error
        });
      }

      if (result.error.includes('approved application')) {
        return res.status(400).json({
          success: false,
          message: 'Adopter must have an approved application before adopting',
          error: result.error
        });
      }

      if (result.error.includes('already has an active adoption')) {
        return res.status(400).json({
          success: false,
          message: 'This pet already has an active adoption',
          error: result.error
        });
      }

      if (result.error.includes('exceeds maximum limit')) {
        return res.status(400).json({
          success: false,
          message: 'Adoption fee exceeds maximum limit of 50000',
          error: result.error
        });
      }

      // Generic error
      return res.status(400).json({
        success: false,
        message: 'Failed to process adoption',
        error: result.error
      });
    }

    // Get the newly created adoption
    const adoption = await pool.query(
      `SELECT a.*, 
              ad.first_name || ' ' || ad.last_name as adopter_name,
              p.name as pet_name
       FROM Adoption a
       JOIN Adopter ad ON a.adopter_id = ad.adopter_id
       JOIN Pet p ON a.pet_id = p.pet_id
       WHERE a.adopter_id = $1 AND a.pet_id = $2
       ORDER BY a.created_at DESC
       LIMIT 1`,
      [adopter_id, pet_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Adoption processed successfully',
      data: adoption.rows[0]
    });
  } catch (error) {
    // Handle trigger validation errors
    if (error.message.includes('Adoption fee cannot be negative')) {
      return res.status(400).json({
        success: false,
        message: 'Adoption fee must be a positive value',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating adoption',
      error: error.message
    });
  }
};

// Update adoption
// Note: trg_validate_adoption_fee and trg_update_pet_status_on_adoption will fire automatically
export const updateAdoption = async (req, res) => {
  try {
    const { id } = req.params;
    const adoptionData = req.body;

    // Get current adoption to check status changes
    const currentAdoption = await Adoption.findById(id);
    
    if (!currentAdoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption not found'
      });
    }

    // Validate adoption fee if being updated
    if (adoptionData.adoption_fee !== undefined) {
      if (adoptionData.adoption_fee < 0) {
        return res.status(400).json({
          success: false,
          message: 'Adoption fee cannot be negative'
        });
      }
      if (adoptionData.adoption_fee > 50000) {
        return res.status(400).json({
          success: false,
          message: 'Adoption fee exceeds maximum limit of 50000'
        });
      }
    }
    
    // Update adoption - triggers will handle pet status updates automatically
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
    // Handle trigger validation errors
    if (error.message.includes('Adoption fee')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid adoption fee',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating adoption',
      error: error.message
    });
  }
};

// Delete adoption
// Note: Deletion is generally not recommended for adoptions (use status updates instead)
export const deleteAdoption = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if adoption is completed - should not delete completed adoptions
    const adoption = await Adoption.findById(id);
    if (adoption && adoption.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete completed adoptions. Consider updating status to "Cancelled" instead.'
      });
    }

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

// Get adoptions by adopter with statistics
export const getAdoptionsByAdopter = async (req, res) => {
  try {
    const { adopterId } = req.params;
    const adoptions = await Adoption.findByAdopter(adopterId);

    // Get total completed adoptions using database function
    const completedCount = await getAdopterAdoptionCount(adopterId);
    
    res.status(200).json({
      success: true,
      count: adoptions.length,
      data: adoptions,
      statistics: {
        total_completed_adoptions: completedCount
      }
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
// Note: trg_update_pet_status_on_adoption will automatically update pet status
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Completed', 'Trial Period', 'Returned', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Get current adoption
    const currentAdoption = await Adoption.findById(id);
    if (!currentAdoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption not found'
      });
    }

    // Update status - trigger will automatically update pet status
    // - If status is 'Completed' or 'Trial Period': pet becomes 'Adopted'
    // - If status is 'Returned' or 'Cancelled': pet becomes 'Available'
    const updatedAdoption = await Adoption.updateStatus(id, status);
    
    if (!updatedAdoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Adoption status updated to ${status}. Pet status updated automatically.`,
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

// Get average adoption fee by species
export const getAvgFeeBySpecies = async (req, res) => {
  try {
    const { species } = req.params;

    // Validate species
    const validSpecies = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
    if (!validSpecies.includes(species)) {
      return res.status(400).json({
        success: false,
        message: `Invalid species. Must be one of: ${validSpecies.join(', ')}`
      });
    }

    // Use database function to calculate average
    const avgFee = await getAvgAdoptionFeeBySpecies(species);
    
    res.status(200).json({
      success: true,
      data: {
        species: species,
        average_adoption_fee: avgFee,
        currency: 'INR'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching average adoption fee',
      error: error.message
    });
  }
};

// Get all average fees by species
export const getAllAvgFeesBySpecies = async (req, res) => {
  try {
    const species = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
    const avgFees = [];

    for (const sp of species) {
      const avgFee = await getAvgAdoptionFeeBySpecies(sp);
      avgFees.push({
        species: sp,
        average_adoption_fee: avgFee
      });
    }
    
    res.status(200).json({
      success: true,
      data: avgFees,
      currency: 'INR'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching average adoption fees',
      error: error.message
    });
  }
};

// Search adoptions by criteria
export const searchAdoptions = async (req, res) => {
  try {
    const { status, date_from, date_to, min_fee, max_fee } = req.query;
    
    let query = `
      SELECT a.*, 
             ad.first_name || ' ' || ad.last_name as adopter_name,
             ad.email as adopter_email,
             p.name as pet_name,
             p.species as pet_species,
             p.breed as pet_breed
      FROM Adoption a
      JOIN Adopter ad ON a.adopter_id = ad.adopter_id
      JOIN Pet p ON a.pet_id = p.pet_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND a.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (date_from) {
      query += ` AND a.adoption_date >= $${paramCount}`;
      params.push(date_from);
      paramCount++;
    }

    if (date_to) {
      query += ` AND a.adoption_date <= $${paramCount}`;
      params.push(date_to);
      paramCount++;
    }

    if (min_fee) {
      query += ` AND a.adoption_fee >= $${paramCount}`;
      params.push(parseFloat(min_fee));
      paramCount++;
    }

    if (max_fee) {
      query += ` AND a.adoption_fee <= $${paramCount}`;
      params.push(parseFloat(max_fee));
      paramCount++;
    }

    query += ' ORDER BY a.adoption_date DESC';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching adoptions',
      error: error.message
    });
  }
};