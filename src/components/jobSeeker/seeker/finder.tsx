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

const Finder = () => {
  return (
    <div className="px-5 md:px-[50px] py-[50px]">
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
            <div className="flex items-start gap-2">
              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                L
              </h4>

              <div>
                <Link to="job">
                  <h5 className="text-lg text-[#4F4F4F]">Non-Profit Expert</h5>
                </Link>
                <p className="text-sm text-[#4F4F4F]">Shalom Health Abuja</p>
              </div>
            </div>

            <div>
              <Icon
                icon="proicons:bookmark"
                className="text-2xl text-[#646464] cursor-pointer"
              />
            </div>
          </div>

          <p className="text-[#4F4F4F] py-2">Match with your profile</p>

          <div className="flex flex-wrap my-3 items-center gap-3">
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
          </div>

          <p className="text-lg text-[#4F4F4F]">1 day ago • 50 applicants</p>

          <div className="flex items-center justify-between my-4">
            <div>
              <p>
                <span className="font-semibold">$100</span> per month
              </p>
            </div>

            <div>
              <Link to="job">
                <button className="border border-[#58585866] rounded-md py-2 px-8 cursor-pointer hover:bg-black/80 hover:text-white ease-in duration-200">
                  Apply
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                L
              </h4>

              <div>
                <Link to="job">
                  <h5 className="text-lg text-[#4F4F4F]">Non-Profit Expert</h5>
                </Link>
                <p className="text-sm text-[#4F4F4F]">Shalom Health Abuja</p>
              </div>
            </div>

            <div>
              <Icon
                icon="proicons:bookmark"
                className="text-2xl text-[#646464] cursor-pointer"
              />
            </div>
          </div>

          <p className="text-[#4F4F4F] py-2">Match with your profile</p>

          <div className="flex flex-wrap my-3 items-center gap-3">
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
          </div>

          <p className="text-lg text-[#4F4F4F]">1 day ago • 50 applicants</p>

          <div className="flex items-center justify-between my-4">
            <div>
              <p>
                <span className="font-semibold">$100</span> per month
              </p>
            </div>

            <div>
              <Link to="job">
                <button className="border border-[#58585866] rounded-md py-2 px-8 cursor-pointer hover:bg-black/80 hover:text-white ease-in duration-200">
                  Apply
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                L
              </h4>

              <div>
                <Link to="job">
                  <h5 className="text-lg text-[#4F4F4F]">Non-Profit Expert</h5>
                </Link>
                <p className="text-sm text-[#4F4F4F]">Shalom Health Abuja</p>
              </div>
            </div>

            <div>
              <Icon
                icon="proicons:bookmark"
                className="text-2xl text-[#646464] cursor-pointer"
              />
            </div>
          </div>

          <p className="text-[#4F4F4F] py-2">Match with your profile</p>

          <div className="flex flex-wrap my-3 items-center gap-3">
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
          </div>

          <p className="text-lg text-[#4F4F4F]">1 day ago • 50 applicants</p>

          <div className="flex items-center justify-between my-4">
            <div>
              <p>
                <span className="font-semibold">$100</span> per month
              </p>
            </div>

            <div>
              <Link to="job">
                <button className="border border-[#58585866] rounded-md py-2 px-8 cursor-pointer hover:bg-black/80 hover:text-white ease-in duration-200">
                  Apply
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                L
              </h4>

              <div>
                <Link to="job">
                  <h5 className="text-lg text-[#4F4F4F]">Non-Profit Expert</h5>
                </Link>
                <p className="text-sm text-[#4F4F4F]">Shalom Health Abuja</p>
              </div>
            </div>

            <div>
              <Icon
                icon="proicons:bookmark"
                className="text-2xl text-[#646464] cursor-pointer"
              />
            </div>
          </div>

          <p className="text-[#4F4F4F] py-2">Match with your profile</p>

          <div className="flex flex-wrap my-3 items-center gap-3">
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
          </div>

          <p className="text-lg text-[#4F4F4F]">1 day ago • 50 applicants</p>

          <div className="flex items-center justify-between my-4">
            <div>
              <p>
                <span className="font-semibold">$100</span> per month
              </p>
            </div>

            <div>
              <Link to="job">
                <button className="border border-[#58585866] rounded-md py-2 px-8 cursor-pointer hover:bg-black/80 hover:text-white ease-in duration-200">
                  Apply
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h4 className="text-2xl font-semibold text-white px-5 py-2 rounded-md bg-[#004D40]">
                L
              </h4>

              <div>
                <Link to="job">
                  <h5 className="text-lg text-[#4F4F4F]">Non-Profit Expert</h5>
                </Link>
                <p className="text-sm text-[#4F4F4F]">Shalom Health Abuja</p>
              </div>
            </div>

            <div>
              <Icon
                icon="proicons:bookmark"
                className="text-2xl text-[#646464] cursor-pointer"
              />
            </div>
          </div>

          <p className="text-[#4F4F4F] py-2">Match with your profile</p>

          <div className="flex flex-wrap my-3 items-center gap-3">
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Full Time</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">Hybrid</p>
            <p className="bg-[#E0E0E0] px-4 py-1 rounded-sm">1 - 3 years</p>
          </div>

          <p className="text-lg text-[#4F4F4F]">1 day ago • 50 applicants</p>

          <div className="flex items-center justify-between my-4">
            <div>
              <p>
                <span className="font-semibold">$100</span> per month
              </p>
            </div>

            <div>
              <Link to="job">
                <button className="border border-[#58585866] rounded-md py-2 px-8 cursor-pointer hover:bg-black/80 hover:text-white ease-in duration-200">
                  Apply
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finder;
