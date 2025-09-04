import { Progress } from "@/components/ui/progress";
import { Outlet, Link } from "react-router";

const Index = () => {
  return (
    <div>
      <div>
        <div className="py-5 px-5 bg-white">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />
        </div>

        <div className="bg-[#F1F1F1] px-3 flex gap-5">
          <div className="w-[400px] py-8 hidden md:block">
            <h2 className="text-xl font-semibold">Create Account</h2>

            <div className="bg-white border border-black/30 my-5 rounded-md">
              <div className="border-b border-black/30 px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-[500]">Completion</p>
                  </div>

                  <p className="font-[500]">16%</p>
                </div>

                <div className="my-3 border border-[#0E0E0E33] p-3 rounded-[999px]">
                  <Progress value={16} />
                </div>
              </div>

              <Link to="">
                <div className="border-b border-black/30 p-5">
                  <p>Account Info</p>
                </div>
              </Link>

              <Link to="personal-information">
                <div className="border-b border-black/30 p-5">
                  <p>Personal Information</p>
                </div>
              </Link>

              <Link to="address">
                <div className="border-b border-black/30 p-5">
                  <p>Address</p>
                </div>
              </Link>

              <Link to="bio">
                <div className="border-b border-black/30 p-5">
                  <p>Bio</p>
                </div>
              </Link>

              <Link to="education">
                <div className="border-b border-black/30 p-5">
                  <p>Education</p>
                </div>
              </Link>

              <Link to="experience">
                <div className="border-b border-black/30 p-5">
                  <p>Experience</p>
                </div>
              </Link>

              <Link to="skill">
                <div className="border-b border-black/30 p-5">
                  <p>Skill</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
