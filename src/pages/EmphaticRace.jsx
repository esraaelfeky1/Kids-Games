// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";

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
import carBgImage from "../assets/car1.jpg";

export default function LetterRaceGame() {
  const navigate = useNavigate();

  // =========================
  // الأصوات
  // =========================

  const correctSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3"
    )
  );

  const wrongSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3"
    )
  );

  const clickSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
    )
  );

  const finishSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
    )
  );

  // =========================
  // الأسئلة
  // =========================

  const questions = [
    { options: ["ب", "ط", "م"], correct: "ط" },
    { options: ["ص", "ل", "ن"], correct: "ص" },
    { options: ["ف", "ت", "ض"], correct: "ض" },
    { options: ["خ", "ج", "س"], correct: "خ" },
    { options: ["د", "غ", "ر"], correct: "غ" },
    { options: ["ق", "و", "ي"], correct: "ق" },
    { options: ["ك", "ه", "ظ"], correct: "ظ" },
    { options: ["ط", "ا", "ب"], correct: "ط" },
  ];

  // =========================
  // States
  // =========================

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const current = questions[currentQuestion];

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
  // تنسيق الوقت
  // =========================

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // =========================
  // إعادة اللعبة
  // =========================

  const restartGame = () => {
    if (soundEnabled) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }

    setCurrentQuestion(0);
    setSelected("");
    setProgress(0);
    setFinished(false);
    setScore(0);
    setTime(0);
  };

  // =========================
  // الرجوع
  // =========================

  const AlHorof1 = () => {
    if (soundEnabled) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    navigate("/AlHorof1");
  };

  // =========================
  // الهوم
  // =========================

  const goHome = () => {
    if (soundEnabled) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    navigate("/home");
  };

  // =========================
  // الإجابة
  // =========================

  const handleAnswer = (letter) => {
    if (finished) return;

    setSelected(letter);

    // صح
    if (letter === current.correct) {
      if (soundEnabled) {
        correctSound.current.currentTime = 0;
        correctSound.current.play();
      }

      const newProgress = progress + 1;
      setProgress(newProgress);
      setScore((prev) => prev + 10);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelected("");
        } else {
          if (soundEnabled) {
            finishSound.current.currentTime = 0;
            finishSound.current.play();
          }
          setFinished(true);
        }
      }, 700);
    } else {
      if (soundEnabled) {
        wrongSound.current.currentTime = 0;
        wrongSound.current.play();
      }
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .mobile-page {
            height: 100dvh !important;
            max-height: 100dvh !important;
            padding: 10px 12px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }

          .mobile-overlay {
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            padding: 0 !important;
          }

          .mobile-top-bar {
            margin-top: 0 !important;
            padding: 0 10px !important;
          }

          .mobile-info-box {
            padding: 4px 10px !important;
            border-radius: 12px !important;
            font-size: clamp(13px, 3.2vw, 16px) !important;
            gap: 6px !important;
          }

          .mobile-title-box {
            padding: 8px 18px !important;
            border-radius: 16px !important;
          }

          .mobile-title {
            font-size: clamp(16px, 4.5vw, 22px) !important;
          }

          .mobile-center-content {
            margin-top: 5px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          .mobile-question {
            margin: 0 auto 12px auto !important;
            padding: 8px 18px !important;
            font-size: clamp(15px, 4vw, 20px) !important;
            border-radius: 16px !important;
          }

          .mobile-options {
            margin-bottom: 8px !important;
            gap: 12px !important;
          }

          .mobile-option-btn {
            width: clamp(68px, 16vw, 84px) !important;
            height: clamp(54px, 13vw, 68px) !important;
            font-size: clamp(26px, 6.5vw, 34px) !important;
            border-radius: 16px !important;
          }

          .mobile-race-wrapper {
            margin: 6px auto 10px auto !important;
            width: 75% !important; /* تصغير عرض طريق السباق للموبايل */
          }

          .mobile-road {
            height: 44px !important;
            border-width: 2.5px !important;
          }

          .mobile-car {
            font-size: 28px !important;
          }

          .mobile-flag {
            font-size: 28px !important;
            right: 10px !important;
          }

          .mobile-bottom-buttons {
            margin-top: 0 !important;
            margin-bottom: 12px !important;
            gap: 14px !important;
          }

          .mobile-circle-btn {
            width: 44px !important;
            height: 44px !important;
          }
        }
      `}</style>

      <div
        style={{
          ...styles.page,
          backgroundImage: `url(${carBgImage})`,
        }}
        className="mobile-page"
      >
        {/* نافذة الفوز المنبثقة */}
        {finished && (
          <div style={styles.winOverlay}>
            <div style={styles.winCard}>
              <div style={styles.winEmoji}>🏆</div>
              <div style={styles.winText}>أحسنت! لقد أنهيت السباق بنجاح</div>
              <div style={styles.winScore}>النقاط النهائية: {score}</div>
              <button onClick={restartGame} style={styles.winBtn}>
                العب مرة أخرى
              </button>
            </div>
          </div>
        )}

        {/* الطبقة الرئيسية */}
        <div style={styles.overlay} className="mobile-overlay">
          {/* الأعلى */}
          <div style={styles.topBar} className="mobile-top-bar">
            {/* النقاط */}
            <div style={styles.infoBox} className="mobile-info-box">
              <span style={{ fontSize: "17px" }}>⭐</span>
              <span style={styles.infoValue}>{score}</span>
            </div>

            {/* العنوان */}
            <div style={styles.titleBox} className="mobile-title-box">
              <span style={styles.title} className="mobile-title">
                لعبة سباق الحروف
              </span>
            </div>

            {/* الوقت */}
            <div style={styles.infoBox} className="mobile-info-box">
              <span style={{ fontSize: "17px" }}>⏰</span>
              <span style={styles.infoValue}>{formatTime(time)}</span>
            </div>
          </div>

          {/* محتوى المنتصف */}
          <div className="mobile-center-content">
            <div style={styles.questionText} className="mobile-question">
              اختر حرفًا مفخمًا لتتقدم في السباق
            </div>

            <div style={styles.options} className="mobile-options">
              {current.options.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(letter)}
                  className="mobile-option-btn"
                  style={{
                    ...styles.optionBtn,
                    backgroundColor:
                      selected === letter
                        ? letter === current.correct
                          ? "#b7f48d"
                          : "#ffb0b0"
                        : "#fff",
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* السباق (تم تصغير العرض هنا أيضاً) */}
          <div style={styles.raceWrapper} className="mobile-race-wrapper">
            <div style={styles.road} className="mobile-road">
              <div
                style={{
                  ...styles.progress,
                  width: `${(progress / questions.length) * 100}%`,
                }}
              />
              <div
                style={{
                  ...styles.car,
                  left: `${(progress / questions.length) * 82}%`,
                }}
                className="mobile-car"
              >
                🚗
              </div>
              <div style={styles.flag} className="mobile-flag">
                🏁
              </div>
            </div>
          </div>

          {/* الأزرار السفلية */}
          <div style={styles.bottomButtons} className="mobile-bottom-buttons">
            <button
              onClick={toggleSound}
              style={{
                ...styles.circleBtn,
                background: soundEnabled ? "#7f57e7" : "#e63946",
              }}
              className="mobile-circle-btn"
            >
              {soundEnabled ? (
                <Volume2 color="white" size={22} />
              ) : (
                <VolumeX color="white" size={22} />
              )}
            </button>

            <button
              onClick={restartGame}
              style={styles.circleBtn}
              className="mobile-circle-btn"
            >
              <RotateCcw color="white" size={20} />
            </button>

            <button
              onClick={AlHorof1}
              style={styles.circleBtn}
              className="mobile-circle-btn"
            >
              <ArrowRight color="white" size={20} />
            </button>

            <button
              onClick={goHome}
              style={styles.circleBtn}
              className="mobile-circle-btn"
            >
              <Home color="white" size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    height: "100vh",
    padding: "15px",
    fontFamily: "Arial",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
    boxSizing: "border-box",
    position: "relative",
  },

  winOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(5px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  winCard: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "25px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    maxWidth: "90%",
  },

  winEmoji: {
    fontSize: "50px",
  },

  winText: {
    fontSize: "clamp(18px, 4vw, 24px)",
    fontWeight: "bold",
    color: "#333",
  },

  winScore: {
    fontSize: "clamp(15px, 3vw, 18px)",
    color: "#7d59ff",
    fontWeight: "bold",
  },

  winBtn: {
    marginTop: "10px",
    padding: "10px 22px",
    background: "linear-gradient(135deg, #b57cff, #7d59ff)",
    color: "#fff",
    border: "none",
    borderRadius: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(125,89,255,0.4)",
  },

  overlay: {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "10px",
    marginTop: "0px",
    marginBottom: "10px",
    padding: "0 10px",
  },

  infoBox: {
    background: "#fff",
    padding: "6px 14px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "clamp(13px, 2vw, 16px)",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    whiteSpace: "nowrap",
  },

  infoValue: {
    fontSize: "clamp(13px, 2vw, 16px)",
    color: "#7d59ff",
    margin: 0,
  },

  titleBox: {
    background: "linear-gradient(135deg, #b57cff, #7d59ff)",
    padding: "10px 20px",
    borderRadius: "20px",
    boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
    whiteSpace: "nowrap",
  },

  title: {
    color: "#fff",
    fontSize: "clamp(16px, 3.5vw, 22px)",
    fontWeight: "bold",
  },

  questionText: {
    background: "#fff",
    width: "fit-content",
    margin: "0 auto",
    padding: "10px 20px",
    borderRadius: "22px",
    fontSize: "clamp(15px, 3vw, 20px)",
    fontWeight: "bold",
    boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
  },

  options: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
    margin: "12px 0",
  },

  optionBtn: {
    width: "clamp(72px, 15vw, 90px)",
    height: "clamp(58px, 12vw, 72px)",
    borderRadius: "20px",
    border: "none",
    fontSize: "clamp(28px, 6vw, 38px)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
  },

  raceWrapper: {
    width: "65%", // تصغير العرض في الشاشات الكبيرة
    maxWidth: "500px",
    margin: "8px auto",
    display: "flex",
    justifyContent: "center",
  },

  road: {
    width: "100%",
    height: "46px",
    background: "#f1f1f1",
    borderRadius: "50px",
    position: "relative",
    overflow: "hidden",
    border: "3px solid #fff",
    boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
  },

  progress: {
    height: "100%",
    background: "linear-gradient(90deg, #71ff55, #33c91f)",
    borderRadius: "50px",
    transition: "0.5s",
  },

  car: {
    position: "absolute",
    top: "45%",
    transform: "translateY(-50%)",
    fontSize: "30px",
    transition: "0.5s",
  },

  flag: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "30px",
  },

  bottomButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },

  circleBtn: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    border: "none",
    background: "#7f57e7",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
  },
};