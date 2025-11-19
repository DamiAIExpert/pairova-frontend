import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useIsNonprofit } from "@/store/authStore";
import PublicProfile from "./publicProfile";

/**
 * Wrapper component that redirects NGO users to the NGO dashboard route
 * to ensure they see the sidebar, while allowing other users to view the profile directly
 */
const PublicProfileWrapper = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNonprofit = useIsNonprofit();

  useEffect(() => {
    // If user is an NGO, redirect to the NGO dashboard route with sidebar
    if (isNonprofit && applicantId) {
      navigate(`/non-profit/applicants/${applicantId}/profile`, {
        replace: true,
        state: location.state, // Preserve any state passed to the route
      });
    }
  }, [isNonprofit, applicantId, navigate, location.state]);

  // If NGO, don't render anything (redirect will happen)
  // If not NGO, render the profile directly
  if (isNonprofit) {
    return null; // Will redirect
  }

  return <PublicProfile />;
};

export default PublicProfileWrapper;





