import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petsAPI, applicationsAPI, adoptionsAPI, sheltersAPI } from '../../services/api.js';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    pendingApplications: 0,
    totalAdoptions: 0,
    totalShelters: 0
  });
  const [recentAdoptions, setRecentAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [petsRes, petStatsRes, appsRes, adoptionsStatsRes, sheltersRes, recentAdoptionsRes] = await Promise.all([
        petsAPI.getAll(),
        petsAPI.getByStatus('Available'),
        applicationsAPI.getPending(),
        adoptionsAPI.getStats(),
        sheltersAPI.getAll(),
        adoptionsAPI.getRecent()
      ]);

      setStats({
        totalPets: petsRes.data.data?.length || 0,
        availablePets: petStatsRes.data.data?.length || 0,
        pendingApplications: appsRes.data.data?.length || 0,
        totalAdoptions: adoptionsStatsRes.data.data?.total_adoptions || 0,
        totalShelters: sheltersRes.data.data?.length || 0
      });

      setRecentAdoptions(recentAdoptionsRes.data.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link, testId }) => (
    <Link to={link} className="block" data-testid={testId}>
      <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" data-testid="loading-dashboard">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard py-8" data-testid="admin-dashboard">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8" data-testid="dashboard-title">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Pets"
            value={stats.totalPets}
            icon="🐾"
            color="border-blue-500"
            link="/admin/pets"
            testId="stat-total-pets"
          />
          <StatCard
            title="Available Pets"
            value={stats.availablePets}
            icon="✅"
            color="border-green-500"
            link="/admin/pets"
            testId="stat-available-pets"
          />
          <StatCard
            title="Pending Applications"
            value={stats.pendingApplications}
            icon="📝"
            color="border-yellow-500"
            link="/admin/applications"
            testId="stat-pending-applications"
          />
          <StatCard
            title="Total Adoptions"
            value={stats.totalAdoptions}
            icon="❤️"
            color="border-purple-500"
            link="/admin/adoptions"
            testId="stat-total-adoptions"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6" data-testid="quick-actions">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/admin/pets" className="block bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-lg" data-testid="action-manage-pets">
                🐾 Manage Pets
              </Link>
              <Link to="/admin/applications" className="block bg-yellow-50 hover:bg-yellow-100 px-4 py-3 rounded-lg" data-testid="action-review-applications">
                📝 Review Applications
              </Link>
              <Link to="/admin/shelters" className="block bg-green-50 hover:bg-green-100 px-4 py-3 rounded-lg" data-testid="action-manage-shelters">
                🏠 Manage Shelters
              </Link>
              <Link to="/admin/staff" className="block bg-purple-50 hover:bg-purple-100 px-4 py-3 rounded-lg" data-testid="action-manage-staff">
                👥 Manage Staff
              </Link>
            </div>
          </div>

          {/* Recent Adoptions */}
          <div className="bg-white rounded-lg shadow-md p-6" data-testid="recent-adoptions">
            <h2 className="text-xl font-semibold mb-4">Recent Adoptions</h2>
            {recentAdoptions.length > 0 ? (
              <div className="space-y-3">
                {recentAdoptions.map((adoption) => (
                  <div key={adoption.adoption_id} className="border-l-4 border-green-500 pl-4 py-2" data-testid={`adoption-${adoption.adoption_id}`}>
                    <p className="font-semibold">{adoption.pet_name}</p>
                    <p className="text-sm text-gray-600">
                      Adopted by {adoption.adopter_first_name} {adoption.adopter_last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(adoption.adoption_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500" data-testid="no-recent-adoptions">No recent adoptions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;