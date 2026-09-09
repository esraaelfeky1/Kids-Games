// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🖼️ استيراد الصور الخاصة باللعبة
import spaceBgImg from "../assets/spaceBg3.jpeg";         // خلفية اللابتوب والتابلت
import spaceBgMobileImg from "../assets/spaceBgMobile.jpeg"; // خلفية الموبايل فقط
import meteor1Img from "../assets/meteor1.png";          // صورة النيزك الأول
import meteor2Img from "../assets/meteor2.png";          // صورة النيزك الثاني

// 🎯 قائمة الكلمات بالتبادل (ألف لينة -> كلمة عادية -> ألف لينة -> كلمة عادية...)
const INITIAL_METEORS = [
  { id: "m1", text: "دنيا", isTarget: true, type: 1 },
  { id: "m2", text: "قلم", isTarget: false, type: 2 },
  { id: "m3", text: "فتى", isTarget: true, type: 1 },
  { id: "m4", text: "بيت", isTarget: false, type: 2 },
  { id: "m5", text: "هدى", isTarget: true, type: 1 },
  { id: "m6", text: "شجر", isTarget: false, type: 2 },
  { id: "m7", text: "مستشفى", isTarget: true, type: 1 },
  { id: "m8", text: "باب", isTarget: false, type: 2 },
  { id: "m9", text: "سلوى", isTarget: true, type: 1 },
  { id: "m10", text: "وردة", isTarget: false, type: 2 },
  { id: "m11", text: "مرضى", isTarget: true, type: 1 },
  { id: "m12", text: "كتاب", isTarget: false, type: 2 },
];

export default function MeteorGame() {
  const navigate = useNavigate();

  const [meteors, setMeteors] = useState(INITIAL_METEORS);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const audioCtxRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  // ⏱️ عداد الوقت
  useEffect(() => {
    let interval = null;
    if (!isGameOver) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);

  // 🔊 إعداد الصوت Web Audio API
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
      console.warn("خطأ في تشغيل الصوت:", e);
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
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  // 💬 إظهار إشعار سريع
  const showQuickMessage = (text, type) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage({ text, type });

    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 1200);
  };

  // ☄️ الضغط على النيزك
  const handleMeteorClick = (meteor) => {
    if (isGameOver || meteor.isHidden) return;

    speakWord(meteor.text);

    if (meteor.isTarget) {
      playSound("success");
      showQuickMessage("صح! ✨", "success");

      setMeteors((prev) => {
        const updated = prev.map((m) => (m.id === meteor.id ? { ...m, isHidden: true } : m));
        const remainingTargets = updated.filter((m) => m.isTarget && !m.isHidden).length;
        if (remainingTargets === 0) {
          setTimeout(() => setIsGameOver(true), 500);
        }
        return updated;
      });

      setScore((prev) => prev + 50);
    } else {
      playSound("error");
      showQuickMessage("خطأ! ❌", "error");
    }
  };

  const startNewGame = () => {
    setMeteors(INITIAL_METEORS);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
  };

  const handleBack = () => {
    navigate("/Soft");
  };

  return (
    <div id="game-container" style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🌌 الخلفية الرئيسية (للاب والتابلت) */}
      <img src={spaceBgImg} alt="خلفية الفضاء" style={styles.bgImg} className="bg-desktop-tablet" />

      {/* 📱 الخلفية المخصصة للموبايل فقط */}
      <img src={spaceBgMobileImg} alt="خلفية الفضاء للموبايل" style={styles.bgImg} className="bg-mobile-only" />

      {/* 🖼️ إطار العنوان */}
      <div style={styles.headerContainer} className="header-container-responsive">
        <h1 style={styles.gameTitle} className="game-title-responsive">
          اجمع النيازك التي تحتوي على ألف لينة
        </h1>
      </div>

      {/* ☄️ شبكة النيازك */}
      <div style={styles.gridContainer} className="grid-container-responsive">
        {meteors.map((meteor) => {
          const meteorImg = meteor.type === 1 ? meteor1Img : meteor2Img;

          return (
            <div
              key={meteor.id}
              onClick={() => handleMeteorClick(meteor)}
              style={{
                ...styles.meteorWrapper,
                visibility: meteor.isHidden ? "hidden" : "visible",
              }}
              className="meteor-responsive spark-effect"
            >
              <img src={meteorImg} alt="نيزك" style={styles.meteorImg} />
              <span style={styles.meteorText} className="meteor-text-responsive">
                {meteor.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🌟 النقاط والوقت */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score}
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive timer-position">
        <Clock className="timer-icon-responsive" color="#0284c7" /> {timer}
      </div>

      {/* 💬 رسائل التغذية الراجعة السريعة */}
      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }}>
          {message.text}
        </div>
      )}

      {/* 🏆 شاشة الفوز الذكية */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winCard} className="win-card-responsive">
            <div style={styles.trophyWrapper}>
              <Trophy className="trophy-icon-responsive" color="#FFD700" />
            </div>
            <h2 style={styles.winTitle} className="win-title-responsive">
              بطل الفضاء 🚀
            </h2>

            <div style={styles.winStatsBox} className="win-stats-responsive">
              <span style={styles.winStatLabel} className="win-stat-label-responsive">
                <Star color="#f57c00" className="star-icon-responsive" /> النقاط: {score}
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

      {/* 🔘 أزرار التحكم السفلية */}
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

