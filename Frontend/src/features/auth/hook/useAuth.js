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
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleRegister({ username, email, password }) {
    await withDispatch(async () => {
      const user = await register({ username, email, password });
      dispatch(setUser(user));
    }, "Registration failed");
  }

  async function handleLogin({ identifier, password }) {
    await withDispatch(async () => {
      const data = await login({ identifier, password });
      dispatch(setUser(data.user));
    }, "Login failed");
  }

  async function handleGetMe() {
    await withDispatch(async () => {
      const data = await getMe();
      dispatch(setUser(data.user));
    }, "Failed to fetch user data");
  }

  return { handleGetMe, handleLogin, handleRegister };
}
