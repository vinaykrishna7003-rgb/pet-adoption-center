import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { petsAPI } from '../services/api';

function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const response = await petsAPI.getById(id);
      setPet(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      setError('Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" data-testid="loading-state">
        <p className="text-gray-600 text-lg">Loading pet details...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" data-testid="error-state">
        <p className="text-red-600 text-lg mb-4">{error || 'Pet not found'}</p>
        <Link to="/browse" className="text-blue-600 hover:underline" data-testid="back-to-browse">Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="pet-details-page py-8" data-testid="pet-details-page">
      <div className="container mx-auto px-4">
        <Link to="/browse" className="text-blue-600 hover:underline mb-4 inline-block" data-testid="back-link">
          ← Back to Browse
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Pet Image/Icon */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center p-12" data-testid="pet-image-section">
              <span className="text-9xl">
                {pet.species === 'Dog' ? '🐶' : pet.species === 'Cat' ? '🐱' : pet.species === 'Bird' ? '🦅' : pet.species === 'Rabbit' ? '🐰' : '🐾'}
              </span>
            </div>

            {/* Pet Details */}
            <div className="md:w-1/2 p-8" data-testid="pet-info-section">
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2" data-testid="pet-name">{pet.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    pet.status === 'Available' ? 'bg-green-100 text-green-800' :
                    pet.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`} data-testid="pet-status">
                    {pet.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div data-testid="pet-species">
                    <p className="text-sm text-gray-500">Species</p>
                    <p className="font-semibold">{pet.species}</p>
                  </div>
                  <div data-testid="pet-breed">
                    <p className="text-sm text-gray-500">Breed</p>
                    <p className="font-semibold">{pet.breed}</p>
                  </div>
                  <div data-testid="pet-age">
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold">{pet.age} years</p>
                  </div>
                  <div data-testid="pet-gender">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-semibold">{pet.gender}</p>
                  </div>
                  <div data-testid="pet-size">
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-semibold">{pet.size}</p>
                  </div>
                  <div data-testid="pet-color">
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-semibold">{pet.color}</p>
                  </div>
                  <div data-testid="pet-weight">
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold">{pet.weight} kg</p>
                  </div>
                </div>

                {pet.shelter_name && (
                  <div className="border-t pt-4" data-testid="shelter-info">
                    <p className="text-sm text-gray-500">Shelter Location</p>
                    <p className="font-semibold">{pet.shelter_name}</p>
                    <p className="text-sm text-gray-600">{pet.shelter_city}</p>
                    {pet.shelter_phone && (
                      <p className="text-sm text-gray-600" data-testid="shelter-phone">📞 {pet.shelter_phone}</p>
                    )}
                  </div>
                )}
              </div>

              {pet.status === 'Available' && (
                <button
                  onClick={() => navigate(`/apply/${pet.pet_id}`)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
                  data-testid="apply-to-adopt-button"
                >
                  Apply to Adopt {pet.name}
                </button>
              )}
              {pet.status !== 'Available' && (
                <div className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg text-center" data-testid="not-available-message">
                  This pet is currently not available for adoption
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetails;