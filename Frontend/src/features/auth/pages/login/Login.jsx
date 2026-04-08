import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./Login.css";
import { useAuth } from "../../hook/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const { handleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const navigate = useNavigate()

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // automatically detect if user typed email or username
    const payload = {
      password: formData.password,
      ...(isEmail(formData.identifier)
        ? { email: formData.identifier }
        : { username: formData.identifier }),
    };

   await handleLogin(payload)
   navigate("/")
  };

  return (
    <>
      <div
        className="auth-root min-h-screen flex items-center justify-center px-4"
        style={{ background: "#040a0b" }}
      >
        {/* background grid */}
        <div
          className="fixed inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#31b8c6 1px, transparent 1px), linear-gradient(90deg, #31b8c6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* glow blob */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: "#31b8c6" }}
        />

        <div className="relative w-full max-w-md">
          {/* corner decorations */}
          <div
            className="corner-decoration"
            style={{
              top: -8,
              left: -8,
              borderWidth: "2px 0 0 2px",
              borderRadius: "2px 0 0 0",
            }}
          />
          <div
            className="corner-decoration"
            style={{
              top: -8,
              right: -8,
              borderWidth: "2px 2px 0 0",
              borderRadius: "0 2px 0 0",
            }}
          />
          <div
            className="corner-decoration"
            style={{
              bottom: -8,
              left: -8,
              borderWidth: "0 0 2px 2px",
              borderRadius: "0 0 0 2px",
            }}
          />
          <div
            className="corner-decoration"
            style={{
              bottom: -8,
              right: -8,
              borderWidth: "0 2px 2px 0",
              borderRadius: "0 0 2px 0",
            }}
          />

          <div className="card-bg px-8 py-10">
            {/* header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="tag-chip px-2 py-1 rounded-sm">
                  SECURE LOGIN
                </span>
              </div>
              <h1
                className="auth-title text-3xl text-white mb-1"
                style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Welcome Back
              </h1>
              <p className="text-xs" style={{ color: "#2e4a4e" }}>
                PERPLEXITY / LOGIN
              </p>
            </div>

            <div className="divider-line mb-8" />

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* identifier — email or username */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-text">Email or Username</label>
                  <span
                    className="identifier-hint"
                    style={{
                      color: formData.identifier
                        ? isEmail(formData.identifier)
                          ? "#31b8c6"
                          : "#5a7a7e"
                        : "#2a3d40",
                    }}
                  >
                    {formData.identifier
                      ? isEmail(formData.identifier)
                        ? "→ email detected"
                        : "→ username detected"
                      : "auto-detects type"}
                  </span>
                </div>
                <div className="glow-border rounded">
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="you@domain.com or your_handle"
                    className="input-field w-full px-4 py-3 rounded relative z-10"
                    required
                  />
                </div>
              </div>

              {/* password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-text">Password</label>
                  <a
                    href="/forgot-password"
                    className="link-text hint-text"
                    style={{ color: "#31b8c6" }}
                  >
                    Forgot?
                  </a>
                </div>
                <div className="glow-border rounded relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field w-full px-4 py-3 pr-16 rounded relative z-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn absolute right-3 top-1/2 -translate-y-1/2 z-20"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="submit-btn w-full py-3 rounded"
                >
                  Sign In →
                </button>
              </div>
            </form>

            <div className="divider-line mt-8 mb-5" />

            <p
              className="text-center"
              style={{ color: "#2e4a4e", fontSize: "0.78rem" }}
            >
              Don't have an account?{" "}
              <a href="/register" className="link-text">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
