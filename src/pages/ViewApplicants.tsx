import React, { useEffect, useState } from 'react';
import api from '../services/api.ts';

const ViewApplicants: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/employer/received');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/applications/${id}/status`, {
        status: newStatus,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === id
            ? { ...app, status: newStatus }
            : app
        )
      );

      alert(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Employer Applications</h1>

      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map((app) => (
          <div
            key={app.application_id}
            className="p-6 border rounded-xl shadow-sm space-y-4"
          >
            {/* JOB + USER */}
            <div>
              <h2 className="text-xl font-bold">{app.title}</h2>
              <p className="text-sm text-gray-500">
                {app.applicant_name} ({app.applicant_email})
              </p>
            </div>

            {/* STATUS */}
            <p className="font-bold">
              Current Status:{' '}
              <span className="text-blue-600">
                {app.status || 'Pending'}
              </span>
            </p>

            {/* 🔥 NEW INFO SECTION */}
            <div className="space-y-2">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Skills:</span>{' '}
                {app.skills || 'Not provided'}
              </p>

              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Cover Letter:</span>{' '}
                {app.cover_letter || 'Not provided'}
              </p>

              <div>
                <span className="font-semibold text-slate-700">CV:</span>{' '}
                {app.resume ? (
                  <a
                    href={`http://localhost:8000${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-bold hover:underline"
                  >
                    View CV 📄
                  </a>
                ) : (
                  <span className="text-gray-400">No CV uploaded</span>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus(app.application_id, 'Accepted')}
                className={`px-4 py-2 rounded-lg font-bold ${
                  app.status === 'Accepted'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                Accept ✔️
              </button>

              <button
                onClick={() => updateStatus(app.application_id, 'Rejected')}
                className={`px-4 py-2 rounded-lg font-bold ${
                  app.status === 'Rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                Reject ❌
              </button>

              <button
                onClick={() => updateStatus(app.application_id, 'Reviewed')}
                className={`px-4 py-2 rounded-lg font-bold ${
                  app.status === 'Reviewed'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                Reviewed ⏳
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewApplicants;