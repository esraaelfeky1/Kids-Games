// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

export default function ArabicLetterGame() {

  // ================= QUESTIONS =================
  const questions = [
    { correct: "يَقُول", options: ["بَدِيع", "كَاتِب", "يَقُول"] },
    { correct: "زُهُور", options: ["زُهُور", "شَفِيعُ", "قَالَ"] },
    { correct: "يَجُوع", options: ["عَادَ", "يَجُوع", "عَبَدَ"] },
    { correct: "جُنُود", options: ["جُنُود", "عَرَفَ", "سَامِعُ"] },
    { correct: "خَرُوف", options: ["شَمْسُ", "رَفَعَ", "خَرُوف"] },
    { correct: "عُقُول", options: ["سَامِعُ", "عُقُول", "رَحَمَ"] },
    { correct: "عُصْفُور", options: ["عُصْفُور", "كَتَبَ", "وَاهِبُ"] },
  ];

  const TOTAL_QUESTIONS = 7;

  const [choices, setChoices] = useState([]);
  const [correct, setCorrect] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [selected, setSelected] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [soundEnabled] = useState(true);

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
    يَقُول: "/sounds/يقول.mp3",
    زُهُور: "/sounds/زهور.mp3",
    يَجُوع: "/sounds/يجوع.mp3",
    جُنُود: "/sounds/جنود.mp3",
    خَرُوف: "/sounds/خروف.mp3",
    عُقُول: "/sounds/عقول.mp3",
    عُصْفُور: "/sounds/عصفور.mp3",
  };

  // ================= PLAY LETTER =================
  const playSound = (letter) => {
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
      if (soundEnabled) {
        const wrongAudio = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3"
        );
        wrongAudio.volume = 0.7;
        wrongAudio.play().catch(() => {});
      }
    }

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

  return (
    <>
      <style>{`
        /* تنسيقات الريسبونسيف الذكية للموبايل والتابلت */
        @media (max-width: 1024px) {
          .arabic-game-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10px !important;
            box-sizing: border-box;
          }
        }

        @media (max-width: 768px) {
          .arabic-header {
            font-size: 14px !important;
            padding: 8px 16px !important;
          }
          .arabic-box {
            padding: 6px 12px !important;
            font-size: 14px !important;
          }
          .arabic-card {
            width: 85% !important;
            max-width: 360px !important;
            padding: 20px !important;
          }
        }
      `}</style>

      <div style={styles.page} className="arabic-game-page">

        {/* ================= TOP BAR ================= */}
        <div style={styles.top}>
          <div style={styles.box} className="arabic-box">
            ⭐ {score}
          </div>

          <div style={styles.header} className="arabic-header">
            لعبة استمع واختر الكلمة التي بها مد بالياء
          </div>

          <div style={styles.box} className="arabic-box">
            ⏰ {time}
          </div>
        </div>

        {/* ================= POPUP CORRECT ================= */}
        {showCorrect && (
          <div style={styles.overlay}>
            <div style={styles.popup}>
              ممتاز 👏
            </div>
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

        {/* ================= GAME CARD ================= */}
        <div style={styles.card} className="arabic-card">
          <p style={styles.gameText}>
            استمع ثم اختر الكلمة الصحيحة
          </p>

          {/* ================= SOUND BUTTON ================= */}
          <div
            style={styles.sound}
            onClick={() => playSound(correct)}
          >
            🔊
          </div>

          {/* ================= CHOICES ================= */}
          <div style={styles.choices}>
            {choices.map((l, i) => (
              <div
                key={i}
                onClick={() => handleClick(l)}
                style={{
                  ...styles.choice,
                  border:
                    selected === l
                      ? l === correct
                        ? "4px solid green"
                        : "4px solid red"
                      : "2px solid #ddd",
                  transform:
                    selected === l
                      ? "scale(1.08)"
                      : "scale(1)",
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM BUTTONS ================= */}
        <div style={styles.bottomButtons}>
          <button
            onClick={() => playSound(correct)}
            style={styles.circleBtn}
          >
            <Volume2 color="white" size={22} />
          </button>

          <button
            onClick={() => (window.location.href = "/Mad")}
            style={styles.circleBtn}
          >
            <ArrowRight color="white" size={22} />
          </button>

          <button
            onClick={() => (window.location.href = "/home")}
            style={styles.circleBtn}
          >
            <Home color="white" size={22} />
          </button>

          <button
            onClick={restartGame}
            style={styles.circleBtn}
          >
            <RotateCcw color="white" size={22} />
          </button>
        </div>

      </div>
    </>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    padding: "15px",
    textAlign: "center",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "url('src/assets/bgg.jpeg')",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0 10px",
    boxSizing: "border-box",
  },

  box: {
    background: "white",
    padding: "8px 16px",
    borderRadius: "16px",
    fontWeight: "bold",
    fontSize: "18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  header: {
    background: "#fcbf49",
    padding: "10px 25px",
    borderRadius: "18px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    color: "#000",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    width: "380px",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
    backdropFilter: "blur(6px)",
    boxSizing: "border-box",
  },

  gameText: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },

  sound: {
    width: "70px",
    height: "70px",
    background: "#5c4084",
    color: "white",
    fontSize: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "15px auto",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },

  choices: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "15px",
  },

  choice: {
    width: "70px",
    height: "70px",
    background: "#f8fafc",
    borderRadius: "16px",
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  bottomButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px",
  },

  circleBtn: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#7f57e7",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  popup: {
    background: "#41c441",
    color: "white",
    padding: "15px 30px",
    borderRadius: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },

  finalPopup: {
    background: "white",
    padding: "25px 30px",
    borderRadius: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    lineHeight: "1.6",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
};