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
    { correct: "قَرِيب", options: ["سَمَعَ", "كَاتِب", "قَرِيب"] },
    { correct: "كَرِيم", options: ["كَرِيم", "وَهَبَ", "قَالَ"] },
    { correct: "جَمِيل", options: ["عَادَ", "جَمِيل", "عَبَدَ"] },
    { correct: "سَمِين", options: ["سَمِين", "عَرَفَ", "سَامِعُ"] },
    { correct: "بَعِيد", options: ["شَمْسُ", "رَفَعَ", "بَعِيد"] },
    { correct: "صَغِير", options: ["عَارِفَ", "صَغِير", "حَمَدَ"] },
    { correct: "كَبِير", options: ["كَبِير", "كَتَبَ", "وَاهِبُ"] },
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
    كَرِيم: "/sounds/كريم.mp3",
    قَرِيب: "/sounds/قريب.mp3",
    جَمِيل: "/sounds/جميل.mp3",
    سَمِين: "/sounds/سمين.mp3",
    بَعِيد: "/sounds/بعيد.mp3",
    صَغِير: "/sounds/صغير.mp3",
    كَبِير: "/sounds/كبير.mp3",
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
      
      {/* ================= TOP ================= */}
      <div style={styles.top}>
        <div style={styles.scoreBox}>
          {score} ⭐
        </div>
        <div style={styles.header}>
          لعبة استمع واختر الكلمة التي بها مد بالياء
        </div>
        <div style={styles.timeBox}>
          {time} ⏱️
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

      {/* ================= GAME ================= */}
      <div style={styles.card}>
        <p style={styles.gameText}>استمع ثم اختر الكلمة الصحيحة</p>

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
                      ? "3px solid #2e7d32"
                      : "3px solid #c62828"
                    : "1px solid #e0e0e0",
                transform: selected === l ? "scale(1.05)" : "scale(1)",
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* ================= BUTTONS ================= */}
      <div style={styles.bottomButtons}>
        <button onClick={() => playSound(correct)} style={styles.circleBtn}>
          <Volume2 color="white" size={22} />
        </button>
        <button onClick={() => (window.location.href = "/Mad")} style={styles.circleBtn}>
          <ArrowRight color="white" size={22} />
        </button>
        <button onClick={() => (window.location.href = "/home")} style={styles.circleBtn}>
          <Home color="white" size={22} />
        </button>
        <button onClick={restartGame} style={styles.circleBtn}>
          <RotateCcw color="white" size={22} />
        </button>
      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    padding: "15px 20px",
    textAlign: "center",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "url('src/assets/WhatsApp Image 2026-06-01 at 1.33.22 AM.jpeg')",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
    left: 0,
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "850px",
    marginTop: "5px",
    padding: "0 10px",
  },

  scoreBox: {
    background: "white",
    padding: "6px 14px",
    borderRadius: "16px",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  timeBox: {
    background: "white",
    padding: "6px 14px",
    borderRadius: "16px",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  header: {
    background: "#ffb703",
    padding: "8px 25px",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#222",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },

  card: {
    background: "rgba(255, 255, 255, 0.96)",
    width: "310px",
    maxWidth: "85%",
    padding: "18px 12px 22px 12px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    marginTop: "50px", // تم تقليل المارجن ليقترب المربع من العنوان الأصفر بمسافة صغيرة
    marginBottom: "auto",
  },

  gameText: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#333",
  },

  sound: {
    width: "58px",
    height: "58px",
    background: "#5c4099",
    color: "white",
    fontSize: "26px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px auto",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
  },

  choices: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },

  choice: {
    minWidth: "75px",
    minHeight: "50px",
    padding: "6px 8px",
    background: "#f8f9fa",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },

  bottomButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "15px",
  },

  circleBtn: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#ff9f1c",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  popup: {
    background: "#2ec4b6",
    color: "white",
    padding: "15px 25px",
    borderRadius: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },

  finalPopup: {
    background: "white",
    padding: "30px 40px",
    borderRadius: "24px",
    fontSize: "24px",
    fontWeight: "bold",
    lineHeight: "1.8",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },
};