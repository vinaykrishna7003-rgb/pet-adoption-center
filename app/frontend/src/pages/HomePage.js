import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petsAPI } from '../services/api';

function HomePage() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPets();
  }, []);

  const fetchFeaturedPets = async () => {
    try {
      const response = await petsAPI.getByStatus('Available');
      setFeaturedPets(response.data.data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching featured pets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page" data-testid="home-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20" data-testid="hero-section">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="hero-title">
            Find Your Perfect Companion
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" data-testid="hero-subtitle">
            Give a loving home to a pet in need. Browse our available pets and start your adoption journey today.
          </p>
          <Link
            to="/browse"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 inline-block"
            data-testid="browse-pets-button"
          >
            Browse Available Pets
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white" data-testid="how-it-works-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="how-it-works-title">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Browse Pets</h3>
              <p className="text-gray-600">Search through our available pets and find the one that matches your lifestyle.</p>
            </div>
            <div className="text-center" data-testid="step-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Submit Application</h3>
              <p className="text-gray-600">Fill out an adoption application to tell us about yourself and your home.</p>
            </div>
            <div className="text-center" data-testid="step-3">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Welcome Home</h3>
              <p className="text-gray-600">Once approved, welcome your new furry friend into your loving home!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-16 bg-gray-50" data-testid="featured-pets-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="featured-pets-title">
            Featured Pets
          </h2>
          {loading ? (
            <div className="text-center" data-testid="loading-indicator">
              <p className="text-gray-600">Loading featured pets...</p>
            </div>
          ) : featuredPets.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPets.map((pet) => (
                <div key={pet.pet_id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover" data-testid={`featured-pet-${pet.pet_id}`}>
                  <div className="h-48 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                    <span className="text-6xl">
                      {pet.species === 'Dog' ? '🐶' : pet.species === 'Cat' ? '🐱' : '🐾'}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" data-testid={`pet-name-${pet.pet_id}`}>{pet.name}</h3>
                    <p className="text-gray-600 mb-1" data-testid={`pet-info-${pet.pet_id}`}>
                      {pet.breed} • {pet.age} years • {pet.gender}
                    </p>
                    <p className="text-gray-500 text-sm mb-4" data-testid={`pet-location-${pet.pet_id}`}>
                      📍 {pet.shelter_city || 'Unknown Location'}
                    </p>
                    <Link
                      to={`/pet/${pet.pet_id}`}
                      className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      data-testid={`view-details-${pet.pet_id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center" data-testid="no-pets-message">
              <p className="text-gray-600">No featured pets available at the moment.</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/browse"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
              data-testid="view-all-pets-button"
            >
              View All Pets
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-16" data-testid="cta-section">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="cta-title">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8" data-testid="cta-subtitle">
            Every pet deserves a loving home. Start your adoption journey today!
          </p>
          <Link
            to="/browse"
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 inline-block"
            data-testid="cta-button"
          >
            Adopt a Pet Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;