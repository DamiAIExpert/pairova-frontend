import LandingPage from "./pages/home/landingPage";
import { createBrowserRouter, RouterProvider } from "react-router";
import UserAuth from "./pages/userAuth";
import Login from "./pages/seeker/login";
import Register from "./pages/seeker/register";

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
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
