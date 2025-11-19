import { Icon } from "@iconify/react";
import Notification from "./seeker/notification";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ProfileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/authStore";
import { useChat } from "@/hooks/useChat";

const Header = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const { user } = useAuthStore();
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { conversations } = useChat();
  
  // Calculate total unread messages
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const profile = await ProfileService.getProfile();
        if (profile?.photoUrl) {
          let photoUrl = profile.photoUrl;
          
          // Handle both absolute and relative URLs
          if (!photoUrl.startsWith('http://') && !photoUrl.startsWith('https://')) {
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
            photoUrl = photoUrl.startsWith('/') 
              ? `${apiBaseUrl}${photoUrl}` 
              : `${apiBaseUrl}/${photoUrl}`;
          }
          
          // Add cache-busting parameter to ensure fresh image loads
          const separator = photoUrl.includes('?') ? '&' : '?';
          setProfilePhoto(`${photoUrl}${separator}_=${Date.now()}`);
        } else {
          // Reset to null if no photoUrl
          setProfilePhoto(null);
        }
      } catch (error: any) {
        // Silently handle 401/403 errors - user might not be authenticated or profile doesn't exist yet
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          // User not authenticated or doesn't have applicant profile yet
          setProfilePhoto(null);
          return;
        }
        // Only log non-auth errors
        if (error?.response?.status !== 404) {
          console.error("Failed to fetch profile photo:", error);
        }
        // Keep profilePhoto as null to show fallback
        setProfilePhoto(null);
      }
    };

    if (user) {
      fetchProfilePhoto();
    }
  }, [user]);

  // Get user initials for fallback
  const getUserInitials = (): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Check if current path is the jobs/dashboard page
  const isJobsPage = location.pathname === "/seeker" || location.pathname.startsWith("/seeker/job");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <div>
      <div className="flex items-center justify-between py-4 px-5 md:px-8 lg:px-12 border-b border-black/30 fixed top-0 left-0 right-0 bg-white z-50">
        <Link to="/" className="flex items-center">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px] cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>

        {/* Navigation Links - Centered */}
        <div className="flex items-center gap-6 md:gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link 
            to="/seeker"
            className={`relative text-sm md:text-base font-medium transition-colors pb-1 ${
              isJobsPage 
                ? "text-black" 
                : "text-gray-600 hover:text-black"
            }`}
          >
            Job
            {isJobsPage && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-400"></span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Messages Icon */}
            <div className="relative">
              <button
                onClick={() => navigate("/seeker/profile/messager")}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Messages"
              >
              <Icon icon="lucide:message-circle" className="text-2xl cursor-pointer hover:text-gray-600 transition-colors" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Notifications"
            >
              <Icon
                icon="iconoir:bell"
                className="text-2xl cursor-pointer hover:text-gray-600 transition-colors"
              />
            </button>

            {showNotification && (
              <Notification setShowNotification={setShowNotification} />
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="hover:opacity-80 transition-opacity"
            >
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="profile" 
                  className="w-[32px] h-[32px] md:w-[36px] md:h-[36px] rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-colors"
                  onError={() => {
                    // Fallback to initials if image fails to load
                    setProfilePhoto(null);
                  }}
                />
              ) : (
                <div className="w-[32px] h-[32px] md:w-[36px] md:h-[36px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-colors">
                  <span className="text-white text-xs md:text-sm font-semibold">
                    {getUserInitials()}
                  </span>
                </div>
              )}
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/seeker/profile"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Icon icon="lucide:user" className="text-lg" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/seeker/profile/messager"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Icon icon="lucide:message-circle" className="text-lg" />
                    <span>Messages</span>
                    {totalUnreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                        {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/seeker/profile/settings"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Icon icon="lucide:settings" className="text-lg" />
                    <span>Settings</span>
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      const { logout } = useAuthStore.getState();
                      logout();
                      navigate("/login");
                    }}
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
  );
};

export default Header;
