// eslint-disable-next-line no-unused-vars
import React, {
  useState,
  useEffect,
  useRef,
} from "react";

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

// الصور
import bg from "../assets/WhatsApp Image 2026-05-22 at 9.35.36 PM.jpeg";
import boy from "../assets/WhatsApp Image 2026-05-22 at 9.35.36 PM(1).png";

export default function EatLettersGame() {

  const navigate = useNavigate();

  // =========================
  // الأصوات
  // =========================
  const correctSound = useRef(
    new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3")
  );

  const wrongSound = useRef(
    new Audio("https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3")
  );

  const finishSound = useRef(
    new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3")
  );

  // =========================
  // States
  // =========================
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [draggingFruit, setDraggingFruit] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // =========================
  // حروف الديسكتوب (الأصلية)
  // =========================
  const desktopFruits = [
    { id: 1, letter: "س", x: 5, y: 22, correct: true, color: "#ff3b30" },
    { id: 2, letter: "ط", x: 18, y: 25, correct: false, color: "#7b2cbf" },
    { id: 3, letter: "ق", x: 30, y: 22, correct: false, color: "#ffd60a" },
    { id: 4, letter: "ض", x: 68, y: 24, correct: false, color: "#ff9500" },
    { id: 5, letter: "ت", x: 80, y: 24, correct: true, color: "#8ac926" },
    { id: 6, letter: "غ", x: 92, y: 22, correct: false, color: "#ff3b30" },

    { id: 7, letter: "ب", x: 10, y: 45, correct: true, color: "#ffd60a" },
    { id: 8, letter: "ظ", x: 25, y: 48, correct: false, color: "#ff3b30" },
    { id: 9, letter: "خ", x: 70, y: 48, correct: false, color: "#7b2cbf" },
    { id: 10, letter: "د", x: 82, y: 48, correct: true, color: "#ff9500" },

    { id: 11, letter: "ف", x: 5, y: 65, correct: true, color: "#7b2cbf" },
    { id: 12, letter: "ن", x: 22, y: 68, correct: true, color: "#ffd60a" },
    { id: 13, letter: "ص", x: 35, y: 65, correct: false, color: "#ff3b30" },
    { id: 14, letter: "ل", x: 60, y: 65, correct: true, color: "#8ac926" },
    { id: 15, letter: "ظ", x: 78, y: 65, correct: false, color: "#ff3b30" },
    { id: 16, letter: "ي", x: 92, y: 65, correct: true, color: "#ffd60a" },

    { id: 17, letter: "ض", x: 5, y: 85, correct: false, color: "#ff3b30" },
    { id: 18, letter: "ز", x: 20, y: 85, correct: true, color: "#7b2cbf" },
    { id: 21, letter: "هـ", x: 65, y: 85, correct: true, color: "#ffd60a" },
    { id: 22, letter: "غ", x: 80, y: 85, correct: false, color: "#ff9500" },
    { id: 23, letter: "ج", x: 93, y: 85, correct: true, color: "#ffd60a" },
  ];

  // =========================
  // حروف الموبايل (الأصلية)
  // =========================
  const mobileFruits = [
    { id: 1, letter: "س", x: 10, y: 23, correct: true, color: "#ff3b30" },
    { id: 2, letter: "ط", x: 28, y: 25, correct: false, color: "#7b2cbf" },
    { id: 3, letter: "ق", x: 50, y: 23, correct: false, color: "#ffd60a" },
    { id: 4, letter: "ت", x: 72, y: 23, correct: true, color: "#8ac926" },

    { id: 5, letter: "ب", x: 10, y: 35, correct: true, color: "#ffd60a" },
    { id: 6, letter: "ظ", x: 35, y: 40, correct: false, color: "#ff3b30" },
    { id: 7, letter: "خ", x: 60, y: 35, correct: false, color: "#7b2cbf" },
    { id: 8, letter: "د", x: 82, y: 35, correct: true, color: "#ff9500" },

    { id: 9, letter: "ف", x: 10, y: 60, correct: true, color: "#7b2cbf" },
    { id: 10, letter: "ن", x: 20, y: 48, correct: true, color: "#ffd60a" },
    { id: 11, letter: "ص", x: 70, y: 52, correct: false, color: "#ff3b30" },
    { id: 12, letter: "ل", x: 82, y: 60, correct: true, color: "#8ac926" },

    { id: 13, letter: "هـ", x: 65, y: 68, correct: true, color: "#ffd60a" },
    { id: 14, letter: "غ", x: 10, y: 75, correct: false, color: "#ff9500" },
    { id: 15, letter: "ج", x: 80, y: 75, correct: true, color: "#ffd60a" },
  ];

  const [fruits, setFruits] = useState([]);

  // =========================
  // تحديد نوع الشاشة والتجاوب
  // =========================
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFruits(isMobile ? mobileFruits : desktopFruits);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // =========================
  // التايمر
  // =========================
  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  // =========================
  // انتهاء اللعبة
  // =========================
  useEffect(() => {
    const correctLetters = fruits.filter((item) => item.correct);

    if (correctLetters.length === 0 && time > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFinished(true);
      setShowGameOver(true);

      if (soundEnabled) {
        finishSound.current.currentTime = 0;
        finishSound.current.play().catch(() => {});
      }

      setTimeout(() => {
        setShowGameOver(false);
      }, 3000);
    }
  }, [fruits, time, soundEnabled]);

  // =========================
  // دالة أكل الحرف
  // =========================
  const eatFruit = (fruit) => {
    if (finished) return;

    setMouthOpen(true);
    setTimeout(() => setMouthOpen(false), 400);

    if (fruit.correct) {
      if (soundEnabled) {
        correctSound.current.currentTime = 0;
        correctSound.current.play().catch(() => {});
      }

      setShowCorrect(true);
      setTimeout(() => setShowCorrect(false), 700);

      setScore((prev) => prev + 10);
    } else {
      if (soundEnabled) {
        wrongSound.current.currentTime = 0;
        wrongSound.current.play().catch(() => {});
      }

      setShowWrong(true);
      setTimeout(() => setShowWrong(false), 700);

      setScore((prev) => Math.max(prev - 5, 0));
    }

    setFruits((prev) => prev.filter((item) => item.id !== fruit.id));
  };

  return (
    <div style={styles.container}>
      <img src={bg} alt="background" style={styles.background} />

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        {/* صندوق الوقت (الأيقونة أصبحت على اليمين) */}
        <div style={styles.infoBox}>
          <span style={styles.infoNumber}>
            00:{String(time % 60).padStart(2, "0")}
          </span>
          <AlarmClock size={20} color="#e11d48" />
        </div>

        {/* صندوق العنوان (بحجم أكبر وواضح) */}
        <div style={styles.titleBox}>
          <h1 style={styles.gameTitle}>لعبة الأكل السريع</h1>
          <p style={styles.gameText}>أطعم البطل الحروف المرققة فقط</p>
        </div>

        {/* صندوق النقاط (الأيقونة أصبحت على اليمين) */}
        <div style={styles.infoBox}>
          <span style={styles.scoreNumber}>{score}</span>
          <Star size={20} color="#eab308" fill="#eab308" />
        </div>
      </div>

      {/* الرسائل التنبيهية */}
      {showCorrect && <div style={styles.successPopup}>ممتاز 👏</div>}
      {showWrong && (
        <div style={{ ...styles.successPopup, background: "#ff5c5c" }}>
          خطأ ❌
        </div>
      )}

      {/* صورة الولد ومنطقة الإفلات */}
      <div
        id="mouthArea"
        onDragOver={(e) => {
          e.preventDefault();
          if (!finished) setMouthOpen(true);
        }}
        onDragLeave={() => setMouthOpen(false)}
        onDrop={(e) => {
          e.preventDefault();
          if (finished) return;
          setMouthOpen(false);
          if (draggingFruit) {
            eatFruit(draggingFruit);
            setDraggingFruit(null);
          }
        }}
        style={styles.boyContainer}
      >
        <img
          src={boy}
          alt="boy"
          style={{
            ...styles.boy,
            transform: mouthOpen ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>

      {/* الحروف / الفواكه (بالتوزيع الأصلي) */}
      {!finished &&
        fruits.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDraggingFruit(item)}
            onClick={() => eatFruit(item)}
            style={{
              ...styles.fruit,
              left: `${item.x}%`,
              top: `${item.y}%`,
              background: item.color,
            }}
          >
            <div style={styles.leaf}></div>
            <span style={styles.letter}>{item.letter}</span>
          </div>
        ))}

      {/* رسالة النهاية */}
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
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled((p) => !p);
          }}
          style={styles.circleBtn}
        >
          {soundEnabled ? <Volume2 color="white" size={20} /> : <VolumeX color="white" size={20} />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            window.location.reload();
          }}
          style={styles.circleBtn}
        >
          <RotateCcw color="white" size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/AlHorof1");
          }}
          style={styles.circleBtn}
        >
          <ArrowRight color="white" size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/home");
          }}
          style={styles.circleBtn}
        >
          <Home color="white" size={20} />
        </button>
      </div>
    </div>
  );
}

