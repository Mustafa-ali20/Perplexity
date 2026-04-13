import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/login/Login";
import Register from "../features/auth/pages/register/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import VerifyEmail from "../features/auth/pages/verify-email/VerfiyEmail";
import Verified from "../features/auth/pages/verified/Verified";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/verified",
    element: <Verified />,
  },
]);
