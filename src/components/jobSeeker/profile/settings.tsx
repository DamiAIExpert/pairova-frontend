import { Icon } from "@iconify/react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="min-h-screen mx-5 my-5">
        <h2 className="text-2xl font-semibold py-5">Settings</h2>

        <div className="rounded-md px-5 md:px-8 py-5 bg-white">
          <h3 className="text-xl font-[500]">Current Password</h3>

          <div className="my-10">
            <div>
              <label htmlFor="" className="text-[#797979] text-sm">
                Change Password
              </label>
              <div className="flex items-center gap-4 border border-[#E7E9ED] my-3 rounded-lg px-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full py-3 focus:outline-none"
                  name="password"
                  // value={loginInfo.password}
                  // onChange={handleChange}
                  placeholder="•••••••••••••••••"
                />
                <Icon
                  icon={
                    showPassword ? "fluent:eye-off-24-regular" : "iconoir:eye"
                  }
                  className="text-2xl cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row my-5 items-center md:gap-10">
              <div className="w-full">
                <label htmlFor="" className="text-[#797979] text-sm">
                  Create New Password
                </label>
                <div className="flex items-center gap-4 border border-[#E7E9ED] my-3 rounded-lg px-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full py-3 focus:outline-none"
                    name="password"
                    // value={loginInfo.password}
                    // onChange={handleChange}
                    placeholder="•••••••••••••••••"
                  />
                  <Icon
                    icon={
                      showPassword ? "fluent:eye-off-24-regular" : "iconoir:eye"
                    }
                    className="text-2xl cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="" className="text-[#797979] text-sm">
                  Confirm New Password
                </label>
                <div className="flex items-center gap-4 border border-[#E7E9ED] my-3 rounded-lg px-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full py-3 focus:outline-none"
                    name="password"
                    // value={loginInfo.password}
                    // onChange={handleChange}
                    placeholder="•••••••••••••••••"
                  />
                  <Icon
                    icon={
                      showPassword ? "fluent:eye-off-24-regular" : "iconoir:eye"
                    }
                    className="text-2xl cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button className="bg-black cursor-pointer px-5 py-2 rounded-md text-white">
                Save Password
              </button>
            </div>
          </div>

          <div className="my-10">
            <div className="my-5">
              <h4 className="font-semibold">2 Factor Authentication</h4>

              <div className="my-3 flex items-center justify-between border border-black/30 rounded-md px-5 py-4">
                <p>Enable Authentication</p>

                <Switch id="2 Factor Authentication" />
              </div>
            </div>

            <div className="my-10">
              <h4 className="font-semibold">Profile Privacy</h4>

              <div className="my-3 flex items-center justify-between border border-black/30 rounded-md px-5 py-4">
                <p>Hide Profile from Public</p>

                <Switch id="2 Factor Authentication" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
