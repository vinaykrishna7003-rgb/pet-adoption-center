import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import BrowsePets from './pages/BrowsePets';
import PetDetails from './pages/PetDetails';
import AdoptionApplication from './pages/AdoptionApplication';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPets from './pages/admin/AdminPets';
import AdminAdopters from './pages/admin/AdminAdopters';
import AdminShelters from './pages/admin/AdminShelters';
import AdminApplications from './pages/admin/AdminApplications';
import AdminAdoptions from './pages/admin/AdminAdoptions';
import AdminStaff from './pages/admin/AdminStaff';

function Navigation() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <nav className="bg-gray-800 text-white shadow-lg" data-testid="admin-navigation">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin" className="text-xl font-bold" data-testid="admin-logo">
              🐾 Admin Panel
            </Link>
            <div className="flex space-x-4">
              <Link to="/admin" className="hover:bg-gray-700 px-3 py-2 rounded" data-testid="nav-admin-dashboard">Dashboard</Link>
              <Link to="/admin/pets" className="hover:bg-gray-700 px-3 py-2 rounded" data-testid="nav-admin-pets">Pets</Link>
              <Link to="/admin/adopters" className="hover:bg-gray-700 px-3 py-2 rounded" data-testid="nav-admin-adopters">Adopters</Link>
              <Link to="/admin/shelters" className="hover:bg-gray-700 px-3 py-2 rounded" data-testid="nav-admin-shelters">Shelters</Link>
              <Link to="/admin/applications" className="hover:bg-gray-700 px-3 py-2 rounded" data-testid="nav-admin-applications">Applications</Link>
              <Link to="/admin/adoptions" className="hover:bg-gray-700 px-3 py-2 rounded" data-testid="nav-admin-adoptions">Adoptions</Link>
              <Link to="/admin/staff" className="hover:bg-gray-700 px-3 py-2 rounded" data-testid="nav-admin-staff">Staff</Link>
              <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded" data-testid="nav-public-site">Public Site</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md" data-testid="public-navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary" data-testid="public-logo">
            🐾 Pet Adoption Center
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium" data-testid="nav-home">Home</Link>
            <Link to="/browse" className="text-gray-700 hover:text-primary font-medium" data-testid="nav-browse">Browse Pets</Link>
            <Link to="/admin" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600" data-testid="nav-admin">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50" data-testid="app-container">
        <Navigation />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePets />} />
          <Route path="/pet/:id" element={<PetDetails />} />
          <Route path="/apply/:petId" element={<AdoptionApplication />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pets" element={<AdminPets />} />
          <Route path="/admin/adopters" element={<AdminAdopters />} />
          <Route path="/admin/shelters" element={<AdminShelters />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/adoptions" element={<AdminAdoptions />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;