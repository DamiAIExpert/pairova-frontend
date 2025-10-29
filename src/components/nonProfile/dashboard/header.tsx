import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { NonprofitService } from "@/services/nonprofit.service";
import { useState, useEffect } from "react";

const Header = () => {
  const { user } = useAuthStore();
  const [logoUrl, setLogoUrl] = useState("");

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
          <div>
            <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />
          </div>

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
