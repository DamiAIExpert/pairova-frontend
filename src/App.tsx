import LandingPage from "./pages/home/landingPage";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Login from "./pages/login";
import Register from "./pages/register";
import AuthCallback from "./pages/AuthCallback";
import VerifyEmail from "./pages/VerifyEmail";
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
import ApplyPage from "./pages/seeker/applyPage";
import FinderPage from "./pages/seeker/finderPage";
import ProfileRoot from "./pages/seeker/profileRoot";
import ProfilePage from "./pages/seeker/profilePage";
import JobReminderPage from "./pages/seeker/jobReminderPage";
import SettingsPage from "./pages/seeker/settings";
import PrivacySettings from "./pages/PrivacySettings";
import ProtectedOnboardingRoute from "./components/ProtectedOnboardingRoute";

// Non Profit

import OnboardingNpo from "./pages/npo/onboardingNpo";
import AccountNpo from "./pages/npo/accountNpo";
import CompanyInfoPage from "./pages/npo/companyInfoPage";
import AddressNpo from "./pages/npo/addressNpo";
import BioNpo from "./pages/npo/bioNpo";
import MissionPage from "./pages/npo/missionPage";
import ValuesPage from "./pages/npo/valuesPage";
import SkillsNpo from "./pages/npo/skillsNpo";
import ProfileDashboard from "./pages/npo/dashboard/profileDashboard";
import JobNpo from "./pages/npo/dashboard/jobNpo";
import CreateJobNpo from "./pages/npo/dashboard/createJobNpo";
import RecruitmentBoard from "./pages/npo/dashboard/recruitmentBoard";
import NonprofitSettings from "./pages/npo/settings";
import NonprofitMessages from "./pages/npo/messages";
import NonprofitHelpCenter from "./pages/npo/helpCenter";
import NonprofitDeleteAccount from "./pages/npo/deleteAccount";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/user",
      element: <Navigate to="/signup" replace />,
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
      path: "/auth/callback",
      element: <AuthCallback />,
    },
    {
      path: "/verify-email",
      element: <VerifyEmail />,
    },
    {
      path: "/jobs/:id",
      element: <JobPage />,
    },
    {
      path: "/seeker/create-account",
      element: (
        <ProtectedOnboardingRoute redirectToDashboard="/seeker">
          <Onboarding />
        </ProtectedOnboardingRoute>
      ),
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
          path: "job/:id",
          element: <JobPage />,
        },
        {
          path: "job/:id/apply",
          element: <ApplyPage />,
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
    {
      path: "/seeker/privacy-settings",
      element: <PrivacySettings />,
    },

    // Non Profit

    {
      path: "/non-profit/create-account",
      element: (
        <ProtectedOnboardingRoute redirectToDashboard="/non-profit">
          <OnboardingNpo />
        </ProtectedOnboardingRoute>
      ),
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
    {
      path: "/non-profit",
      element: <ProfileDashboard />,
      children: [
        {
          index: true,
          element: <JobNpo />,
        },
        {
          path: "create-job",
          element: <CreateJobNpo />,
        },
        {
          path: "recruitment-board",
          element: <RecruitmentBoard />,
        },
        {
          path: "settings",
          element: <NonprofitSettings />,
        },
        {
          path: "messages",
          element: <NonprofitMessages />,
        },
        {
          path: "help-center",
          element: <NonprofitHelpCenter />,
        },
        {
          path: "delete-account",
          element: <NonprofitDeleteAccount />,
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
