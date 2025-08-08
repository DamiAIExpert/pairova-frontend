import { useState } from "react";
import Signup from "./signup";
import Otp from "./otp";
import Success from "./success";

const Index = () => {
  const [step, setStep] = useState<{
    stepOne?: boolean;
    stepTwo?: boolean;
    stepThree?: boolean;
  }>({
    stepOne: true,
    stepTwo: false,
    stepThree: false,
  });

  return (
    <div>
      {step.stepOne && <Signup setStep={setStep} />}
      {step.stepTwo && <Otp setStep={setStep} />}
      {step.stepThree && <Success />}
    </div>
  );
};

export default Index;
