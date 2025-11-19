import { Link, useNavigate, useSearchParams } from "react-router";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLoginError(""); // Clear error when user types
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setLoginError("Please enter both email and password");
      return;
    }

    try {
      setLoginError("");
      const response = await login(formData.email, formData.password);
      
      // Check if there's a redirect parameter
      const redirectParam = searchParams.get('redirect');
      
      // Check onboarding status and redirect accordingly
      const user = response.user;
      
      if (!user.hasCompletedOnboarding) {
        // Redirect to onboarding (can't skip this)
        // Preserve redirect parameter for after onboarding if it exists
        if (redirectParam) {
          if (user.role === 'applicant') {
            navigate(`/seeker/create-account?redirect=${encodeURIComponent(redirectParam)}`, { replace: true });
          } else if (user.role === 'nonprofit') {
            navigate(`/non-profit/create-account?redirect=${encodeURIComponent(redirectParam)}`, { replace: true });
          } else {
            navigate(`/seeker/create-account?redirect=${encodeURIComponent(redirectParam)}`, { replace: true });
          }
        } else {
          if (user.role === 'applicant') {
            navigate('/seeker/create-account', { replace: true });
          } else if (user.role === 'nonprofit') {
            navigate('/non-profit/create-account', { replace: true });
          } else {
            navigate('/seeker/create-account', { replace: true }); // Default fallback
          }
        }
      } else {
        // Onboarding complete - check for redirect parameter first
        if (redirectParam) {
          // Use the redirect parameter if provided
          // Decode the redirect URL safely
          try {
            const decodedRedirect = decodeURIComponent(redirectParam);
            // Use replace to avoid adding to history and prevent navigation issues
            navigate(decodedRedirect, { replace: true });
          } catch (error) {
            console.error('Error decoding redirect URL:', error);
            // Fallback to default dashboard if redirect URL is invalid
            if (user.role === 'applicant') {
              navigate('/seeker', { replace: true });
            } else if (user.role === 'nonprofit') {
              navigate('/non-profit', { replace: true });
            } else {
              navigate('/seeker', { replace: true });
            }
          }
        } else {
          // Otherwise redirect to dashboard based on role
          if (user.role === 'applicant') {
            navigate('/seeker', { replace: true });
          } else if (user.role === 'nonprofit') {
            navigate('/non-profit', { replace: true });
          } else if (user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/seeker', { replace: true }); // Default fallback
          }
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setLoginError(errorMessage);
    }
  };

  return (
    <div>
      <div className="flex gap-10">
        <div className="w-[50%] bg-[url(/Images/welcome.AVIF)] min-h-screen bg-cover relative hidden md:block">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="absolute left-[20px] bottom-[20px]">
            <Icon icon="ph:smiley-light" className="text-white text-[120px]" />
            <h2 className="text-[48px] text-white font-semibold">
              Welcome Back!
            </h2>
            <p className="text-[24px] text-white font-semibold">
              Apply for your next job role
            </p>
          </div>
          <div className="w-full min-h-screen bg-black/50" />
        </div>

        <div className="w-full md:w-auto py-[50px] md:py-[150px] px-5 md:px-10">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />

          <div>
            <h2 className="text-4xl font-semibold">Login to your account</h2>
            <p className="text-xs py-3 text-[#808080]">
              Let’s get started already. Join our 100%
              <br /> remote network of creators and freelancers{" "}
            </p>
          </div>

          {/* OAuth Login Buttons */}
          <div className="my-3">
            <button 
              onClick={() => {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
                window.location.href = `${apiUrl}/auth/google`;
              }}
              className="border border-[#818181] w-full py-3 flex items-center gap-3 justify-center rounded-md my-3 hover:bg-gray-50 transition-colors"
              type="button"
            >
              <Icon icon="flat-color-icons:google" className="text-2xl" />
              Sign in with Google
            </button>

            <button 
              onClick={() => {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
                window.location.href = `${apiUrl}/auth/linkedin`;
              }}
              className="border border-[#818181] w-full py-3 flex items-center gap-3 justify-center rounded-md my-3 hover:bg-gray-50 transition-colors"
              type="button"
            >
              <Icon icon="devicon:linkedin" className="text-2xl" />
              Sign in with LinkedIn
            </button>
          </div>

          <div className="flex items-center gap-4 my-4">
            <p className="bg-[#969696] h-[1px] w-full"></p>
            <p className="text-sm text-gray-600">OR</p>
            <p className="bg-[#969696] h-[1px] w-full"></p>
          </div>

          <form onSubmit={handleSubmit} className="my-3">
            {/* Error Message */}
            {(loginError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                <p className="text-sm">{loginError || error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="my-3">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="my-5">
              <button
                type="submit"
                className={`bg-black text-white py-3 w-full rounded-md cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>

              <div className="my-2">
                <button type="button" className="text-xs underline text-[#434343] w-full hover:text-black">
                  Forgot Password
                </button>
                <p className="text-center text-xs my-3">
                  Don't have an account?{" "}
                  <span className="text-[#000148] underline">
                    <Link to="/signup">Sign Up</Link>
                  </span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
