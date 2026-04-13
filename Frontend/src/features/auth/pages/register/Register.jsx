import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hook/useAuth";
import "./Register.scss";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const success = await handleRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (success)
        navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      const responseData = error.response?.data;
      if (responseData?.errors) {
        const mapped = {};
        responseData.errors.forEach((e) => (mapped[e.path] = e.msg));
        setFieldErrors(mapped);
      }
      if (responseData?.message) {
        setFieldErrors({ email: responseData.message });
      }
    }
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
          className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
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

          <div className="card-bg noise-overlay px-8 py-10">
            {/* header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="tag-chip px-2 py-1 rounded-sm">
                  NEW ACCOUNT
                </span>
              </div>
              <h1
                className="auth-title text-3xl font-800 text-white mb-1"
                style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Create Account
              </h1>
              <p className="text-xs" style={{ color: "#2e4a4e" }}>
                PERPLEXITY / REGISTER
              </p>
            </div>

            <div className="divider-line mb-8" />

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* username */}
              <div>
                <label className="label-text block mb-2">Username</label>
                <div className="glow-border rounded">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="your_handle"
                    className={`input-field w-full px-4 py-3 rounded relative z-10 ${fieldErrors.username ? "error" : ""}`}
                    required
                  />
                </div>
                {fieldErrors.username && (
                  <p className="field-error">{fieldErrors.username}</p>
                )}
              </div>

              {/* email */}
              <div>
                <label className="label-text block mb-2">Email</label>
                <div className="glow-border rounded">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    className={`input-field w-full px-4 py-3 rounded relative z-10 ${fieldErrors.email ? "error" : ""}`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="field-error">{fieldErrors.email}</p>
                )}
              </div>

              {/* password */}
              <div>
                <label className="label-text block mb-2">Password</label>
                <div className="glow-border rounded relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="min. 6 characters"
                    className="input-field w-full px-4 py-3 pr-16 rounded relative z-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn absolute right-3 top-1/2 -translate-y-1/2 z-20"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="field-error">{fieldErrors.password}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="submit-btn w-full py-3 rounded"
                >
                  Create Account →
                </button>
              </div>
            </form>

            <div className="divider-line mt-8 mb-5" />

            <p
              className="text-center"
              style={{ color: "#2e4a4e", fontSize: "0.78rem" }}
            >
              Already have an account?{" "}
              <a href="/login" className="link-text">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
