import { Icon } from "@iconify/react";

const Job = () => {
  return (
    <div>
      <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Jobs Created</h3>
            <p className="text-sm text-[#616161]">50 jobs have been created</p>
          </div>

          <div>
            <button className="items-center gap-3 bg-black rounded-md px-4 py-2 text-white hidden md:flex">
              <Icon icon="material-symbols:add-rounded" className="text-2xl" />
              Create Job
            </button>

            <button className="items-center gap-3 bg-black rounded-md px-4 py-2 text-white flex md:hidden">
              <Icon icon="material-symbols:add-rounded" className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex items-center gap-3 py-2 px-3 border border-black/30 rounded-[999px]">
            <Icon icon="iconamoon:search-light" className="text-lg" />
            <input
              type="text"
              className="focus:outline-none bg-transparent "
              placeholder="Search..."
            />
          </div>

          <button className="border border-black/30 rounded-md px-3 py-2 hover:bg-black/10">
            <Icon icon="mynaui:filter-solid" className="text-2xl" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="border border-black/30 rounded-md py-5 px-5">
            <div className="flex items-center justify-between">
              <div>
                <img
                  src="/Images/notify.svg"
                  alt="notification"
                  className="w-[80px]"
                />
              </div>

              <div>
                <Icon
                  icon="mi:delete-alt"
                  className="text-[36px] border border-black/30 p-2 rounded-[50%] cursor-pointer"
                />
              </div>
            </div>

            <div className="my-5">
              <div className="flex items-center gap-3">
                <h5 className="text-xl font-semibold">Charity Manager</h5>
                <span className="text-[#5F5F5F] text-2xl">|</span>
                <p className="text-[#5F5F5F] text-sm">Full Time</p>
              </div>

              <p className="text-[#7B7B7B] py-2">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum
                aperiam numquam modi veritatis nostrum repellendus dolores velit
                iusto ipsa aliquid, consectetur vitae omnis ad, nobis odio.
                Impedit deleniti deserunt error!
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon
                  icon="streamline-sharp:non-commercial-dollars-remix"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">$40 / Week</p>
              </div>

              <div className="flex items-center gap-1">
                <Icon
                  icon="lucide:clock-7"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">Full Time</p>
              </div>
            </div>

            <div className="flex items-center justify-between my-5">
              <div className="flex items-center gap-1">
                <Icon
                  icon="proicons:location"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">Lagos State, Nigeria</p>
              </div>

              <div className="flex items-center gap-1">
                <Icon icon="lucide:mic" className="text-[#7B7B7B] text-sm" />
                <p className="text-sm">Office Interview</p>
              </div>
            </div>

            <div className="">
              <p className="px-2 py-2 rounded-[999px] bg-[#F5F5F5] w-[120px] text-center">
                Volunteer
              </p>
            </div>

            <div className="my-5 border-t-2 border-dashed border-black/30 pt-5">
              <p className="font-semibold">Created 5 min ago</p>
            </div>
          </div>

          <div className="border border-black/30 rounded-md py-5 px-5">
            <div className="flex items-center justify-between">
              <div>
                <img
                  src="/Images/notify.svg"
                  alt="notification"
                  className="w-[80px]"
                />
              </div>

              <div>
                <Icon
                  icon="mi:delete-alt"
                  className="text-[36px] border border-black/30 p-2 rounded-[50%] cursor-pointer"
                />
              </div>
            </div>

            <div className="my-5">
              <div className="flex items-center gap-3">
                <h5 className="text-xl font-semibold">Charity Manager</h5>
                <span className="text-[#5F5F5F] text-2xl">|</span>
                <p className="text-[#5F5F5F] text-sm">Full Time</p>
              </div>

              <p className="text-[#7B7B7B] py-2">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum
                aperiam numquam modi veritatis nostrum repellendus dolores velit
                iusto ipsa aliquid, consectetur vitae omnis ad, nobis odio.
                Impedit deleniti deserunt error!
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon
                  icon="streamline-sharp:non-commercial-dollars-remix"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">$40 / Week</p>
              </div>

              <div className="flex items-center gap-1">
                <Icon
                  icon="lucide:clock-7"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">Full Time</p>
              </div>
            </div>

            <div className="flex items-center justify-between my-5">
              <div className="flex items-center gap-1">
                <Icon
                  icon="proicons:location"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">Lagos State, Nigeria</p>
              </div>

              <div className="flex items-center gap-1">
                <Icon icon="lucide:mic" className="text-[#7B7B7B] text-sm" />
                <p className="text-sm">Office Interview</p>
              </div>
            </div>

            <div className="">
              <p className="px-2 py-2 rounded-[999px] bg-[#F5F5F5] w-[120px] text-center">
                Volunteer
              </p>
            </div>

            <div className="my-5 border-t-2 border-dashed border-black/30 pt-5">
              <p className="font-semibold">Created 5 min ago</p>
            </div>
          </div>

          <div className="border border-black/30 rounded-md py-5 px-5">
            <div className="flex items-center justify-between">
              <div>
                <img
                  src="/Images/notify.svg"
                  alt="notification"
                  className="w-[80px]"
                />
              </div>

              <div>
                <Icon
                  icon="mi:delete-alt"
                  className="text-[36px] border border-black/30 p-2 rounded-[50%] cursor-pointer"
                />
              </div>
            </div>

            <div className="my-5">
              <div className="flex items-center gap-3">
                <h5 className="text-xl font-semibold">Charity Manager</h5>
                <span className="text-[#5F5F5F] text-2xl">|</span>
                <p className="text-[#5F5F5F] text-sm">Full Time</p>
              </div>

              <p className="text-[#7B7B7B] py-2">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum
                aperiam numquam modi veritatis nostrum repellendus dolores velit
                iusto ipsa aliquid, consectetur vitae omnis ad, nobis odio.
                Impedit deleniti deserunt error!
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon
                  icon="streamline-sharp:non-commercial-dollars-remix"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">$40 / Week</p>
              </div>

              <div className="flex items-center gap-1">
                <Icon
                  icon="lucide:clock-7"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">Full Time</p>
              </div>
            </div>

            <div className="flex items-center justify-between my-5">
              <div className="flex items-center gap-1">
                <Icon
                  icon="proicons:location"
                  className="text-[#7B7B7B] text-sm"
                />
                <p className="text-sm">Lagos State, Nigeria</p>
              </div>

              <div className="flex items-center gap-1">
                <Icon icon="lucide:mic" className="text-[#7B7B7B] text-sm" />
                <p className="text-sm">Office Interview</p>
              </div>
            </div>

            <div className="">
              <p className="px-2 py-2 rounded-[999px] bg-[#F5F5F5] w-[120px] text-center">
                Volunteer
              </p>
            </div>

            <div className="my-5 border-t-2 border-dashed border-black/30 pt-5">
              <p className="font-semibold">Created 5 min ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;
