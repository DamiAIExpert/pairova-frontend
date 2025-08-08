const Success = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-[90%] bg-[url(/Images/man-bg.AVIF)] min-h-screen bg-cover hidden md:block">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="w-full min-h-screen bg-black/50" />
        </div>

        <div className="py-[150px] px-5 md:px-[150px] w-full relative">
          <div>
            <img
              src="/Images/confetti1.AVIF"
              alt="confetti"
              className="absolute right-0 top-0 hidden md:block"
            />

            <img
              src="/Images/confetti2.AVIF"
              alt="confetti"
              className="absolute bottom-0 hidden md:block"
            />
          </div>

          <div className="md:w-[400px]">
            <h1 className="text-xl font-semibold">Logo</h1>

            <div>
              <h2 className="text-4xl font-semibold">Created Successfully</h2>
              <p className="text-xs py-3 text-[#808080]">
                Proceed as either the job seeker or as the non profit
                <br /> organization
              </p>
            </div>

            <div className="my-5">
              <button className="bg-[#2F2F2F] text-white w-full py-3 rounded-md my-3">
                Procees
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
