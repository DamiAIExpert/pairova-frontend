import PersonalInfo from "@/components/jobSeeker/onboarding/personalInfo";
import { ScrollRestoration } from "react-router";

const InfoPage = () => {
  return (
    <div>
      <ScrollRestoration />
      <PersonalInfo />
    </div>
  );
};

export default InfoPage;
