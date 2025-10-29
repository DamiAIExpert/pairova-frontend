import { useState, useEffect } from "react";
import PrivacyModal from "./privacyModal";
import { Outlet } from "react-router";
import Header from "../header";

const Sidebar = () => {
  const [showPrivacySetting, setShowPrivacySetting] = useState(false);
  // const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Only show privacy modal if user hasn't configured it yet
    const hasConfigured = localStorage.getItem('privacySettingsConfigured');
    if (!hasConfigured) {
      setShowPrivacySetting(true);
    }
  }, []);

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

      <div className="sticky top-0">
        <Header />
      </div>

      <div className="bg-[#E4E4E480] w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
