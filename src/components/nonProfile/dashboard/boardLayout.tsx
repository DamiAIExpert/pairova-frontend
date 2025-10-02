import { Icon } from "@iconify/react";
import { Link, Outlet } from "react-router";
import Header from "./header";

const BoardLayout = () => {
  return (
    <div>
      <div>
        <div className="sticky top-0">
          <Header />
        </div>

        <div className="flex">
          <div className="w-[300px] border-r border-black/30 fixed  bg-white h-full hidden md:block">
            <div className="px-4 py-5 mt-10">
              <div className="my-5">
                <Link to="/non-profit">
                  <button className="flex gap-4 cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100">
                    <Icon icon="lucide:user-round" className="text-2xl" />
                    Job
                  </button>
                </Link>
              </div>

              <div className="my-5">
                {/* <Link to="/seeker/profile/job-reminder"> */}
                  <button className="flex gap-4  cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100">
                    <Icon icon="fa7-regular:bell" className="text-2xl" />
                    Recruitment Board
                  </button>
                {/* </Link> */}
              </div>

              <div className="my-5">
                {/* <Link to="/seeker/profile/settings"> */}
                  <button className="flex gap-4 cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100">
                    <Icon icon="lucide:lock-keyhole" className="text-2xl" />
                    Settings
                  </button>
                {/* </Link> */}
              </div>

              <div className="my-5">
                <button className="flex gap-4 hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100">
                  <Icon icon="mynaui:envelope" className="text-2xl" />
                  Message
                </button>
              </div>

              <div className="my-5">
                <button className="flex gap-4 hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100">
                  <Icon icon="lucide:file-question-mark" className="text-2xl" />
                  Help center
                </button>
              </div>

              <div className="my-5">
                <button className="flex gap-4 text-[#DF6161] hover:bg-[#DF6161]/10 cursor-pointer w-full py-2 px-3 rounded-md ease-in duration-100">
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
    </div>
  );
};

export default BoardLayout;
