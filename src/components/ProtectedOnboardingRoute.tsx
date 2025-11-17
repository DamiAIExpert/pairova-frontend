import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/store/authStore";

interface ProtectedOnboardingRouteProps {
  children: React.ReactNode;
  redirectToDashboard: string; // Where to redirect if onboarding is already complete
}

const ProtectedOnboardingRoute = ({ 
  children, 
  redirectToDashboard 
}: ProtectedOnboardingRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, getCurrentUser } = useAuthStore();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // First check if we have user in store (from persisted state or just logged in)
        if (!isAuthenticated || !user) {
          // Only check token once to avoid infinite loops
          if (!hasCheckedToken) {
            setHasCheckedToken(true);
            // Check if we have a token in localStorage (might be set but store not updated yet)
            const token = localStorage.getItem('auth_token');
            if (token) {
              try {
                // Token exists but user not in store - fetch user
                await getCurrentUser();
                // getCurrentUser updates the store, which will trigger a re-render
                // The effect will run again with the updated user
                return;
              } catch (error) {
                // Token invalid or expired - clear it and redirect to login
                localStorage.removeItem('auth_token');
                setRedirectTo('/login');
                setLoading(false);
                return;
              }
            } else {
              // No token and no user - redirect to login
              setRedirectTo('/login');
              setLoading(false);
              return;
            }
          } else {
            // Already checked token but still no user - redirect to login
            setRedirectTo('/login');
            setLoading(false);
            return;
          }
        }

        // User is authenticated - check onboarding status
        // Allow access to privacy-settings even if onboarding is complete
        const isPrivacySettingsPage = location.pathname.includes('/privacy-settings');
        
        if (user.hasCompletedOnboarding && !isPrivacySettingsPage) {
          // Onboarding already complete - redirect to dashboard (unless on privacy settings page)
          setRedirectTo(redirectToDashboard);
        }
        // If onboarding not complete, or on privacy settings page, allow access
        setLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If there's an error, redirect to login
        setRedirectTo('/login');
        setLoading(false);
      }
    };

    // Small delay to ensure state is persisted after login
    const timeoutId = setTimeout(() => {
      checkOnboardingStatus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, redirectToDashboard, getCurrentUser, hasCheckedToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (redirectTo) {
    // Preserve the redirect query param if it exists
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');
    const finalRedirect = redirectTo === '/login' && redirectParam 
      ? `/login?redirect=${encodeURIComponent(redirectParam)}`
      : redirectTo;
    
    return <Navigate to={finalRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedOnboardingRoute;





