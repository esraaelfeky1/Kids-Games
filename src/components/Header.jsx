// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

import sun from "../assets/sun.png";
import cloud1 from "../assets/cloud1.png";
import cloud2 from "../assets/cloud1.png";
import cloud3 from "../assets/cloud1.png";
import birds from "../assets/birds.png";

export default function Header() {
  const [clicked, setClicked] = useState(null);

  return (
    <div style={styles.wrapper}>

      {/* CSS Animations + Responsive */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          @keyframes moveRight {
            0% { transform: translateX(0px); }
            50% { transform: translateX(25px); }
            100% { transform: translateX(0px); }
          }

          /* 📱 موبايل */
          @media (max-width: 600px) {

            .header-wrapper {
              height: 140px !important;
            }

            .sun {
              width: 70px !important;
              top: 30px !important;
              left: 20px !important;
            }

            .cloud {
              width: 70px !important;
            }

            .cloud1 {
              top: 15px !important;
              left: 20% !important;
            }

            .cloud2 {
              top: 50px !important;
              right: 10% !important;
            }

            .cloud3 {
              top: 80px !important;
              left: 40% !important;
            }

            .birds {
              width: 50px !important;
              top: 60px !important;
              left: 55% !important;
            }
          }
        `}
      </style>

      {/* ☀️ الشمس */}
      <img
        src={sun}
        alt="sun"
        onClick={() => setClicked("sun")}
        className="sun"
        style={{
          ...styles.sun,
          animation: "float 4s ease-in-out infinite",
          transform: clicked === "sun" ? "scale(1.2)" : "scale(1)",
        }}
      />

      {/* ☁️ السحابة 1 */}
      <img
        src={cloud1}
        alt="cloud"
        className="cloud cloud1"
        style={{
          ...styles.cloud,
          top: "25px",
          left: "15%",
          animation: "moveRight 6s ease-in-out infinite",
        }}
      />

      {/* ☁️ السحابة 2 */}
      <img
        src={cloud2}
        alt="cloud"
        className="cloud cloud2"
        style={{
          ...styles.cloud,
          top: "70px",
          right: "20%",
          animation: "moveRight 8s ease-in-out infinite",
        }}
      />

      {/* ☁️ السحابة 3 */}
      <img
        src={cloud3}
        alt="cloud"
        className="cloud cloud3"
        style={{
          ...styles.cloud,
          top: "110px",
          left: "50%",
          animation: "moveRight 7s ease-in-out infinite",
        }}
      />

      {/* 🐦 العصافير */}
      <img
        src={birds}
        alt="birds"
        onClick={() => setClicked("birds")}
        className="birds"
        style={{
          ...styles.birds,
          animation: "float 3s ease-in-out infinite",
          transform:
            clicked === "birds"
              ? "translateX(-50%) scale(1.3)"
              : "translateX(-50%) scale(1)",
        }}
      />
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "180px",
    overflow: "hidden",
    background: "linear-gradient(#dff6ff, #ffffff)",
  },

  sun: {
    width: "90px",
    position: "absolute",
    top: "50px",
    left: "90px",
    cursor: "pointer",
    transition: "0.3s",
  },

  cloud: {
    width: "90px",
    position: "absolute",
    cursor: "pointer",
  },

  birds: {
    width: "60px",
    position: "absolute",
    top: "80px",
    left: "60%",
    cursor: "pointer",
    transition: "0.3s",
  },
};