import React, { useEffect, useState } from 'react';
import { staffAPI, sheltersAPI } from '../../services/api';

function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', role: '', hire_date: '', shelter_id: ''
  });

  useEffect(() => {
    fetchStaff();
    fetchShelters();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShelters = async () => {
    try {
      const response = await sheltersAPI.getAll();
      setShelters(response.data.data || []);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await staffAPI.update(editingStaff.staff_id, formData);
      } else {
        await staffAPI.create(formData);
      }
      setShowForm(false);
      setEditingStaff(null);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member');
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      first_name: staffMember.first_name,
      last_name: staffMember.last_name,
      email: staffMember.email,
      role: staffMember.role,
      hire_date: staffMember.hire_date?.split('T')[0] || '',
      shelter_id: staffMember.shelter_id
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffAPI.delete(id);
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff member');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '', last_name: '', email: '', role: '', hire_date: '', shelter_id: ''
    });
  };

  return (
    <div className="admin-staff py-8" data-testid="admin-staff-page">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="page-title">Manage Staff</h1>
          <button
            onClick={() => { setShowForm(true); setEditingStaff(null); resetForm(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            data-testid="add-staff-button"
          >
            + Add Staff Member
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-testid="staff-form">
            <h2 className="text-xl font-semibold mb-4">{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                required
                className="px-3 py-2 border rounded"
                data-testid="first-name-input"
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                required
                className="px-3 py-2 border rounded"
                data-testid="last-name-input"
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="px-3 py-2 border rounded"
                data-testid="email-input"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
                className="px-3 py-2 border rounded"
                data-testid="role-select"
              >
                <option value="">Select Role *</option>
                <option value="Manager">Manager</option>
                <option value="Veterinarian">Veterinarian</option>
                <option value="Caretaker">Caretaker</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Volunteer">Volunteer</option>
              </select>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                required
                className="px-3 py-2 border rounded"
                data-testid="hire-date-input"
              />
              <select
                value={formData.shelter_id}
                onChange={(e) => setFormData({...formData, shelter_id: e.target.value})}
                required
                className="px-3 py-2 border rounded"
                data-testid="shelter-select"
              >
                <option value="">Select Shelter *</option>
                {shelters.map(s => (
                  <option key={s.shelter_id} value={s.shelter_id}>{s.name}</option>
                ))}
              </select>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  data-testid="submit-staff-button"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingStaff(null); }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  data-testid="cancel-staff-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p data-testid="loading-staff">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto" data-testid="staff-table">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Shelter</th>
                  <th className="px-4 py-3 text-left">Hire Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member.staff_id} className="border-t" data-testid={`staff-row-${member.staff_id}`}>
                    <td className="px-4 py-3">{member.first_name} {member.last_name}</td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{member.shelter_name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {member.hire_date ? new Date(member.hire_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 hover:underline mr-2"
                        data-testid={`edit-staff-${member.staff_id}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.staff_id)}
                        className="text-red-600 hover:underline"
                        data-testid={`delete-staff-${member.staff_id}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStaff;