import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#42A9D8] mx-auto" />
          <p className="text-xs font-mono text-[#646464]">Validating SalonFlow session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold font-display text-[#202020]">Access Restricted</h2>
          <p className="text-sm text-[#575757]">
            Your current account role (<span className="font-mono font-bold">{user.role}</span>) does not have access to this section.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
