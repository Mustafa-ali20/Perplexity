import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import axios from "axios";

const Verified = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    axios
      .get(`http://localhost:3000/api/auth/verify-email?token=${token}`, {
        withCredentials: true,
      })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may have expired.",
        );
      });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#040a0b", fontFamily: "'DM Mono', monospace" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&display=swap');`}</style>

      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#31b8c6 1px, transparent 1px), linear-gradient(90deg, #31b8c6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "#31b8c6", opacity: 0.04, filter: "blur(80px)" }}
      />

      <div className="relative w-full max-w-md">
        {[
          { top: -8, left: -8, border: "2px 0 0 2px", radius: "2px 0 0 0" },
          { top: -8, right: -8, border: "2px 2px 0 0", radius: "0 2px 0 0" },
          { bottom: -8, left: -8, border: "0 0 2px 2px", radius: "0 0 0 2px" },
          { bottom: -8, right: -8, border: "0 2px 2px 0", radius: "0 0 2px 0" },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute w-5 h-5 pointer-events-none"
            style={{
              ...s,
              borderColor: "#31b8c6",
              borderStyle: "solid",
              borderWidth: s.border,
              borderRadius: s.radius,
              opacity: 0.6,
            }}
          />
        ))}

        <div
          className="px-8 py-10 rounded"
          style={{
            background: "#080e10",
            border: "1px solid #0f1e21",
            boxShadow: "0 0 60px #31b8c608, 0 25px 50px #00000080",
          }}
        >
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "2px solid #31b8c630",
                  borderTop: "2px solid #31b8c6",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              <p style={{ color: "#3a5a5e", fontSize: "0.8rem" }}>
                Verifying your email...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {status === "success" && (
            <>
              <div
                className="mb-6 flex items-center justify-center w-14 h-14 rounded"
                style={{
                  background: "#31b8c610",
                  border: "1px solid #31b8c625",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#31b8c6"
                  strokeWidth="1.5"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <div className="mb-2 flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded-sm"
                  style={{
                    background: "#31b8c610",
                    border: "1px solid #31b8c625",
                    color: "#31b8c6",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  VERIFIED
                </span>
              </div>

              <h1
                className="mb-3 text-white"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                You're verified!
              </h1>

              <p
                className="mb-8"
                style={{
                  color: "#3a5a5e",
                  fontSize: "0.8rem",
                  lineHeight: 1.7,
                }}
              >
                Your email has been verified successfully. You can now sign in
                and start using Perplexity.
              </p>

              <div
                className="h-px mb-6"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #1e2d2f, transparent)",
                }}
              />

              <Link
                to="/login"
                className="flex items-center justify-center w-full py-3 rounded"
                style={{
                  background: "#31b8c6",
                  color: "#050d0e",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = "0 0 30px #31b8c640")
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              >
                Go to Login →
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div
                className="mb-6 flex items-center justify-center w-14 h-14 rounded"
                style={{
                  background: "#ef444410",
                  border: "1px solid #ef444425",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>

              <div className="mb-2">
                <span
                  className="px-2 py-1 rounded-sm"
                  style={{
                    background: "#ef444410",
                    border: "1px solid #ef444425",
                    color: "#ef4444",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  FAILED
                </span>
              </div>

              <h1
                className="mb-3 text-white"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Verification failed
              </h1>

              <p
                className="mb-8"
                style={{
                  color: "#3a5a5e",
                  fontSize: "0.8rem",
                  lineHeight: 1.7,
                }}
              >
                {message}
              </p>

              <div
                className="h-px mb-6"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #1e2d2f, transparent)",
                }}
              />

              <Link
                to="/register"
                className="flex items-center justify-center w-full py-3 rounded"
                style={{
                  background: "#31b8c6",
                  color: "#050d0e",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Register Again →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verified;
