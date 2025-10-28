import pool from '../database/db.js';

class Shelter {
  static async create(shelterData) {
    const { name, address, city, phone, capacity } = shelterData;
    
    const query = `
      INSERT INTO Shelter (name, address, city, phone, capacity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [name, address, city, phone, capacity];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM Shelter ORDER BY shelter_id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM Shelter WHERE shelter_id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCity(city) {
    const query = 'SELECT * FROM Shelter WHERE city = $1 ORDER BY shelter_id';
    const result = await pool.query(query, [city]);
    return result.rows;
  }

  static async update(id, shelterData) {
    const { name, address, city, phone, capacity } = shelterData;
    
    const query = `
      UPDATE Shelter 
      SET name = $1, address = $2, city = $3, phone = $4, capacity = $5
      WHERE shelter_id = $6
      RETURNING *
    `;
    
    const values = [name, address, city, phone, capacity, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM Shelter WHERE shelter_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getShelterWithPets(id) {
    const query = `
      SELECT s.*,
             json_agg(
               json_build_object(
                 'pet_id', p.pet_id,
                 'name', p.name,
                 'species', p.species,
                 'breed', p.breed,
                 'age', p.age,
                 'status', p.status
               )
             ) FILTER (WHERE p.pet_id IS NOT NULL) as pets,
             COUNT(p.pet_id) FILTER (WHERE p.status = 'Available') as available_pets,
             COUNT(p.pet_id) as total_pets
      FROM Shelter s
      LEFT JOIN Pet p ON s.shelter_id = p.shelter_id
      WHERE s.shelter_id = $1
      GROUP BY s.shelter_id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getShelterWithStaff(id) {
    const query = `
      SELECT s.*,
             json_agg(
               json_build_object(
                 'staff_id', st.staff_id,
                 'first_name', st.first_name,
                 'last_name', st.last_name,
                 'email', st.email,
                 'role', st.role
               )
             ) FILTER (WHERE st.staff_id IS NOT NULL) as staff
      FROM Shelter s
      LEFT JOIN Staff st ON s.shelter_id = st.shelter_id
      WHERE s.shelter_id = $1
      GROUP BY s.shelter_id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getShelterCapacity(id) {
    const query = `
      SELECT s.shelter_id, s.name, s.capacity,
             COUNT(p.pet_id) as current_occupancy,
             s.capacity - COUNT(p.pet_id) as available_space,
             ROUND((COUNT(p.pet_id)::numeric / s.capacity) * 100, 2) as occupancy_percentage
      FROM Shelter s
      LEFT JOIN Pet p ON s.shelter_id = p.shelter_id
      WHERE s.shelter_id = $1
      GROUP BY s.shelter_id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAllSheltersWithStats() {
    const query = `
      SELECT s.*,
             COUNT(p.pet_id) as total_pets,
             COUNT(p.pet_id) FILTER (WHERE p.status = 'Available') as available_pets,
             COUNT(st.staff_id) as staff_count,
             ROUND((COUNT(p.pet_id)::numeric / s.capacity) * 100, 2) as occupancy_percentage
      FROM Shelter s
      LEFT JOIN Pet p ON s.shelter_id = p.shelter_id
      LEFT JOIN Staff st ON s.shelter_id = st.shelter_id
      GROUP BY s.shelter_id
      ORDER BY s.shelter_id
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }
}

export default Shelter;