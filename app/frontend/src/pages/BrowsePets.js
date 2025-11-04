import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petsAPI } from '../services/api';

function BrowsePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    status: 'Available',
    size: '',
    gender: '',
    minAge: '',
    maxAge: ''
  });

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.species) params.species = filters.species;
      if (filters.status) params.status = filters.status;
      if (filters.size) params.size = filters.size;
      if (filters.gender) params.gender = filters.gender;
      if (filters.minAge) params.minAge = filters.minAge;
      if (filters.maxAge) params.maxAge = filters.maxAge;

      const response = await petsAPI.search(params);
      setPets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      species: '',
      status: 'Available',
      size: '',
      gender: '',
      minAge: '',
      maxAge: ''
    });
  };

  return (
    <div className="browse-pets-page py-8" data-testid="browse-pets-page">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8" data-testid="page-title">Browse Available Pets</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-testid="filters-section">
          <h2 className="text-xl font-semibold mb-4">Filter Pets</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" data-testid="species-filter-label">Species</label>
              <select
                name="species"
                value={filters.species}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="species-filter"
              >
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" data-testid="size-filter-label">Size</label>
              <select
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="size-filter"
              >
                <option value="">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" data-testid="gender-filter-label">Gender</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="gender-filter"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" data-testid="age-filter-label">Age Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minAge"
                  placeholder="Min"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="min-age-filter"
                />
                <input
                  type="number"
                  name="maxAge"
                  placeholder="Max"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="max-age-filter"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              data-testid="clear-filters-button"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-gray-600 text-lg">Loading pets...</p>
          </div>
        ) : pets.length > 0 ? (
          <div>
            <p className="text-gray-600 mb-4" data-testid="results-count">
              Found {pets.length} pet{pets.length !== 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pets.map((pet) => (
                <div key={pet.pet_id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover" data-testid={`pet-card-${pet.pet_id}`}>
                  <div className="h-40 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                    <span className="text-5xl">
                      {pet.species === 'Dog' ? '🐶' : pet.species === 'Cat' ? '🐱' : pet.species === 'Bird' ? '🦅' : pet.species === 'Rabbit' ? '🐰' : '🐾'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1" data-testid={`pet-name-${pet.pet_id}`}>{pet.name}</h3>
                    <p className="text-sm text-gray-600 mb-1" data-testid={`pet-breed-${pet.pet_id}`}>{pet.breed}</p>
                    <p className="text-sm text-gray-500 mb-2" data-testid={`pet-details-${pet.pet_id}`}>
                      {pet.age} yrs • {pet.gender} • {pet.size}
                    </p>
                    <p className="text-xs text-gray-500 mb-3" data-testid={`pet-location-${pet.pet_id}`}>
                      📍 {pet.shelter_city || 'Unknown'}
                    </p>
                    <Link
                      to={`/pet/${pet.pet_id}`}
                      className="block text-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                      data-testid={`view-pet-${pet.pet_id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md" data-testid="no-results">
            <p className="text-gray-600 text-lg">No pets found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              data-testid="clear-filters-no-results"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowsePets;