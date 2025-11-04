import React, { useEffect, useState } from 'react';
import { adoptersAPI } from '../../services/api';

function AdminAdopters() {
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdopter, setEditingAdopter] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', housing_type: '', has_yard: false
  });

  useEffect(() => {
    fetchAdopters();
  }, []);

  const fetchAdopters = async () => {
    try {
      const response = await adoptersAPI.getAll();
      setAdopters(response.data.data || []);
    } catch (error) {
      console.error('Error fetching adopters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdopter) {
        await adoptersAPI.update(editingAdopter.adopter_id, formData);
      } else {
        await adoptersAPI.create(formData);
      }
      setShowForm(false);
      setEditingAdopter(null);
      resetForm();
      fetchAdopters();
    } catch (error) {
      console.error('Error saving adopter:', error);
      alert('Failed to save adopter');
    }
  };

  const handleEdit = (adopter) => {
    setEditingAdopter(adopter);
    setFormData({
      first_name: adopter.first_name, last_name: adopter.last_name,
      email: adopter.email, phone: adopter.phone, address: adopter.address,
      housing_type: adopter.housing_type, has_yard: adopter.has_yard
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this adopter?')) {
      try {
        await adoptersAPI.delete(id);
        fetchAdopters();
      } catch (error) {
        console.error('Error deleting adopter:', error);
        alert('Failed to delete adopter');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '', last_name: '', email: '', phone: '',
      address: '', housing_type: '', has_yard: false
    });
  };

  return (
    <div className="admin-adopters py-8" data-testid="admin-adopters-page">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="page-title">Manage Adopters</h1>
          <button
            onClick={() => { setShowForm(true); setEditingAdopter(null); resetForm(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            data-testid="add-adopter-button"
          >
            + Add Adopter
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-testid="adopter-form">
            <h2 className="text-xl font-semibold mb-4">{editingAdopter ? 'Edit Adopter' : 'Add New Adopter'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required className="px-3 py-2 border rounded" data-testid="first-name-input" />
              <input type="text" placeholder="Last Name *" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required className="px-3 py-2 border rounded" data-testid="last-name-input" />
              <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="px-3 py-2 border rounded" data-testid="email-input" />
              <input type="tel" placeholder="Phone *" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="px-3 py-2 border rounded" data-testid="phone-input" />
              <input type="text" placeholder="Address *" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required className="px-3 py-2 border rounded md:col-span-2" data-testid="address-input" />
              <select value={formData.housing_type} onChange={(e) => setFormData({...formData, housing_type: e.target.value})} required className="px-3 py-2 border rounded" data-testid="housing-type-select">
                <option value="">Select Housing Type *</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Other">Other</option>
              </select>
              <label className="flex items-center space-x-2" data-testid="has-yard-label">
                <input type="checkbox" checked={formData.has_yard} onChange={(e) => setFormData({...formData, has_yard: e.target.checked})} className="w-4 h-4" data-testid="has-yard-checkbox" />
                <span>Has Yard</span>
              </label>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" data-testid="submit-adopter-button">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingAdopter(null); }} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600" data-testid="cancel-adopter-button">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p data-testid="loading-adopters">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto" data-testid="adopters-table">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Housing</th>
                  <th className="px-4 py-3 text-left">Has Yard</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adopters.map(adopter => (
                  <tr key={adopter.adopter_id} className="border-t" data-testid={`adopter-row-${adopter.adopter_id}`}>
                    <td className="px-4 py-3">{adopter.first_name} {adopter.last_name}</td>
                    <td className="px-4 py-3">{adopter.email}</td>
                    <td className="px-4 py-3">{adopter.phone}</td>
                    <td className="px-4 py-3">{adopter.housing_type}</td>
                    <td className="px-4 py-3">{adopter.has_yard ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(adopter)} className="text-blue-600 hover:underline mr-2" data-testid={`edit-adopter-${adopter.adopter_id}`}>Edit</button>
                      <button onClick={() => handleDelete(adopter.adopter_id)} className="text-red-600 hover:underline" data-testid={`delete-adopter-${adopter.adopter_id}`}>Delete</button>
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

export default AdminAdopters;