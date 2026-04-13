import { useLocation, Link } from "react-router";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#040a0b", fontFamily: "'DM Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&display=swap');`}</style>

      {/* grid bg */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "linear-gradient(#31b8c6 1px, transparent 1px), linear-gradient(90deg, #31b8c6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: "#31b8c6", opacity: 0.04, filter: "blur(80px)" }} />

      <div className="relative w-full max-w-md">
        {/* corners */}
        {[
          { top: -8, left: -8, border: "2px 0 0 2px", radius: "2px 0 0 0" },
          { top: -8, right: -8, border: "2px 2px 0 0", radius: "0 2px 0 0" },
          { bottom: -8, left: -8, border: "0 0 2px 2px", radius: "0 0 0 2px" },
          { bottom: -8, right: -8, border: "0 2px 2px 0", radius: "0 0 2px 0" },
        ].map((s, i) => (
          <div key={i} className="absolute w-5 h-5 pointer-events-none" style={{ ...s, borderColor: "#31b8c6", borderStyle: "solid", borderWidth: s.border, borderRadius: s.radius, opacity: 0.6 }} />
        ))}

        <div className="px-8 py-10 rounded" style={{ background: "#080e10", border: "1px solid #0f1e21", boxShadow: "0 0 60px #31b8c608, 0 25px 50px #00000080" }}>

          {/* icon */}
          <div className="mb-6 flex items-center justify-center w-14 h-14 rounded" style={{ background: "#31b8c610", border: "1px solid #31b8c625" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#31b8c6" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7 10-7" />
            </svg>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <span className="px-2 py-1 rounded-sm text-xs tracking-widest" style={{ background: "#31b8c610", border: "1px solid #31b8c625", color: "#31b8c6", fontSize: "0.65rem" }}>VERIFY EMAIL</span>
          </div>

          <h1 className="mb-2 text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
            Check your inbox
          </h1>

          <p className="mb-1" style={{ color: "#3a5a5e", fontSize: "0.8rem", lineHeight: 1.7 }}>
            We sent a verification link to
          </p>
          <p className="mb-6" style={{ color: "#31b8c6", fontSize: "0.82rem", fontWeight: 500 }}>
            {email}
          </p>

          <div className="mb-8 p-4 rounded" style={{ background: "#0d1117", border: "1px solid #0f1e21" }}>
            <p style={{ color: "#2e4a4e", fontSize: "0.75rem", lineHeight: 1.8 }}>
              Click the link in the email to verify your account. The link expires in <span style={{ color: "#31b8c6" }}>2 days</span>. Check your spam folder if you don't see it.
            </p>
          </div>

          <div className="h-px mb-6" style={{ background: "linear-gradient(to right, transparent, #1e2d2f, transparent)" }} />

          <p className="text-center" style={{ color: "#2e4a4e", fontSize: "0.78rem" }}>
            Already verified?{" "}
            <Link to="/login" style={{ color: "#31b8c6" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;