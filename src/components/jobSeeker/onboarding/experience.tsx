import { Icon } from "@iconify/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router";

const Experience = () => {
  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden"
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md  relative pb-[100px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Experience</h4>
          </div>

          <div className="my-10 px-5">
            <div className="w-full">
              <label htmlFor="">Employment Type</label>
              <Select>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Employment Types</SelectLabel>
                    <SelectItem value="NIgeria">Graphics Designer</SelectItem>
                    <SelectItem value="Ghana">Software Developer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-5 my-5">
              <div className="w-full">
                <label htmlFor="">Company Name</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Comapant's Name"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Job Role</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Job Role"
                />
              </div>
            </div>

            <div className="my-10">
              <h2 className="font-semibold">Job Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                <div className="w-full">
                  <label htmlFor="">Start Date</label>
                  <input
                    type="text"
                    className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                    placeholder="Enter Start Date"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="">End Date</label>
                  <input
                    type="text"
                    className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                    placeholder="Enter End Date"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="">Province / Sate</label>
                  <Select>
                    <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                      <SelectValue placeholder="Lagos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>States</SelectLabel>
                        <SelectItem value="Abuja">Abuja</SelectItem>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <label htmlFor="">Postal Code</label>
                  <input
                    type="text"
                    className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                    placeholder="Enter Postal Code"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="">Description</label>

                <textarea
                  name=""
                  id=""
                  className="resize-none w-full focus:outline-none border border-black/30 rounded-md py-10 px-10 my-3"
                  rows={8}
                  placeholder="Type here..."
                ></textarea>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
              <div>
                <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block">
                  Back
                </button>
              </div>
              <div className="">
                <Link to="/seeker/create-account/skill">
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

export default Experience;
