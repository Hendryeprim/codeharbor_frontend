import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-harbor-lightBg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-harbor-blue" />
          <p className="text-sm text-slate-500 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    let redirectPath = '/login';
    if (requiredRole === 'ADMIN') redirectPath = '/admin/login';
    else if (requiredRole === 'EMPLOYEE') redirectPath = '/employee/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If a specific role is required and doesn't match:
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'EMPLOYEE') return <Navigate to="/employee/dashboard" replace />;
    if (user.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // If no requiredRole specified (like existing /customer routes), protect against role bleeding:
  if (!requiredRole) {
    if (user.role === 'EMPLOYEE') {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return children;
};

