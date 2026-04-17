import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Briefcase, MapPin, DollarSign, Clock, Building, Send, ArrowLeft } from 'lucide-react';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'jobseeker') {
      setMessage({ type: 'error', text: 'Only job seekers can apply for jobs.' });
      return;
    }

    setApplying(true);
    try {
      await api.post('/applications', { job_id: id, cover_letter: coverLetter });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setCoverLetter('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit application.' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading job details...</div>;
  if (!job) return <div className="p-12 text-center">Job not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-all group font-medium">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Job Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Briefcase size={14} />
                    {job.job_type}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 leading-tight">{job.title}</h1>
                  <div className="flex items-center gap-3 text-primary-600 font-bold text-xl">
                    <div className="bg-primary-50 p-2 rounded-lg">
                      <Building size={20} />
                    </div>
                    {job.company_name}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                    <MapPin size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Location</span>
                    <span className="font-semibold">{job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                    <DollarSign size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Salary</span>
                    <span className="font-semibold">{job.salary}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                    <Clock size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Posted</span>
                    <span className="font-semibold">{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-10">
                <section>
                  <h2 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                    Job Description
                  </h2>
                  <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                    {job.description}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                    About the Company
                  </h2>
                  <div className="text-slate-600 leading-relaxed text-lg">
                    {job.company_description || 'No company description provided.'}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Application Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {user?.role !== 'employer' && user?.role !== 'admin' ? (
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Apply Now</h2>
                
                {message.text && (
                  <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleApply} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Cover Letter (Optional)</label>
                    <textarea
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400 h-48 resize-none"
                      placeholder="Tell the employer why you are a good fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group"
                  >
                    {applying ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-900/20">
                <h3 className="text-xl font-display font-bold mb-4">Manage this job</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  As an {user.role}, you can manage applications and edit job details from your dashboard.
                </p>
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/employer/dashboard'}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}

            <div className="bg-primary-600 p-8 rounded-3xl text-white shadow-xl shadow-primary-600/20 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-2">Need help?</h3>
                <p className="text-primary-100 text-sm mb-6">Our support team is here to help you with your application process.</p>
                <button className="text-white font-bold text-sm underline underline-offset-4 hover:text-primary-50 transition-colors">Contact Support</button>
              </div>
              <Briefcase className="absolute -right-8 -bottom-8 text-primary-500/20 w-40 h-40 -rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
