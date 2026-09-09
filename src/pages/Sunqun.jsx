// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور ===
import moonKingdomBg from "../assets/moonKingdomBg3.jpeg"; 
import moonKingdomBgMobile from "../assets/moonKingdomBgMobile7.png"; 
import cloudImg from "../assets/cloud8.png";
import boyImg from "../assets/boy9.png";
import rockPlatformImg from "../assets/rockPlatform.png";

// === 2. مصفوفة الكلمات ===
const WORDS_DATA = [
  { id: 1, word: "الْـكِـتَـابُ", isMoon: true },
  { id: 2, word: "الصًّبْرُ", isMoon: false },
  { id: 3, word: "الـسَّـيَّـارَةُ", isMoon: false },
  { id: 4, word: "الْبَابُ", isMoon: true },
  { id: 5, word: "الْبَيْتُ", isMoon: true },
  { id: 6, word: "الـشَّـمْـسُ", isMoon: false },
];

export default function MoonKingdomGame() {
  const navigate = useNavigate();

  // ☁️ إحداثيات السحب (للاب توب والتابلت)
  const cloudsPositions = [
    { id: 1, left: 28, top: 38 },
    { id: 2, left: 52, top: 38 },
    { id: 3, left: 26, top: 56 },
    { id: 4, left: 54, top: 56 },
    { id: 5, left: 22, top: 74 },
    { id: 6, left: 56, top: 74 },
  ];

  // 🪨 موقع الحجر والبداية (تم النزول بهم قليلاً لتحت)
  const ROCK_POSITION = { left: 2, top: 66 };
  const BOY_START_POSITION = { left: 3.2, top: 60.5 }; 

  // 🏰 إعدادات دخول القصر
  const CASTLE_CONFIG = {
    desktop: { left: 75, top: 40 },
    mobile: { left: 65, top: 22 },
  };

  const DELAY_BEFORE_CASTLE_JUMP = 600; 
  const CASTLE_ANIMATION_DURATION = 650; 

  const totalMoonWords = WORDS_DATA.filter((w) => w.isMoon).length;

  const [boyPos, setBoyPos] = useState(BOY_START_POSITION);
  const [visitedClouds, setVisitedClouds] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isJumping, setIsJumping] = useState(false);

  const audioCtxRef = useRef(null);

  // ⏱️ العداد الزمني
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
      console.warn("AudioContext not supported", e);
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
      console.warn("Sound error:", e);
    }
  };

  const speakWord = (text) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanWord = text.replace(/[\u064B-\u0652]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  const handleCloudClick = (item, pos) => {
    if (isGameOver || isJumping) return;

    speakWord(item.word);
    setIsJumping(true);

    // 🎯 النط والوقوف فوق السحابة مباشرة
    const targetBoyPos = { left: pos.left + 1, top: pos.top - 12 };

    if (item.isMoon) {
      setBoyPos(targetBoyPos);
      playSound("success");

      let newVisited = visitedClouds;
      if (!visitedClouds.includes(item.id)) {
        newVisited = [...visitedClouds, item.id];
        setVisitedClouds(newVisited);
        setScore((prev) => prev + 10);
      }

      setMessage({ text: "إجابة صحيحة (لام قمرية) 🌙", type: "success" });

      if (newVisited.length === totalMoonWords) {
        setTimeout(() => {
          setIsJumping(true);
          const isMobile = window.innerWidth <= 640;
          const targetCastlePos = isMobile ? CASTLE_CONFIG.mobile : CASTLE_CONFIG.desktop;

          setBoyPos(targetCastlePos);

          setTimeout(() => {
            setIsGameOver(true);
            setIsJumping(false);
            triggerConfetti();
          }, CASTLE_ANIMATION_DURATION);
        }, DELAY_BEFORE_CASTLE_JUMP);
      } else {
        setTimeout(() => setIsJumping(false), 500);
      }
    } else {
      setBoyPos(targetBoyPos);
      playSound("error");
      setMessage({ text: "هذه لام شمسية ☀️ عدت للموقع الأصلي", type: "error" });

      setTimeout(() => {
        setBoyPos(BOY_START_POSITION);
        setIsJumping(false);
      }, 750);
    }

    setTimeout(() => setMessage({ text: "", type: "" }), 2000);
  };

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  const startNewGame = () => {
    setBoyPos(BOY_START_POSITION);
    setVisitedClouds([]);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
    setIsJumping(false);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🖼️ خلفيات اللعبة */}
      <img src={moonKingdomBg} alt="خلفية اللعبة" style={styles.bgImg} className="bg-desktop" />
      <img src={moonKingdomBgMobile} alt="خلفية اللعبة موبايل" style={styles.bgImgMobile} className="bg-mobile" />

      {/* العنوان والفقرة */}
      <div style={styles.headerAreaWrapper} className="header-area-responsive">
        <div style={styles.titleCard} className="title-card-responsive">
          <h1 style={styles.mainTitle} className="title-responsive">مملكة القمر</h1>
        </div>
        <div style={styles.subtitleCard} className="subtitle-card-responsive">
          <h2 style={styles.highlightTitle} className="highlight-responsive">اقفز على سحب اللام القمرية للوصول للقصر 🏰</h2>
        </div>
      </div>

      {/* 🌟 النقاط والوقت (تم تصغير البادج بكسلات قليلاً) */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score} 
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive timer-position">
        <Clock size={18} color="#0284c7" /> {timer} 
      </div>

      {/* 🪨 حجر البداية (منزل لأسفل) */}
      <div
        style={{
          position: "absolute",
          left: `${ROCK_POSITION.left}%`,
          top: `${ROCK_POSITION.top}%`,
          zIndex: 10,
        }}
        className="rock-platform-responsive"
      >
        <img src={rockPlatformImg} alt="منصة الحجر" style={styles.fullImg} />
      </div>

      {/* 👦 الولد (منزل لأسفل مع الصخرة) */}
      <div
        style={{
          position: "absolute",
          left: `${boyPos.left}%`,
          top: `${boyPos.top}%`,
          transition: "all 0.65s cubic-bezier(0.25, 1, 0.5, 1)",
          zIndex: 25,
        }}
        className={`boy-character-responsive ${isJumping ? "jump-animation" : ""}`}
      >
        <img src={boyImg} alt="الولد" style={styles.fullImg} />
      </div>

      {/* ☁️ السحب */}
      <div style={styles.gameArea}>
        {WORDS_DATA.map((item, index) => {
          const pos = cloudsPositions[index];

          return (
            <div
              key={item.id}
              onClick={() => handleCloudClick(item, pos)}
              style={{
                position: "absolute",
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                cursor: "pointer",
                opacity: 1,
              }}
              className={`cloud-item-responsive cloud-mobile-pos-${index}`}
            >
              <img src={cloudImg} alt="سحابة" style={styles.fullImg} />
              <div style={styles.wordOnCloud} className="word-on-cloud-responsive">
                {item.word}
              </div>
            </div>
          );
        })}
      </div>

      {/* الرسائل التوضيحية */}
      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }} className="feedback-responsive">
          {message.text}
        </div>
      )}

      {/* 🏆 شاشة الفوز (تم تصغيرها بذكاء) */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winCard} className="win-card-responsive">
            <div style={styles.trophyWrapper}>
              <Trophy className="trophy-icon-responsive" color="#FFD700" />
            </div>
            <h2 style={styles.winTitle} className="win-title-responsive">
              أحسنت يا بطل🎉
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
              <button onClick={() => navigate(-1)} style={styles.winIconBtn} className="win-btn-responsive" title="رجوع">
                <ArrowRight className="btn-icon-responsive" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* أزرار التحكم السفلى */}
      <div style={styles.controlsBarCenter} className="controls-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="control-btn-responsive" title="الصوت">
          {soundEnabled ? <Volume2 className="ctrl-icon-responsive" /> : <VolumeX className="ctrl-icon-responsive" />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} className="control-btn-responsive" title="إعادة اللعب">
          <RotateCcw className="ctrl-icon-responsive" />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="control-btn-responsive" title="الصفحة الرئيسية">
          <Home className="ctrl-icon-responsive" />
        </button>
        <button onClick={() => navigate(-1)} style={styles.iconBtn} className="control-btn-responsive" title="رجوع">
          <ArrowRight className="ctrl-icon-responsive" />
        </button>
      </div>
    </div>
  );
}

