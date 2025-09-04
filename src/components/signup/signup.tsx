import { Icon } from "@iconify/react";
import { Link } from "react-router";

const Signup = ({
  setStep,
}: {
  setStep: (step: { stepTwo: boolean }) => void;
}) => {
  return (
    <div>
      <div className="flex gap-10">
        <div className="w-[50%] bg-[url(/Images/signup-bg.AVIF)] min-h-screen bg-cover bg-no-repeat hidden md:block">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="absolute left-[40px] bottom-[80px]">
            <h2 className="text-white text-[36px] font-semibold">
              Our Philosophy is simple
            </h2>
            <p className="text-white text-[24px] font-semibold">
              Pairova allows non profit organizations
              <br /> promote job roles for users
            </p>
          </div>
          <div className="w-full min-h-full bg-black/30" />
        </div>

        <div className="py-[50px] px-5 md:px-10 w-full md:w-[400px] md:mx-auto">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />

          <div>
            <h2 className="text-4xl font-semibold">Join Pairova</h2>
            <p className="text-sm py-3 text-[#808080]">
              Let’s get started already. Join our 100%
              <br className="hidden md:block" /> remote network of creators and
              freelancers{" "}
            </p>
          </div>

          {/* Sign up with Google or LinkedIn */}

          <div className="my-3">
            <button className="border border-[#818181] w-full py-3 flex items-center gap-3 justify-center rounded-md my-5">
              <Icon icon="flat-color-icons:google" className="text-2xl" />
              Sign up with Google
            </button>

            <button className="border border-[#818181] w-full py-3 flex items-center gap-3 justify-center rounded-md my-5">
              <Icon icon="devicon:linkedin" className="text-2xl" />
              Sign up with LinkedIn
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="bg-[#969696] h-[1px] w-full"></p>
            <p>OR</p>
            <p className="bg-[#969696] h-[1px] w-full"></p>
          </div>

          {/* Signup with Email */}

          <div className="my-4">
            <div>
              <label htmlFor="" className="text-sm">
                Name
              </label>
              <input
                type="text"
                className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full"
                placeholder="Enter Name"
              />
            </div>

            <div>
              <label htmlFor="" className="text-sm">
                Email
              </label>
              <input
                type="email"
                className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full"
                placeholder="Enter Email Adress"
              />
            </div>

            <div>
              <label htmlFor="" className="text-sm">
                Password
              </label>
              <input
                type="password"
                className="py-3 border border-[#818181] px-3 block my-2 rounded-md w-full"
                placeholder="Enter Password"
              />
            </div>

            <div className="my-5">
              <button
                className="bg-black text-white py-3 w-full rounded-md cursor-pointer"
                onClick={() => setStep({ stepTwo: true })}
              >
                Signup
              </button>

              <div className="my-2">
                <p className="text-center text-xs my-3">
                  Already have an account?{" "}
                  <span className="text-[#000148] underline">
                    <Link to="/login">Log in</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
