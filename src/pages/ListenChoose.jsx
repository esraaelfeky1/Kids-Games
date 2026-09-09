// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";

import {
  Volume2,
  VolumeX,
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// =========================
// استيراد الخلفية لمنع اختفائها عند الرفع
// =========================
import gameBgImage from "../assets/WhatsApp Image 2026-05-16 at 6.54.08 PM.jpeg";

export default function ArabicLetterGame() {
  const navigate = useNavigate();

  // ================= QUESTIONS =================
  const questions = [
    { correct: "ص", options: ["ض", "س", "ص"] },
    { correct: "خ", options: ["خ", "ح", "ج"] },
    { correct: "ض", options: ["ظ", "ض", "د"] },
    { correct: "ط", options: ["ط", "ت", "ظ"] },
    { correct: "ظ", options: ["ذ", "ز", "ظ"] },
    { correct: "ق", options: ["غ", "ق", "ك"] },
    { correct: "غ", options: ["غ", "ع", "خ"] },
    { correct: "ص", options: ["ث", "س", "ص"] },
    { correct: "خ", options: ["ح", "خ", "هـ"] },
    { correct: "ض", options: ["ظ", "د", "ض"] },
    { correct: "ط", options: ["ت", "ط", "ظ"] },
    { correct: "ظ", options: ["د", "ذ", "ظ"] },
    { correct: "ق", options: ["ق", "ك", "غ"] },
    { correct: "غ", options: ["ع", "غ", "ق"] },
    { correct: "ص", options: ["ص", "ض", "س"] },
  ];

  const TOTAL_QUESTIONS = 15;

  const [choices, setChoices] = useState([]);
  const [correct, setCorrect] = useState("");

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  const [selected, setSelected] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [finished, setFinished] = useState(false);

  const [showCorrect, setShowCorrect] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioRef = useRef(null);

  // ================= TIMER =================
  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  // ================= LETTER SOUNDS =================
  const sounds = {
    خ: "/sounds/خ.mp3",
    ص: "/sounds/ص.mp3",
    ض: "/sounds/ض.mp3",
    ط: "/sounds/ط.mp3",
    ظ: "/sounds/ظ.mp3",
    ق: "/sounds/ق.mp3",
    غ: "/sounds/غ.mp3",
  };

  // ================= PLAY LETTER =================
  const playSound = (letter) => {
    if (!soundEnabled) return;

    const src = sounds[letter];

    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);

    audio.playbackRate = 0.85;

    audio.volume = 0;

    audioRef.current = audio;

    audio.play().catch(() => {});

    // fade in
    let volume = 0;

    const fade = setInterval(() => {
      volume += 0.1;

      if (volume >= 1) {
        volume = 1;
        clearInterval(fade);
      }

      audio.volume = volume;
    }, 30);
  };

  // ================= TOGGLE SOUND =================
  const toggleSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.pause();
    }
    setSoundEnabled((prev) => !prev);
  };

  // ================= GENERATE QUESTION =================
  const generateQuestion = (index) => {
    const q = questions[index];

    setChoices(q.options);

    setCorrect(q.correct);

    setSelected(null);

    setTimeout(() => {
      playSound(q.correct);
    }, 500);
  };

  // ================= START =================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateQuestion(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= CLICK =================
  const handleClick = (l) => {
    if (selected || finished) return;

    setSelected(l);

    // ================= CORRECT =================
    if (l === correct) {
      setScore((s) => s + 1);

      setShowCorrect(true);

      if (soundEnabled) {
        const correctAudio = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3"
        );

        correctAudio.volume = 0.7;

        correctAudio.play().catch(() => {});
      }

      setTimeout(() => {
        setShowCorrect(false);
      }, 1200);
    } else {
      // ================= WRONG =================
      if (soundEnabled) {
        const wrongAudio = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3"
        );

        wrongAudio.volume = 0.7;

        wrongAudio.play().catch(() => {});
      }
    }

    // ================= NEXT QUESTION =================
    setTimeout(() => {
      const next = questionIndex + 1;

      setQuestionIndex(next);

      if (next >= TOTAL_QUESTIONS) {
        setFinished(true);

        setShowFinal(true);

        setTimeout(() => {
          setShowFinal(false);
        }, 3000);
      } else {
        generateQuestion(next);
      }
    }, 900);
  };

  // ================= RESTART =================
  const restartGame = () => {
    setScore(0);

    setTime(0);

    setQuestionIndex(0);

    setFinished(false);

    setSelected(null);

    setShowCorrect(false);

    setShowFinal(false);

    generateQuestion(0);
  };

  // التنقلات
  const goHome = () => {
    navigate("/home");
  };

  const goToAlHorof1 = () => {
    navigate("/AlHorof1");
  };

  return (
    <>
      {/* CSS مخصص للتجاوب وتصغير الحجم للموبايل فقط */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-page {
            padding: 2vw !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: 100vh !important;
            box-sizing: border-box !important;
          }

          .mobile-top {
            margin-bottom: 0px !important;
            gap: 4px !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
          }

          .mobile-top-box {
            padding: 6px 10px !important;
            font-size: clamp(13px, 3.8vw, 16px) !important;
            border-radius: 12px !important;
            white-space: nowrap !important;
          }

          .mobile-header {
            margin: 0 !important;
            padding: 7px 12px !important;
            font-size: clamp(13px, 4.2vw, 18px) !important;
            border-radius: 14px !important;
            width: auto !important;
            white-space: nowrap !important;
          }

          .mobile-card {
            width: 85% !important;
            max-width: 320px !important;
            margin: auto !important;
            padding: 15px 10px !important;
            border-radius: 20px !important;
          }

          .mobile-game-text {
            font-size: clamp(14px, 4vw, 17px) !important;
            margin-bottom: 10px !important;
          }

          .mobile-sound {
            width: clamp(50px, 14vw, 65px) !important;
            height: clamp(50px, 14vw, 65px) !important;
            font-size: clamp(24px, 7vw, 32px) !important;
            margin: 10px auto !important;
          }

          .mobile-choices {
            gap: 2.5vw !important;
            margin-top: 10px !important;
          }

          .mobile-choice {
            width: clamp(45px, 12vw, 60px) !important;
            height: clamp(45px, 12vw, 60px) !important;
            font-size: clamp(20px, 5.5vw, 26px) !important;
            margin-top: 5px !important;
            margin-bottom: 5px !important;
            border-radius: 14px !important;
          }

          .mobile-bottom-buttons {
            margin-top: auto !important;
            margin-bottom: 20px !important;
            gap: 3.5vw !important;
          }

          .mobile-circle-btn {
            width: clamp(34px, 10vw, 44px) !important;
            height: clamp(34px, 10vw, 44px) !important;
          }

          .mobile-circle-btn svg {
            width: clamp(16px, 5vw, 22px) !important;
            height: clamp(16px, 5vw, 22px) !important;
          }
        }
      `}</style>

      {/* ربط الخلفية المستوردة هنا */}
      <div
        style={{
          ...styles.page,
          backgroundImage: `url(${gameBgImage})`,
        }}
        className="mobile-page"
      >
        {/* ================= TOP HEADER (الوقت - العنوان - النقاط) ================= */}
        <div style={styles.top} className="mobile-top">
          <div style={styles.box} className="mobile-top-box">
            ⏰ {time}
          </div>

          <div style={styles.header} className="mobile-header">
            لعبة اسمع واختر الحروف المفخمة
          </div>

          <div style={styles.box} className="mobile-top-box">
            ⭐ {score}
          </div>
        </div>

        {/* ================= POPUP CORRECT ================= */}
        {showCorrect && (
          <div style={styles.overlay}>
            <div style={styles.popup}>ممتاز 👏</div>
          </div>
        )}

        {/* ================= FINAL POPUP ================= */}
        {showFinal && (
          <div style={styles.overlay}>
            <div style={styles.finalPopup}>
              🎉 أحسنت
              <br />
              ⭐ حصلت على {score} نقطة
            </div>
          </div>
        )}

        {/* ================= GAME (كارت اللعبة) ================= */}
        <div style={styles.card} className="mobile-card">
          <p style={styles.gameText} className="mobile-game-text">
            استمع ثم اختر الحرف الصحيح
          </p>

          {/* ================= SOUND BUTTON ================= */}
          <div
            style={styles.sound}
            className="mobile-sound"
            onClick={() => playSound(correct)}
          >
            🔊
          </div>

          {/* ================= CHOICES ================= */}
          <div style={styles.choices} className="mobile-choices">
            {choices.map((l, i) => (
              <div
                key={i}
                onClick={() => handleClick(l)}
                className="mobile-choice"
                style={{
                  ...styles.choice,
                  border:
                    selected === l
                      ? l === correct
                        ? "4px solid green"
                        : "4px solid red"
                      : "2px solid #ddd",
                  transform: selected === l ? "scale(1.08)" : "scale(1)",
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* ================= BUTTONS (الأزرار السفلية) ================= */}
        <div style={styles.bottomButtons} className="mobile-bottom-buttons">
          <button
            onClick={restartGame}
            style={styles.circleBtn}
            className="mobile-circle-btn"
          >
            <RotateCcw color="white" />
          </button>

          <button
            onClick={goHome}
            style={styles.circleBtn}
            className="mobile-circle-btn"
          >
            <Home color="white" />
          </button>

          <button
            onClick={goToAlHorof1}
            style={styles.circleBtn}
            className="mobile-circle-btn"
          >
            <ArrowRight color="white" />
          </button>

          <button
            onClick={toggleSound}
            style={{
              ...styles.circleBtn,
              background: soundEnabled ? "#7f57e7" : "#e63946",
            }}
            className="mobile-circle-btn"
          >
            {soundEnabled ? <Volume2 color="white" /> : <VolumeX color="white" />}
          </button>
        </div>
      </div>
    </>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "90vh",
    padding: "clamp(5px, 4vw, 20px)",
    textAlign: "center",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  // ================= TOP ================
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "10px",
    marginBottom: "20px",
  },

  box: {
    background: "white",
    padding: "clamp(8px, 2vw, 12px) clamp(14px, 2vw, 20px)",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "clamp(15px, 2vw, 18px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  // ================= HEADER =================
  header: {
    background: "#fcbf49",
    padding: "clamp(10px, 1.5vw, 12px) clamp(15px, 3vw, 40px)",
    borderRadius: "18px",
    fontSize: "clamp(14px, 2.5vw, 20px)",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    whiteSpace: "nowrap",
  },

  // ================= CARD =================
  card: {
    background: "rgba(255,255,255,0.95)",
    width: "min(80%, 450px)",
    marginBottom: "20px",
    margin: "auto",
    marginTop: "20px",
    padding: "clamp(5px, 2vw, 25px)",
    borderRadius: "24px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    backdropFilter: "blur(6px)",
  },

  // ================= GAME TEXT =================
  gameText: {
    fontSize: "clamp(19px, 2.5vw, 25px)",
    fontWeight: "bold",
    marginBottom: "clamp(40px,2vw,5px)",
    color: "#333",
  },

  // ================= SOUND =================
  sound: {
    width: "clamp(70px, 10vw, 90px)",
    height: "clamp(70px, 10vw, 90px)",
    background: "#6a4c93",
    color: "white",
    fontSize: "clamp(34px, 7vw, 44px)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "18px auto",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },

  // ================= CHOICES =================
  choices: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(12px, 3vw, 20px)",
    flexWrap: "wrap",
    marginTop: "15px",
  },

  choice: {
    width: "clamp(50px, 14vw, 80px)",
    height: "clamp(50px, 14vw, 80px)",
    marginTop: "15px",
    marginBottom: "20px",
    background: "#f8fafc",
    borderRadius: "20px",
    fontSize: "clamp(30px, 6vw, 35px)",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  // ================= BUTTONS =================
  bottomButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "30px",
  },

  circleBtn: {
    width: "clamp(30px, 11vw, 58px)",
    height: "clamp(30px, 11vw, 58px)",
    borderRadius: "50%",
    background: "#7f57e7",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },

  // ================= OVERLAY =================
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  // ================= POPUP =================
  popup: {
    background: "#41c441",
    color: "white",
    padding: "clamp(12px, 2vw, 10px)",
    borderRadius: "24px",
    fontSize: "clamp(22px, 2vw, 30px)",
    fontWeight: "bold",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },

  // ================= FINAL POPUP =================
  finalPopup: {
    background: "white",
    padding: "clamp(20px, 5vw, 35px)",
    borderRadius: "24px",
    fontSize: "clamp(20px, 4vw, 28px)",
    fontWeight: "bold",
    lineHeight: "1.8",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },
};