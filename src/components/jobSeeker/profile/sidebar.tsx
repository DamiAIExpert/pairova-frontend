import { Icon } from "@iconify/react";
import Header from "../header";
import { Outlet, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Keep dropdown open when on profile-related pages
  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '');
    if (path === "/seeker/profile" || path === "/seeker/profile/edit-account") {
      setIsProfileOpen(true);
    }
    // Keep settings dropdown open when on settings-related pages
    if (path === "/seeker/profile/settings" || path === "/seeker/profile/privacy-settings") {
      setIsSettingsOpen(true);
    }
  }, [location.pathname]);
  
  const isActive = (path: string) => {
    const normalizedPathname = location.pathname.replace(/\/$/, '');
    const normalizedPath = path.replace(/\/$/, '');
    
    if (normalizedPath === "/seeker/profile") {
      return normalizedPathname === normalizedPath;
    }
    return normalizedPathname === normalizedPath;
  };

  const isProfileSectionActive = () => {
    const path = location.pathname.replace(/\/$/, '');
    return path === "/seeker/profile" || path === "/seeker/profile/edit-account";
  };

  const isSettingsSectionActive = () => {
    const path = location.pathname.replace(/\/$/, '');
    return path === "/seeker/profile/settings" || path === "/seeker/profile/privacy-settings";
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleSettingsDropdown = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="flex flex-1 relative overflow-hidden mt-[70px]">
        <div className="w-[300px] border-r border-black/30 fixed top-[70px] left-0 bg-white h-[calc(100vh-70px)] overflow-y-auto overflow-x-hidden hidden md:block z-40 flex-shrink-0">
          <div className="px-4 py-5 w-full">
            {/* Profile Dropdown */}
            <div className="my-5">
              <button
                onClick={toggleProfileDropdown}
                className={`flex items-center justify-between gap-4 cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                  isProfileSectionActive()
                    ? "bg-gray-100 font-semibold" 
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon icon="lucide:user-round" className="text-2xl" />
                  <span>Profile</span>
                </div>
                <Icon 
                  icon="mdi:chevron-up" 
                  className={`text-xl transition-transform duration-200 ${isProfileOpen ? '' : 'rotate-180'}`}
                />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="ml-4 mt-3 space-y-2 border-l-2 border-gray-200 pl-5">
                  <Link to="/seeker/profile/edit-account">
                    <button className={`flex items-center w-full py-2 px-3 rounded-md ease-in duration-100 text-sm ${
                      isActive("/seeker/profile/edit-account")
                        ? "bg-gray-100 border-l-4 border-[#10b981] font-semibold text-gray-900" 
                        : "hover:bg-black/10 text-gray-700"
                    }`}>
                      <span>Edit Account</span>
                    </button>
                  </Link>
                  <Link to="/seeker/profile">
                    <button className={`flex items-center w-full py-2 px-3 rounded-md ease-in duration-100 text-sm ${
                      isActive("/seeker/profile")
                        ? "bg-gray-100 border-l-4 border-[#10b981] font-semibold text-gray-900" 
                        : "hover:bg-black/10 text-gray-700"
                    }`}>
                      <span>Profile</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="my-5">
              <Link to="/seeker/profile/job-reminder">
                <button className="flex gap-4  cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100">
                  <Icon icon="fa7-regular:bell" className="text-2xl" />
                  Job Reminder
                </button>
              </Link>
            </div>

            {/* Settings Dropdown */}
            <div className="my-5">
              <button
                onClick={toggleSettingsDropdown}
                className={`flex items-center justify-between gap-4 cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                  isSettingsSectionActive()
                    ? "bg-gray-100 font-semibold" 
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon icon="lucide:lock-keyhole" className="text-2xl" />
                  <span>Settings</span>
                </div>
                <Icon 
                  icon="mdi:chevron-up" 
                  className={`text-xl transition-transform duration-200 ${isSettingsOpen ? '' : 'rotate-180'}`}
                />
              </button>
              
              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div className="ml-4 mt-3 space-y-2 border-l-2 border-gray-200 pl-5">
                  <Link to="/seeker/profile/settings">
                    <button className={`flex items-center w-full py-2 px-3 rounded-md ease-in duration-100 text-sm ${
                      isActive("/seeker/profile/settings")
                        ? "bg-gray-100 border-l-4 border-[#10b981] font-semibold text-gray-900" 
                        : "hover:bg-black/10 text-gray-700"
                    }`}>
                      <span>Settings</span>
                    </button>
                  </Link>
                  <Link to="/seeker/profile/privacy-settings">
                    <button className={`flex items-center w-full py-2 px-3 rounded-md ease-in duration-100 text-sm ${
                      isActive("/seeker/profile/privacy-settings")
                        ? "bg-gray-100 border-l-4 border-[#10b981] font-semibold text-gray-900" 
                        : "hover:bg-black/10 text-gray-700"
                    }`}>
                      <span>Privacy Settings</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="my-5">
              <Link to="/seeker/profile/messager">
                <button className={`flex gap-4 hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                  isActive("/seeker/profile/messager")
                    ? "bg-gray-100 font-semibold" 
                    : ""
                }`}>
                  <Icon icon="mynaui:envelope" className="text-2xl" />
                  Messager
                </button>
              </Link>
            </div>

            <div className="my-5">
              <Link to="/seeker/profile/help-center">
                <button className={`flex gap-4 hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                  isActive("/seeker/profile/help-center")
                    ? "bg-gray-100 font-semibold" 
                    : ""
                }`}>
                  <Icon icon="lucide:file-question-mark" className="text-2xl" />
                  Help center
                </button>
              </Link>
            </div>

            <div className="my-5">
              <Link to="/seeker/profile/delete-account">
                <button className={`flex gap-4 text-[#DF6161] hover:bg-[#DF6161]/10 cursor-pointer w-full py-2 px-3 rounded-md ease-in duration-100 ${
                  isActive("/seeker/profile/delete-account")
                    ? "bg-[#DF6161]/10 font-semibold" 
                    : ""
                }`}>
                  <Icon icon="mynaui:x-octagon" className="text-2xl" />
                  Delete Account
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-[#E4E4E480] w-full md:ml-[300px] min-h-[calc(100vh-70px)] overflow-x-hidden">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