// === 🎨 Smart Responsive CSS الذكي لكل الشاشات والمقاسات ===
const responsiveCSS = `
  .bg-desktop-tablet { display: block; }
  .bg-mobile-only { display: none; }

  @keyframes meteorSparkle {
    0% {
      filter: drop-shadow(0 0 6px rgba(255, 140, 0, 0.8)) drop-shadow(0 0 12px rgba(255, 69, 0, 0.6));
      transform: translateY(0px) scale(1);
    }
    50% {
      filter: drop-shadow(0 0 16px rgba(255, 215, 0, 1)) drop-shadow(0 0 25px rgba(255, 69, 0, 0.9));
      transform: translateY(-4px) scale(1.02);
    }
    100% {
      filter: drop-shadow(0 0 6px rgba(255, 140, 0, 0.8)) drop-shadow(0 0 12px rgba(255, 69, 0, 0.6));
      transform: translateY(0px) scale(1);
    }
  }

  .meteor-responsive {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, filter 0.2s ease;
    animation: meteorSparkle 1.8s infinite ease-in-out;
  }

  .meteor-responsive:hover {
    transform: scale(1.08) translateY(-4px);
    filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.9)) !important;
  }

  .stat-badge-responsive {
    font-size: 1.15rem !important;
    padding: 5px 16px !important;
    position: absolute;
    z-index: 40;
  }

  .score-position { top: 16px; left: 20px; }
  .timer-position { top: 16px; right: 20px; }
  .timer-icon-responsive { width: 20px; height: 20px; }

  .header-container-responsive {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 35;
    background: rgba(15, 23, 42, 0.85);
    border: 2px solid #38bdf8;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
    border-radius: 20px;
    padding: 8px 24px;
    max-width: 90%;
  }

  .game-title-responsive {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 900;
    color: #ffffff;
    text-align: center;
    white-space: nowrap;
  }

  .grid-container-responsive {
    position: absolute;
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 50%;
    max-width: 580px;
    z-index: 20;
  }

  .meteor-text-responsive {
    font-size: 1.6rem;
    font-weight: 900;
    color: #ffffff !important;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
  }

  .controls-bottom-responsive {
    position: absolute;
    bottom: 2.5%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
    z-index: 40;
  }

  .win-card-responsive { 
    width: auto !important; 
    min-width: 200px !important;
    max-width: 85vw !important;
    padding: 12px 18px !important; 
    border-radius: 16px !important;
  }
  .trophy-icon-responsive { width: 36px !important; height: 36px !important; }
  .win-title-responsive { font-size: 0.95rem !important; margin: 4px 0 8px 0 !important; white-space: nowrap; }
  .win-stats-responsive { padding: 4px 10px !important; margin-bottom: 10px !important; }
  .win-stat-label-responsive { font-size: 0.85rem !important; }
  .star-icon-responsive { width: 16px !important; height: 16px !important; }
  .btn-icon-responsive { width: 18px !important; height: 18px !important; }
  .win-btn-responsive { padding: 6px !important; }

  /* 📱 للموبايل فقط (Smart Responsive) */
  @media (max-width: 600px) {
    .bg-desktop-tablet { display: none !important; }
    .bg-mobile-only { display: block !important; }

    .header-container-responsive {
      top: 6px !important;
      padding: 4px 12px !important;
      border-radius: 10px !important;
    }

    .game-title-responsive { 
      font-size: 1.0rem !important; 
    }

    /* ☄️ نزلنا الحجر تحت شوية على الموبايل */
    .grid-container-responsive {
      top: 20% !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 8px !important;
      width: 63% !important;
      max-width: 260px !important;
    }

    .meteor-text-responsive {
      font-size: 1.3rem !important;
      font-weight: 900 !important;
      color: #ffffff !important;
    }

    .controls-bottom-responsive {
      bottom: 1.5% !important;
      gap: 10px !important;
    }

    /* 🔘 كبرنا الأزرار 1 بكسل على الموبايل */
    .control-btn-responsive {
      padding: 7px !important; 
    }

    .ctrl-icon-responsive {
      width: 20px !important;
      height: 20px !important;
    }

    /* 🌟 كبرنا النقاط والوقت 1 بكسل على الموبايل */
    .stat-badge-responsive {
      font-size: 0.83rem !important;
      padding: 4px 10px !important;
    }
    .timer-icon-responsive { width: 18px; height: 18px; }

    .score-position { top: 10px; left: 10px; }
    .timer-position { top: 10px; right: 10px; }
  }

  /* 💻📱 للشاشات المتوسطة والتابلت (Tablet Smart Responsive) */
  @media (min-width: 601px) and (max-width: 1024px) {
    .header-container-responsive {
      top: 15px !important;
      padding: 6px 20px !important;
    }

    .game-title-responsive {
      font-size: 1.25rem !important;
    }

    /* ☄️ نزلنا الحجر في المنتصف وكبرنا حجمه قليلاً على التابلت */
    .grid-container-responsive {
      top: 22% !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 14px !important;
      width: 62% !important;
      max-width: 480px !important;
    }

    .meteor-text-responsive {
      font-size: 1.8rem !important;
    }

    /* 🌟 كبرنا النقاط والوقت على التابلت */
    .stat-badge-responsive {
      font-size: 1.05rem !important;
      padding: 6px 14px !important;
    }
    .timer-icon-responsive { width: 22px; height: 22px; }

    /* 🔘 كبرنا الأزرار قليلاً على التابلت */
    .controls-bottom-responsive {
      bottom: 2% !important;
      gap: 18px !important;
    }

    .control-btn-responsive {
      padding: 12px !important;
    }

    .ctrl-icon-responsive {
      width: 24px !important;
      height: 24px !important;
    }
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
    backgroundColor: "#030712",
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
  gameTitle: {},
  gridContainer: {},
  meteorWrapper: {
    width: "100%",
    height: "auto",
  },
  meteorImg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  meteorText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    whiteSpace: "nowrap",
    pointerEvents: "none",
  },
  scoreBadge: {
    background: "rgba(15, 23, 42, 0.85)",
    borderRadius: "20px",
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
    borderRadius: "20px",
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
    top: "16%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 60,
    borderRadius: "16px",
    fontWeight: "bold",
    color: "#fff",
    padding: "6px 22px",
    fontSize: "1.2rem",
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
    width: "70%",
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
    padding: "10px",
  },
};