import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Otp = ({
  setStep,
}: {
  setStep: (step: { stepThree: boolean }) => void;
}) => {
  return (
    <div>
      <div className="flex">
        <div className="w-[50%] bg-[url(/Images/man-bg.AVIF)] min-h-screen bg-cover hidden md:block">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="w-full min-h-screen bg-black/50" />
        </div>

        <div className="w-full md:w-auto py-[50px] md:py-[150px] px-5 md:px-[100px]">
          <h1 className="text-xl font-semibold">Logo</h1>

          <div>
            <h2 className="text-4xl font-semibold">Enter the six digit code</h2>
            <p className="text-xs py-3 text-[#808080]">
              Check your email for the code sent
            </p>
          </div>

          <div className="my-4">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="my-5">
              <button className="text-[#8A8A8A] text-xs w-full">
                Try another way
              </button>
              <button
                className="bg-[#2F2F2F] text-white w-full py-3 rounded-md my-3"
                onClick={() => setStep({ stepThree: true })}
              >
                Verify Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
