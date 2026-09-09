// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";

import {
  Volume2,
  VolumeX,
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

export default function ArabicLetterGame() {

  // ================= QUESTIONS =================
  const questions = [
    { correct: "هَرَمًا", options: ["بَدِيع", "كَاتِب", "هَرَمًا"] },
    { correct: "أَسَدًا", options: ["أَسَدًا", "شَفِيعُ", "قَالَ"] },
    { correct: "أَحَدًا", options: ["عَادَ", "أَحَدًا", "عَبَدَ"] },
    { correct: "قَرِيبًا", options: ["قَرِيبًا", "عَرَفَ", "سَامِعُ"] },
    { correct: "صَوْتًا", options: ["شَمْسُ", "رَفَعَ", "صَوْتًا"] },
    { correct: "طَرِيقًا", options: ["سَامِعُ", "طَرِيقًا", "رَحَمَ"] },
    { correct: "رَقَمًا", options: ["رَقَمًا", "كَتَبَ", "وَاهِبُ"] },
    
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

  // حالة الصوت مفعلة افتراضياً
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
    هَرَمًا: "/sounds/هرما.mp3",
    أَسَدًا: "/sounds/أسد.mp3",
    أَحَدًا: "/sounds/أحد.mp3",
    قَرِيبًا: "/sounds/قريبا.mp3",
    صَوْتًا: "/sounds/صوت.mp3",
    طَرِيقًا: "/sounds/طريق.mp3",
    رَقَمًا: "/sounds/رقم.mp3",
  };

  // ================= PLAY LETTER =================
  const playSound = (letter) => {
    // إذا كان الصوت مغلقاً، لا تقم بتشغيل أي شيء
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

        <div style={styles.box}>
          ⏰ {time}
        </div>

        {/* ================= HEADER ================= */}
        <div style={styles.header}>
          لعبة استمع واختر الكلمة التي بها مد بالياء
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
          ⭐  حصلت على {score} نقطة 
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
          <RotateCcw color="white" size={24} />
        </button>

        <button
          onClick={() => (window.location.href = "/home")}
          style={styles.circleBtn}
        >
          <Home color="white" size={24} />
        </button>

        <button
          onClick={() => (window.location.href = "/Nunation")}
          style={styles.circleBtn}
        >
          <ArrowRight color="white" size={24} />
        </button>

        {/* زر الصوت السفلي (Toggle كتم / فتح الصوت) */}
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (soundEnabled && audioRef.current) {
              audioRef.current.pause();
            }
          }}
          style={{
            ...styles.circleBtn,
            background: soundEnabled ? "#7f57e7" : "#d90429",
          }}
          title={soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
        >
          {soundEnabled ? <Volume2 color="white" size={24} /> : <VolumeX color="white" size={24} />}
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

    padding: "clamp(5px, 4vw, 20px)",

    textAlign: "center",

    direction: "rtl",

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundImage:
      "url('src/assets/bgg.jpeg')",
      
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  // ================= TOP ================
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

    padding:
      "clamp(8px, 2vw, 12px) clamp(14px, 2vw, 20px)",

    borderRadius: "14px",

    fontWeight: "bold",

    fontSize: "clamp(15px, 2vw, 18px)",

    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  // ================= HEADER =================
 
  header: {
    background: "#fcbf49",

    width: "fit-content",

    margin: "0",

    padding:
      "clamp(10px, 2vw, 14px) clamp(16px, 3.5vw, 45px)",

    borderRadius: "18px",

    fontSize: "clamp(15px, 2.6vw, 22px)",

    fontWeight: "bold",

    textAlign: "center",

    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",

    lineHeight: "1.4",
  },

  // ================= CARD (تم تقليص العرض والبادنج الجانبي بشكل أكبر) =================
  card: {
    background: "rgba(255,255,255,0.95)",

    // تم تقليص العرض الأقصى ليصبح أصغر (340px بدلاً من 420px) ونسبة أضيق من الشاشة
    width: "min(75%, 340px)",

    margin: "auto",

    // تقليص البادنج الجانبي أكثر ليصبح 2px فقط، والعمودي 16px
    padding: "16px 2px",
marginBottom: "140px",
    borderRadius: "20px",

    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",

    backdropFilter: "blur(6px)",
  },

  // ================= GAME TEXT =================
  gameText: {
    fontSize: "clamp(20px, 2.8vw, 26px)",

    fontWeight: "bold",

    marginBottom: "10px",

    color: "#333",
  },

  // ================= SOUND =================
  sound: {
    width: "clamp(60px, 8vw, 75px)",

    height: "clamp(60px, 8vw, 75px)",

    background: "#6a4c93",

    color: "white",

    fontSize: "clamp(28px, 6vw, 36px)",

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

    gap: "clamp(10px, 2.5vw, 16px)",

    flexWrap: "wrap",

    marginTop: "10px",
  },

  choice: {
    width: "clamp(48px, 12vw, 72px)",

    height: "clamp(48px, 12vw, 72px)",
    
    marginTop: "5px",
    marginBottom: "5px",

    background: "#f8fafc",

    borderRadius: "16px",

    fontSize: "clamp(24px, 5vw, 30px)",

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

    marginBottom: "10px",
  },

  circleBtn: {
    width: "clamp(45px, 9vw, 55px)",

    height: "clamp(45px, 9vw, 55px)",

    borderRadius: "50%",

    background: "#7f57e7",

    border: "none",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    cursor: "pointer",

    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "background 0.3s ease",
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