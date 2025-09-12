import { Icon } from "@iconify/react";

const JobReminder = () => {
  return (
    <div>
      <div className="min-h-screen mx-5 my-5">
        <h2 className="text-2xl font-semibold py-5">Job Reminder</h2>

        <div className="flex items-center justify-between">
          <div className="flex bg-[#E3E3E3]  rounded-[999px] py-1 px-1">
            <button className="bg-white rounded-[999px] px-5 py-2">
              Track Jobs
            </button>
            <button className="px-5 cursor-pointer">Saved Jobs</button>
          </div>

          <div className="md:flex items-center gap-3 bg-white px-5 py-2 rounded-[999px] hidden">
            <Icon icon="ri:search-line" className="text-xl" />
            <input
              type="text"
              className="bg-transparent focus:outline-none"
              placeholder="Search all jobs"
            />
          </div>
        </div>

        <div className="my-5 bg-white px-5 mdpx-[30px] py-10 rounded-md">
          <div className="border border-black/30 rounded-xs px-5 py-5">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <h4 className="text-4xl font-semibold text-white px-7 py-4 rounded-md bg-[#004D40]">
                L
              </h4>

              <div className="w-full">
                <div>
                  <h5 className="text-xl font-semibold pb-1">Charity Volunteer</h5>
                  <p className="text-sm text-[#808080] ">AYA Healthcare</p>
                  <p className="text-sm text-[#808080]">Lagos, Nigeria</p>
                </div>

                <div className="flex flex-wrap gap-3 my-6 items-center justify-between">
                  <div>
                    <h6 className="text-sm text-[#808080]">Email Address</h6>
                    <p className="font-[500] underline">jonathanbushman51@gmail.com</p>
                  </div>

                  <div>
                    <h6 className="text-sm text-[#808080]">Phone</h6>
                    <p className="font-[500] ">+08-989-989-90</p>
                  </div>

                  <div>
                    <button className={`px-5 py-2 rounded-md text-white bg-[#DFDF49]`}>Pending</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobReminder;
