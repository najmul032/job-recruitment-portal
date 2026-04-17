import React, { useState, useEffect } from 'react';
import api from '../services/api.ts';
import { Users, Briefcase, CheckCircle, XCircle, Trash2, ShieldCheck, Building } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, jobsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/jobs')
      ]);

      setUsers(usersRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveJob = async (id: number, approved: boolean) => {
    try {
      const newStatus = approved ? 'approved' : 'rejected';

      await api.put(`/admin/jobs/${id}/approve`, { status: newStatus });

      setJobs(
        jobs.map((job) =>
          job.job_id === id ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This will remove all their data.')) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user.user_id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading admin dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-primary-600 p-3 rounded-2xl text-white shadow-lg shadow-primary-600/20">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 leading-tight">
              Admin Control Center
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">
              System-wide monitoring and moderation tools.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:border-primary-200 transition-colors">
          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform">
            <Users size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Users</p>
            <h3 className="text-3xl font-display font-bold text-slate-900">{users.length}</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:border-purple-200 transition-colors">
          <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
            <Briefcase size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Jobs</p>
            <h3 className="text-3xl font-display font-bold text-slate-900">{jobs.length}</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:border-green-200 transition-colors">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
            <CheckCircle size={32} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Approved Jobs</p>
            <h3 className="text-3xl font-display font-bold text-slate-900">
              {jobs.filter((j) => j.status === 'approved').length}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Manage Users */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                <Users size={20} />
              </div>
              Manage Users
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</span>
          </div>

          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="p-6 hover:bg-slate-50/50 transition-all flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    {user.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-sm text-slate-400 font-medium">{user.email}</p>
                    <span
                      className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm ${
                        user.role === 'admin'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : user.role === 'employer'
                          ? 'bg-primary-50 text-primary-700 border border-primary-100'
                          : 'bg-green-50 text-green-700 border border-green-100'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(user.user_id)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manage Jobs */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <Briefcase size={20} />
              </div>
              Job Moderation
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Review</span>
          </div>

          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
            {jobs.map((job) => (
              <div
                key={job.job_id}
                className="p-6 hover:bg-slate-50/50 transition-all flex justify-between items-center group"
              >
                <div className="flex-1 pr-6 space-y-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h4>

                  <div className="flex items-center gap-2 text-primary-600 font-bold text-xs">
                    <Building size={14} />
                    {job.company_name}
                  </div>

                  <p className="text-xs text-slate-400 font-medium truncate max-w-xs">
                    {job.description}
                  </p>

                  <span
                    className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                      job.status === 'approved'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : job.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {job.status === 'approved' ? (
                    <button
                      onClick={() => handleApproveJob(job.job_id, false)}
                      className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                      title="Reject Job"
                    >
                      <XCircle size={18} />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApproveJob(job.job_id, true)}
                      className="p-3 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-all shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                      title="Approve Job"
                    >
                      <CheckCircle size={18} />
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;