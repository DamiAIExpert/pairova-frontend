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
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