const responsiveCSS = `
  @keyframes jumpArc {
    0% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-35px) scale(1.1); }
    100% { transform: translateY(0) scale(1); }
  }

  .jump-animation {
    animation: jumpArc 0.65s ease-in-out;
  }

  .rock-platform-responsive { width: 230px; }
  .boy-character-responsive { width: 115px; }

  .cloud-item-responsive {
    width: 170px;
    transition: transform 0.15s ease;
  }
  .cloud-item-responsive:active { transform: scale(0.93); }

  .word-on-cloud-responsive { font-size: 1.55rem !important; }

  /* 🌟 تصغير بادجات الوقت والنقاط بمقدار بكسل */
  .stat-badge-responsive {
    font-size: 1.05rem !important;
    padding: 5px 14px !important;
    border-width: 2.5px !important;
    position: absolute;
    z-index: 30;
  }

  .score-position { top: 16px; left: 20px; }
  .timer-position { top: 16px; right: 20px; }

  /* 🏆 تصغير كارت الفوز أكثر ليكون سمارت ومناسب */
  .win-card-responsive { width: 230px !important; padding: 12px 16px !important; }
  .trophy-icon-responsive { width: 42px; height: 42px; }
  .win-title-responsive { font-size: 1.15rem !important; margin: 4px 0 8px 0 !important; }
  .win-stats-responsive { padding: 6px 10px !important; margin-bottom: 10px !important; }
  .win-stat-label-responsive { font-size: 0.95rem !important; }
  .star-icon-responsive { width: 17px; height: 17px; }
  .btn-icon-responsive { width: 18px; height: 18px; }
  .win-btn-responsive { padding: 7px !important; }

  .control-btn-responsive { padding: 8px !important; border-width: 2px !important; }
  .ctrl-icon-responsive { width: 21px; height: 21px; }

  .bg-mobile { display: none; }

  @media (max-width: 1024px) {
    .rock-platform-responsive { width: 180px; }
    .boy-character-responsive { width: 100px; }
    .cloud-item-responsive { width: 135px; }
    .word-on-cloud-responsive { font-size: 1.25rem !important; }
    .stat-badge-responsive { font-size: 0.95rem !important; padding: 4px 11px !important; }
  }

  @media (max-width: 640px) {
    .bg-desktop { display: none !important; }
    .bg-mobile { display: block !important; }

    .header-area-responsive { top: 6px !important; }
    .title-card-responsive { padding: 4px 16px !important; }
    .subtitle-card-responsive { padding: 4px 14px !important; margin-top: 4px !important; }
    .title-responsive { font-size: 1rem !important; }
    .highlight-responsive { font-size: 0.95rem !important; }

    .rock-platform-responsive { width: 155px !important; }
    .boy-character-responsive { width: 92px !important; }
    .cloud-item-responsive { width: 130px !important; }
    .word-on-cloud-responsive { font-size: 1.25rem !important; }

    .cloud-mobile-pos-0 { left: 24% !important; top: 40% !important; }
    .cloud-mobile-pos-1 { left: 62% !important; top: 40% !important; }
    .cloud-mobile-pos-2 { left: 22% !important; top: 56% !important; }
    .cloud-mobile-pos-3 { left: 62% !important; top: 56% !important; }
    .cloud-mobile-pos-4 { left: 22% !important; top: 72% !important; }
    .cloud-mobile-pos-5 { left: 62% !important; top: 72% !important; }

    .score-position { top: 12px; left: 12px; }
    .timer-position { top: 12px; right: 12px; }

    .feedback-responsive { font-size: 1.1rem !important; padding: 10px 18px !important; }

    .win-card-responsive { width: 190px !important; padding: 10px 12px !important; border-width: 3px !important; }
    .trophy-icon-responsive { width: 34px; height: 34px; }
    .win-title-responsive { font-size: 1.05rem !important; }
    .win-stat-label-responsive { font-size: 0.85rem !important; }
    .star-icon-responsive { width: 15px; height: 15px; }
    .btn-icon-responsive { width: 16px; height: 16px; }

    .control-btn-responsive { padding: 7px !important; }
    .ctrl-icon-responsive { width: 22px; height: 22px; }
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
    backgroundColor: "#1a103c",
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
  bgImgMobile: {
    width: "100%",
    height: "100%",
    objectFit: "cover", 
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  fullImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    pointerEvents: "none",
  },
  gameArea: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 15,
  },
  headerAreaWrapper: {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  titleCard: {
    backgroundColor: "rgba(75, 41, 125, 0.95)",
    padding: "6px 25px",
    borderRadius: "16px",
    border: "3px solid #f2ab27",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
    textAlign: "center",
  },
  subtitleCard: {
    backgroundColor: "rgba(30, 27, 75, 0.9)",
    padding: "6px 15px",
    borderRadius: "14px",
    border: "2px solid #a855f7",
    marginTop: "6px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  mainTitle: { margin: 0, color: "#ffffff", fontSize: "1.2rem", fontWeight: "700" },
  highlightTitle: { margin: 0, color: "#ffe082", fontSize: "1.3rem", fontWeight: "800" },
  scoreBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "bold",
    color: "#f57c00",
    border: "2.5px solid #f57c00",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
  },
  timerBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "bold",
    color: "#0284c7",
    border: "2.5px solid #0284c7",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
  },
  wordOnCloud: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "900",
    color: "#1e1b4b",
    fontFamily: "'Cairo', sans-serif",
    textAlign: "center",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  },
  feedbackMessage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 60,
    borderRadius: "20px",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
  },
  success: { backgroundColor: "#2e7d32" },
  error: { backgroundColor: "#c62828" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.72)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winCard: {
    background: "#ffffff",
    border: "3.5px solid #6b21a8",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trophyWrapper: { marginBottom: "2px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" },
  winTitle: { color: "#4c1d95", fontWeight: "800" },
  winStatsBox: {
    background: "#f3e8ff",
    borderRadius: "10px",
    border: "1.5px solid #d8b4fe",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    width: "100%",
    boxSizing: "border-box",
  },
  winStatLabel: { display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", color: "#581c87" },
  winActionButtons: { display: "flex", justifyContent: "center", gap: "10px" },
  winIconBtn: {
    background: "#ffffff",
    border: "2px solid #6b21a8",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#6b21a8",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsBarCenter: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "14px",
    zIndex: 40,
  },
  iconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#6b21a8",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};