// =========================
// التنسيقات المتجاوبة
// =========================
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
    padding: "0 10px",
    boxSizing: "border-box",
    gap: "6px",
  },

  infoBox: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    padding: "8px 12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    flexShrink: 0,
  },

  infoNumber: {
    color: "#16a34a",
    fontSize: "clamp(13px, 3.2vw, 17px)",
    fontWeight: "bold",
  },

  scoreNumber: {
    color: "#ff6600",
    fontSize: "clamp(13px, 3.2vw, 17px)",
    fontWeight: "bold",
  },

  titleBox: {
    background: "#7b2cff",
    padding: "8px 16px",
    borderRadius: "16px",
    color: "white",
    textAlign: "center",
    width: "fit-content",
    maxWidth: "52%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  gameTitle: {
    margin: 0,
    fontSize: "clamp(15px, 3.8vw, 20px)", // تم تكبير العنوان قليلاً ليصبح بارزاً وأجمل
    fontWeight: "bold",
  },

  gameText: {
    background: "white",
    color: "#333",
    borderRadius: "10px",
    padding: "3px 8px",
    marginTop: "4px",
    fontSize: "clamp(9px, 2.2vw, 12px)",
    fontWeight: "bold",
  },

  boyContainer: {
    position: "absolute",
    left: "50%",
    bottom: "max(75px, env(safe-area-inset-bottom))",
    transform: "translateX(-50%)",
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    pointerEvents: "none",
  },

  boy: {
    width: "clamp(220px, 46vw, 380px)", // تم تكبير حجم الولد ليكون أكبر وواضحاً جداً على الموبايل والشاشات
    height: "auto",
    transition: "transform 0.3s ease",
    pointerEvents: "auto",
  },

  fruit: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "5px solid white",
    cursor: "pointer",
    zIndex: 15,
    boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
    touchAction: "manipulation",
  },

  leaf: {
    width: "20px",
    height: "12px",
    background: "green",
    borderRadius: "20px",
    position: "absolute",
    top: "-13px",
    right: "25px",
    transform: "rotate(-30deg)",
  },

  letter: {
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
  },

  successPopup: {
    position: "absolute",
    top: "22%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#41c441",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "16px",
    fontSize: "clamp(16px, 4vw, 20px)",
    fontWeight: "bold",
    zIndex: 200,
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },

  bottomButtons: {
    position: "absolute",
    bottom: "max(20px, env(safe-area-inset-bottom))",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "15px",
    zIndex: 100,
  },

  circleBtn: {
    width: "48px",
    height: "48px",
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

  gameOver: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    color: "#333",
    padding: "15px 25px",
    borderRadius: "15px",
    zIndex: 200,
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
};