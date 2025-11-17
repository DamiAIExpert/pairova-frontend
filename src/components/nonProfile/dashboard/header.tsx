import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { NonprofitService } from "@/services/nonprofit.service";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [logoUrl, setLogoUrl] = useState("");
  const [orgName, setOrgName] = useState("");
  const [brandLogoError, setBrandLogoError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await NonprofitService.getProfile();
        setLogoUrl(profile.logoUrl || "");
        setOrgName(profile.orgName || "");
      } catch (error) {
        console.error("Failed to fetch nonprofit profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between py-5 px-5 md:px-[100px] border-b border-black/30 sticky top-0 bg-white">
          <Link to="/non-profit">
            <div className="cursor-pointer">
              {!brandLogoError ? (
                <img 
                  src="/Images/logo.AVIF" 
                  alt="Pairova" 
                  className="w-[100px]"
                  onError={() => {
                    console.error("Failed to load Pairova brand logo from /Images/logo.AVIF");
                    setBrandLogoError(true);
                  }}
                />
              ) : (
                <div className="w-[100px] h-[40px] flex items-center justify-center text-xl font-bold text-black border border-black/20 rounded px-2">
                  PAIROVA
                </div>
              )}
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative hover:bg-gray-100 p-2 rounded-full transition-colors">
              <Icon icon="iconoir:bell" className="text-2xl cursor-pointer" />
              {/* Notification badge - uncomment when notifications are ready */}
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            {/* Post a Job Button - Desktop */}
            <Link to="/non-profit/create-job" className="hidden md:block">
              <button className="text-sm border border-black rounded-md px-4 py-2 hover:bg-black hover:text-white transition-colors">
                Post a job
              </button>
            </Link>

            {/* User Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors"
              >
                {/* Organization Logo */}
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-transparent hover:border-gray-300 transition-colors">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Organization" className="w-full h-full object-cover" />
                  ) : (
                    <Icon icon="lucide:building-2" className="text-xl text-gray-400" />
                  )}
                </div>
                {/* Dropdown Arrow */}
                <Icon 
                  icon="iconamoon:arrow-down-2" 
                  className={`text-lg transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {orgName || "Organization"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/non-profit"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Icon icon="lucide:briefcase" className="text-lg" />
                      <span>Jobs Dashboard</span>
                    </Link>

                    <Link
                      to="/non-profit/recruitment-board"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Icon icon="lucide:users" className="text-lg" />
                      <span>Recruitment Board</span>
                    </Link>

                    <Link
                      to="/non-profit/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Icon icon="lucide:settings" className="text-lg" />
                      <span>Settings</span>
                    </Link>

                    <Link
                      to="/non-profit/messages"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Icon icon="lucide:mail" className="text-lg" />
                      <span>Messages</span>
                    </Link>

                    <Link
                      to="/non-profit/help-center"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Icon icon="lucide:help-circle" className="text-lg" />
                      <span>Help Center</span>
                    </Link>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <Icon icon="lucide:log-out" className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
