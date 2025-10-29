import { useState } from "react";
import Signup from "./signup";
import Otp from "./otp";
import Success from "./success";

type UserRole = "jobSeeker" | "nonProfit" | null;

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

  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleSignupSuccess = (email: string, role: UserRole) => {
    setUserEmail(email);
    setUserRole(role);
  };

  return (
    <div>
      {step.stepOne && <Signup setStep={setStep} onSignupSuccess={handleSignupSuccess} />}
      {step.stepTwo && <Otp setStep={setStep} email={userEmail} />}
      {step.stepThree && <Success userRole={userRole} />}
    </div>
  );
};

export default Index;
