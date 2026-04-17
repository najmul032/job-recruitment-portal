import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  User,
  Building2,
  Users,
  TrendingUp
} from 'lucide-react';

const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = Math.max(1, Math.ceil(end / 60));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / 60);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}{suffix}</span>;
};

const Home: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.get(`/jobs?search=${searchTerm}&location=${location}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const companies = new Set(jobs.map((j) => j.company_name)).size;
    return {
      jobs: jobs.length || 0,
      companies: companies || 0,
      hires: 95,
    };
  }, [jobs]);

  const howItWorksItems = user?.role === 'jobseeker'
    ? [
        {
          step: '01',
          title: 'Create Account',
          desc: 'Create your account as a job seeker to start your journey.',
          icon: <User size={32} />,
          link: user ? '/seeker/dashboard' : '/register'
        },
        {
          step: '02',
          title: 'Complete Profile',
          desc: 'Add your skills, education, experience, and upload your CV.',
          icon: <Users size={32} />,
          link: '/seeker/profile'
        },
        {
          step: '03',
          title: 'Browse & Apply Jobs',
          desc: 'Explore jobs, open details, and apply to the best opportunities.',
          icon: <Briefcase size={32} />,
          link: '/'
        }
      ]
    : user?.role === 'employer'
    ? [
        {
          step: '01',
          title: 'Create Account',
          desc: 'Create your employer account to start hiring candidates.',
          icon: <User size={32} />,
          link: user ? '/employer/dashboard' : '/register'
        },
        {
          step: '02',
          title: 'Complete Company Profile',
          desc: 'Add company name, contact info, and company description.',
          icon: <Building2 size={32} />,
          link: '/employer/profile'
        },
        {
          step: '03',
          title: 'Post a Job',
          desc: 'Publish your job post and manage applicants from your dashboard.',
          icon: <Briefcase size={32} />,
          link: '/employer/post-job'
        }
      ]
    : [
        {
          step: '01',
          title: 'Create Account',
          desc: 'Sign up as a job seeker or employer to get started with your journey.',
          icon: <User size={32} />,
          link: '/register'
        },
        {
          step: '02',
          title: 'Complete Profile',
          desc: 'Add your skills, experience, or company details to stand out from the crowd.',
          icon: <Users size={32} />,
          link: '/register'
        },
        {
          step: '03',
          title: 'Apply or Post',
          desc: 'Find your dream job or post a vacancy to find the perfect candidate.',
          icon: <Briefcase size={32} />,
          link: '/login'
        }
      ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-20 lg:py-32 transition-colors duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-50 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary-700 dark:text-primary-300 uppercase bg-primary-50 dark:bg-slate-800 rounded-full">
              Trusted by Growing Companies
            </span>

            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-[1.1]">
              Find your next{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                career milestone
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Skip the noise. We connect top-tier talent with ambitious companies building the future.
              Your dream role is just a search away.
            </p>

            <form
              onSubmit={handleSearch}
              className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto transition-colors duration-300"
            >
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="hidden md:block w-px h-8 self-center bg-slate-200 dark:bg-slate-700"></div>

              <div className="flex-1 relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white py-4 px-10 rounded-xl whitespace-nowrap font-bold transition-all"
              >
                Search Jobs
              </button>
            </form>

            {/* Animated Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-2 text-primary-600">
                  <Briefcase size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Open Jobs
                  </span>
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter end={stats.jobs} suffix="+" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-2 text-primary-600">
                  <Building2 size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Companies
                  </span>
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter end={stats.companies} suffix="+" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-2 text-primary-600">
                  <TrendingUp size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Success Rate
                  </span>
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter end={stats.hires} suffix="%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Jobs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Discover hand-picked roles from top employers.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm text-sm font-bold text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {jobs.length} roles currently open
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-lg w-1/2 mb-8"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-lg w-full"></div>
                  <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-lg w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">No matches found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">
              Try adjusting your search filters or browse all available roles.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setLocation('');
                fetchJobs();
              }}
              className="mt-8 text-primary-600 font-bold hover:text-primary-700 transition-colors flex items-center gap-2 mx-auto"
            >
              Clear all filters
              <span className="text-lg">↺</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <Link
                key={job.job_id}
                to={`/job/${job.job_id}`}
                className="group bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-600/20 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 flex flex-col"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-600/30 transition-all duration-500">
                    <Briefcase size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    {job.job_type}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors leading-tight">
                  {job.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mb-8">{job.company_name}</p>

                <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <span>{job.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md text-slate-400">
                      <DollarSign size={16} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{job.salary}</span>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}
                  </span>
                  <div className="text-primary-600 font-black text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    Apply Now <span className="text-lg">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-slate-900 dark:bg-black py-32 overflow-hidden relative transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">How it works</h2>
            <p className="text-slate-400 text-lg font-medium">
              We've streamlined the recruitment process for both talent and employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksItems.map((item, idx) => (
              <Link
                to={item.link}
                key={idx}
                className="relative group block"
              >
                <div className="text-[120px] font-display font-black text-white/5 absolute -top-20 -left-10 select-none group-hover:text-primary-600/10 transition-colors duration-500">
                  {item.step}
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 relative z-10 min-h-[360px]">
                  <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary-600/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-4">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 font-medium leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-8 text-primary-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Click to continue →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;