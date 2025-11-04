import React, { useEffect, useState } from 'react';
import { adoptionsAPI, adoptersAPI, petsAPI } from '../../services/api.js';

function AdminAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [adopters, setAdopters] = useState([]);
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    adopter_id: '', pet_id: '', adoption_date: '', adoption_fee: '', notes: '', status: 'Completed'
  });

  useEffect(() => {
    fetchAdoptions();
    fetchAdoptersAndPets();
  }, []);

  const fetchAdoptions = async () => {
    try {
      const response = await adoptionsAPI.getAll();
      setAdoptions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching adoptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdoptersAndPets = async () => {
    try {
      const [adoptersRes, petsRes] = await Promise.all([
        adoptersAPI.getAll(),
        petsAPI.getByStatus('Available')
      ]);
      setAdopters(adoptersRes.data.data || []);
      setPets(petsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adoptionsAPI.create(formData);
      setShowForm(false);
      resetForm();
      fetchAdoptions();
    } catch (error) {
      console.error('Error creating adoption:', error);
      alert('Failed to create adoption');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this adoption record?')) {
      try {
        await adoptionsAPI.delete(id);
        fetchAdoptions();
      } catch (error) {
        console.error('Error deleting adoption:', error);
        alert('Failed to delete adoption');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      adopter_id: '', pet_id: '', adoption_date: '', adoption_fee: '', notes: '', status: 'Completed'
    });
  };

  return (
    <div className="admin-adoptions py-8" data-testid="admin-adoptions-page">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="page-title">Manage Adoptions</h1>
          <button
            onClick={() => { setShowForm(true); resetForm(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            data-testid="add-adoption-button"
          >
            + Record Adoption
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-testid="adoption-form">
            <h2 className="text-xl font-semibold mb-4">Record New Adoption</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <select value={formData.adopter_id} onChange={(e) => setFormData({...formData, adopter_id: e.target.value})} required className="px-3 py-2 border rounded" data-testid="adopter-select">
                <option value="">Select Adopter *</option>
                {adopters.map(a => <option key={a.adopter_id} value={a.adopter_id}>{a.first_name} {a.last_name}</option>)}
              </select>
              <select value={formData.pet_id} onChange={(e) => setFormData({...formData, pet_id: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-select">
                <option value="">Select Pet *</option>
                {pets.map(p => <option key={p.pet_id} value={p.pet_id}>{p.name} ({p.species})</option>)}
              </select>
              <input type="date" value={formData.adoption_date} onChange={(e) => setFormData({...formData, adoption_date: e.target.value})} required className="px-3 py-2 border rounded" data-testid="adoption-date-input" />
              <input type="number" step="0.01" placeholder="Adoption Fee *" value={formData.adoption_fee} onChange={(e) => setFormData({...formData, adoption_fee: e.target.value})} required className="px-3 py-2 border rounded" data-testid="adoption-fee-input" />
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required className="px-3 py-2 border rounded" data-testid="status-select">
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
              <input type="text" placeholder="Notes (optional)" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="px-3 py-2 border rounded" data-testid="notes-input" />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" data-testid="submit-adoption-button">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600" data-testid="cancel-adoption-button">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p data-testid="loading-adoptions">Loading...</p>
        ) : (
          <div className="space-y-4" data-testid="adoptions-list">
            {adoptions.map(adoption => (
              <div key={adoption.adoption_id} className="bg-white rounded-lg shadow-md p-6" data-testid={`adoption-card-${adoption.adoption_id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{adoption.pet_name}</h3>
                    <p className="text-gray-600">{adoption.species} • {adoption.breed}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    adoption.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {adoption.status}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Adopter</p>
                    <p className="font-semibold">{adoption.adopter_first_name} {adoption.adopter_last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Adoption Date</p>
                    <p className="font-semibold">{new Date(adoption.adoption_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Adoption Fee</p>
                    <p className="font-semibold">${adoption.adoption_fee}</p>
                  </div>
                </div>
                {adoption.notes && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm">Notes</p>
                    <p className="text-gray-700">{adoption.notes}</p>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(adoption.adoption_id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  data-testid={`delete-adoption-${adoption.adoption_id}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAdoptions;