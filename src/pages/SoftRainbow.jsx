// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🖼️ استيراد الصور
import rainbowBgImg from "../assets/rainbowBg.jpeg";         
import titleBoardImg from "../assets/rainbowTitleBoard.png"; 
import cloudBtnImg1 from "../assets/cloudBtn1.png";         
import cloudBtnImg2 from "../assets/cloudBtn2.png";         

const QUESTIONS = [
  {
    id: 1,
    word: "مُسْتَشْفَى",
    options: [
      { text: "أَلِف لِينَة", isCorrect: true, img: cloudBtnImg1 },
      { text: "يَاء مِلْكِيَّة", isCorrect: false, img: cloudBtnImg2 },
    ],
  },
  {
    id: 2,
    word: "كِتَابِي",
    options: [
      { text: "أَلِف لِينَة", isCorrect: false, img: cloudBtnImg1 },
      { text: "يَاء مِلْكِيَّة", isCorrect: true, img: cloudBtnImg2 },
    ],
  },
  {
    id: 3,
    word: "عَلَى",
    options: [
      { text: "أَلِف لِينَة", isCorrect: true, img: cloudBtnImg1 },
      { text: "يَاء مِلْكِيَّة", isCorrect: false, img: cloudBtnImg2 },
    ],
  },
  {
    id: 4,
    word: "قَلَمِي",
    options: [
      { text: "أَلِف لِينَة", isCorrect: false, img: cloudBtnImg1 },
      { text: "يَاء مِلْكِيَّة", isCorrect: true, img: cloudBtnImg2 },
    ],
  },
  {
    id: 5,
    word: "فَتَى",
    options: [
      { text: "أَلِف لِينَة", isCorrect: true, img: cloudBtnImg1 },
      { text: "يَاء مِلْكِيَّة", isCorrect: false, img: cloudBtnImg2 },
    ],
  },
  {
    id: 6,
    word: "مَدْرَسَتِي",
    options: [
      { text: "أَلِف لِينَة", isCorrect: false, img: cloudBtnImg1 },
      { text: "يَاء مِلْكِيَّة", isCorrect: true, img: cloudBtnImg2 },
    ],
  },
  {
    id: 7,
    word: "إِلَى",
    options: [
      { text: "أَلِف لِينَة", isCorrect: true, img: cloudBtnImg1 },
      { text: "يَاء مِلْكِيَّة", isCorrect: false, img: cloudBtnImg2 },
    ],
  },
];

export default function RainbowGame() {
  const navigate = useNavigate();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [progressStep, setProgressStep] = useState(0); 
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isBusy, setIsBusy] = useState(false);

  const audioCtxRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (!isGameOver) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    } catch (e) {
      console.warn("AudioContext غير مدعوم", e);
    }
  }, []);

  const playSound = (type) => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      if (type === "success") {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0.2, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 0.2);
        });
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("خطأ الصوت:", e);
    }
  };

  const speakWord = (text) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (e) {}
  };

  const showQuickMessage = (text, type) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage({ text, type });
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 1200);
  };

  const handleOptionClick = (option) => {
    if (isBusy || isGameOver) return;
    setIsBusy(true);

    if (option.isCorrect) {
      playSound("success");
      showQuickMessage("إجابة صحيحة! 🌈✨", "success");
      setScore((prev) => prev + 10);
      
      const newProgress = Math.min(progressStep + 1, QUESTIONS.length);
      setProgressStep(newProgress);

      setTimeout(() => {
        if (currentQIndex + 1 < QUESTIONS.length) {
          setCurrentQIndex((prev) => prev + 1);
        } else {
          setIsGameOver(true);
        }
        setIsBusy(false);
      }, 1000);
    } else {
      playSound("error");
      showQuickMessage("إجابة خاطئة! تراجع القوس ❌", "error");
      
      setProgressStep((prev) => Math.max(prev - 1, 0));

      setTimeout(() => {
        setIsBusy(false);
      }, 1000);
    }
  };

  const startNewGame = () => {
    setCurrentQIndex(0);
    setProgressStep(0);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setIsBusy(false);
    setMessage({ text: "", type: "" });
  };

  const handleBack = () => {
    navigate("/Soft");
  };

  const currentQ = QUESTIONS[currentQIndex];
  const fillPercentage = (progressStep / QUESTIONS.length) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div id="game-container" style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🌌 الخلفية */}
      <img src={rainbowBgImg} alt="خلفية اللعبة" style={styles.bgImg} />

      {/* 🌟 النقاط والوقت */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score}
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive qcounter-position">
        <Clock size={18} color="#38bdf8" /> {formatTime(timer)}
      </div>

      {/* 🖼️ العنوان والوصف */}
      <div style={styles.headerContainer} className="header-container-responsive">
        <div style={styles.titleBoardWrapper}>
          <img src={titleBoardImg} alt="عنوان اللعبة" style={styles.titleBoardImg} />
          <div style={styles.titleTextContainer}>
            <h1 style={styles.gameTitle} className="game-title-responsive">لعبة قوس قزح</h1>
            <p style={styles.gameSubTitle} className="game-subtitle-responsive">اختر الإجابة الصحيحة لتلوين قوس قزح!</p>
          </div>
        </div>
      </div>

      {/* 📝 بطاقة الكلمة */}
      <div style={styles.wordCard} className="word-card-responsive">
        <span style={styles.wordText} className="word-text-responsive">{currentQ.word}</span>
        <button onClick={() => speakWord(currentQ.word)} style={styles.speakerBtn} title="استمع للكلمة">
          <Volume2 size={26} color="#fbbf24" />
        </button>
      </div>

      {/* 🌈 قوس قزح */}
      <div style={styles.rainbowContainer} className="rainbow-container-responsive">
        <svg 
          viewBox="0 0 200 120" 
          style={{ 
            width: "100%", 
            height: "100%", 
            overflow: "visible", 
            filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.15))" 
          }}
        >
          <g style={{
            clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
            transition: "clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <path d="M 25 110 A 75 75 0 0 1 175 110" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 29 110 A 71 71 0 0 1 171 110" fill="none" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 33 110 A 67 67 0 0 1 167 110" fill="none" stroke="#eab308" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 37 110 A 63 63 0 0 1 163 110" fill="none" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 41 110 A 59 59 0 0 1 159 110" fill="none" stroke="#06b6d4" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 45 110 A 55 55 0 0 1 155 110" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 49 110 A 51 51 0 0 1 151 110" fill="none" stroke="#a855f7" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* ☁️ أزرار السحابتين */}
      <div style={styles.cloudsContainer} className="clouds-container-responsive">
        {currentQ.options.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => handleOptionClick(opt)}
            style={styles.cloudWrapper}
            className="cloud-btn-responsive"
          >
            <img src={opt.img} alt={`سحابة ${idx + 1}`} style={styles.cloudImg} />
            <span style={styles.cloudText} className="cloud-text-responsive">
              {opt.text}
            </span>
          </div>
        ))}
      </div>

      {/* 💬 الرسائل */}
      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }}>
          {message.text}
        </div>
      )}

      {/* 🏆 شاشة الفوز */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winCard} className="win-card-responsive">
            <div style={styles.trophyWrapper}>
              <Trophy className="trophy-icon-responsive" color="#FFD700" />
            </div>
            <h2 style={styles.winTitle} className="win-title-responsive">
              رائع جداً! اكتملت اللعبة بنجاح! 🌈✨
            </h2>

            <div style={styles.winStatsBox} className="win-stats-responsive">
              <span style={styles.winStatLabel} className="win-stat-label-responsive">
                <Star color="#f57c00" className="star-icon-responsive" /> النقاط: {score} | ⏱️ الوقت: {formatTime(timer)}
              </span>
            </div>

            <div style={styles.winActionButtons}>
              <button onClick={startNewGame} style={styles.winIconBtn} className="win-btn-responsive" title="إعادة اللعب">
                <RotateCcw className="btn-icon-responsive" />
              </button>
              <button onClick={() => navigate("/home")} style={styles.winIconBtn} className="win-btn-responsive" title="الصفحة الرئيسية">
                <Home className="btn-icon-responsive" />
              </button>
              <button onClick={handleBack} style={styles.winIconBtn} className="win-btn-responsive" title="رجوع لصفحة Soft">
                <ArrowRight className="btn-icon-responsive" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔘 الأزرار الأربعة السفلية */}
      <div style={styles.controlsBarBottom} className="controls-bottom-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="control-btn-responsive" title="الصوت">
          {soundEnabled ? <Volume2 className="ctrl-icon-responsive" /> : <VolumeX className="ctrl-icon-responsive" />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} className="control-btn-responsive" title="إعادة اللعب">
          <RotateCcw className="ctrl-icon-responsive" />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="control-btn-responsive" title="الصفحة الرئيسية">
          <Home className="ctrl-icon-responsive" />
        </button>
        <button onClick={handleBack} style={styles.iconBtn} className="control-btn-responsive" title="رجوع لصفحة Soft">
          <ArrowRight className="ctrl-icon-responsive" />
        </button>
      </div>
    </div>
  );
}

const responsiveCSS = `
  .header-container-responsive {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    width: 360px;
    max-width: 92vw;
  }

  .game-title-responsive {
    font-size: 1.4rem;
    font-weight: 900;
    color: #ffffff;
    margin: 0;
    line-height: 1.2;
    text-shadow: 0 2px 5px rgba(0,0,0,0.7);
  }

  /* 🎯 تم تكبير الفقرة (الوصف) لجميع الشاشات */
  .game-subtitle-responsive {
    font-size: 0.92rem;
    color: #fef08a;
    margin: 3px 0 0 0;
    font-weight: 800;
    line-height: 1.2;
    text-shadow: 0 1px 3px rgba(0,0,0,0.9);
  }

  .word-card-responsive {
    position: absolute;
    top: 130px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(8px);
    border: 3px solid #f59e0b;
    border-radius: 25px;
    padding: 6px 30px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
    z-index: 25;
  }

  .word-text-responsive {
    font-size: 2.5rem;
    font-weight: 900;
    color: #ffffff;
    text-shadow: 0 3px 8px rgba(0,0,0,0.6);
  }

  .rainbow-container-responsive {
    position: absolute;
    top: 26%;
    left: 50%;
    transform: translateX(-50%);
    width: 62%;
    height: 34%;
    z-index: 15;
    pointer-events: none;
  }

  .clouds-container-responsive {
    position: absolute;
    bottom: 85px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 30px;
    z-index: 25;
    width: 100%;
  }

  .cloud-btn-responsive {
    width: 175px;
    height: 105px;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .cloud-btn-responsive:hover {
    transform: scale(1.08);
  }

  .cloud-text-responsive {
    font-size: 1.5rem;
    font-weight: 900;
    color: #0369a1;
  }

  .stat-badge-responsive {
    font-size: 1.1rem !important;
    padding: 6px 16px !important;
    position: absolute;
    z-index: 40;
  }

  .score-position { top: 16px; left: 20px; }
  .qcounter-position { top: 16px; right: 20px; }

  .controls-bottom-responsive {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 16px;
    z-index: 40;
  }

  .win-card-responsive { width: 280px !important; padding: 20px !important; }
  .trophy-icon-responsive { width: 48px !important; height: 48px !important; }
  .win-title-responsive { font-size: 1.1rem !important; margin: 6px 0 10px 0 !important; }
  .win-stats-responsive { padding: 6px 12px !important; margin-bottom: 12px !important; }
  .win-stat-label-responsive { font-size: 0.95rem !important; }
  .star-icon-responsive { width: 18px !important; height: 18px !important; }
  .btn-icon-responsive { width: 20px !important; height: 20px !important; }
  .win-btn-responsive { padding: 8px !important; }

  /* 📱 للموبايل والشاشات الصغيرة */
  @media (max-width: 600px) {
    .header-container-responsive {
      top: 4px !important;
      width: 230px !important;
    }

    .game-title-responsive { font-size: 1.15rem !important; }
    
    /* 🎯 تكبير خط الفقرة في الموبايل */
    .game-subtitle-responsive { font-size: 0.8rem !important; margin-top: 2px !important; }

    .word-card-responsive {
      top: 110px !important;
      padding: 4px 18px !important;
      gap: 10px !important;
    }

    .word-text-responsive { font-size: 2rem !important; }

    .rainbow-container-responsive {
      top: 27% !important;
      width: 70% !important;
      height: 30% !important;
    }

    /* 🎯 رفع السحابتين لأعلى في الموبايل */
    .clouds-container-responsive {
      bottom: 115px !important;
      gap: 15px !important;
    }

    .cloud-btn-responsive {
      width: 140px !important;
      height: 85px !important;
    }

    .cloud-text-responsive {
      font-size: 1.2rem !important;
    }

    .stat-badge-responsive {
      font-size: 0.85rem !important;
      padding: 4px 10px !important;
    }

    .controls-bottom-responsive {
      bottom: 10px !important;
      gap: 10px !important;
    }

    .control-btn-responsive { padding: 7px !important; }
    .ctrl-icon-responsive { width: 20px !important; height: 20px !important; }
  }
`;

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    backgroundColor: "#38bdf8",
    userSelect: "none",
    touchAction: "none",
  },
  bgImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  headerContainer: {},
  titleBoardWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titleBoardImg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  titleTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 8%",
    boxSizing: "border-box",
  },
  gameTitle: {},
  gameSubTitle: {},
  wordCard: {},
  wordText: {},
  speakerBtn: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rainbowContainer: {},
  cloudsContainer: {},
  cloudWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cloudImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    position: "absolute",
    top: 0,
    left: 0,
  },
  cloudText: {
    position: "relative",
    zIndex: 2,
    marginTop: "5px",
    pointerEvents: "none",
  },
  scoreBadge: {
    background: "rgba(15, 23, 42, 0.85)",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    color: "#f57c00",
    border: "2px solid #f57c00",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  timerBadge: {
    background: "rgba(15, 23, 42, 0.85)",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    color: "#38bdf8",
    border: "2px solid #38bdf8",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  feedbackMessage: {
    position: "absolute",
    top: "14%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 60,
    borderRadius: "14px",
    fontWeight: "bold",
    color: "#fff",
    padding: "6px 20px",
    fontSize: "1.1rem",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
    pointerEvents: "none",
  },
  success: { backgroundColor: "#15803d" },
  error: { backgroundColor: "#b91c1c" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winCard: {
    background: "#0f172a",
    border: "3px solid #38bdf8",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 0 30px rgba(56, 189, 248, 0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trophyWrapper: {
    marginBottom: "2px",
    filter: "drop-shadow(0 0 8px #ffd700)",
  },
  winTitle: {
    color: "#f8fafc",
    fontWeight: "800",
  },
  winStatsBox: {
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
  },
  winStatLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "bold",
    color: "#fde047",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  winIconBtn: {
    background: "#1e293b",
    border: "2px solid #38bdf8",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#38bdf8",
    boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsBarBottom: {},
  iconBtn: {
    background: "rgba(15, 23, 42, 0.9)",
    borderRadius: "50%",
    border: "2px solid #38bdf8",
    cursor: "pointer",
    color: "#38bdf8",
    boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  },
};