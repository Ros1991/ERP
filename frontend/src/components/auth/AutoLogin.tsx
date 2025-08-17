import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store';

export function AutoLogin() {
  const { isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    // Auto-login functionality - check if user data exists in storage
    if (!isAuthenticated && token && user) {
    }
  }, [isAuthenticated, token, user]);

  return null; // This component doesn't render anything
}
