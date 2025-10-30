import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { NonprofitService } from "@/services/nonprofit.service";
import { useState, useEffect } from "react";

const Header = () => {
  const { user } = useAuthStore();
  const [logoUrl, setLogoUrl] = useState("");
  const [brandLogoError, setBrandLogoError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await NonprofitService.getProfile();
        setLogoUrl(profile.logoUrl || "");
      } catch (error) {
        console.error("Failed to fetch nonprofit profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <div>
        <div className="flex items-center justify-between py-5 px-5 md:px-[100px] border-b border-black/30 sticky top-0 bg-white">
          <Link to="/non-profit">
            <div className="cursor-pointer">
              {!brandLogoError ? (
                <img 
                  src="/Images/logo.svg" 
                  alt="Pairova" 
                  className="w-[120px] h-[40px]"
                  onError={(e) => {
                    console.error("Failed to load brand logo from /Images/logo.svg, trying AVIF...");
                    const img = e.target as HTMLImageElement;
                    if (img.src.includes('logo.svg')) {
                      img.src = '/Images/logo.AVIF';
                    } else {
                      setBrandLogoError(true);
                    }
                  }}
                />
              ) : (
                <div className="w-[120px] h-[40px] flex items-center justify-center text-2xl font-bold text-black border border-black/20 rounded px-3">
                  PAIROVA
                </div>
              )}
            </div>
          </Link>

          {/* <div className="hidden md:flex items-center gap-5">
          <button>Candidate</button>
          <button>Job</button>
          <button>Non profit</button>
        </div> */}

          <div className="flex items-center gap-4">
            <div className="md:relative">
              <Icon
                icon="iconoir:bell"
                className="text-2xl cursor-pointer"
                //   onClick={() => setShowNotification(true)}
              />

              {/* {showNotification && (
              <Notification setShowNotification={setShowNotification} />
            )} */}
            </div>
            {/* Organization Logo */}
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Organization" className="w-full h-full object-cover" />
              ) : (
                <Icon icon="lucide:building-2" className="text-xl text-gray-400" />
              )}
            </div>
            <Link to="/non-profit/create-job">
              <button className="text-sm border border-black rounded-md px-3 py-2 cursor-pointer">
                Post a job
              </button>
            </Link>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
