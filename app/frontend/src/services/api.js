import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pets API
export const petsAPI = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  search: (params) => api.get('/pets/search', { params }),
  getStatistics: () => api.get('/pets/statistics'),
  getByStatus: (status) => api.get(`/pets/status/${status}`),
  getBySpecies: (species) => api.get(`/pets/species/${species}`),
  getByShelter: (shelterId) => api.get(`/pets/shelter/${shelterId}`),
  updateStatus: (id, status) => api.patch(`/pets/${id}/status`, { status }),
};

// Adopters API
export const adoptersAPI = {
  getAll: () => api.get('/adopters'),
  getById: (id) => api.get(`/adopters/${id}`),
  create: (data) => api.post('/adopters', data),
  update: (id, data) => api.put(`/adopters/${id}`, data),
  delete: (id) => api.delete(`/adopters/${id}`),
  getWithApplications: (id) => api.get(`/adopters/${id}/applications`),
  getWithAdoptions: (id) => api.get(`/adopters/${id}/adoptions`),
};

// Shelters API
export const sheltersAPI = {
  getAll: () => api.get('/shelters'),
  getById: (id) => api.get(`/shelters/${id}`),
  create: (data) => api.post('/shelters', data),
  update: (id, data) => api.put(`/shelters/${id}`, data),
  delete: (id) => api.delete(`/shelters/${id}`),
  getStats: () => api.get('/shelters/stats'),
  getByCity: (city) => api.get(`/shelters/city/${city}`),
  getWithPets: (id) => api.get(`/shelters/${id}/pets`),
  getWithStaff: (id) => api.get(`/shelters/${id}/staff`),
  getCapacity: (id) => api.get(`/shelters/${id}/capacity`),
};

// Applications API
export const applicationsAPI = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
  getStats: () => api.get('/applications/stats'),
  getPending: (id) => api.get(`${id}/applications/pending`),
  getByAdopter: (adopterId) => api.get(`/applications/adopter/${adopterId}`),
  getByStatus: (status) => api.get(`/applications/status/${status}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};

// Adoptions API
export const adoptionsAPI = {
  getAll: () => api.get('/adoptions'),
  getById: (id) => api.get(`/adoptions/${id}`),
  create: (data) => api.post('/adoptions', data),
  update: (id, data) => api.put(`/adoptions/${id}`, data),
  delete: (id) => api.delete(`/adoptions/${id}`),
  getStats: () => api.get('/adoptions/stats'),
  getRecent: () => api.get('/adoptions/recent'),
  getByMonth: (year) => api.get(`/adoptions/month/${year}`),
  getByAdopter: (adopterId) => api.get(`/adoptions/adopter/${adopterId}`),
  getByPet: (petId) => api.get(`/adoptions/pet/${petId}`),
  updateStatus: (id, status) => api.patch(`/adoptions/${id}/status`, { status }),
};

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
  getStatsByRole: () => api.get('/staff/stats/role'),
  getByShelter: (shelterId) => api.get(`/staff/shelter/${shelterId}`),
  getByRole: (role) => api.get(`/staff/role/${role}`),
  getWithDetails: (id) => api.get(`/staff/${id}/details`),
};

export default api;