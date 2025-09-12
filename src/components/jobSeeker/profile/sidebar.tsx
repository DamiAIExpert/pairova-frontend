import { Icon } from "@iconify/react";
import Header from "../header";
import { Outlet, Link } from "react-router";

const Sidebar = () => {
  return (
    <div>
      <div className="sticky top-0">
        <Header />
      </div>

      <div className="flex">
        <div className="w-[300px] border-r border-black/30 fixed  bg-white h-full hidden md:block">
          <div className="px-4 py-5 mt-10">
            <div className="my-5">
              <Link to="/seeker/profile">
                <button className="flex gap-4 cursor-pointer">
                  <Icon icon="lucide:user-round" className="text-2xl" />
                  Profile
                </button>
              </Link>
            </div>

            <div className="my-5">
              <Link to="/seeker/profile/job-reminder">
                <button className="flex gap-4  cursor-pointer">
                  <Icon icon="fa7-regular:bell" className="text-2xl" />
                  Job Reminder
                </button>
              </Link>
            </div>

            <div className="my-5">
              <button className="flex gap-4">
                <Icon icon="lucide:lock-keyhole" className="text-2xl" />
                Settings
              </button>
            </div>

            <div className="my-5">
              <button className="flex gap-4">
                <Icon icon="mynaui:envelope" className="text-2xl" />
                Messager
              </button>
            </div>

            <div className="my-5">
              <button className="flex gap-4">
                <Icon icon="lucide:file-question-mark" className="text-2xl" />
                Help center
              </button>
            </div>

            <div className="my-5">
              <button className="flex gap-4 text-[#DF6161]">
                <Icon icon="mynaui:x-octagon" className="text-2xl" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#E4E4E480] w-full md:ml-[300px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
