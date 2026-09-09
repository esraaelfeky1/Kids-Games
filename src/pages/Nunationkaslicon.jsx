// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";

import {
  Home,
  RotateCcw,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function ArabicLetterGame() {

  // ================= QUESTIONS =================
  const questions = [
    { correct: "قَوْلٍ", options: ["بَدِيع", "كَاتِب", "قَوْلٍ"] },
    { correct: "مَطَرٍ", options: ["مَطَرٍ", "شَفِيعُ", "قَالَ"] },
    { correct: "حَبْلٍ", options: ["عَادَ", "حَبْلٍ", "عَبَدَ"] },
    { correct: "كَأْسٍ", options: ["كَأْسٍ", "عَرَفَ", "سَامِعُ"] },
    { correct: "حُوتٍ", options: ["شَمْسُ", "رَفَعَ", "حُوتٍ"] },
    { correct: "خَوْفٍ", options: ["سَامِعُ", "خَوْفٍ", "رَحَمَ"] },
    { correct: "بَهِيجٍ", options: ["بَهِيجٍ", "كَتَبَ", "وَاهِبُ"] },
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

  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioRef = useRef(null);
  const preloadedAudios = useRef({});

  // ================= PRELOAD SOUNDS =================
  useEffect(() => {
    const soundsMap = {
      قَوْلٍ: "/sounds/قول.mp3",
      مَطَرٍ: "/sounds/مطر.mp3",
      حَبْلٍ: "/sounds/حبل.mp3",
      حُوتٍ: "/sounds/حوت.mp3",
      كَأْسٍ: "/sounds/كأس.mp3",
      خَوْفٍ: "/sounds/خوف.mp3",
      بَهِيجٍ: "/sounds/بهيج.mp3",
    };

    // تحميل جميع الأصوات مسبقاً في الذاكرة لتجنب أي تأخير
    Object.keys(soundsMap).forEach((key) => {
      const audio = new Audio(soundsMap[key]);
      audio.playbackRate = 0.85;
      audio.preload = "auto";
      preloadedAudios.current[key] = audio;
    });
  }, []);

  // ================= TIMER =================
  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  // ================= PLAY LETTER =================
  const playSound = (letter) => {
    if (!soundEnabled) return;

    const audio = preloadedAudios.current[letter];
    if (!audio) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audio.currentTime = 0;
    audio.volume = 1;
    audioRef.current = audio;
    
    audio.play().catch(() => {});
  };

  // ================= GENERATE QUESTION =================
  const generateQuestion = (index) => {
    const q = questions[index];

    setChoices(q.options);
    setCorrect(q.correct);
    setSelected(null);

    // تشغيل الصوت فوراً بدون تأخير
    playSound(q.correct);
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
        <div style={styles.box}>
          ⏰ {time}
        </div>

        {/* ================= HEADER ================= */}
        <div style={styles.header}>
          لعبة استمع واختر الكلمة التي بها تنوين بالكسر
        </div>

        <div style={styles.box}>
          ⭐ {score}
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

      {/* ================= GAME ================= */}
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
        <button
          onClick={restartGame}
          style={styles.circleBtn}
        >
          <RotateCcw color="white" size={20} />
        </button>

        <button
          onClick={() => (window.location.href = "/home")}
          style={styles.circleBtn}
        >
          <Home color="white" size={20} />
        </button>

        <button
          onClick={() => (window.location.href = "/Nunation")}
          style={styles.circleBtn}
        >
          <ArrowRight color="white" size={20} />
        </button>

        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (soundEnabled && audioRef.current) {
              audioRef.current.pause();
            }
          }}
          style={styles.circleBtn}
        >
          {soundEnabled ? (
            <Volume2 color="white" size={20} />
          ) : (
            <VolumeX color="white" size={20} />
          )}
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
    overflow: "hidden",
    padding: "clamp(4px, 2vw, 10px)",
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
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "0px",
  },
  box: {
    background: "white",
    padding: "clamp(5px, 1.2vw, 8px) clamp(10px, 1.8vw, 14px)",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "clamp(14px, 1.8vw, 16px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  header: {
    background: "#fcbf49",
    width: "fit-content",
    margin: "0 auto",
    padding: "clamp(6px, 1.2vw, 10px) clamp(15px, 3vw, 35px)",
    borderRadius: "16px",
    fontSize: "clamp(17px, 2.5vw, 22px)",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    lineHeight: "1.4",
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    width: "min(75%, 340px)",
    margin: "80px auto auto auto",
    padding: "clamp(14px, 2.5vw, 22px) clamp(2px, 0.8vw, 6px)",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    backdropFilter: "blur(6px)",
  },
  gameText: {
    fontSize: "clamp(20px, 2.8vw, 26px)",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#333",
  },
  sound: {
    width: "clamp(50px, 6.5vw, 65px)",
    height: "clamp(50px, 6.5vw, 65px)",
    background: "#6a4c93",
    color: "white",
    fontSize: "clamp(24px, 4.5vw, 32px)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "6px auto",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },
  choices: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(8px, 2vw, 14px)",
    flexWrap: "wrap",
    marginTop: "6px",
  },
  choice: {
    width: "clamp(42px, 10vw, 60px)",
    height: "clamp(42px, 10vw, 60px)",
    marginTop: "2px",
    marginBottom: "2px",
    background: "#f8fafc",
    borderRadius: "16px",
    fontSize: "clamp(20px, 4vw, 26px)",
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
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "19px",
  },
  circleBtn: {
    width: "clamp(36px, 7.5vw, 44px)",
    height: "clamp(36px, 7.5vw, 44px)",
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
    padding: "clamp(12px, 2vw, 10px)",
    borderRadius: "24px",
    fontSize: "clamp(22px, 2vw, 30px)",
    fontWeight: "bold",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },
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