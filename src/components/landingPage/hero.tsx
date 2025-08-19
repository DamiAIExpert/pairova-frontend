import { Icon } from "@iconify/react";

const Hero = () => {
  return (
    <div>
      <img src="/Images/bg-hero.AVIF" alt="" className="hidden md:block absolute top-0 w-[80%] right-0 -z-10" />

      <div className="mt-[100px] px-5 md:px-[50px] relative">
        <div className="flex items-center gap-4 justify-center w-[250px] mx-auto py-3 px-8 rounded-[999px] bg-gradient-to-r from-[#FFCBE8] to-[#CDE3FF]">
          <h3>Try Our AI Model</h3>
          <Icon icon="line-md:arrow-right" className="text-2xl" />
        </div>

        <div className="my-3">
          <h1 className="text-[42px] text-center font-[500]">
            {" "}
            Ultimate Platform for Work Opportunities
          </h1>
          <p className="text-center ">
            Explore tailored job recommendations, track applications, and
            connect with non profit
            <br /> organizations that align with your values. An AI assistant is
            attached
          </p>

          <div className="flex items-center gap-3 justify-center my-8">
            <button className="px-10 py-2 border border-black/30 rounded-md">
              Find a Job
            </button>
            <button className="bg-black/80 text-white px-10 py-2 rounded-md ">
              Non Profit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
