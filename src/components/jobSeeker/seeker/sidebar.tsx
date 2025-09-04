import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useState, useEffect } from "react";
import PrivacyModal from "./privacyModal";
import { Outlet } from "react-router";

const Sidebar = () => {
  const [showPrivacySetting, setShowPrivacySetting] = useState(false);

  useEffect(() => {
    setShowPrivacySetting(true);
  }, []);

  return (
    <div>
      {showPrivacySetting && (
        <PrivacyModal setShowPrivacySetting={setShowPrivacySetting} />
      )}
      <div className="flex items-center justify-between py-5 px-5 md:px-[100px] border-b border-black/30 sticky top-0 bg-white">
        <div>
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />
        </div>

        {/* <div className="hidden md:flex items-center gap-5">
          <button>Candidate</button>
          <button>Job</button>
          <button>Non profit</button>
        </div> */}

        <div className="flex items-center gap-4">
          <Icon icon="iconoir:bell" className="text-2xl" />
          <img src="/Images/profile.svg" alt="profile" className="w-[30px]" />
        </div>
      </div>

      <div className="flex ">
        {/* Sidebar */}
        <div className="w-[300px] border-r border-black/30 fixed bg-white h-full overflow-y-scroll pb-[100px] hidden md:block ">
          <div className="flex items-center justify-between py-5 border-b border-black/30 px-5">
            <h4>Filter</h4>
            <button>Clear all</button>
          </div>

          <div className="px-5 py-5 border-b border-black/30">
            <h3 className="font-semibold text-lg">Job Type</h3>

            <div className="my-5">
              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">Contract</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox
                  id="terms"
                  className="w-[20px] h-[20px]"
                  defaultChecked
                />
                <label htmlFor="terms">Full Time</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">Part Time</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">Internship</label>
              </div>
            </div>
          </div>

          <div className="py-5 border-b border-black/30 flex justify-center">
            <button className="flex items-center gap-2 px-8 py-2 rounded-md bg-gradient-to-r from-[#FA9ED1] to-[#A7CDFF]">
              AI Model <Icon icon="tabler:arrow-right" className="text-2xl" />
            </button>
          </div>

          <div className="px-5 py-5 border-b border-black/30">
            <h3 className="font-semibold text-lg">Experience</h3>

            <div className="my-5">
              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">Less than a year</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox
                  id="terms"
                  className="w-[20px] h-[20px]"
                  defaultChecked
                />
                <label htmlFor="terms">1 - 3 years</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">3 - 5 years</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">5 - 10 years</label>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 border-b border-black/30 flex items-center justify-between">
            <p className="">Open to volunteer</p>

            <Switch id="volunteer" />
          </div>

          <div className="px-5 py-5 border-b border-black/30">
            <h3 className="font-semibold text-lg">Job Timeline</h3>

            <div className="my-5">
              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">Less than 24 hours</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox
                  id="terms"
                  className="w-[20px] h-[20px]"
                  defaultChecked
                />
                <label htmlFor="terms">1 - 3 weeks</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">1 month</label>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Checkbox id="terms" className="w-[20px] h-[20px]" />
                <label htmlFor="terms">2 -10 months</label>
              </div>
            </div>
          </div>

          <div className="px-5 py-5">
            <h3 className="font-semibold text-lg">Expected Salary</h3>

            <div className="my-4">
              <RadioGroup defaultValue="under $1000">
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="under $1000"
                    defaultChecked
                    className=""
                  />
                  <label htmlFor="">Under $1000</label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="1000 - 10000"
                    defaultChecked
                    className=""
                  />
                  <label htmlFor="">$1000 - $10000</label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="preference"
                    defaultChecked
                    className=""
                  />
                  <label htmlFor="">My own preference</label>
                </div>
              </RadioGroup>
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
