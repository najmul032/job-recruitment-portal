import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { Building, MapPin, ArrowRight, Briefcase } from 'lucide-react';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div className="p-12 text-center">Loading companies...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
          Companies
        </h1>
        <p className="text-slate-500">
          Explore real companies and their active approved job posts.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white border rounded-3xl p-12 text-center">
          <p className="text-slate-500 font-medium">No companies found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link
              to={`/companies/${company.employer_id}`}
              key={company.employer_id}
              className="bg-white p-6 border rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                  <Building size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {company.company_name || 'Unnamed Company'}
                </h2>
              </div>

              <p className="text-slate-600 mb-4 line-clamp-3">
                {company.company_description || 'No company description available.'}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <MapPin size={16} />
                {company.contact_info || 'Contact info not available'}
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-primary-600 font-bold">
                  <Briefcase size={16} />
                  {company.open_jobs} Open Jobs
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                  View Details <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;