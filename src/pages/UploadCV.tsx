import React, { useState } from 'react';
import api from '../services/api.ts';
import { FileText, Upload, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/profile/seeker/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload resume.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight">Upload Your Resume</h1>
              <p className="text-slate-500 font-medium tracking-tight">Make your profile stand out to employers.</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <p className="text-slate-500 font-medium mb-10 text-center max-w-md mx-auto">
            Upload your CV/Resume in <span className="text-slate-900 font-bold">PDF, DOC, or DOCX</span> format. Maximum file size is 5MB.
          </p>

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
            <div className="relative group">
              <input
                type="file"
                id="cv-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <label 
                htmlFor="cv-upload" 
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center hover:border-primary-500 hover:bg-primary-50/30 transition-all group/label bg-slate-50/50"
              >
                <div className="bg-white p-6 rounded-3xl text-primary-600 mb-6 shadow-xl shadow-slate-200/50 group-hover/label:scale-110 group-hover/label:text-primary-700 transition-all border border-slate-100">
                  <Upload size={40} />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover/label:text-primary-600 transition-colors">
                  {file ? file.name : 'Click to select a file'}
                </h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC, DOCX (Max 5MB)'}
                </p>
                {!file && (
                  <div className="mt-6 px-6 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 text-xs font-bold uppercase tracking-widest shadow-sm group-hover/label:border-primary-200 group-hover/label:text-primary-600 transition-all">
                    Browse Files
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-primary-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Uploading...
                </span>
              ) : (
                <>
                  <Upload size={22} className="group-hover:-translate-y-1 transition-transform" />
                  Start Upload
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadCV;
