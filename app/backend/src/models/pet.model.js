import pool from '../database/db.js';

class Pet {
  static async create(petData) {
    const { name, breed, age, gender, color, species, weight, size, status, shelter_id } = petData;
    
    const query = `
      INSERT INTO Pet (name, breed, age, gender, color, species, weight, size, status, shelter_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [name, breed, age, gender, color, species, weight, size, status || 'Available', shelter_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT p.*, s.name as shelter_name, s.city as shelter_city
      FROM Pet p
      LEFT JOIN Shelter s ON p.shelter_id = s.shelter_id
      ORDER BY p.pet_id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, s.name as shelter_name, s.city as shelter_city, s.phone as shelter_phone
      FROM Pet p
      LEFT JOIN Shelter s ON p.shelter_id = s.shelter_id
      WHERE p.pet_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByStatus(status) {
    const query = `
      SELECT p.*, s.name as shelter_name, s.city as shelter_city
      FROM Pet p
      LEFT JOIN Shelter s ON p.shelter_id = s.shelter_id
      WHERE p.status = $1
      ORDER BY p.pet_id
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  static async findBySpecies(species) {
    const query = `
      SELECT p.*, s.name as shelter_name, s.city as shelter_city
      FROM Pet p
      LEFT JOIN Shelter s ON p.shelter_id = s.shelter_id
      WHERE p.species = $1
      ORDER BY p.pet_id
    `;
    const result = await pool.query(query, [species]);
    return result.rows;
  }

  static async findByShelter(shelterId) {
    const query = `
      SELECT p.*, s.name as shelter_name
      FROM Pet p
      LEFT JOIN Shelter s ON p.shelter_id = s.shelter_id
      WHERE p.shelter_id = $1
      ORDER BY p.pet_id
    `;
    const result = await pool.query(query, [shelterId]);
    return result.rows;
  }

  static async update(id, petData) {
    const { name, breed, age, gender, color, species, weight, size, status, shelter_id } = petData;
    
    const query = `
      UPDATE Pet 
      SET name = $1, breed = $2, age = $3, gender = $4, color = $5, 
          species = $6, weight = $7, size = $8, status = $9, shelter_id = $10
      WHERE pet_id = $11
      RETURNING *
    `;
    
    const values = [name, breed, age, gender, color, species, weight, size, status, shelter_id, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE Pet SET status = $1 WHERE pet_id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM Pet WHERE pet_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async searchPets(filters) {
    let query = `
      SELECT p.*, s.name as shelter_name, s.city as shelter_city
      FROM Pet p
      LEFT JOIN Shelter s ON p.shelter_id = s.shelter_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.species) {
      query += ` AND p.species = $${paramCount}`;
      values.push(filters.species);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND p.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.size) {
      query += ` AND p.size = $${paramCount}`;
      values.push(filters.size);
      paramCount++;
    }

    if (filters.gender) {
      query += ` AND p.gender = $${paramCount}`;
      values.push(filters.gender);
      paramCount++;
    }

    if (filters.minAge !== undefined) {
      query += ` AND p.age >= $${paramCount}`;
      values.push(filters.minAge);
      paramCount++;
    }

    if (filters.maxAge !== undefined) {
      query += ` AND p.age <= $${paramCount}`;
      values.push(filters.maxAge);
      paramCount++;
    }

    query += ' ORDER BY p.pet_id';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getPetStatistics() {
    const query = `
      SELECT 
        status,
        species,
        COUNT(*) as count
      FROM Pet
      GROUP BY status, species
      ORDER BY status, species
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default Pet;