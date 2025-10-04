import { Icon } from "@iconify/react";

const Board = () => {
  return (
    <div>
      <div className="min-h-screen px-5 py-10">
        <div className="flex items-center justify-between ">
          <div>
            <h3 className="text-2xl font-semibold pb-2">
              Charity Administrator
            </h3>
            <p className="text-xs ">Full Time • Nigeria • 23</p>
          </div>

          <div>
            <button className="flex items-center gap-3 text-white bg-black px-5 py-2 rounded-[999px]">
              <Icon icon="ci:share-ios-export" className="" />
              Export
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between my-10">
          <div className="flex bg-[#E3E3E3] max-w-[320px] lg:max-w-auto rounded-[999px] py-1 px-1">
            <button className="bg-white rounded-[999px] px-5 py-3 ">
              Qualified Jobs 21
            </button>
            <button className="px-5 cursor-pointer">Disqualified 19</button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex items-center gap-3 py-2 px-3 border border-black/30 rounded-[999px] bg-white w-full lg:w-auto">
              <Icon icon="iconamoon:search-light" className="text-lg" />
              <input
                type="text"
                className="focus:outline-none bg-transparent "
                placeholder="Search..."
              />
            </div>

            <button className="border border-black/30 rounded-md px-3 py-2 hover:bg-black/10 bg-white">
              <Icon icon="mynaui:filter-solid" className="text-2xl" />
            </button>
          </div>
        </div>

        {/* If Qualified */}

        <div className="flex flex-wrap lg:flex-nowrap gap-4 bg-white py-1 px-1 rounded-md ">
          <button className="flex items-center justify-between bg-black text-white rounded-md px-3 py-2 w-full">
            Applied Job (10){" "}
            <Icon icon="material-symbols-light:add-box" className="text-2xl" />
          </button>

          <button className="flex items-center justify-between text-[#C1C1C1] rounded-md px-3 py-2 w-full">
            Under Review (10){" "}
            <Icon icon="material-symbols-light:add-box" className="text-2xl" />
          </button>

          <button className="flex items-center justify-between text-[#C1C1C1] rounded-md px-3 py-2 w-full">
            Interview (10){" "}
            <Icon icon="material-symbols-light:add-box" className="text-2xl" />
          </button>

          <button className="flex items-center justify-between text-[#C1C1C1] rounded-md px-3 py-2 w-full">
            Hiring Jobs (10){" "}
            <Icon icon="material-symbols-light:add-box" className="text-2xl" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-5">
          <div className="bg-white rounded-md px-3 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img src="/Images/profile.svg" alt="pfp" />

                <div>
                  <h5>Robert Foxx</h5>
                  <p className="text-sm underline text-[#2093FF] cursor-pointer">
                    robertfoxx@gmail.com
                  </p>
                </div>
              </div>

              <div>
                <Icon icon="mynaui:x-circle" className="text-[#B3B3B3]" />
              </div>
            </div>

            <h4 className="my-4">Charity Manager</h4>

            <div className="flex items-center justify-between mt-6 py-2 border-t border-black/30">
              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="bx:file" className="" />
                <span>13 Files</span>
              </div>

              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="octicon:thumbsup-16" className="" />
                <span>79%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md px-3 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img src="/Images/profile.svg" alt="pfp" />

                <div>
                  <h5>Robert Foxx</h5>
                  <p className="text-sm underline text-[#2093FF] cursor-pointer">
                    robertfoxx@gmail.com
                  </p>
                </div>
              </div>

              <div>
                <Icon icon="mynaui:x-circle" className="text-[#B3B3B3]" />
              </div>
            </div>

            <h4 className="my-4">Charity Manager</h4>

            <div className="flex items-center justify-between mt-6 py-2 border-t border-black/30">
              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="bx:file" className="" />
                <span>13 Files</span>
              </div>

              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="octicon:thumbsup-16" className="" />
                <span>79%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md px-3 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img src="/Images/profile.svg" alt="pfp" />

                <div>
                  <h5>Robert Foxx</h5>
                  <p className="text-sm underline text-[#2093FF] cursor-pointer">
                    robertfoxx@gmail.com
                  </p>
                </div>
              </div>

              <div>
                <Icon icon="mynaui:x-circle" className="text-[#B3B3B3]" />
              </div>
            </div>

            <h4 className="my-4">Charity Manager</h4>

            <div className="flex items-center justify-between mt-6 py-2 border-t border-black/30">
              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="bx:file" className="" />
                <span>13 Files</span>
              </div>

              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="octicon:thumbsup-16" className="" />
                <span>79%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md px-3 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img src="/Images/profile.svg" alt="pfp" />

                <div>
                  <h5>Robert Foxx</h5>
                  <p className="text-sm underline text-[#2093FF] cursor-pointer">
                    robertfoxx@gmail.com
                  </p>
                </div>
              </div>

              <div>
                <Icon icon="mynaui:x-circle" className="text-[#B3B3B3]" />
              </div>
            </div>

            <h4 className="my-4">Charity Manager</h4>

            <div className="flex items-center justify-between mt-6 py-2 border-t border-black/30">
              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="bx:file" className="" />
                <span>13 Files</span>
              </div>

              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="octicon:thumbsup-16" className="" />
                <span>79%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md px-3 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img src="/Images/profile.svg" alt="pfp" />

                <div>
                  <h5>Robert Foxx</h5>
                  <p className="text-sm underline text-[#2093FF] cursor-pointer">
                    robertfoxx@gmail.com
                  </p>
                </div>
              </div>

              <div>
                <Icon icon="mynaui:x-circle" className="text-[#B3B3B3]" />
              </div>
            </div>

            <h4 className="my-4">Charity Manager</h4>

            <div className="flex items-center justify-between mt-6 py-2 border-t border-black/30">
              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="bx:file" className="" />
                <span>13 Files</span>
              </div>

              <div className="flex items-center gap-1 text-sm bg-[#EFEFEF] rounded-[999px] px-3 py-1">
                <Icon icon="octicon:thumbsup-16" className="" />
                <span>79%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
