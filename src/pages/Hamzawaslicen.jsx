// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  RotateCcw,
  ArrowRight,
  Volume2
} from "lucide-react";

export default function ArabicLetterGame() {

  // ================= QUESTIONS =================
  const questions = [
    { correct: "أسد", options: ["اكتب", "أسد"] },
    { correct: "اجلس", options: ["اجلس", "أرنب"] },
    { correct: "أحمد", options: ["افتح", "أحمد"] },
    { correct: "اذهب", options: ["اذهب",  "أمر"] },
    { correct: "أخذ", options: ["استخرج",  "أخذ"] },
    { correct: "انكسر", options: ["انكسر", "إبداع"] },
    { correct: "إنجاز", options: ["إنجاز", "انتصر"] },
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

  // ================= LETTER SOUNDS (ملفات الصوت الأصلية الخاصة بكِ) =================
  const sounds = {
    أسد: "/sounds/همزه قطع.mp3",
    اجلس: "/sounds/الف وصل.mp3",
    أحمد: "/sounds/همزه قطع.mp3",
    اذهب: "/sounds/الف وصل.mp3",
    أخذ: "/sounds/همزه قطع.mp3",
    انكسر: "/sounds/الف وصل.mp3",
    إنجاز: "/sounds/إنجاز.mp3", // يمكنك تعديل المسار لو كان مختلفاً لملف إنجاز
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

    audio.play().catch((err) => {
      console.log("Audio play blocked or path error:", err);
    });

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

  return (
    <div style={styles.page}>

      {/* ================= TOP ================= */}
      <div style={styles.top}>
        <div style={styles.box}>⭐ {score}</div>
        <div style={styles.header}>اختارالكلمة التي بها همزة القطع أوألف الوصل</div>
        <div style={styles.box}>⏱️ {time}</div>
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

      {/* ================= CARD ================= */}
      <div style={styles.card}>

        <p style={styles.gameText}>
          استمع ثم اختر الكلمة الصحيحة
        </p>

        {/* ================= SOUND BUTTON ================= */}
        <div
          style={styles.sound}
          onClick={() => playSound(correct)}
          title="اضغط للاستماع"
        >
          <Volume2 size={30} color="white" />
        </div>

        {/* ================= CHOICES (عمودي) ================= */}
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
                    ? "scale(1.05)"
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
        <button
          onClick={() => (window.location.href = "/Hamza")}
          style={styles.circleBtn}
        >
          <ArrowRight color="white" size={20} />
        </button>

        <button
          onClick={() => (window.location.href = "/home")}
          style={styles.circleBtn}
        >
          <Home color="white" size={20} />
        </button>

        <button
          onClick={restartGame}
          style={styles.circleBtn}
        >
          <RotateCcw color="white" size={20} />
        </button>
      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    padding: "10px",
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
    overflowX: "hidden",
  },

  top: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "95%",
    padding: "0 5px",
    boxSizing: "border-box",
  },

  box: {
    background: "white",
    padding: "6px 14px",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  header: {
    background: "#fcbf49",
    padding: "8px 20px",
    borderRadius: "18px",
    fontSize: "17px",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    color: "#000",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    width: "240px",
    margin: "auto",
    padding: "20px 15px",
    borderRadius: "24px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    backdropFilter: "blur(6px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  gameText: {
    fontSize: "19px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#333",
  },

  sound: {
    width: "55px",
    height: "55px",
    background: "#6a4c93",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px auto",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },

  choices: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  },

  choice: {
    width: "75%",
    padding: "8px 10px",
    background: "#f8fafc",
    borderRadius: "14px",
    fontSize: "22px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
  },

  bottomButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "10px",
  },

  circleBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#7f57e7",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
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
    padding: "12px 25px",
    borderRadius: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },

  finalPopup: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    lineHeight: "1.8",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
    color: "#333",
  },
};