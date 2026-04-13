import axios from "axios";

const api = new axios.create({
  baseURL: "https://perplexity-8rzc.onrender.com",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
}

export async function login({ identifier, password }) {
  const response = await api.post("/api/auth/login", { identifier, password });
  return response.data;
}

export async function getMe() {
  const response = await api.get("api/auth/get-me");
  return response.data;
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}
