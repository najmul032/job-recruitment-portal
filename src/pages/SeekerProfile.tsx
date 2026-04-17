import React, { useState, useEffect } from 'react';
import api from '../services/api.ts';
import { User, Mail, BookOpen, Briefcase, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeekerProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    education: '',
    experience: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setFormData({
  name: response.data.user.name,
  email: response.data.user.email,
  skills: response.data.profile.skills,
  education: response.data.profile.education,
  experience: response.data.profile.experience,
});
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/profile/seeker', formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading profile...</div>;

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
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">My Professional Profile</h1>
              <p className="text-slate-500 font-medium tracking-tight">Showcase your skills and experience to potential employers.</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          {message.text && (
            <div className={`p-5 rounded-2xl mb-10 flex items-center gap-4 text-sm font-bold shadow-sm border ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-100' 
                : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              <div className={`p-2 rounded-lg ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    name="name"
                    type="text"
                    readOnly
                    className="w-full pl-14 pr-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 outline-none font-medium cursor-not-allowed"
                    value={formData.name}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    name="email"
                    type="email"
                    readOnly
                    className="w-full pl-14 pr-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 outline-none font-medium cursor-not-allowed"
                    value={formData.email}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Skills (Comma separated)</label>
              <div className="relative group">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <input
                  name="skills"
                  type="text"
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="e.g. React, Node.js, SQL, UI/UX"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Education</label>
              <div className="relative group">
                <BookOpen className="absolute left-5 top-6 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <textarea
                  name="education"
                  className="w-full pl-14 pr-5 py-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 min-h-[150px] resize-none"
                  placeholder="e.g. Bachelor of Science in Computer Science, University of Technology"
                  value={formData.education}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Experience</label>
              <div className="relative group">
                <Briefcase className="absolute left-5 top-6 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <textarea
                  name="experience"
                  className="w-full pl-14 pr-5 py-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 min-h-[250px] resize-none"
                  placeholder="Describe your previous roles, responsibilities, and achievements..."
                  value={formData.experience}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none group"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving Changes...
                </span>
              ) : (
                <>
                  <Save size={22} className="group-hover:scale-110 transition-transform" />
                  Save Profile Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;
