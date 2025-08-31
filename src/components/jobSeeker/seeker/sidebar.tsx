import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import PrivacyModal from "./privacyModal";

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
      <div className="flex items-center justify-between py-5 px-5 md:px-[100px] border-b border-black/30">
        <div>
          <h2 className="text-2xl font-semibold">Logo</h2>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <button>Candidate</button>
          <button>Job</button>
          <button>Non profit</button>
        </div>

        <div>
          <Icon icon="iconoir:bell" className="text-2xl" />
        </div>
      </div>

      <div className="flex ">
        {/* Sidebar */}
        <div className="w-[350px] border-r border-black/30 overflow-y-scroll pb-[100px] hidden md:block ">
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

        <div className="bg-[#E4E4E480] w-full px-5 md:px-[50px] py-[50px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 bg-white px-2 py-2 rounded-md w-full">
              <Icon icon="ri:search-line" className="text-xl" />
              <input
                type="text"
                className="bg-transparent focus:outline-none w-full"
                placeholder="Search all jobs"
              />
            </div>

            <div className="w-[70%] hidden md:block">
              <Select>
                <SelectTrigger className="py-3 px-4 border border-black/30 rounded-md my-3 w-full bg-white">
                  <SelectValue placeholder="Nigeria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Country</SelectLabel>
                    <SelectItem value="NIgeria">Nigeria</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-white px-2 py-2 rounded-md">
              <Icon icon="akar-icons:location" className="text-xl" />
              <input
                type="text"
                className="bg-transparent focus:outline-none"
                placeholder="All City"
              />
            </div>

            <div>
              <button className="px-6 py-2 text-white rounded-md bg-[#3A3B3B]">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between my-3">
            <div>
              <p>Showing 0 results</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm">
                Sort by{" "}
                <span className="border rounded-md px-1 py-1">Relevancy</span>
              </p>
              <Icon icon="mynaui:filter" className="text-2xl" />
            </div>
          </div>

          {/* Jobs */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="bg-white rounded-lg px-5 py-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                    L
                  </h4>

                  <div>
                    <h5 className="text-lg text-[#4F4F4F]">
                      Non-Profit Expert
                    </h5>
                    <p className="text-sm text-[#4F4F4F]">
                      Shalom Health Abuja
                    </p>
                  </div>
                </div>

                <div>
                  <Icon
                    icon="proicons:bookmark"
                    className="text-2xl text-[#646464]"
                  />
                </div>
              </div>

              <p className="text-[#4F4F4F] py-2">Match with your profile</p>

              <div className="flex flex-wrap my-3 items-center gap-3">
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
              </div>

              <p className="text-lg text-[#4F4F4F]">
                1 day ago • 50 applicants
              </p>

              <div className="flex items-center justify-between my-4">
                <div>
                  <p>
                    <span className="font-semibold">$100</span> per month
                  </p>
                </div>

                <div>
                  <button className="border border-[#58585866] rounded-md py-2 px-8">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg px-5 py-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                    L
                  </h4>

                  <div>
                    <h5 className="text-lg text-[#4F4F4F]">
                      Non-Profit Expert
                    </h5>
                    <p className="text-sm text-[#4F4F4F]">
                      Shalom Health Abuja
                    </p>
                  </div>
                </div>

                <div>
                  <Icon
                    icon="proicons:bookmark"
                    className="text-2xl text-[#646464]"
                  />
                </div>
              </div>

              <p className="text-[#4F4F4F] py-2">Match with your profile</p>

              <div className="flex flex-wrap my-3 items-center gap-3">
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
              </div>

              <p className="text-lg text-[#4F4F4F]">
                1 day ago • 50 applicants
              </p>

              <div className="flex items-center justify-between my-4">
                <div>
                  <p>
                    <span className="font-semibold">$100</span> per month
                  </p>
                </div>

                <div>
                  <button className="border border-[#58585866] rounded-md py-2 px-8">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg px-5 py-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                    L
                  </h4>

                  <div>
                    <h5 className="text-lg text-[#4F4F4F]">
                      Non-Profit Expert
                    </h5>
                    <p className="text-sm text-[#4F4F4F]">
                      Shalom Health Abuja
                    </p>
                  </div>
                </div>

                <div>
                  <Icon
                    icon="proicons:bookmark"
                    className="text-2xl text-[#646464]"
                  />
                </div>
              </div>

              <p className="text-[#4F4F4F] py-2">Match with your profile</p>

              <div className="flex flex-wrap my-3 items-center gap-3">
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
              </div>

              <p className="text-lg text-[#4F4F4F]">
                1 day ago • 50 applicants
              </p>

              <div className="flex items-center justify-between my-4">
                <div>
                  <p>
                    <span className="font-semibold">$100</span> per month
                  </p>
                </div>

                <div>
                  <button className="border border-[#58585866] rounded-md py-2 px-8">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg px-5 py-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                    L
                  </h4>

                  <div>
                    <h5 className="text-lg text-[#4F4F4F]">
                      Non-Profit Expert
                    </h5>
                    <p className="text-sm text-[#4F4F4F]">
                      Shalom Health Abuja
                    </p>
                  </div>
                </div>

                <div>
                  <Icon
                    icon="proicons:bookmark"
                    className="text-2xl text-[#646464]"
                  />
                </div>
              </div>

              <p className="text-[#4F4F4F] py-2">Match with your profile</p>

              <div className="flex flex-wrap my-3 items-center gap-3">
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
              </div>

              <p className="text-lg text-[#4F4F4F]">
                1 day ago • 50 applicants
              </p>

              <div className="flex items-center justify-between my-4">
                <div>
                  <p>
                    <span className="font-semibold">$100</span> per month
                  </p>
                </div>

                <div>
                  <button className="border border-[#58585866] rounded-md py-2 px-8">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg px-5 py-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                    L
                  </h4>

                  <div>
                    <h5 className="text-lg text-[#4F4F4F]">
                      Non-Profit Expert
                    </h5>
                    <p className="text-sm text-[#4F4F4F]">
                      Shalom Health Abuja
                    </p>
                  </div>
                </div>

                <div>
                  <Icon
                    icon="proicons:bookmark"
                    className="text-2xl text-[#646464]"
                  />
                </div>
              </div>

              <p className="text-[#4F4F4F] py-2">Match with your profile</p>

              <div className="flex flex-wrap my-3 items-center gap-3">
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
                <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
              </div>

              <p className="text-lg text-[#4F4F4F]">
                1 day ago • 50 applicants
              </p>

              <div className="flex items-center justify-between my-4">
                <div>
                  <p>
                    <span className="font-semibold">$100</span> per month
                  </p>
                </div>

                <div>
                  <button className="border border-[#58585866] rounded-md py-2 px-8">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
