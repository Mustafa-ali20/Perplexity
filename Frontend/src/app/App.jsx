import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth";
import TopLoader from "../components/loader/TopLoader";

function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <TopLoader />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
