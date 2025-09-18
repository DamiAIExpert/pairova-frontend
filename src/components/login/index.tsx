import { Link, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useUser } from "@/store";

const Index = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  const handleClick = () => {
    if (user === "jobSeeker") {
      navigate("/seeker/create-account");
    } else if (user === "nonProfit") {
      navigate("/non-profit/create-account");
    }
  };

  return (
    <div>
      <div className="flex gap-10">
        <div className="w-[50%] bg-[url(/Images/welcome.AVIF)] min-h-screen bg-cover relative hidden md:block">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="absolute left-[20px] bottom-[20px]">
            <Icon icon="ph:smiley-light" className="text-white text-[120px]" />
            <h2 className="text-[48px] text-white font-semibold">
              Welcome Back!
            </h2>
            <p className="text-[24px] text-white font-semibold">
              Apply for your next job role
            </p>
          </div>
          <div className="w-full min-h-screen bg-black/50" />
        </div>

        <div className="w-full md:w-auto py-[50px] md:py-[150px] px-5 md:px-10">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />

          <div>
            <h2 className="text-4xl font-semibold">Login to your account</h2>
            <p className="text-xs py-3 text-[#808080]">
              Let’s get started already. Join our 100%
              <br /> remote network of creators and freelancers{" "}
            </p>
          </div>

          <div className="my-3">
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

            <div className="my-3">
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
              {/* <Link to="/seeker/create-account"> */}
                <button
                  className="bg-black text-white py-3 w-full rounded-md cursor-pointer"
                  onClick={handleClick}
                >
                  Login
                </button>
              {/* </Link> */}

              <div className="my-2">
                <button className="text-xs underline text-[#434343] w-full ">
                  Forgot Password
                </button>
                <p className="text-center text-xs my-3">
                  Don't have an account?{" "}
                  <span className="text-[#000148] underline">
                    <Link to="/signup">Sign Up</Link>
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

export default Index;
