import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import Navbar from './components/Navbar.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Companies from './pages/Companies.tsx';
import CompanyDetails from './pages/CompanyDetails.tsx';

import HelpCenter from './pages/HelpCenter.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import Terms from './pages/Terms.tsx';
// Public Pages
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';

// Dashboards
import SeekerDashboard from './pages/SeekerDashboard.tsx';
import EmployerDashboard from './pages/EmployerDashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

// Other Pages
import JobDetails from './pages/JobDetails.tsx';
import PostJob from './pages/PostJob.tsx';
import SeekerProfile from './pages/SeekerProfile.tsx';
import EmployerProfile from './pages/EmployerProfile.tsx';
import UploadCV from './pages/UploadCV.tsx';
import ViewApplicants from './pages/ViewApplicants.tsx';
import EditJob from './pages/EditJob.tsx';

import Footer from './components/Footer.tsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:id" element={<CompanyDetails />} />

<Route path="/help" element={<HelpCenter />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/terms" element={<Terms />} />

              {/* Seeker Routes */}
              <Route
                path="/seeker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/profile"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SeekerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/upload-cv"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <UploadCV />
                  </ProtectedRoute>
                }
              />

              {/* Employer Routes */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/post-job"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/profile"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/applicants"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <ViewApplicants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/edit-job/:id"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EditJob />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}