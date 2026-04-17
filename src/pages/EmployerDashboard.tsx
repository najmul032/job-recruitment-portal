import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Briefcase, Users, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs/employer/my-jobs'),
          api.get('/applications/employer/received')
        ]);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job post?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(job => job.job_id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'Reviewed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border border-green-100';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-100';
      default:
        return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Employer Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your job listings and track applicant progress.</p>
        </div>
        <Link
          to="/employer/post-job"
          className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary-600/20 group"
        >
          <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-bold">Post a New Job</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:border-primary-200 transition-colors">
          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform">
            <Briefcase size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">My Jobs</p>
            <h3 className="text-3xl font-display font-bold text-slate-900">{jobs.length}</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:border-green-200 transition-colors">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
            <Users size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Applicants</p>
            <h3 className="text-3xl font-display font-bold text-slate-900">{applications.length}</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:border-blue-200 transition-colors">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
            <Eye size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Approved Jobs</p>
            <h3 className="text-3xl font-display font-bold text-slate-900">
              {jobs.filter(job => job.status === 'approved').length}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                <Briefcase size={20} />
              </div>
              My Job Posts
            </h3>
          </div>

          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
            {jobs.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Briefcase size={32} />
                </div>
                <p className="text-slate-500 font-medium">No jobs posted yet.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.job_id} className="p-8 hover:bg-slate-50/50 transition-all group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${getJobStatusColor(job.status)}`}
                        >
                          {job.status}
                        </span>

                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                          {job.job_type}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500">{job.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/employer/edit-job/${job.job_id}`}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all shadow-sm"
                      >
                        <Edit size={18} />
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job.job_id)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <Users size={20} />
              </div>
              Recent Applications
            </h3>

            <Link
              to="/employer/applicants"
              className="text-primary-600 text-sm font-bold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
            {applications.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Users size={32} />
                </div>
                <p className="text-slate-500 font-medium">No applications received yet.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.application_id} className="p-8 hover:bg-slate-50/50 transition-all group">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="space-y-1">
                      <h4 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {app.applicant_name}
                      </h4>
                      <p className="text-sm text-slate-400 font-medium">
                        Applied for: <span className="text-slate-600 font-bold">{app.title}</span>
                      </p>
                    </div>

                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${getApplicationStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      to="/employer/applicants"
                      className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider hover:gap-3 transition-all"
                    >
                      <Eye size={16} /> View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;