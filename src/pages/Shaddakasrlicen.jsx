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
    { correct: "لُوِّنَ", options: ["بَدِيع", "كَاتِب", "لُوِّنَ"] },
    { correct: "عُيِّنَ", options: ["عُيِّنَ", "شَفِيعُ", "قَالَ"] },
    { correct: "مُعَّلِمُ", options: ["عَادَ", "مُعَّلِمُ", "عَبَدَ"] },
    { correct: "رُشِّحَ", options: ["رُشِّحَ", "عَرَفَ", "سَامِعُ"] },
    { correct: "سُعِّرَ", options: ["شَمْسُ", "رَفَعَ", "سُعِّرَ"] },
    { correct: "يُقَلِّدُ", options: ["سَامِعُ", "يُقَلِّدُ", "رَحَمَ"] },
    { correct: "رُخِّصَ", options: ["رُخِّصَ", "كَتَبَ", "وَاهِبُ"] },
    
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
    لُوِّنَ: "/sounds/لون.mp3",
    عُيِّنَ: "/sounds/عين.mp3",
    مُعَّلِمُ: "/sounds/معلم.mp3",
    رُشِّحَ: "/sounds/روشح.mp3",
    سُعِّرَ: "/sounds/سعر.mp3",
    يُقَلِّدُ: "/sounds/يقلد.mp3",
    رُخِّصَ: "/sounds/رخص.mp3",
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

      {/* ================= TOP (Time, Header, Score) ================= */}
      <div style={styles.top}>
        <div style={styles.box}>
          ⏰ {time}
        </div>

        <div style={styles.header}>
          استمع واختر الكلمة التي بها شدة مع كسرة
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
          onClick={() => (window.location.href = "/Shadda")}
          style={styles.circleBtn}
        >
          <ArrowRight color="white" size={20} />
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
    overflow: "hidden", // منع السكرول نهائياً

    padding: "8px 20px 4px 20px",

    textAlign: "center",

    direction: "rtl",

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundImage:
      "url('src/assets/bgg.jpeg')",
      
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start", // سحب المحتوى للأعلى وتوزيع مرن
    alignItems: "center",
    boxSizing: "border-box",
  },

  // ================= TOP =================
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "650px",
    marginTop: "4px",
  },

  box: {
    background: "white",

    padding: "8px 15px",

    borderRadius: "14px",

    fontWeight: "bold",

    fontSize: "clamp(15px, 2vw, 18px)",

    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  // ================= HEADER =================
  header: {
    background: "#fcbf49",

    padding: "12px 28px",

    borderRadius: "18px",

    fontSize: "clamp(17px, 2.5vw, 22px)",

    fontWeight: "bold",

    textAlign: "center",

    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  // ================= CARD (تم رفعه للأعلى أكثر) =================
  card: {
    background: "rgba(255,255,255,0.95)",

    width: "fit-content",
    minWidth: "300px",

    margin: "59px auto 0 auto", // مسافة علوية لرفع المربع أكثر

    padding: "25px 15px",

    borderRadius: "24px",

    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",

    backdropFilter: "blur(6px)",
    boxSizing: "border-box",
  },

  // ================= GAME TEXT =================
  gameText: {
    fontSize: "clamp(18px, 2.2vw, 20px)",

    fontWeight: "bold",

    marginBottom: "6px",

    color: "#333",
  },

  // ================= SOUND =================
  sound: {
    width: "clamp(50px, 7.5vw, 65px)",

    height: "clamp(50px, 7.5vw, 65px)",

    background: "#6a4c93",

    color: "white",

    fontSize: "clamp(24px, 4.5vw, 30px)",

    borderRadius: "50%",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    margin: "6px auto",

    cursor: "pointer",

    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",

    transition: "0.2s",
  },

  // ================= CHOICES =================
  choices: {
    display: "flex",

    justifyContent: "center",

    gap: "16px",

    flexWrap: "wrap",

    marginTop: "15px",

    padding: "0 15px",
  },

  choice: {
    width: "clamp(42px, 9.5vw, 60px)",

    height: "clamp(42px, 9.5vw, 60px)",

    background: "#f8fafc",

    borderRadius: "16px",

    fontSize: "clamp(20px, 4.5vw, 26px)",

    fontWeight: "bold",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    cursor: "pointer",

    transition: "0.2s",

    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  // ================= BUTTONS (تم رفعها للأعلى أكثر) =================
  bottomButtons: {
    display: "flex",

    justifyContent: "center",

    gap: "14px",

    marginTop: "90px", // دفع الأزرار للأعلى ومحاذاة ممتازة
    marginBottom: "15px",
  },

  circleBtn: {
    width: "clamp(38px, 7.5vw, 46px)",

    height: "clamp(38px, 7.5vw, 46px)",

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

    padding: "10px 18px",

    borderRadius: "20px",

    fontSize: "clamp(20px, 2vw, 26px)",

    fontWeight: "bold",

    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },

  // ================= FINAL POPUP =================
  finalPopup: {
    background: "white",

    padding: "18px 25px",

    borderRadius: "22px",

    fontSize: "clamp(18px, 3.5vw, 26px)",

    fontWeight: "bold",

    lineHeight: "1.7",

    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
  },
};