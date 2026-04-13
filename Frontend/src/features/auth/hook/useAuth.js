import { useDispatch } from "react-redux";
import { register, login, getMe } from "../services/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  // single wrapper — handles loading, error, finally for every function from claude better handling of loading and error states in one place, instead of repeating in every function
  async function withDispatch(asyncFn, fallbackMessage) {
    try {
      dispatch(setLoading(true));
      return await asyncFn();
    } catch (error) {
      dispatch(setError(error.response?.data?.message || fallbackMessage));
      throw error; // re-throw so Login.jsx catch block can also handle it
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleRegister({ username, email, password }) {
    return await withDispatch(async () => {
      const user = await register({ username, email, password });
      dispatch(setUser(user));
      return true;
    }, "Registration failed");
  }

  async function handleLogin({ identifier, password }) {
    return await withDispatch(async () => {
      const data = await login({ identifier, password });
      dispatch(setUser(data.user));
      return true;
    }, "Login failed");
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      // silently ignore - user just isn't logged in
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleGetMe, handleLogin, handleRegister };
}
