import { Icon } from "@iconify/react";

const Oppotunity = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row my-[50px] mx-5 md:mx-[50px] gap-10 md:gap-[100px] border-b py-10">
        <div className="md:w-[50%]">
          <img
            src="/Images/opportunity.AVIF"
            alt="woman"
            className="rounded-r-2xl w-full"
          />
        </div>

        <div>
          <h4 className="bg-[#FEE9CE] px-8 py-2 rounded-[999px] my-4 w-[150px] text-center uppercase">
            Opportunity
          </h4>

          <h1 className="text-[48px] font-semibold">
            Find Your Next
            <br className="hidden md:block" /> Opportunity
          </h1>

          <p className="my-4 text-sm">
            Discover a range of adaptable remote possibilities
            <br className="hidden md:block" /> customized to meet your
            preferences.
          </p>

          <p className="text-sm">
            Compares to Indeed, Toptal, LinkedIn, Upwork
          </p>

          <div>
            <button className="flex items-center gap-1 font-semibold my-5">
              <span className="underline">How it works</span>{" "}
              <Icon icon="basil:arrow-right-outline" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oppotunity;
