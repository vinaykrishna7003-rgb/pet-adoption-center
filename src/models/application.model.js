import pool from '../database/db.js';

class Application {
  static async create(applicationData) {
    const { adopter_id, application_date, status, preferred_pet_age, experience_level } = applicationData;
    
    const query = `
      INSERT INTO Application (adopter_id, application_date, status, preferred_pet_age, experience_level)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      adopter_id, 
      application_date || new Date(), 
      status || 'Pending', 
      preferred_pet_age, 
      experience_level
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT app.*, 
             a.first_name, a.last_name, a.email, a.phone
      FROM Application app
      LEFT JOIN Adopter a ON app.adopter_id = a.adopter_id
      ORDER BY app.application_id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT app.*, 
             a.first_name, a.last_name, a.email, a.phone, a.address, 
             a.housing_type, a.has_yard
      FROM Application app
      LEFT JOIN Adopter a ON app.adopter_id = a.adopter_id
      WHERE app.application_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByAdopter(adopterId) {
    const query = `
      SELECT app.*
      FROM Application app
      WHERE app.adopter_id = $1
      ORDER BY app.application_date DESC
    `;
    const result = await pool.query(query, [adopterId]);
    return result.rows;
  }

  static async findByStatus(status) {
    const query = `
      SELECT app.*, 
             a.first_name, a.last_name, a.email, a.phone
      FROM Application app
      LEFT JOIN Adopter a ON app.adopter_id = a.adopter_id
      WHERE app.status = $1
      ORDER BY app.application_date DESC
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  static async update(id, applicationData) {
    const { status, preferred_pet_age, experience_level } = applicationData;
    
    const query = `
      UPDATE Application 
      SET status = $1, preferred_pet_age = $2, experience_level = $3
      WHERE application_id = $4
      RETURNING *
    `;
    
    const values = [status, preferred_pet_age, experience_level, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE Application SET status = $1 WHERE application_id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM Application WHERE application_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getApplicationStats() {
    const query = `
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
      FROM Application
      GROUP BY status
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getPendingApplications() {
    const query = `
      SELECT app.*, 
             a.first_name, a.last_name, a.email, a.phone,
             EXTRACT(DAY FROM CURRENT_DATE - app.application_date) as days_pending
      FROM Application app
      LEFT JOIN Adopter a ON app.adopter_id = a.adopter_id
      WHERE app.status = 'Pending'
      ORDER BY app.application_date ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default Application;