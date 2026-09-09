// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  Home,
  AlarmClock,
  Star,
} from "lucide-react";

// ================= الصور =================
import bg from "../assets/bgapple.jpeg";
import boy from "../assets/boyapple.png";
import redApple from "../assets/applered.png";
import greenApple from "../assets/applegreen.png";

export default function AppleBasketGame() {
  const navigate = useNavigate();

  const [basketX, setBasketX] = useState(42);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(45);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  // ================= الحروف =================
  const letters = [
    { letter: "ب", emphatic: false },
    { letter: "س", emphatic: false },
    { letter: "ل", emphatic: false },
    { letter: "ن", emphatic: false },
    { letter: "م", emphatic: false },
    { letter: "ت", emphatic: false },
    { letter: "ث", emphatic: false },
    { letter: "ج", emphatic: false },
    { letter: "ح", emphatic: false },
    { letter: "ر", emphatic: false },
    { letter: "ف", emphatic: false },
    { letter: "ك", emphatic: false },

    { letter: "ص", emphatic: true },
    { letter: "ط", emphatic: true },
    { letter: "ض", emphatic: true },
    { letter: "ظ", emphatic: true },
    { letter: "ق", emphatic: true },
    { letter: "خ", emphatic: true },
  ];

  // ================= تفاح (أخضر / أحمر بالتناوب) =================
  const createApples = () => {
    return letters.map((item, index) => {
      const isEmphatic = index % 2 === 1;

      return {
        id: index,
        ...item,
        emphatic: isEmphatic,

        x: (index * 6) % 82 + 3,
        y: -Math.random() * 100,

        speed: isEmphatic
          ? 0.10 + Math.random() * 0.10
          : 0.22 + Math.random() * 0.22,

        hidden: false,
      };
    });
  };

  const [apples, setApples] = useState(createApples());

  // ================= إعادة التشغيل =================
  const resetGame = () => {
    setScore(0);
    setTime(45);
    setApples(createApples());
    setShowGameOver(false);
    setGamePaused(false);
  };

  // ================= الفوز =================
  const checkWin = (updated) => {
    const remainingSoft = updated.filter(
      (a) => !a.emphatic && !a.hidden
    );

    if (remainingSoft.length === 0) {
      setGamePaused(true);
      setShowGameOver(true);

      if (soundEnabled) {
        const winAudio = new Audio("/sounds/win.mp3");
        winAudio.volume = 0.8;
        winAudio.play().catch(() => {});
      }

      setTimeout(() => {
        resetGame();
      }, 3000);
    }
  };

  // ================= التايمر =================
  useEffect(() => {
    if (gamePaused || showGameOver) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setShowGameOver(true);

          setTimeout(() => {
            resetGame();
          }, 3000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePaused, showGameOver]);

  // ================= حركة التفاح =================
  useEffect(() => {
    if (gamePaused) return;

    const interval = setInterval(() => {
      setApples((prev) => {
        const updated = prev.map((apple) => {
          if (apple.hidden) return apple;

          const newY = apple.y + apple.speed;

          if (newY > 102) {
            return {
              ...apple,
              y: -10,
              x: Math.random() * 80,
            };
          }

          // ===== 🧺 السلة (منطقة التقاط دقيقة ومتجاوبة) =====
          const basketWidth = 22;
          const basketLeft = basketX;
          const basketRight = basketX + basketWidth;

          const appleCenter = apple.x + 3;
          const basketY = 72;

          if (
            newY > basketY &&
            appleCenter > basketLeft &&
            appleCenter < basketRight
          ) {
            if (!apple.emphatic) {
              if (soundEnabled) {
                const audio = new Audio("/sounds/hay1.mp3");
                audio.volume = 0.7;
                audio.play().catch(() => {});
              }

              setScore((p) => p + 10);
              return { ...apple, hidden: true };
            }
          }

          return { ...apple, y: newY };
        });

        checkWin(updated);
        return updated;
      });
    }, 20);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basketX, soundEnabled, gamePaused]);

  // ================= الماوس =================
  useEffect(() => {
    const move = (e) => {
      let x = (e.clientX / window.innerWidth) * 100;
      if (x < 0) x = 0;
      if (x > 78) x = 78;
      setBasketX(x);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ================= الموبايل (Touch) =================
  useEffect(() => {
    const touchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      let x = (e.touches[0].clientX / window.innerWidth) * 100;
      if (x < 0) x = 0;
      if (x > 78) x = 78;
      setBasketX(x);
    };

    window.addEventListener("touchmove", touchMove, { passive: true });
    return () => window.removeEventListener("touchmove", touchMove);
  }, []);

  return (
    <div style={styles.container}>
      {/* خلفية اللعبة */}
      <img src={bg} alt="background" style={styles.background} />

      {/* الشريط العلوي (الوقت، العنوان، النقاط) */}
      <div style={styles.topBar}>
        {/* صندوق الوقت (تم تصغيره وإدخاله للداخل) */}
        <div style={styles.infoBox}>
          <span style={styles.timeNumber}>
            00:{String(time).padStart(2, "0")}
          </span>
          <AlarmClock size={17} color="#e11d48" />
        </div>

        {/* صندوق العنوان الرئيسي */}
        <div style={styles.titleBox}>
          <h1 style={styles.gameTitle}>لعبة سلة التفاح 🍎</h1>
          <p style={styles.gameText}>اجمع الحروف المرققة فقط</p>
        </div>

        {/* صندوق النقاط (تم تصغيره وإدخاله للداخل) */}
        <div style={styles.infoBox}>
          <span style={styles.scoreNumber}>{score}</span>
          <Star size={17} color="#eab308" fill="#eab308" />
        </div>
      </div>

      {/* التفاح الساقط */}
      {!gamePaused &&
        apples.map(
          (apple) =>
            !apple.hidden && (
              <div
                key={apple.id}
                style={{
                  ...styles.appleContainer,
                  left: `${apple.x}%`,
                  top: `${apple.y}%`,
                }}
              >
                <img
                  src={apple.emphatic ? redApple : greenApple}
                  alt="apple"
                  style={styles.appleImg}
                />
                <span style={styles.appleLetter}>{apple.letter}</span>
              </div>
            )
        )}

      {/* الولد والسلة */}
      <div
        style={{
          ...styles.boyContainer,
          left: `${basketX + 11}%`,
        }}
      >
        <img src={boy} alt="boy basket" style={styles.boyImg} />
      </div>

      {/* رسالة الفوز / انتهاء الوقت */}
      {showGameOver && (
        <div style={styles.gameOver}>
          🎉 أحسنت
          <br />
          النقاط: {score}
        </div>
      )}

      {/* الأزرار السفلية */}
      <div style={styles.bottomButtons}>
        <button
          onClick={() => setSoundEnabled((p) => !p)}
          style={styles.circleBtn}
        >
          {soundEnabled ? (
            <Volume2 color="white" size={20} />
          ) : (
            <VolumeX color="white" size={20} />
          )}
        </button>

        <button
          onClick={() => window.location.reload()}
          style={styles.circleBtn}
        >
          <RotateCcw color="white" size={20} />
        </button>

        <button
          onClick={() => navigate("/AlHorof1")}
          style={styles.circleBtn}
        >
          <ArrowRight color="white" size={20} />
        </button>

        <button onClick={() => navigate("/home")} style={styles.circleBtn}>
          <Home color="white" size={20} />
        </button>
      </div>
    </div>
  );
}

// ================= التنسيقات المتجاوبة بالكامل =================
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "sans-serif",
    userSelect: "none",
    boxSizing: "border-box",
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },

  topBar: {
    width: "100%",
    position: "absolute",
    top: "max(12px, env(safe-area-inset-top))",
    left: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
    padding: "0 18px", // تم زيادة الهوامش الجانبية لإدخال الوقت والنقاط للداخل أكثر
    boxSizing: "border-box",
    gap: "6px",
  },

  infoBox: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "14px",
    padding: "5px 10px", // تصغير الحجم الداخلي قليلاً
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    flexShrink: 0,
  },

  timeNumber: {
    color: "#e11d48",
    fontSize: "clamp(12px, 3vw, 15px)", // تصغير حجم الخط قليلاً ليصبح متناسقاً
    fontWeight: "bold",
  },

  scoreNumber: {
    color: "#16a34a",
    fontSize: "clamp(12px, 3vw, 15px)", // تصغير حجم الخط قليلاً ليصبح متناسقاً
    fontWeight: "bold",
  },

  titleBox: {
    background: "#8B4513",
    padding: "7px 12px",
    borderRadius: "16px",
    color: "white",
    textAlign: "center",
    width: "fit-content",
    maxWidth: "48%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  gameTitle: {
    margin: 0,
    fontSize: "clamp(12px, 3.2vw, 17px)",
    fontWeight: "bold",
  },

  gameText: {
    background: "white",
    color: "#2e7d32",
    borderRadius: "8px",
    padding: "2px 5px",
    marginTop: "2px",
    fontSize: "clamp(8px, 2vw, 11px)",
    fontWeight: "bold",
  },

  appleContainer: {
    position: "absolute",
    width: "clamp(38px, 9vw, 52px)",
    height: "clamp(38px, 9vw, 52px)",
    zIndex: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  appleImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
  },

  appleLetter: {
    position: "absolute",
    color: "white",
    fontSize: "clamp(16px, 4vw, 24px)",
    fontWeight: "bold",
    textShadow: "0 2px 4px rgba(0,0,0,0.6)",
  },

  boyContainer: {
    position: "absolute",
    bottom: "max(65px, env(safe-area-inset-bottom))",
    width: "clamp(110px, 24vw, 190px)",
    transform: "translateX(-50%)",
    zIndex: 10,
    pointerEvents: "none",
  },

  boyImg: {
    width: "100%",
    height: "auto",
    filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.3))",
  },

  gameOver: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    color: "#333",
    padding: "20px 30px",
    borderRadius: "20px",
    zIndex: 200,
    fontSize: "clamp(18px, 4.5vw, 26px)",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },

  bottomButtons: {
    position: "absolute",
    bottom: "max(12px, env(safe-area-inset-bottom))",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "12px",
    zIndex: 100,
  },

  circleBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    background: "#7f57e7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    touchAction: "manipulation",
  },
};