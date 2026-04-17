import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.ts';
import { User, Mail, Lock, UserPlus, Briefcase, UserCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker' as 'jobseeker' | 'employer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
  console.error('Register error full:', err);
  console.error('Register response data:', err.response?.data);

  setError(
    err.response?.data?.message ||
    err.message ||
    'Registration failed. Please try again.'
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-3xl mb-8">
            <div className="bg-primary-600 p-2 rounded-xl text-white">
              <Briefcase size={28} />
            </div>
            <span className="font-display tracking-tight text-slate-900">Job<span className="text-primary-600">Portal</span></span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-slate-900">Create account</h2>
          <p className="text-slate-500 mt-2">Join our community of professionals today</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">I am a:</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`
                  flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all
                  ${formData.role === 'jobseeker' ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-sm' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}
                `}>
                  <input
                    type="radio"
                    name="role"
                    value="jobseeker"
                    className="hidden"
                    checked={formData.role === 'jobseeker'}
                    onChange={handleChange}
                  />
                  <UserCircle size={24} />
                  <span className="font-bold text-sm">Job Seeker</span>
                </label>

                <label className={`
                  flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all
                  ${formData.role === 'employer' ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-sm' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}
                `}>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    className="hidden"
                    checked={formData.role === 'employer'}
                    onChange={handleChange}
                  />
                  <Briefcase size={24} />
                  <span className="font-bold text-sm">Employer</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;