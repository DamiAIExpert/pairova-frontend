import AccountInfo from "@/components/jobSeeker/onboarding/accountInfo";
import { ScrollRestoration } from "react-router";

const AccountPage = () => {
  return (
    <div>
      <ScrollRestoration />
      <AccountInfo />
    </div>
  );
};

export default AccountPage;
