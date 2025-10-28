import Application from '../models/application.model.js';
import pool from '../database/db.js'; // Assuming you have a database connection

// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll();
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// Get single application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

// Create new application
export const createApplication = async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Trigger trg_validate_adopter_contact will automatically validate contact info
    const newApplication = await Application.create(applicationData);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: newApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message
    });
  }
};

// Update application
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const applicationData = req.body;
    
    const updatedApplication = await Application.update(id, applicationData);
    
    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedApplication = await Application.delete(id);
    
    if (!deletedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
      data: deletedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message
    });
  }
};

// Get applications by adopter
export const getApplicationsByAdopter = async (req, res) => {
  try {
    const { adopterId } = req.params;
    const applications = await Application.findByAdopter(adopterId);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications by adopter',
      error: error.message
    });
  }
};

// Get applications by status
export const getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const applications = await Application.findByStatus(status);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications by status',
      error: error.message
    });
  }
};

// Update application status using stored procedure
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Use the stored procedure update_application_status
    await pool.query('CALL update_application_status($1, $2)', [parseInt(id), status]);
    
    // Fetch the updated application
    const updatedApplication = await Application.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    // Handle specific PostgreSQL errors
    if (error.message.includes('Invalid status')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided. Must be Pending, Approved, Rejected, or Under Review',
        error: error.message
      });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.getApplicationStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application statistics',
      error: error.message
    });
  }
};

// Get pending applications
export const getPendingApplications = async (req, res) => {
  try {
    const applications = await Application.getPendingApplications();
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending applications',
      error: error.message
    });
  }
};

// Get adopter's adoption history count using function
export const getAdopterAdoptionCount = async (req, res) => {
  try {
    const { adopterId } = req.params;
    
    const result = await pool.query('SELECT get_adopter_adoption_count($1) as adoption_count', [parseInt(adopterId)]);
    
    res.status(200).json({
      success: true,
      data: {
        adopter_id: adopterId,
        adoption_count: result.rows[0].adoption_count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adopter adoption count',
      error: error.message
    });
  }
};
