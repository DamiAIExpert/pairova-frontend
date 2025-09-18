import LandingPage from "./pages/home/landingPage";
import { createBrowserRouter, RouterProvider } from "react-router";
import UserAuth from "./pages/userAuth";
import Login from "./pages/login";
import Register from "./pages/register";
import Onboarding from "./pages/seeker/onboarding";
import AccountPage from "./pages/seeker/accountPage";
import AddressPage from "./pages/seeker/addressPage";
import BioPage from "./pages/seeker/bioPage";
import InfoPage from "./pages/seeker/infoPage";
import EducationPage from "./pages/seeker/educationPage";
import ExperiencePage from "./pages/seeker/experiencePage";
import SkillPage from "./pages/seeker/skillPage";
import Seeker from "./pages/seeker/seeker";
import JobPage from "./pages/seeker/jobPage";
import FinderPage from "./pages/seeker/finderPage";
import ProfileRoot from "./pages/seeker/profileRoot";
import ProfilePage from "./pages/seeker/profilePage";
import JobReminderPage from "./pages/seeker/jobReminderPage";
import SettingsPage from "./pages/seeker/settings";

// Non Profit

import OnboardingNpo from "./pages/npo/onboardingNpo";
import AccountNpo from "./pages/npo/accountNpo";
import CompanyInfoPage from "./pages/npo/companyInfoPage";
import AddressNpo from "./pages/npo/addressNpo";
import BioNpo from "./pages/npo/bioNpo";
import MissionPage from "./pages/npo/missionPage";
import ValuesPage from "./pages/npo/valuesPage";
import SkillsNpo from "./pages/npo/skillsNpo";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/user",
      element: <UserAuth />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Register />,
    },
    {
      path: "/seeker/create-account",
      element: <Onboarding />,
      children: [
        {
          index: true,
          element: <AccountPage />,
        },
        {
          path: "personal-information",
          element: <InfoPage />,
        },
        {
          path: "address",
          element: <AddressPage />,
        },
        {
          path: "bio",
          element: <BioPage />,
        },
        {
          path: "education",
          element: <EducationPage />,
        },
        {
          path: "experience",
          element: <ExperiencePage />,
        },
        {
          path: "skill",
          element: <SkillPage />,
        },
      ],
    },
    {
      path: "/seeker",
      element: <Seeker />,
      children: [
        {
          index: true,
          element: <FinderPage />,
        },
        {
          path: "job",
          element: <JobPage />,
        },
      ],
    },
    {
      path: "/seeker/profile",
      element: <ProfileRoot />,
      children: [
        {
          index: true,
          element: <ProfilePage />,
        },
        {
          path: "job-reminder",
          element: <JobReminderPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
      ],
    },

    // Non Profit

    {
      path: "/non-profit/create-account",
      element: <OnboardingNpo />,
      children: [
        {
          index: true,
          element: <AccountNpo />,
        },
        {
          path: "company-info",
          element: <CompanyInfoPage />,
        },
        {
          path: "address",
          element: <AddressNpo />,
        },
        {
          path: "bio",
          element: <BioNpo />,
        },
        {
          path: "mission-statement",
          element: <MissionPage />,
        },
        {
          path: "values",
          element: <ValuesPage />,
        },
        {
          path: "skills",
          element: <SkillsNpo />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
