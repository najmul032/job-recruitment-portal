import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Briefcase,
  LogOut,
  User,
  LayoutDashboard,
  Building2,
  Sun,
  Moon,
  ChevronDown,
  Settings
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'employer') return '/employer/dashboard';
    return '/seeker/dashboard';
  };

  const getProfileLink = () => {
    if (user?.role === 'employer') return '/employer/profile';
    if (user?.role === 'jobseeker') return '/seeker/profile';
    return '/admin/dashboard';
  };

  return (
    <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-3 text-primary-600 font-bold text-2xl group"
            >
              <div className="bg-primary-600 p-2.5 rounded-xl text-white shadow-lg shadow-primary-600/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Briefcase size={24} />
              </div>
              <span className="font-display tracking-tight text-slate-900 dark:text-white text-2xl">
                Job<span className="text-primary-600">Portal</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-slate-500 dark:text-slate-300 hover:text-primary-600 text-sm font-bold tracking-tight transition-all relative group hover:scale-105"
              >
                Browse Jobs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link
                to="/companies"
                className="text-slate-500 dark:text-slate-300 hover:text-primary-600 text-sm font-bold tracking-tight transition-all relative group hover:scale-105"
              >
                Companies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 dark:hover:bg-slate-700 transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {user ? (
              <div className="flex items-center gap-5">
                <Link
                  to={getDashboardLink()}
                  className="hidden md:flex items-center gap-2.5 text-slate-600 dark:text-slate-300 hover:text-primary-600 px-4 py-2 text-sm font-bold transition-all rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>

                {/* Professional Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 pl-4 pr-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm transition-all"
                  >
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.15em] bg-primary-50 dark:bg-slate-800 px-2 py-0.5 rounded-md leading-none">
                        {user.role}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                      {user.role === 'employer' ? <Building2 size={20} /> : <User size={20} />}
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-200 ${
                        menuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50">
                      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.role}</p>
                      </div>

                      <div className="p-2">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </Link>

                        <Link
                          to={getProfileLink()}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <Settings size={18} />
                          Profile Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-500 dark:text-slate-300 hover:text-primary-600 px-4 py-2 text-sm font-bold transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-primary-600/20 hover:bg-primary-700 hover:shadow-primary-600/30 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;