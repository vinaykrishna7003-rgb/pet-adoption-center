import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petsAPI, adoptersAPI, applicationsAPI } from '../services/api.js';

function AdoptionApplication() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    // Adopter info
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    housing_type: '',
    has_yard: false,
    // Application info
    preferred_pet_age: '',
    experience_level: ''
  });

  useEffect(() => {
    fetchPetDetails();
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
      const response = await petsAPI.getById(petId);
      setPet(response.data.data);
    } catch (error) {
      console.error('Error fetching pet:', error);
      setError('Failed to load pet details');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, create adopter
      const adopterData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        housing_type: formData.housing_type,
        has_yard: formData.has_yard
      };

      const adopterResponse = await adoptersAPI.create(adopterData);
      const adopterId = adopterResponse.data.data.adopter_id;

      // Then, create application
      const applicationData = {
        adopter_id: adopterId,
        application_date: new Date().toISOString(),
        status: 'Pending',
        preferred_pet_age: formData.preferred_pet_age,
        experience_level: formData.experience_level
      };

      await applicationsAPI.create(applicationData);
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/browse');
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" data-testid="loading-pet">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12" data-testid="success-message">
        <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Application Submitted!</h2>
          <p className="text-gray-700 mb-2">
            Thank you for your interest in adopting {pet.name}.
          </p>
          <p className="text-gray-600">
            Our team will review your application and contact you soon.
          </p>
          <p className="text-sm text-gray-500 mt-4">Redirecting to browse page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adoption-application-page py-8" data-testid="adoption-application-page">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Adoption Application</h1>
          <p className="text-gray-600 mb-8" data-testid="page-subtitle">
            You're applying to adopt <span className="font-semibold">{pet.name}</span>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" data-testid="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8" data-testid="application-form">
            {/* Personal Information */}
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="first-name-label">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="first-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="last-name-label">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="last-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="email-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="email-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="phone-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="phone-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" data-testid="address-label">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="address-input"
                />
              </div>
            </div>

            {/* Housing Information */}
            <h2 className="text-xl font-semibold mb-4">Housing Information</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="housing-type-label">Housing Type *</label>
                <select
                  name="housing_type"
                  value={formData.housing_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="housing-type-select"
                >
                  <option value="">Select...</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condo">Condo</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2" data-testid="has-yard-label">
                  <input
                    type="checkbox"
                    name="has_yard"
                    checked={formData.has_yard}
                    onChange={handleChange}
                    className="w-4 h-4"
                    data-testid="has-yard-checkbox"
                  />
                  <span className="text-sm font-medium">I have a yard</span>
                </label>
              </div>
            </div>

            {/* Experience Information */}
            <h2 className="text-xl font-semibold mb-4">Experience Information</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="preferred-age-label">Preferred Pet Age *</label>
                <select
                  name="preferred_pet_age"
                  value={formData.preferred_pet_age}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="preferred-age-select"
                >
                  <option value="">Select...</option>
                  <option value="Puppy/Kitten">Puppy/Kitten (0-1 years)</option>
                  <option value="Young">Young (1-3 years)</option>
                  <option value="Adult">Adult (3-7 years)</option>
                  <option value="Senior">Senior (7+ years)</option>
                  <option value="Any">Any Age</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="experience-label">Experience Level *</label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="experience-select"
                >
                  <option value="">Select...</option>
                  <option value="First-time">First-time Pet Owner</option>
                  <option value="Beginner">Beginner (1-2 pets)</option>
                  <option value="Intermediate">Intermediate (3-5 pets)</option>
                  <option value="Experienced">Experienced (5+ pets)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                data-testid="submit-button"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                data-testid="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdoptionApplication;