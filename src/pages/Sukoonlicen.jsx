// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, Home, RotateCcw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ArabicLetterGame() {
  const navigate = useNavigate();

  // ================= QUESTIONS =================
  const questions = [
    { correct: "نَجْم", options: ["بَدِيع", "كَاتِب", "نَجْم"] },
    { correct: "عُشْب", options: ["عُشْب", "شَفِيعُ", "قَالَ"] },
    { correct: "صَخْر", options: ["عَادَ", "صَخْر", "عَبَدَ"] },
    { correct: "شَمْس", options: ["شَمْس", "عَرَفَ", "سَامِعُ"] },
    { correct: "بَيْت", options: ["حَمَلَ", "رَفَعَ", "بَيْت"] },
    { correct: "نِسْر", options: ["سَامِعُ", "نِسْر", "رَحَمَ"] },
    { correct: "نَهْر", options: ["نَهْر", "كَتَبَ", "وَاهِبُ"] },
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
    نَجْم: "/sounds/نجم1.mp3",
    عُشْب: "/sounds/عشب.mp3",
    صَخْر: "/sounds/صخر.mp3",
    شَمْس: "/sounds/شمس.mp3",
    بَيْت: "/sounds/بيت.mp3",
    نِسْر: "/sounds/نسر.mp3",
    نَهْر: "/sounds/نهر.mp3",
  };

  // ================= PLAY LETTER =================
  const playSound = (letter) => {
    if (!soundEnabled) return;
    const src = sounds[letter];
    
    if (!src) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.playbackRate = 0.85;
    audio.volume = 1;
    audioRef.current = audio;
    
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  // ================= INTERNAL BEEP SOUNDS (للصح والخطأ بدون مشاكل روابط) =================
  const playTone = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "correct") {
        // نغمة نجاح فرحة (ترددات تصاعدية سريعة)
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // نغمة خطأ (تردد منخفض وثقيل)
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.setValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.log("Tone error:", e);
    }
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
      playTone("correct");

      setTimeout(() => {
        setShowCorrect(false);
      }, 1200);
    } else {
      playTone("wrong");
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
      <div style={styles.topContainer}>
        <div style={styles.box}>⏰ {time}</div>
        <div style={styles.header}>
          لعبة استمع واختر الكلمة التي بها مد بالياء
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
        <div style={styles.overlayNonBlocking}>
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
                transform: selected === l ? "scale(1.08)" : "scale(1)",
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
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            ...styles.circleBtn,
            opacity: soundEnabled ? 1 : 0.5,
          }}
        >
          <Volume2 color="white" />
        </button>

        <button
          onClick={() => navigate("/Sukoon")}
          style={styles.circleBtn}
        >
          <ArrowRight color="white" />
        </button>

        <button
          onClick={() => navigate("/home")}
          style={styles.circleBtn}
        >
          <Home color="white" />
        </button>

        <button
          onClick={restartGame}
          style={styles.circleBtn}
        >
          <RotateCcw color="white" />
        </button>
      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    padding: "10px 15px",
    textAlign: "center",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "url('/src/assets/bgg.jpeg')",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
    marginTop: "5px",
    gap: "8px",
  },

  box: {
    background: "white",
    padding: "6px 12px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },

  header: {
    background: "#fcbf49",
    width: "fit-content",
    padding: "8px 14px",
    borderRadius: "14px",
    fontSize: "clamp(16px, 2vw, 17px)",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    color: "#fff",
  },

  card: {
    background: "rgba(255,255,255,0.96)",
    width: "100%",
    maxWidth: "320px",
    marginTop: "65px",
    marginBottom: "auto",
    padding: "16px",
    borderRadius: "22px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    backdropFilter: "blur(6px)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  gameText: {
    fontSize: "19px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },

  sound: {
    width: "55px",
    height: "55px",
    background: "#6a4c93",
    color: "white",
    fontSize: "26px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "8px auto",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
    transition: "0.2s",
  },

  choices: {
    delay: 0,
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "10px",
    width: "100%",
  },

  choice: {
    minWidth: "60px",
    padding: "8px 10px",
    background: "#f8fafc",
    borderRadius: "14px",
    fontSize: "23px",
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
    flexWrap: "wrap",
    marginBottom: "25px",
  },

  circleBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#7f57e7",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    zIndex: 1000,
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

  overlayNonBlocking: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    pointerEvents: "none",
  },

  popup: {
    background: "#41c441",
    color: "white",
    padding: "12px 30px",
    borderRadius: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
    pointerEvents: "auto",
  },

  finalPopup: {
    background: "white",
    padding: "25px",
    borderRadius: "24px",
    fontSize: "20px",
    fontWeight: "bold",
    lineHeight: "1.6",
    boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
    textAlign: "center",
    pointerEvents: "auto",
  },
};