import pool from '../database/db.js';

class Adopter {
  static async create(adopterData) {
    const { first_name, last_name, phone, email, address, housing_type, has_yard } = adopterData;
    
    const query = `
      INSERT INTO Adopter (first_name, last_name, phone, email, address, housing_type, has_yard)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [first_name, last_name, phone, email, address, housing_type, has_yard];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM Adopter ORDER BY adopter_id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM Adopter WHERE adopter_id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM Adopter WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, adopterData) {
    const { first_name, last_name, phone, email, address, housing_type, has_yard } = adopterData;
    
    const query = `
      UPDATE Adopter 
      SET first_name = $1, last_name = $2, phone = $3, email = $4, 
          address = $5, housing_type = $6, has_yard = $7
      WHERE adopter_id = $8
      RETURNING *
    `;
    
    const values = [first_name, last_name, phone, email, address, housing_type, has_yard, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM Adopter WHERE adopter_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAdopterWithApplications(id) {
    const query = `
      SELECT a.*, 
             json_agg(
               json_build_object(
                 'application_id', app.application_id,
                 'application_date', app.application_date,
                 'status', app.status,
                 'preferred_pet_age', app.preferred_pet_age,
                 'experience_level', app.experience_level
               )
             ) FILTER (WHERE app.application_id IS NOT NULL) as applications
      FROM Adopter a
      LEFT JOIN Application app ON a.adopter_id = app.adopter_id
      WHERE a.adopter_id = $1
      GROUP BY a.adopter_id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAdopterWithAdoptions(id) {
    const query = `
      SELECT a.*, 
             json_agg(
               json_build_object(
                 'adoption_id', ad.adoption_id,
                 'pet_id', ad.pet_id,
                 'pet_name', p.name,
                 'adoption_date', ad.adoption_date,
                 'adoption_fee', ad.adoption_fee,
                 'status', ad.status
               )
             ) FILTER (WHERE ad.adoption_id IS NOT NULL) as adoptions
      FROM Adopter a
      LEFT JOIN Adoption ad ON a.adopter_id = ad.adopter_id
      LEFT JOIN Pet p ON ad.pet_id = p.pet_id
      WHERE a.adopter_id = $1
      GROUP BY a.adopter_id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default Adopter;