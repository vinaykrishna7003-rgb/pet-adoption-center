import React, { useEffect, useState } from 'react';
import { petsAPI, sheltersAPI } from '../../services/api.js';

function AdminPets() {
  const [pets, setPets] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '', breed: '', age: '', gender: '', color: '',
    species: '', weight: '', size: '', status: 'Available', shelter_id: ''
  });

  useEffect(() => {
    fetchPets();
    fetchShelters();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await petsAPI.getAll();
      setPets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
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
      if (editingPet) {
        await petsAPI.update(editingPet.pet_id, formData);
      } else {
        await petsAPI.create(formData);
      }
      setShowForm(false);
      setEditingPet(null);
      resetForm();
      fetchPets();
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('Failed to save pet');
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name, breed: pet.breed, age: pet.age, gender: pet.gender,
      color: pet.color, species: pet.species, weight: pet.weight,
      size: pet.size, status: pet.status, shelter_id: pet.shelter_id
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petsAPI.delete(id);
        fetchPets();
      } catch (error) {
        console.error('Error deleting pet:', error);
        alert('Failed to delete pet');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', breed: '', age: '', gender: '', color: '',
      species: '', weight: '', size: '', status: 'Available', shelter_id: ''
    });
  };

  return (
    <div className="admin-pets py-8" data-testid="admin-pets-page">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="page-title">Manage Pets</h1>
          <button
            onClick={() => { setShowForm(true); setEditingPet(null); resetForm(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            data-testid="add-pet-button"
          >
            + Add Pet
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-testid="pet-form">
            <h2 className="text-xl font-semibold mb-4">{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
              <input type="text" placeholder="Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-name-input" />
              <input type="text" placeholder="Breed *" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-breed-input" />
              <select value={formData.species} onChange={(e) => setFormData({...formData, species: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-species-select">
                <option value="">Select Species *</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
              </select>
              <input type="number" placeholder="Age *" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-age-input" />
              <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-gender-select">
                <option value="">Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input type="text" placeholder="Color *" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-color-input" />
              <input type="number" step="0.1" placeholder="Weight (kg) *" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-weight-input" />
              <select value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-size-select">
                <option value="">Select Size *</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-status-select">
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Adopted">Adopted</option>
              </select>
              <select value={formData.shelter_id} onChange={(e) => setFormData({...formData, shelter_id: e.target.value})} required className="px-3 py-2 border rounded" data-testid="pet-shelter-select">
                <option value="">Select Shelter *</option>
                {shelters.map(s => <option key={s.shelter_id} value={s.shelter_id}>{s.name}</option>)}
              </select>
              <div className="md:col-span-3 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" data-testid="submit-pet-button">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingPet(null); }} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600" data-testid="cancel-pet-button">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p data-testid="loading-pets">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto" data-testid="pets-table">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Species</th>
                  <th className="px-4 py-3 text-left">Breed</th>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Shelter</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map(pet => (
                  <tr key={pet.pet_id} className="border-t" data-testid={`pet-row-${pet.pet_id}`}>
                    <td className="px-4 py-3">{pet.name}</td>
                    <td className="px-4 py-3">{pet.species}</td>
                    <td className="px-4 py-3">{pet.breed}</td>
                    <td className="px-4 py-3">{pet.age} yrs</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${pet.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{pet.status}</span></td>
                    <td className="px-4 py-3">{pet.shelter_name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(pet)} className="text-blue-600 hover:underline mr-2" data-testid={`edit-pet-${pet.pet_id}`}>Edit</button>
                      <button onClick={() => handleDelete(pet.pet_id)} className="text-red-600 hover:underline" data-testid={`delete-pet-${pet.pet_id}`}>Delete</button>
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

export default AdminPets;