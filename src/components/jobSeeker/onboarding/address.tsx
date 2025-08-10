import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Link } from "react-router";

const Address = () => {
  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:block"
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md min-h-screen relative">
          <div className="py-5 px-5  border-b border-black/30">
            <h4 className="font-semibold">Address</h4>
          </div>

          <div className="my-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <label htmlFor="">State</label>

              <Select>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>States</SelectLabel>
                    <SelectItem value="NIgeria">Lagos</SelectItem>
                    <SelectItem value="Ghana">Abuja</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label htmlFor="">City</label>

              <Select>
                <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cities</SelectLabel>
                    <SelectItem value="NIgeria">Ikeja</SelectItem>
                    <SelectItem value="Ghana">Akure</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label htmlFor="">Postal Code</label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="Enter code"
              />
            </div>

            <div className="w-full">
              <label htmlFor="">Tax ID</label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="Input ID Number"
              />
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
              <div>
                <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block">
                  Back
                </button>
              </div>
              <div className="">
                <Link to="/seeker/create-account/bio">
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

export default Address;
