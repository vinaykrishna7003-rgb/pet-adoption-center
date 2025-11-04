import React, { useEffect, useState } from 'react';
import { applicationsAPI } from '../../services/api';

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      let response;
      if (filter === 'pending') {
        response = await applicationsAPI.getPending();
      } else if (filter === 'all') {
        response = await applicationsAPI.getAll();
      } else {
        response = await applicationsAPI.getByStatus(filter);
      }
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await applicationsAPI.updateStatus(id, newStatus);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationsAPI.delete(id);
        fetchApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application');
      }
    }
  };

  return (
    <div className="admin-applications py-8" data-testid="admin-applications-page">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6" data-testid="page-title">Manage Applications</h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6" data-testid="filter-tabs">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              data-testid="filter-all"
            >
              All Applications
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}
              data-testid="filter-pending"
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Approved')}
              className={`px-4 py-2 rounded ${filter === 'Approved' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
              data-testid="filter-approved"
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`px-4 py-2 rounded ${filter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
              data-testid="filter-rejected"
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <p data-testid="loading-applications">Loading...</p>
        ) : applications.length > 0 ? (
          <div className="space-y-4" data-testid="applications-list">
            {applications.map(app => (
              <div key={app.application_id} className="bg-white rounded-lg shadow-md p-6" data-testid={`application-card-${app.application_id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{app.first_name} {app.last_name}</h3>
                    <p className="text-gray-600">{app.email} • {app.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`} data-testid={`application-status-${app.application_id}`}>
                    {app.status}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Application Date</p>
                    <p className="font-semibold">{new Date(app.application_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Preferred Pet Age</p>
                    <p className="font-semibold">{app.preferred_pet_age}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Experience Level</p>
                    <p className="font-semibold">{app.experience_level}</p>
                  </div>
                  {app.days_pending && (
                    <div>
                      <p className="text-gray-500">Days Pending</p>
                      <p className="font-semibold text-orange-600">{app.days_pending} days</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {app.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(app.application_id, 'Approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        data-testid={`approve-${app.application_id}`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.application_id, 'Rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        data-testid={`reject-${app.application_id}`}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(app.application_id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    data-testid={`delete-${app.application_id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center" data-testid="no-applications">
            <p className="text-gray-600">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApplications;