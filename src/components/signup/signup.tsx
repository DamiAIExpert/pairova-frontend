import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { useState } from "react";
import { AuthService, Role } from "@/services/auth.service";

type UserRole = "jobSeeker" | "nonProfit" | null;

interface SignupProps {
  setStep: (step: { stepTwo: boolean }) => void;
  onSignupSuccess?: (email: string, role: UserRole) => void;
}

const Signup = ({ setStep, onSignupSuccess }: SignupProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError("");
  };

  const handleSignup = async () => {
    // Validation
    if (!selectedRole) {
      setError("Please select your role first");
      return;
    }
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter a password");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Determine role based on selection
      const userRole = selectedRole === "nonProfit" ? Role.NONPROFIT : Role.APPLICANT;
      
      // Prepare registration data with name field
      const registrationData: any = {
        email: formData.email,
        password: formData.password,
        role: userRole,
      };
      
      // Add appropriate name field based on role
      if (selectedRole === "nonProfit") {
        registrationData.orgName = formData.name;
      } else {
        registrationData.fullName = formData.name;
      }
      
      // Register user - this will trigger OTP email and create profile
      await AuthService.register(registrationData);

      // Store email and role for OTP verification
      if (onSignupSuccess) {
        onSignupSuccess(formData.email, selectedRole);
      }

      // Move to OTP step
      setStep({ stepTwo: true });
    } catch (err: any) {
      console.error("Registration error:", err);
      // Extract the error message from the response
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-10">
        <div className="w-[50%] bg-[url(/Images/signup-bg.AVIF)] min-h-screen bg-cover bg-no-repeat hidden md:block">
          <div className="absolute left-[40px] bottom-[80px]">
            <h2 className="text-white text-[36px] font-semibold">
              Our Philosophy is simple
            </h2>
            <p className="text-white text-[24px] font-semibold">
              Pairova allows non profit organizations
              <br /> promote job roles for users
            </p>
          </div>
          <div className="w-full min-h-full bg-black/30" />
        </div>

        <div className="py-[50px] px-5 md:px-10 w-full md:w-[400px] md:mx-auto">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />

          {/* Role Selection - Step 1 */}
          {!selectedRole ? (
            <div>
              <div className="my-8">
                <h2 className="text-4xl font-semibold">Join Pairova</h2>
                <p className="text-sm py-3 text-[#808080]">
                  First, tell us who you are
                </p>
              </div>

              {/* Role Selection Buttons */}
              <div className="space-y-4 my-8">
                <button
                  onClick={() => handleRoleSelect("jobSeeker")}
                  className="w-full py-4 px-6 border-2 border-black/20 rounded-lg hover:border-black hover:bg-black hover:text-white transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Job Seeker</h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-200">
                        I'm looking for job opportunities
                      </p>
                    </div>
                    <Icon icon="mingcute:user-4-line" className="text-3xl" />
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect("nonProfit")}
                  className="w-full py-4 px-6 border-2 border-black/20 rounded-lg hover:border-black hover:bg-black hover:text-white transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Non-Profit Organization</h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-200">
                        I represent a non-profit organization
                      </p>
                    </div>
                    <Icon icon="mdi:office-building-outline" className="text-3xl" />
                  </div>
                </button>
              </div>

              <div className="text-center mt-8">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#000148] underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Signup Form - Step 2 */
            <div>
              <div className="my-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setFormData({ name: "", email: "", password: "" });
                    setError("");
                  }}
                  className="text-gray-600 hover:text-black"
                >
                  <Icon icon="mdi:arrow-left" className="text-2xl" />
                </button>
                <div>
                  <h2 className="text-3xl font-semibold">
                    {selectedRole === "nonProfit" ? "Organization Signup" : "Job Seeker Signup"}
                  </h2>
                  <p className="text-xs text-gray-600">
                    Creating account as {selectedRole === "nonProfit" ? "Non-Profit" : "Applicant"}
                  </p>
                </div>
              </div>

              {/* Sign up with Google or LinkedIn */}
              <div className="my-3">
                <button 
                  onClick={() => {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3007';
                    window.location.href = `${apiUrl}/auth/google`;
                  }}
                  className="border border-[#818181] w-full py-3 flex items-center gap-3 justify-center rounded-md my-3 hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  <Icon icon="flat-color-icons:google" className="text-2xl" />
                  Sign up with Google
                </button>

                <button 
                  onClick={() => {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3007';
                    window.location.href = `${apiUrl}/auth/linkedin`;
                  }}
                  className="border border-[#818181] w-full py-3 flex items-center gap-3 justify-center rounded-md my-3 hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  <Icon icon="devicon:linkedin" className="text-2xl" />
                  Sign up with LinkedIn
                </button>
              </div>

              <div className="flex items-center gap-4 my-4">
                <p className="bg-[#969696] h-[1px] w-full"></p>
                <p className="text-sm text-gray-600">OR</p>
                <p className="bg-[#969696] h-[1px] w-full"></p>
              </div>

              {/* Error message */}
              {error && (
                <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Signup with Email */}
              <div className="my-4">
                <div className="mb-4">
                  <label htmlFor="name" className="text-sm font-medium">
                    {selectedRole === "nonProfit" ? "Organization Name" : "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder={selectedRole === "nonProfit" ? "Enter Organization Name" : "Enter Your Full Name"}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter Email Address"
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter Password (min. 6 characters)"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div className="my-5">
                  <button
                    className={`bg-black text-white py-3 w-full rounded-md cursor-pointer hover:bg-gray-800 transition-colors ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSignup}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : "Create Account"}
                  </button>

                  {loading && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      This may take a few moments while we set up your account and send verification email...
                    </p>
                  )}

                  <div className="my-3 text-center">
                    <p className="text-xs text-gray-600">
                      Already have an account?{" "}
                      <Link to="/login" className="text-[#000148] underline hover:text-[#000148]/80">
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
