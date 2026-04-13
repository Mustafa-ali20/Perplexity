import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Protected from "../features/auth/components/Protected";

const Login = lazy(() => import("../features/auth/pages/login/Login"));
const Register = lazy(() => import("../features/auth/pages/register/Register"));
const Dashboard = lazy(() => import("../features/chat/pages/Dashboard"));
const VerifyEmail = lazy(
  () => import("../features/auth/pages/verify-email/VerfiyEmail"),
);
const Verified = lazy(() => import("../features/auth/pages/verified/Verified"));

const withSuspense = (Component) => (
  <Suspense
    fallback={
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid transparent",
            borderTop: "3px solid #31b8c6", // matches your TopLoader color
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }
  >
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  { path: "/login", element: withSuspense(Login) },
  { path: "/register", element: withSuspense(Register) },
  { path: "/", element: withSuspense(Dashboard) },
  { path: "/verify-email", element: withSuspense(VerifyEmail) },
  { path: "/verified", element: withSuspense(Verified) },
]);
