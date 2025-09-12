import { Icon } from "@iconify/react";

const Notification = ({
  setShowNotification,
}: {
  setShowNotification: (newValue: boolean) => void;
}) => {
  return (
    <div className="absolute right-0 top-[76px] md:top-[50px] z-10">
      <div className="bg-white w-[95%] md:w-[500px] border border-black/30 shadow-2xl rounded-md py-2 ">
        <div className="flex items-center justify-between border-b py-3 px-3">
          <h5 className="font-semibold">Notification</h5>

          <Icon
            icon="proicons:cancel"
            className="text-4xl hover:bg-black/10 px-2 py-1 rounded-md cursor-pointer"
            onClick={() => setShowNotification(false)}
          />
        </div>

        <div className="my-6 px-5">
          <div className="flex gap-4 px-3 border border-black/30 rounded-md py-4">
            <div>
              <img
                src="/Images/notify.svg"
                alt="notification"
                className="w-[100px]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Trampco</h4>
                <span className="text-[#FF1111] text-2xl">•</span>
              </div>
              <p className="text-sm text-[#707070]">
                "Congratulations! You've been selected for the Charity
                Administrator position at Telmanco. Check in for more
                information
              </p>

              <p className="text-sm text-[#707070] pt-3">2 min ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
