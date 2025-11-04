import React, { useEffect, useState } from 'react';
import { sheltersAPI } from '../../services/api.js';

function AdminShelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', phone: '', capacity: ''
  });

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await sheltersAPI.getStats();
      setShelters(response.data.data || []);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingShelter) {
        await sheltersAPI.update(editingShelter.shelter_id, formData);
      } else {
        await sheltersAPI.create(formData);
      }
      setShowForm(false);
      setEditingShelter(null);
      resetForm();
      fetchShelters();
    } catch (error) {
      console.error('Error saving shelter:', error);
      alert('Failed to save shelter');
    }
  };

  const handleEdit = (shelter) => {
    setEditingShelter(shelter);
    setFormData({
      name: shelter.name, address: shelter.address,
      city: shelter.city, phone: shelter.phone, capacity: shelter.capacity
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      try {
        await sheltersAPI.delete(id);
        fetchShelters();
      } catch (error) {
        console.error('Error deleting shelter:', error);
        alert('Failed to delete shelter');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', address: '', city: '', phone: '', capacity: ''
    });
  };

  return (
    <div className="admin-shelters py-8" data-testid="admin-shelters-page">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="page-title">Manage Shelters</h1>
          <button
            onClick={() => { setShowForm(true); setEditingShelter(null); resetForm(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            data-testid="add-shelter-button"
          >
            + Add Shelter
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-testid="shelter-form">
            <h2 className="text-xl font-semibold mb-4">{editingShelter ? 'Edit Shelter' : 'Add New Shelter'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Shelter Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-3 py-2 border rounded" data-testid="shelter-name-input" />
              <input type="text" placeholder="City *" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required className="px-3 py-2 border rounded" data-testid="city-input" />
              <input type="text" placeholder="Address *" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required className="px-3 py-2 border rounded md:col-span-2" data-testid="address-input" />
              <input type="tel" placeholder="Phone *" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="px-3 py-2 border rounded" data-testid="phone-input" />
              <input type="number" placeholder="Capacity *" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required className="px-3 py-2 border rounded" data-testid="capacity-input" />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" data-testid="submit-shelter-button">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingShelter(null); }} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600" data-testid="cancel-shelter-button">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p data-testid="loading-shelters">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="shelters-grid">
            {shelters.map(shelter => (
              <div key={shelter.shelter_id} className="bg-white rounded-lg shadow-md p-6" data-testid={`shelter-card-${shelter.shelter_id}`}>
                <h3 className="text-xl font-bold mb-2">{shelter.name}</h3>
                <p className="text-gray-600 mb-1">{shelter.city}</p>
                <p className="text-sm text-gray-500 mb-3">{shelter.address}</p>
                <p className="text-sm text-gray-600 mb-2">📞 {shelter.phone}</p>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Capacity:</span>
                    <span className="font-semibold">{shelter.capacity} pets</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Pets:</span>
                    <span className="font-semibold">{shelter.total_pets || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Available:</span>
                    <span className="font-semibold text-green-600">{shelter.available_pets || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Occupancy:</span>
                    <span className="font-semibold">{shelter.occupancy_percentage || 0}%</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(shelter)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" data-testid={`edit-shelter-${shelter.shelter_id}`}>Edit</button>
                  <button onClick={() => handleDelete(shelter.shelter_id)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" data-testid={`delete-shelter-${shelter.shelter_id}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminShelters;