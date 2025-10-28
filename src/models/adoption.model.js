import pool from '../database/db.js';

class Adoption {
  static async create(adoptionData) {
    const { adopter_id, pet_id, adoption_date, adoption_fee, notes, status } = adoptionData;
    
    const query = `
      INSERT INTO Adoption (adopter_id, pet_id, adoption_date, adoption_fee, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      adopter_id, 
      pet_id, 
      adoption_date || new Date(), 
      adoption_fee, 
      notes, 
      status || 'Completed'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT ad.*, 
             a.first_name as adopter_first_name, a.last_name as adopter_last_name,
             a.email as adopter_email, a.phone as adopter_phone,
             p.name as pet_name, p.species, p.breed, p.age as pet_age
      FROM Adoption ad
      LEFT JOIN Adopter a ON ad.adopter_id = a.adopter_id
      LEFT JOIN Pet p ON ad.pet_id = p.pet_id
      ORDER BY ad.adoption_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT ad.*, 
             a.first_name as adopter_first_name, a.last_name as adopter_last_name,
             a.email as adopter_email, a.phone as adopter_phone, a.address,
             p.name as pet_name, p.species, p.breed, p.age as pet_age,
             p.gender, p.color, s.name as shelter_name
      FROM Adoption ad
      LEFT JOIN Adopter a ON ad.adopter_id = a.adopter_id
      LEFT JOIN Pet p ON ad.pet_id = p.pet_id
      LEFT JOIN Shelter s ON p.shelter_id = s.shelter_id
      WHERE ad.adoption_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByAdopter(adopterId) {
    const query = `
      SELECT ad.*, 
             p.name as pet_name, p.species, p.breed
      FROM Adoption ad
      LEFT JOIN Pet p ON ad.pet_id = p.pet_id
      WHERE ad.adopter_id = $1
      ORDER BY ad.adoption_date DESC
    `;
    const result = await pool.query(query, [adopterId]);
    return result.rows;
  }

  static async findByPet(petId) {
    const query = `
      SELECT ad.*, 
             a.first_name, a.last_name, a.email, a.phone
      FROM Adoption ad
      LEFT JOIN Adopter a ON ad.adopter_id = a.adopter_id
      WHERE ad.pet_id = $1
      ORDER BY ad.adoption_date DESC
    `;
    const result = await pool.query(query, [petId]);
    return result.rows;
  }

  static async update(id, adoptionData) {
    const { adoption_fee, notes, status } = adoptionData;
    
    const query = `
      UPDATE Adoption 
      SET adoption_fee = $1, notes = $2, status = $3
      WHERE adoption_id = $4
      RETURNING *
    `;
    
    const values = [adoption_fee, notes, status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE Adoption SET status = $1 WHERE adoption_id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM Adoption WHERE adoption_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAdoptionStats() {
    const query = `
      SELECT 
        COUNT(*) as total_adoptions,
        SUM(adoption_fee) as total_revenue,
        AVG(adoption_fee) as average_fee,
        COUNT(DISTINCT adopter_id) as unique_adopters
      FROM Adoption
      WHERE status = 'Completed'
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  static async getAdoptionsByMonth(year) {
    const query = `
      SELECT 
        EXTRACT(MONTH FROM adoption_date) as month,
        COUNT(*) as adoption_count,
        SUM(adoption_fee) as monthly_revenue
      FROM Adoption
      WHERE EXTRACT(YEAR FROM adoption_date) = $1 AND status = 'Completed'
      GROUP BY EXTRACT(MONTH FROM adoption_date)
      ORDER BY month
    `;
    const result = await pool.query(query, [year]);
    return result.rows;
  }

  static async getRecentAdoptions(limit = 10) {
    const query = `
      SELECT ad.*, 
             a.first_name as adopter_first_name, a.last_name as adopter_last_name,
             p.name as pet_name, p.species, p.breed
      FROM Adoption ad
      LEFT JOIN Adopter a ON ad.adopter_id = a.adopter_id
      LEFT JOIN Pet p ON ad.pet_id = p.pet_id
      WHERE ad.status = 'Completed'
      ORDER BY ad.adoption_date DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

export default Adoption;