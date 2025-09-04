import { Icon } from "@iconify/react";

const NonProfit = () => {
  return (
    <div className="container mx-auto">
      <div className="flex md:flex-row-reverse flex-col my-[50px] mx-5 md:mx-[50px] gap-10 md:gap-[100px] py-10">
        <div className="md:w-[70%]">
          <img
            src="/Images/non-profit.AVIF"
            alt="woman"
            className="rounded-2xl w-full"
          />
        </div>

        <div className="md:w-[50%]">
          <h4 className="bg-[#FEE9CE] px-8 py-2 rounded-[999px] my-4 w-[170px] text-center uppercase">
            Non Profit
          </h4>

          <h1 className="text-[48px] font-semibold">
            Access Non Profit
            <br /> Organization Roles
          </h1>

          <p className="my-4 text-sm">
            Explore a variety of roles tailored to your skills and
            <br className="hidden md:block" /> passions within the non-profit sector.
          </p>

          <p className="text-sm">
            Compares to Indeed, Toptal, LinkedIn, Upwork
          </p>

          <div>
            <button className="flex items-center gap-1 font-semibold my-5 cursor-pointer">
              <span className="underline">Access Roles here</span>{" "}
              <Icon icon="basil:arrow-right-outline" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonProfit;
