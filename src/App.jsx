import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { ExploreProjects } from './pages/public/ExploreProjects';
import { ProjectDetails } from './pages/public/ProjectDetails';
import { ProjectCategories } from './pages/public/ProjectCategories';
import { AboutUs } from './pages/public/AboutUs';
import { ContactUs } from './pages/public/ContactUs';
import { FAQ } from './pages/public/FAQ';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { DigitalLicense } from './pages/public/DigitalLicense';
import { TermsConditions } from './pages/public/TermsConditions';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerProjects } from './pages/customer/CustomerProjects';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { CustomerDownloads } from './pages/customer/CustomerDownloads';
import { CustomerSupport } from './pages/customer/CustomerSupport';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminTechnologies } from './pages/admin/AdminTechnologies';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminFiles } from './pages/admin/AdminFiles';
import { AdminSupport } from './pages/admin/AdminSupport';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<ExploreProjects />} />
            <Route path="projects/:slug" element={<ProjectDetails />} />
            <Route path="categories" element={<ProjectCategories />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="license" element={<DigitalLicense />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
          </Route>

          {/* Customer Area */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="projects" element={<CustomerProjects />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="downloads" element={<CustomerDownloads />} />
            <Route path="support" element={<CustomerSupport />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Area */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="technologies" element={<AdminTechnologies />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="files" element={<AdminFiles />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

