import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.ts';
import { Briefcase, MapPin, DollarSign, Clock, Save, ArrowLeft } from 'lucide-react';

const EditJob: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
    job_type: 'Full-time',
    status: 'open',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          salary: response.data.salary,
          location: response.data.location,
          job_type: response.data.job_type,
          status: response.data.status,
        });
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.put(`/jobs/${id}`, formData);
      navigate('/employer/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading job data...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-10 transition-all font-bold text-sm uppercase tracking-widest"
      >
        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors">
          <ArrowLeft size={18} />
        </div>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-10 py-10 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="bg-primary-600 p-4 rounded-2xl text-white shadow-lg shadow-primary-600/20">
              <Briefcase size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">Edit Job Post</h1>
              <p className="text-slate-500 font-medium tracking-tight">Update your job listing details.</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm mb-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
              <input
                name="title"
                type="text"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <input
                    name="location"
                    type="text"
                    required
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Salary Range</label>
                <div className="relative group">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <input
                    name="salary"
                    type="text"
                    required
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Job Type</label>
                <div className="relative group">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <select
                    name="job_type"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                    value={formData.job_type}
                    onChange={handleChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <select
                  name="status"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Job Description</label>
              <textarea
                name="description"
                required
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 min-h-[300px] resize-none"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none group"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save size={22} className="group-hover:scale-110 transition-transform" />
                  Update Job Post
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
