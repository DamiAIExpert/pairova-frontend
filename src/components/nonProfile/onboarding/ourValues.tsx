import { Icon } from "@iconify/react";
import { Link } from "react-router";

const OurValues = () => {
  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden"
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative min-h-screen">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Our Values</h4>
          </div>

          <div className="my-10 px-5">
            <div className="px-5 py-5 border-2 border-black/20 rounded-md">
              <textarea
                name=""
                id=""
                className="resize-none w-full focus:outline-none"
                rows={8}
                placeholder="Enter a brief description about yourself..."
              ></textarea>

              <div className="flex justify-end">
                <p className="border border-black/20 rounded-md px-5 py-2 text-sm">
                  Max 150 words
                </p>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
              <div>
                <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block">
                  Back
                </button>
              </div>
              <div className="">
                <Link to="/non-profit/create-account/skills">
                  <button className="bg-black text-white py-3 px-8 rounded-md">
                    Save and Continue
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurValues;
