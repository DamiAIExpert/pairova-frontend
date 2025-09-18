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
import { Icon } from "@iconify/react";

const AccountInfo = () => {
  return (
    <div>
      <div className="my-8">
        <Icon icon="line-md:arrow-left-circle" className="text-2xl my-3 md:hidden" />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md min-h-screen relative pb-[100px] md:pb-0">
          <div className="py-5 px-5  border-b border-black/30">
            <h4 className="font-semibold">Account</h4>
            <p className="text-xs text-[#797979] py-1">
              Please configure and fill in your information
            </p>
          </div>

          <div className="px-5 py-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src="/Images/profile.AVIF"
                alt="profile"
                className="w-[120px] h-[120px] rounded-[50%]"
              />

              <div className="border border-black/30 rounded-md py-3 px-8">
                <label htmlFor="upload">
                  <input type="file" id="upload" className="hidden w-full" />
                  <p>Upload Photo</p>
                </label>
              </div>

              <div>
                <button className="bg-black py-3 px-8 rounded-md text-white">
                  Remove Photo
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4  px-5">
            <div className="w-full">
              <label htmlFor="">Company</label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="Enter Company Name"
              />
            </div>

            <div className="w-full">
              <label htmlFor="">Select Country</label>
              <Select>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Contries</SelectLabel>
                    <SelectItem value="NIgeria">Nigeria</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full">
            {/* <button>Back</button> */}
            <div className="flex justify-end">
              <Link to="company-info">
                <button className="bg-black text-white py-3 px-8 rounded-md">
                  Save and Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
