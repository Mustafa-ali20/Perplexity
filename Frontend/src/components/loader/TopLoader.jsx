import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TopLoader = () => {
  const loading = useSelector((state) => state.auth.loading);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    let interval;

    if (loading) {
      setVisible(true);
      setFinishing(false);
      setWidth(0);

      setTimeout(() => setWidth(20), 50);

      interval = setInterval(() => {
        setWidth((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          return prev + Math.random() * 12;
        });
      }, 400);
    } else {
      setFinishing(true);
      setWidth(100);
      const hide = setTimeout(() => {
        setVisible(false);
        setWidth(0);
        setFinishing(false);
      }, 400);
      return () => clearTimeout(hide);
    }

    return () => clearInterval(interval);
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "2px",
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "#31b8c6",
          transition: finishing
            ? "width 0.3s ease-out"
            : "width 0.4s ease-in-out",
          boxShadow: "0 0 8px #31b8c6, 0 0 2px #31b8c6",
        }}
      />
    </div>
  );
};

export default TopLoader;