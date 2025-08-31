import { Icon } from "@iconify/react";
import { Link } from "react-router";

const Skill = () => {
  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden"
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative pb-[100px]">
          <div className="py-5 px-5 border-b border-black/30">
            <h4 className="font-semibold">Skills</h4>
          </div>

          <div className="flex items-center gap-5 my-10 px-5">
            <div className="w-full">
              <label htmlFor="">Hard / Soft Skill</label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="Enter Skill"
              />
            </div>

            <div className="w-full">
              <label htmlFor="">Technical Skill</label>
              <input
                type="text"
                className="py-3 px-4 border border-black/30 rounded-md w-full my-3"
                placeholder="Enter Skill"
              />
            </div>
          </div>

          {/* Certificate */}
          <div>
            <div className="py-5 px-5 border-b border-black/30">
              <h4 className="font-semibold">Certificate</h4>
            </div>

            <div className="my-10 mx-10">
              <div className="w-full border border-black-30 rounded-md text-center cursor-pointer py-[50px]">
                <label htmlFor="upload">
                  <input type="file" className="hidden w-full" id="upload" />
                  <div className="w-full py-6">
                    <Icon
                      icon="material-symbols:upload-rounded"
                      className="text-4xl text-center w-[100px] mx-auto cursor-pointer"
                    />
                    <span>
                      Drag and Drop or <span>Choose File</span> for upload
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Other Attachments */}

          <div>
            <div className="py-5 px-5 border-b border-black/30">
              <h4 className="font-semibold">Other Attachments</h4>
            </div>

            <div className="my-10 mx-10">
              <div className="w-full border border-black-30 rounded-md text-center cursor-pointer py-[50px]">
                <label htmlFor="upload">
                  <input type="file" className="hidden w-full" id="upload" />
                  <div className="w-full py-6">
                    <Icon
                      icon="material-symbols:upload-rounded"
                      className="text-4xl text-center w-[100px] mx-auto cursor-pointer"
                    />
                    <span>
                      Drag and Drop or <span>Choose File</span> for upload
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between">
            <div>
              <button className="py-2 px-7 rounded-md border border-black/30 hidden md:block">
                Back
              </button>
            </div>
            <div className="">
              <Link to="/seeker">
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

export default Skill;
