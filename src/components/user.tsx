import { Link } from "react-router";

const User = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-[40%] bg-[url(/Images/man-bg.AVIF)] h-[400px] md:min-h-screen bg-center md:bg-cover ">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="absolute top-[40px] left-[40px] md:hidden">
            <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />
          </div>

          <div className="w-full h-[400px] md:min-h-screen bg-black/50" />
        </div>

        <div className="px-5 md:px-auto w-full md:w-[400px] mx-auto my-10 md:my-auto">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />

          <div className="my-3">
            <h2 className="text-4xl font-semibold">Continue as</h2>
            <p className="text-xs py-3 text-[#808080]">
              Proceed as either the job seeker or as the non profit
              <br className="hidden md:block" /> organization
            </p>
          </div>

          <div className="">
            <Link to="/login">
              <button className="w-full py-3 my-3 bg-black text-white rounded-lg cursor-pointer">
                Applicant
              </button>
            </Link>
            <Link to="/signup">
              <button className="my-3 py-3 w-full border border-[#81818166] text-[#81818166] rounded-lg hover:bg-black hover:text-white cursor-pointer ease-in duration-200">
                Non Profit Organization
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
