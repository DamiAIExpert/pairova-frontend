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

const CreateJob = () => {
  return (
    <div>
      <div className="min-h-screen bg-white mx-5 my-5 rounded-m border border-black/30">
        {/* Basic Information */}
        <div className="px-5 py-10 border-b border-black/30 ">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Basic Information</h4>
            <Icon icon="ic:baseline-check-circle" className="text-2xl" />
          </div>

          <div>
            <div className="my-5">
              <label htmlFor="" className="text-[#797979]">
                Job Title
              </label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="Enter Job Title..."
              />
            </div>

            <div className="my-5">
              <label htmlFor="" className="text-[#797979]">
                Role Description
              </label>
              <textarea
                name=""
                id=""
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                rows={3}
                placeholder="Enter Job Description..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Additional Information */}

        <div className="px-5 py-10">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Additional Information</h4>
            <Icon
              icon="ic:baseline-check-circle"
              className="text-2xl text-black/30"
            />
          </div>

          <div className="my-5">
            <h5>Employment Type</h5>
            <div className="flex flex-wrap items-center gap-3 my-3">
              <button className="flex items-center gap-2 text-sm border border-black/30 rounded-md hover:bg-black/10 px-5 py-2">
                <Icon icon="hugeicons:stop-watch" className="" /> Full Time
              </button>

              <button className="flex items-center gap-2 text-sm border border-black/30 rounded-md hover:bg-black/10 px-5 py-2">
                <Icon icon="lucide:globe-lock" className="" /> Freelance
              </button>

              <button className="flex items-center gap-2 text-sm border border-black/30 rounded-md hover:bg-black/10 px-5 py-2">
                <Icon icon="lucide:notebook-tabs" className="" /> Contract
              </button>

              <button className="flex items-center gap-2 text-sm border border-black/30 rounded-md hover:bg-black/10 px-5 py-2">
                <Icon icon="la:handshake-solid" className="" /> Volunteer
              </button>
            </div>
          </div>

          <div className="grid my-10 grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <label htmlFor="">Job Placement</label>
              <Select>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Job Placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Job Placement</SelectLabel>
                    <SelectItem value="NIgeria">Onsite</SelectItem>
                    <SelectItem value="Ghana">Remote</SelectItem>
                    <SelectItem value="Ghana">Hybrid</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label htmlFor="">Experience</label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="4 - 6 years"
              />
            </div>

            <div className="w-full">
              <label htmlFor="">Select Range</label>
              <Select>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select Salary Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Salary Range</SelectLabel>
                    <SelectItem value="NIgeria">$1000 - $10000</SelectItem>
                    <SelectItem value="NIgeria">$10000 - $20000</SelectItem>
                    <SelectItem value="Ghana">$20000 upwards</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label htmlFor="">Size</label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="1000 - 5000 employees"
              />
            </div>
          </div>

          {/* Location */}

          <div>
            <h5 className="font-[500] text-black/40">Location</h5>

            <div className="grid my-5 grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label htmlFor="">City</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter City"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Country</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Country"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Provinnce / State</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Provinve / State"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Postal Code</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="ex 111901"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
