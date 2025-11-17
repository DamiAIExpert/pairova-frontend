import { useState, useEffect } from "react";
import PrivacyModal from "./privacyModal";
import { Outlet, useLocation } from "react-router";
import Header from "../header";
import { useAuthStore } from "@/store/authStore";

const Sidebar = () => {
  const [showPrivacySetting, setShowPrivacySetting] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  // const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Only show privacy modal:
    // 1. After completing onboarding (user has completed onboarding)
    // 2. On the dashboard (exactly /seeker, not on job pages or apply pages)
    // 3. If user hasn't configured privacy settings yet
    
    const isDashboard = location.pathname === '/seeker' || location.pathname === '/seeker/';
    const isOnJobPage = location.pathname.includes('/seeker/job/');
    const hasCompletedOnboarding = user?.hasCompletedOnboarding;
    const hasConfigured = localStorage.getItem('privacySettingsConfigured');
    
    // Only show on dashboard after onboarding completion, not on job/apply pages
    if (isDashboard && hasCompletedOnboarding && !isOnJobPage && !hasConfigured) {
      setShowPrivacySetting(true);
    } else {
      setShowPrivacySetting(false);
    }
  }, [location.pathname, user?.hasCompletedOnboarding]);

  return (
    <div>
      {showPrivacySetting && (
        <PrivacyModal setShowPrivacySetting={setShowPrivacySetting} />
      )}
      {/* <div className="flex items-center justify-between py-5 px-5 md:px-[100px] border-b border-black/30 sticky top-0 bg-white">
        <div>
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />
        </div>

        <div className="hidden md:flex items-center gap-5">
          <button>Candidate</button>
          <button>Job</button>
          <button>Non profit</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Icon
              icon="iconoir:bell"
              className="text-2xl cursor-pointer"
              onClick={() => setShowNotification(true)}
            />
            {showNotification && (
              <Notification setShowNotification={setShowNotification} />
            )}
          </div>
          <img src="/Images/profile.svg" alt="profile" className="w-[30px]" />
        </div>
      </div> */}

      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="bg-[#E4E4E480] w-full mt-[70px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
