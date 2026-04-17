import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { FileText, Briefcase, Clock, User, Building, MapPin } from 'lucide-react';

const SeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await api.get('/profile');
        console.log('Profile Response:', profileRes.data);
        setProfileData(profileRes.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }

      try {
        const appsRes = await api.get('/applications/my-applications');
        console.log('Applications Response:', appsRes.data);
        setApplications(appsRes.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
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

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-400"></div>
            <div className="px-8 pb-8 -mt-12">
              <div className="relative inline-block mb-6">
                <div className="bg-white p-1.5 rounded-2xl shadow-lg shadow-slate-200/50">
                  <div className="bg-primary-50 w-20 h-20 rounded-xl flex items-center justify-center text-primary-600">
                    <User size={40} />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-slate-900">
                  {profileData?.user?.name || user?.name}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {profileData?.user?.email || user?.email}
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.profile?.skills ? (
                      profileData.profile.skills.split(',').map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                        >
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs font-medium italic">
                        No skills added yet
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Education
                  </p>
                  <p className="text-slate-700 text-sm font-semibold">
                    {profileData?.profile?.education || 'Not specified'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Experience
                  </p>
                  <p className="text-slate-700 text-sm font-semibold">
                    {profileData?.profile?.experience || 'Not specified'}
                  </p>
                </div>

                <Link
                  to="/seeker/profile"
                  className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-primary-600 rounded-3xl shadow-xl shadow-primary-600/20 p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-display font-bold mb-2">Ready for a new role?</h3>
              <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                Keep your resume updated to attract more employers and get better matches.
              </p>
              <Link
                to="/seeker/upload-cv"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-50 transition-all shadow-lg shadow-white/10"
              >
                <FileText size={18} />
                Update Resume
              </Link>
            </div>
            <Briefcase className="absolute -right-8 -bottom-8 text-primary-500/20 w-40 h-40 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                  <Briefcase size={20} />
                </div>
                My Applications
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
                <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">
                  {applications.length} Total
                </span>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Briefcase size={40} />
                </div>
                <p className="text-slate-500 mb-6 font-medium">
                  You haven't applied for any jobs yet.
                </p>
                <Link to="/" className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2">
                  Browse jobs and start applying!
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {applications.map((app) => (
                  <div key={app.application_id} className="p-8 hover:bg-slate-50/50 transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="space-y-1">
                        <h4 className="text-xl font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {app.title}
                        </h4>
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                          <Building size={16} />
                          {app.company_name}
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-300" />
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-300" />
                        {app.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;