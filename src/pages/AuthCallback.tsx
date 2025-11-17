import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '@/store/authStore';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // Store tokens
      setToken(accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user data
      fetch(`${import.meta.env.VITE_API_URL || 'https://api.pairova.com'}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          console.log('🔍 Auth profile response status:', res.status);
          if (!res.ok) {
            return res.text().then(text => {
              console.error('❌ Auth profile error response:', text);
              throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
          }
          return res.json();
        })
        .then((response) => {
          console.log('🔍 Raw response from backend:', response);
          
          // Backend wraps response in { data: {...}, statusCode: 200, success: true }
          const user = response.data || response;
          console.log('🔍 Extracted user data:', user);
          
          // Handle both camelCase and snake_case property names
          if (user && user.id) {
            // Transform backend user format to frontend UserProfile format
            const userProfile = {
              id: user.id,
              email: user.email,
              role: user.role,
              isVerified: user.isVerified ?? user.is_verified ?? false,
              hasCompletedOnboarding: user.hasCompletedOnboarding ?? user.has_completed_onboarding ?? false,
              firstName: user.applicantProfile?.firstName || user.applicantProfile?.first_name,
              lastName: user.applicantProfile?.lastName || user.applicantProfile?.last_name,
              orgName: user.nonprofitOrg?.orgName || user.nonprofitOrg?.org_name,
              phone: user.phone,
              lastLoginAt: user.lastLoginAt || user.last_login_at,
              createdAt: user.createdAt || user.created_at,
              updatedAt: user.updatedAt || user.updated_at,
            };
            
            console.log('🔍 Transformed user profile:', userProfile);
            
            setUser(userProfile);
            
            // Redirect based on onboarding status
            if (!userProfile.hasCompletedOnboarding) {
              if (userProfile.role === 'applicant') {
                console.log('✅ Redirecting to /seeker/create-account');
                navigate('/seeker/create-account');
              } else {
                console.log('✅ Redirecting to /nonprofit/create-account');
                navigate('/nonprofit/create-account');
              }
            } else {
              if (userProfile.role === 'applicant') {
                console.log('✅ Redirecting to /seeker/dashboard');
                navigate('/seeker/dashboard');
              } else {
                console.log('✅ Redirecting to /nonprofit/dashboard');
                navigate('/nonprofit/dashboard');
              }
            }
          } else {
            console.error('❌ Invalid user data:', user);
            navigate('/login?error=oauth_failed');
          }
        })
        .catch((error) => {
          console.error('❌ Failed to fetch user data:', error);
          console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
          });
          navigate('/login?error=oauth_failed');
        });
    } else {
      navigate('/login?error=no_tokens');
    }
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

