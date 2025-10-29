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
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3007'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            
            // Redirect based on onboarding status
            if (!data.user.hasCompletedOnboarding) {
              if (data.user.role === 'applicant') {
                navigate('/seeker/create-account');
              } else {
                navigate('/nonprofit/create-account');
              }
            } else {
              if (data.user.role === 'applicant') {
                navigate('/seeker/dashboard');
              } else {
                navigate('/nonprofit/dashboard');
              }
            }
          } else {
            navigate('/login?error=oauth_failed');
          }
        })
        .catch((error) => {
          console.error('Failed to fetch user data:', error);
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

