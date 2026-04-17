import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api.ts';
import { Building, MapPin, Briefcase, ArrowLeft, DollarSign, Clock } from 'lucide-react';

const CompanyDetails: React.FC = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/companies/${id}`);
        setCompanyData(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading company details...</div>;

  if (!companyData) {
    return <div className="p-12 text-center">Company not found.</div>;
  }

  const { company, jobs } = companyData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 font-medium"
      >
        <ArrowLeft size={18} />
        Back to Companies
      </Link>

      <div className="bg-white border rounded-3xl shadow-sm p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
            <Building size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {company.company_name}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 mt-1">
              <MapPin size={16} />
              {company.contact_info || 'Contact info not available'}
            </div>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed">
          {company.company_description || 'No company description available.'}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Approved Open Jobs</h2>

        {jobs.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-slate-500">
            No approved jobs available for this company.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <Link
                to={`/job/${job.job_id}`}
                key={job.job_id}
                className="block bg-white border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {job.job_type}
                    </div>
                    <div className="flex items-center gap-2 text-primary-600 font-bold">
                      <Briefcase size={16} />
                      View Job
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;