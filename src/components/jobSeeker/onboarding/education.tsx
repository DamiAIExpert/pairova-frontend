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

const Education = () => {
  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden"
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md  relative pb-[200px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Education</h4>
          </div>

          <div className="my-10 px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label htmlFor="">School</label>

                <Select>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Enter School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>School</SelectLabel>
                      <SelectItem value="NIgeria">
                        Obafemi Awolowo University
                      </SelectItem>
                      <SelectItem value="Ghana">
                        Convenant University
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <label htmlFor="">Degree</label>

                <Select>
                  <SelectTrigger className="py-[23px] px-4 border border-black/30 rounded-md w-full my-3">
                    <SelectValue placeholder="Select Degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Degree</SelectLabel>
                      <SelectItem value="NIgeria">B.sc Mathematics</SelectItem>
                      <SelectItem value="Ghana">B.sc Computer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <label htmlFor="">Course</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Enter Course"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Grade</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="First Class Honors"
                />
              </div>
            </div>

            <div className="border border-black/30 rounded-md px-5 py-5 flex flex-col mdLflex-row items-start gap-5 my-8">
              <div className="w-full">
                <label htmlFor="">Role</label>
                <input
                  type="text"
                  className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                  placeholder="Input major role"
                />
              </div>

              <div className="w-full">
                <label htmlFor="">Description</label>

                <textarea
                  name=""
                  id=""
                  rows={5}
                  className="resize-none px-4 py-3 border border-black/30 rounded-md w-full my-3"
                  placeholder="Type here"
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
              <Link to="/seeker/create-account/experience">
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

export default Education;
