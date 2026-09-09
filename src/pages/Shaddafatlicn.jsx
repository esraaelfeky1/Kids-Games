// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";

import {
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

export default function ArabicLetterGame() {

  // ================= QUESTIONS =================
  const questions = [
    { correct: "رُمَّانُ", options: ["بَدِيع", "كَاتِب", "رُمَّانُ"] },
    { correct: "عُمَّانُ", options: ["عُمَّانُ", "شَفِيعُ", "قَالَ"] },
    { correct: "تُجَّارُ", options: ["عَادَ", "تُجَّارُ", "عَبَدَ"] },
    { correct: "فَكَّرَ", options: ["فَكَّرَ", "عَرَفَ", "سَامِعُ"] },
    { correct: "كَذَّبَ", options: ["شَمْسُ", "رَفَعَ", "كَذَّبَ"] },
    { correct: "عَلَّمَ", options: ["سَامِعُ", "عَلَّمَ", "رَحَمَ"] },
    { correct: "صَدَّقَ", options: ["صَدَّقَ", "كَتَبَ", "وَاهِبُ"] },
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
    رُمَّانُ: "/sounds/رمان.mp3",
    عُمَّانُ: "/sounds/عمان.mp3",
    تُجَّارُ: "/sounds/تجار.mp3",
    فَكَّرَ: "/sounds/فكر.mp3",
    كَذَّبَ: "/sounds/كذب.mp3",
    عَلَّمَ: "/sounds/علم.mp3",
    صَدَّقَ: "/sounds/صدق.mp3",
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
    <div style={styles.page}>

      {/* ================= TOP SECTION (Time, Header, Score) ================= */}
      <div style={styles.topSection}>
        <div style={styles.box}>⏰ {time}</div>
        
        <div style={styles.header}>
          استمع واختر الكلمة التي بها شدة مع فتحة
        </div>

        <div style={styles.box}>⭐ {score}</div>
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

      {/* ================= GAME CARD ================= */}
      <div style={styles.card}>
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

      {/* ================= BUTTONS ================= */}
      <div style={styles.bottomButtons}>
        <button onClick={restartGame} style={styles.circleBtn}>
          <RotateCcw color="white" />
        </button>

        <button onClick={() => (window.location.href = "/home")} style={styles.circleBtn}>
          <Home color="white" />
        </button>

        <button onClick={() => (window.location.href = "/Shadda")} style={styles.circleBtn}>
          <ArrowRight color="white" />
        </button>
      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    maxHeight: "100vh",
    overflow: "hidden", // 🚫 قفل السكرول نهائياً
    position: "fixed",
    top: 0,
    left: 0,
    padding: "clamp(6px, 1.5vh, 12px) clamp(15px, 4vw, 25px)",
    textAlign: "center",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "url('src/assets/bgg.jpeg')",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
  },

  // ================= TOP SECTION ================
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "750px",
    marginTop: "2px",
  },

  box: {
    background: "white",
    padding: "clamp(6px, 1.5vh, 10px) clamp(12px, 2vw, 18px)",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "clamp(14px, 2vw, 16px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  // ================= HEADER (تم تكبير الخط وزيادة العرض قليلاً ليناسب النص الجديد) =================
  header: {
    background: "#fcbf49",
    width: "fit-content",
    padding: "clamp(8px, 1.5vh, 12px) clamp(20px, 3.5vw, 40px)",
    borderRadius: "16px",
    fontSize: "clamp(16px, 3.2vw, 22px)",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    lineHeight: "1.3",
  },

  // ================= CARD =================
  card: {
    background: "rgba(255,255,255,0.95)",
    width: "min(70%, 350px)",
    margin: "0 auto",
    padding: "clamp(10px, 2.5vh, 25px) clamp(20px, 4vw, 35px)",
    marginBottom: "clamp(15px, 2.5vh, 25px)",
    borderRadius: "24px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    backdropFilter: "blur(6px)",
    boxSizing: "border-box",
  },

  // ================= GAME TEXT =================
  gameText: {
    fontSize: "clamp(19px, 2.8vw, 25px)",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },

  // ================= SOUND =================
  sound: {
    width: "clamp(60px, 9vw, 75px)",
    height: "clamp(60px, 9vw, 75px)",
    background: "#6a4c93",
    color: "white",
    fontSize: "clamp(28px, 5.5vw, 38px)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px auto",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },

  // ================= CHOICES =================
  choices: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(12px, 2.5vw, 18px)",
    flexWrap: "wrap",
    marginTop: "10px",
  },

  choice: {
    width: "clamp(55px, 13vw, 75px)",
    height: "clamp(55px, 13vw, 75px)",
    background: "#f8fafc",
    borderRadius: "18px",
    fontSize: "clamp(24px, 5vw, 32px)",
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
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "8px",
  },

  circleBtn: {
    width: "clamp(40px, 9.5vw, 50px)",
    height: "clamp(40px, 9.5vw, 50px)",
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
    padding: "10px 22px",
    borderRadius: "20px",
    fontSize: "clamp(18px, 2.5vw, 25px)",
    fontWeight: "bold",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },

  // ================= FINAL POPUP =================
  finalPopup: {
    background: "white",
    padding: "18px 28px",
    borderRadius: "20px",
    fontSize: "clamp(16px, 3vw, 24px)",
    fontWeight: "bold",
    lineHeight: "1.6",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },
};