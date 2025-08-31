import { Icon } from "@iconify/react";
import { Switch } from "@/components/ui/switch";

const PrivacyModal = ({setShowPrivacySetting} : {setShowPrivacySetting : (newValue: boolean) => void;}) => {
  return (
    <div className="bg-black/30 w-full h-full fixed top-0 z-[1000] ">
      <div className="bg-white py-5 px-5 rounded-xl w-[95%] md:w-[600px] h-[90%] mx-auto my-[50px] overflow-y-scroll">
        <h3 className="text-center text-xl font-[500]">Privacy Settings</h3>

        <div className="flex items-center gap-1 mt-7">
          <Icon
            icon="gridicons:notice-outline"
            className="text-2xl rotate-180 text-[#AAAAAA]"
          />

          <p className="text-[#AAAAAA]">Set the data to be used by the model</p>
        </div>

        <div className="my-3">
          <div className=" my-6">
            <h3 className="font-semibold text-lg my-2">Personal Information</h3>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable test</p>

              <Switch />
            </div>
          </div>

          <div className=" my-6">
            <h3 className="font-semibold text-lg my-2">Gender Data</h3>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable test</p>

              <Switch />
            </div>
          </div>

          <div className=" my-6">
            <h3 className="font-semibold text-lg my-2">Location</h3>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable test</p>

              <Switch />
            </div>
          </div>

          <div className=" my-6">
            <h3 className="font-semibold text-lg my-2">Experience</h3>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable test</p>

              <Switch />
            </div>
          </div>

          <div className=" my-6">
            <h3 className="font-semibold text-lg my-2">Skills</h3>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable test</p>

              <Switch />
            </div>
          </div>

          <div className=" my-6">
            <h3 className="font-semibold text-lg my-2">Certificates</h3>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable test</p>

              <Switch />
            </div>
          </div>

          <div className=" my-6">
            <h3 className="font-semibold text-lg my-2">Bio</h3>
            <div className="flex items-center justify-between border border-black/30 py-3 px-3 rounded-md">
              <p>Enable test</p>

              <Switch />
            </div>
          </div>
        </div>

        <div className="border-t border-black/30 py-8 flex flex-col md:flex-row gap-4 items-center justify-between my-8">
          <button className="px-7 py-2 rounded-md border border-black/30 text-[#818181] w-full md:w-auto" onClick={() => setShowPrivacySetting(false)}>Cancel</button>
          <button className="bg-black text-white py-2 px-7 rounded-md w-full md:w-auto" onClick={() => setShowPrivacySetting(false)}>Save and Continue</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
