import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icon } from "@iconify/react";
import { Link } from "react-router";

const CompanyInfo = () => {
  return (
    <div>
      <div>
        <div className="my-8">
          <Icon
            icon="line-md:arrow-left-circle"
            className="text-2xl my-3 md:hidden"
          />
          <h2 className="font-semibold text-xl">Form</h2>

          <div className="bg-white border border-black/30 my-5 rounded-md  relative pb-[200px]">
            <div className="py-5 px-5 border-b border-black/30">
              <h4 className="font-semibold">Company Information</h4>
            </div>

            <div className="my-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label htmlFor="">Company Mail</label>
                <input
                  type="email"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter First Name"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Phone</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Last Name"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Date Founded</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Email Address"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Phone</label>
                <input
                  type="tel"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Phone Number"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Company Type</label>
                <input
                  type="date"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Date of Birth"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Select Language</label>
                <Select>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Pick Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Language</SelectLabel>
                      <SelectItem value="NIgeria">English</SelectItem>
                      <SelectItem value="Ghana">French</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="" className="mb-3">
                  Select Gender
                </label>

                <RadioGroup
                  defaultValue="male"
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="male" defaultChecked className="" />
                    <label htmlFor="">Male</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="female" />
                    <label htmlFor="">Female</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <label htmlFor="" className="mb-3">
                  Language Proficiency
                </label>

                <RadioGroup
                  defaultValue="native"
                  className="flex items-center gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="native"
                      defaultChecked
                      className=""
                    />
                    <label htmlFor="">Native</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="professional" />
                    <label htmlFor="">Professional</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="intermediate" />
                    <label htmlFor="">Intermediate</label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
              <div>
                <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block">
                  Back
                </button>
              </div>
              <div className="">
                <Link to="/non-profit/create-account/address">
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

export default CompanyInfo;
