import { Icon } from "@iconify/react";
import { Link, Outlet, useLocation } from "react-router";
import Header from "./header";

const BoardLayout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

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
                  <button className={`flex gap-4 cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                    isActive("/non-profit") && location.pathname === "/non-profit" 
                      ? "bg-gray-100 border-b-2 border-red-500" 
                      : ""
                  }`}>
                    <Icon icon="lucide:user-round" className="text-2xl" />
                    Job Form
                  </button>
                </Link>
              </div>

              <div className="my-5">
                <Link to="/non-profit/recruitment-board">
                  <button className={`flex gap-4 cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                    isActive("/non-profit/recruitment-board") 
                      ? "bg-gray-100 border-b-2 border-red-500" 
                      : ""
                  }`}>
                    <Icon icon="fa7-regular:bell" className="text-2xl" />
                    Recruitment Board
                  </button>
                </Link>
              </div>

              <div className="my-5">
                <Link to="/non-profit/settings">
                  <button className={`flex gap-4 cursor-pointer hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                    isActive("/non-profit/settings") 
                      ? "bg-gray-100 border-b-2 border-red-500" 
                      : ""
                  }`}>
                    <Icon icon="lucide:lock-keyhole" className="text-2xl" />
                    Settings
                  </button>
                </Link>
              </div>

              <div className="my-5">
                <Link to="/non-profit/messages">
                  <button className={`flex gap-4 hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                    isActive("/non-profit/messages") 
                      ? "bg-gray-100 border-b-2 border-red-500" 
                      : ""
                  }`}>
                    <Icon icon="mynaui:envelope" className="text-2xl" />
                    Message
                  </button>
                </Link>
              </div>

              <div className="my-5">
                <Link to="/non-profit/help-center">
                  <button className={`flex gap-4 hover:bg-black/10 w-full py-2 px-3 rounded-md ease-in duration-100 ${
                    isActive("/non-profit/help-center") 
                      ? "bg-gray-100 border-b-2 border-red-500" 
                      : ""
                  }`}>
                    <Icon icon="lucide:file-question-mark" className="text-2xl" />
                    Help Center
                  </button>
                </Link>
              </div>

              <div className="my-5">
                <Link to="/non-profit/delete-account">
                  <button className={`flex gap-4 text-[#DF6161] hover:bg-[#DF6161]/10 cursor-pointer w-full py-2 px-3 rounded-md ease-in duration-100 ${
                    isActive("/non-profit/delete-account") 
                      ? "bg-red-50 border-b-2 border-red-500" 
                      : ""
                  }`}>
                    <Icon icon="mynaui:x-octagon" className="text-2xl" />
                    Delete Account
                  </button>
                </Link>
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
