import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { AuthService } from "@/services/auth.service";

interface ProtectedOnboardingRouteProps {
  children: React.ReactNode;
  redirectToDashboard: string; // Where to redirect if onboarding is already complete
}

const ProtectedOnboardingRoute = ({ 
  children, 
  redirectToDashboard 
}: ProtectedOnboardingRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          // Not authenticated - redirect to login
          setShouldRedirect(true);
          setLoading(false);
          return;
        }

        // Get current user profile
        const user = await AuthService.getCurrentUser();

        // If user has already completed onboarding, redirect to dashboard
        if (user.hasCompletedOnboarding) {
          setShouldRedirect(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If there's an error (like token expired), redirect to login
        setShouldRedirect(true);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

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

  if (shouldRedirect) {
    return <Navigate to={redirectToDashboard} replace />;
  }

  return <>{children}</>;
};

export default ProtectedOnboardingRoute;





