import { useEffect } from "react";
import { useNavigate } from "react-router";

type UserRole = "jobSeeker" | "nonProfit" | null;

interface SuccessProps {
  userRole: UserRole;
}

const Success = ({ userRole }: SuccessProps) => {
  const navigate = useNavigate();

  // Determine onboarding route based on user role
  const onboardingRoute = userRole === "nonProfit" 
    ? "/non-profit/create-account" 
    : "/seeker/create-account";

  useEffect(() => {
    // Automatically redirect to onboarding after 2 seconds
    const timer = setTimeout(() => {
      navigate(onboardingRoute);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, onboardingRoute]);

  const handleClick = () => {
    navigate(onboardingRoute);
  };

  return (
    <div>
      <div className="flex">
        <div className="w-[90%] bg-[url(/Images/man-bg.AVIF)] min-h-screen bg-cover hidden md:block">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="w-full min-h-screen bg-black/50" />
        </div>

        <div className="py-[150px] px-5 md:px-[150px] w-full relative">
          <div>
            <img
              src="/Images/confetti1.AVIF"
              alt="confetti"
              className="absolute right-0 top-0 hidden md:block"
            />

            <img
              src="/Images/confetti2.AVIF"
              alt="confetti"
              className="absolute bottom-0 hidden md:block"
            />
          </div>

          <div className="md:w-[400px]">
            <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />

            <div>
              <h2 className="text-4xl font-semibold">Email Verified!</h2>
              <p className="text-xs py-3 text-[#808080]">
                Your account has been successfully created as {userRole === "nonProfit" ? "a Non-Profit Organization" : "an Applicant"}.
                <br /> Redirecting you to complete your profile...
              </p>
            </div>

            <div className="my-5">
              <button 
                className="bg-[#2F2F2F] text-white w-full py-3 rounded-md my-3 cursor-pointer hover:bg-black transition-colors" 
                onClick={handleClick}
              >
                Continue to Profile Setup
              </button>
              <p className="text-center text-xs text-[#808080] mt-2">
                Auto-redirecting in 2 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
