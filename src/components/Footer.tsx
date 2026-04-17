import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Github, Linkedin, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 pt-20 pb-10 border-t border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 text-white font-bold text-2xl group">
              <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-600/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Briefcase size={24} />
              </div>
              <span className="font-display tracking-tight">
                Job<span className="text-primary-600">Portal</span>
              </span>
            </Link>

            <p className="text-slate-400 font-medium leading-relaxed">
              Connecting the best talent with top companies in Bangladesh.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/najmul.hassan.986832/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-lg"
              >
                <Facebook size={18} />
              </a>

              <a
                href="https://www.linkedin.com/in/najmul-hassan-008a38325/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all hover:scale-110 shadow-lg"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="https://github.com/najmul032"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-all hover:scale-110 shadow-lg"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 font-medium">
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-primary-500 transition-colors">Companies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 font-medium">
              <li><Link to="/help" className="hover:text-primary-500">Help Center</Link></li>
<li><Link to="/privacy" className="hover:text-primary-500">Privacy Policy</Link></li>
<li><Link to="/terms" className="hover:text-primary-500">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 font-medium">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-600" />
                <span>najmulhassan032@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-600" />
                <span>01782184075</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary-600" />
                <span>Kaliakair, Gazipur, Dhaka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
          <p>© 2026 Job Recruitment Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;