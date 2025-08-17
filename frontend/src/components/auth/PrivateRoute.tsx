import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  console.log('🔒 PrivateRoute check:', {
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!token,
    currentPath: location.pathname
  });

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ Authentication OK, rendering children');
  return <>{children}</>;
}
