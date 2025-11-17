import { Icon } from "@iconify/react";
import Notification from "./seeker/notification";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ProfileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const { user } = useAuthStore();
  const location = useLocation();

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
          <div className="relative">
            <Icon
              icon="iconoir:bell"
              className="text-2xl cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => setShowNotification(true)}
            />

            {showNotification && (
              <Notification setShowNotification={setShowNotification} />
            )}
          </div>
          <Link to="/seeker/profile" className="hover:opacity-80 transition-opacity">
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
