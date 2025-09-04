import { Icon } from "@iconify/react";

const JobTrend = () => {
  return (
    <div className="">
      <div className="bg-[#262626] my-[50px] py-10 px-5 md:px-[50px]">
        <div className="container mx-auto">
          <h4 className="text-center bg-white py-2 px-8 rounded-[999px] w-[130px] mx-auto">
            Recent
          </h4>
          <h2 className="text-white text-2xl text-center font-semibold my-4">
            Job Trends
          </h2>

          <div className="flex flex-col lg:flex-row gap-5 my-5">
            <div className="bg-white rounded-md px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <img src="/Images/paystack.svg" alt="paystack" />
                  <div>
                    <h4 className="font-semibold text-lg">
                      Social Media Volunteer
                    </h4>
                    <p className="text-sm text-[#6F6F6F]">
                      <span className="font-[500] underline">
                        A.O Foundation
                      </span>{" "}
                      in Uyo | Full Time
                    </p>
                  </div>
                </div>

                <Icon icon="mdi-light:star" className="text-2xl" />
              </div>

              <div className="my-4">
                <p>
                  Hulu is an American subscription-based streaming service that
                  offers a vast library of shows
                </p>
              </div>

              <div className="flex items-center justify-between my-5">
                <p className="text-sm">
                  <span className="text-lg font-[500]">30hrs</span> / week
                </p>
                <p className="text-sm">5hrs ago</p>
              </div>

              <div className="flex gap-5">
                <button className="px-10 py-2 border border-black/30 rounded-md w-full cursor-pointer hover:bg-black/80 ease-in duration-200 hover:text-white">
                  View Details
                </button>
                <button className="bg-black/80 text-white px-10 py-2 rounded-md w-full cursor-pointer hover:bg-black/90">
                  Apply Now
                </button>
              </div>
            </div>

            <div className="bg-white rounded-md px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <img src="/Images/hulu.svg" alt="hulu" />
                  <div>
                    <h4 className="font-semibold text-lg">Legal Volunteer</h4>
                    <p className="text-sm text-[#6F6F6F]">
                      <span className="font-[500] underline">Hulu</span> in New
                      York | Full Time
                    </p>
                  </div>
                </div>

                <Icon icon="mdi-light:star" className="text-2xl" />
              </div>

              <div className="my-4">
                <p>
                  Hulu is an American subscription-based streaming service that
                  offers a vast library of shows
                </p>
              </div>

              <div className="flex items-center justify-between my-5">
                <p className="text-sm">
                  <span className="text-lg font-[500]">30hrs</span> / week
                </p>
                <p className="text-sm">5hrs ago</p>
              </div>

              <div className="flex gap-5">
                <button className="px-10 py-2 border border-black/30 rounded-md w-full cursor-pointer hover:bg-black/80 ease-in duration-200 hover:text-white">
                  View Details
                </button>
                <button className="bg-black/80 text-white px-10 py-2 rounded-md w-full cursor-pointer hover:bg-black/90">
                  Apply Now
                </button>
              </div>
            </div>

            <div className="bg-white rounded-md px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <img src="/Images/tony.svg" alt="tony" />
                  <div>
                    <h4 className="font-semibold text-lg">
                      Volunteer: Intern
                    </h4>
                    <p className="text-sm text-[#6F6F6F]">
                      <span className="font-[500] underline">
                        TOE Foundation
                      </span>{" "}
                      in Abuja | Full Time
                    </p>
                  </div>
                </div>

                <Icon icon="mdi-light:star" className="text-2xl" />
              </div>

              <div className="my-4">
                <p>
                  Hulu is an American subscription-based streaming service that
                  offers a vast library of shows
                </p>
              </div>

              <div className="flex items-center justify-between my-5">
                <p className="text-sm">
                  <span className="text-lg font-[500]">30hrs</span> / week
                </p>
                <p className="text-sm">5hrs ago</p>
              </div>

              <div className="flex gap-5">
                <button className="px-10 py-2 border border-black/30 rounded-md w-full cursor-pointer hover:bg-black/80 ease-in duration-200 hover:text-white">
                  View Details
                </button>
                <button className="bg-black/80 text-white px-10 py-2 rounded-md w-full cursor-pointer hover:bg-black/90">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTrend;
