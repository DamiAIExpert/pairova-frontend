import { Icon } from "@iconify/react";
import { Link } from "react-router";

const Header = () => {
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
            {/* <Link to="/seeker/profile"> */}
            <img src="/Images/profile.svg" alt="profile" className="w-[30px]" />
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
