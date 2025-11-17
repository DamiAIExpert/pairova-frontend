// Component to listen for token expiration events and clear auth store
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const AuthListener = () => {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleTokenExpired = async () => {
      // Clear auth store when token expires
      await logout();
    };

    // Listen for token expiration events from API client
    window.addEventListener('auth:token-expired', handleTokenExpired);

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
    };
  }, [logout]);

  return null; // This component doesn't render anything
};

