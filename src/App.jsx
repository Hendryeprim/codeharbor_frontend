import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { EmployeeLayout } from './layouts/EmployeeLayout';

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

// Customer Pages (100% UNCHANGED)
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerProjects } from './pages/customer/CustomerProjects';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { CustomerDownloads } from './pages/customer/CustomerDownloads';
import { CustomerSupport } from './pages/customer/CustomerSupport';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Employee Portal Pages
import { EmployeeLogin } from './pages/employee/EmployeeLogin';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EmployeeProjects } from './pages/employee/EmployeeProjects';
import { EmployeeProjectDetails } from './pages/employee/EmployeeProjectDetails';
import { EmployeeTasks } from './pages/employee/EmployeeTasks';
import { EmployeeSubmissions } from './pages/employee/EmployeeSubmissions';
import { EmployeeNotifications } from './pages/employee/EmployeeNotifications';
import { EmployeeProfile } from './pages/employee/EmployeeProfile';

// Admin Portal Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminAddEmployee } from './pages/admin/AdminAddEmployee';
import { AdminEmployeeProfile } from './pages/admin/AdminEmployeeProfile';
import { AdminEmployeePerformance } from './pages/admin/AdminEmployeePerformance';
import { AdminEmployeeSkills } from './pages/admin/AdminEmployeeSkills';
import { AdminManagedProjects } from './pages/admin/AdminManagedProjects';
import { AdminCreateProject } from './pages/admin/AdminCreateProject';
import { AdminProjectReviews } from './pages/admin/AdminProjectReviews';
import { AdminTasks } from './pages/admin/AdminTasks';
import { AdminExecutions } from './pages/admin/AdminExecutions';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminProfile } from './pages/admin/AdminProfile';

// Existing Admin Store Pages (Kept intact)
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

          {/* Customer Area (100% UNCHANGED) */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
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

          {/* Employee Login */}
          <Route path="/employee/login" element={<EmployeeLogin />} />

          {/* Employee Protected Area */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute requiredRole="EMPLOYEE">
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="projects" element={<EmployeeProjects />} />
            <Route path="projects/:id" element={<EmployeeProjectDetails />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="submissions" element={<EmployeeSubmissions />} />
            <Route path="notifications" element={<EmployeeNotifications />} />
            <Route path="profile" element={<EmployeeProfile />} />
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

            {/* Employees */}
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="employees/add" element={<AdminAddEmployee />} />
            <Route path="employees/performance" element={<AdminEmployeePerformance />} />
            <Route path="employees/skills" element={<AdminEmployeeSkills />} />
            <Route path="employees/:id" element={<AdminEmployeeProfile />} />

            {/* Managed Projects */}
            <Route path="managed-projects" element={<AdminManagedProjects />} />
            <Route path="managed-projects/create" element={<AdminCreateProject />} />

            {/* Reviews & Executions */}
            <Route path="project-reviews" element={<AdminProjectReviews />} />
            <Route path="project-reviews/:submissionId" element={<AdminProjectReviews />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="executions" element={<AdminExecutions />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="profile" element={<AdminProfile />} />

            {/* Existing Marketplace Store Management (Intact) */}
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
