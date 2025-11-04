import pool from '../database/db.js';

class Staff {
  static async create(staffData) {
    const { first_name, last_name, email, role, hire_date, shelter_id } = staffData;
    
    const query = `
      INSERT INTO Staff (first_name, last_name, email, role, hire_date, shelter_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [first_name, last_name, email, role, hire_date || new Date(), shelter_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT st.*, s.name as shelter_name, s.city as shelter_city
      FROM Staff st
      LEFT JOIN Shelter s ON st.shelter_id = s.shelter_id
      ORDER BY st.staff_id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT st.*, s.name as shelter_name, s.city as shelter_city, s.address as shelter_address
      FROM Staff st
      LEFT JOIN Shelter s ON st.shelter_id = s.shelter_id
      WHERE st.staff_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM Staff WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByShelter(shelterId) {
    const query = `
      SELECT st.*
      FROM Staff st
      WHERE st.shelter_id = $1
      ORDER BY st.staff_id
    `;
    const result = await pool.query(query, [shelterId]);
    return result.rows;
  }

  static async findByRole(role) {
    const query = `
      SELECT st.*, s.name as shelter_name, s.city as shelter_city
      FROM Staff st
      LEFT JOIN Shelter s ON st.shelter_id = s.shelter_id
      WHERE st.role = $1
      ORDER BY st.staff_id
    `;
    const result = await pool.query(query, [role]);
    return result.rows;
  }

  static async update(id, staffData) {
    const { first_name, last_name, email, role, shelter_id } = staffData;
    
    const query = `
      UPDATE Staff 
      SET first_name = $1, last_name = $2, email = $3, role = $4, shelter_id = $5
      WHERE staff_id = $6
      RETURNING *
    `;
    
    const values = [first_name, last_name, email, role, shelter_id, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM Staff WHERE staff_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getStaffStatsByRole() {
    const query = `
      SELECT 
        role,
        COUNT(*) as count,
        json_agg(
          json_build_object(
            'staff_id', staff_id,
            'first_name', first_name,
            'last_name', last_name,
            'email', email
          )
        ) as staff_members
      FROM Staff
      GROUP BY role
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getStaffWithShelterDetails(id) {
    const query = `
      SELECT st.*, 
             s.name as shelter_name, 
             s.address as shelter_address, 
             s.city as shelter_city,
             s.phone as shelter_phone,
             s.capacity as shelter_capacity,
             COUNT(p.pet_id) as total_pets_in_shelter
      FROM Staff st
      LEFT JOIN Shelter s ON st.shelter_id = s.shelter_id
      LEFT JOIN Pet p ON s.shelter_id = p.shelter_id
      WHERE st.staff_id = $1
      GROUP BY st.staff_id, s.shelter_id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default Staff;