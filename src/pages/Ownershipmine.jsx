// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور الخاصة بلعبة منجم ياء الملكية ===
import mineBg from "../assets/mineBg.jpeg"; 
import mineBgMobile from "../assets/mineBgMobile.jpeg"; 
import rockNormalImg from "../assets/rockNormal.png"; 
import gemImg from "../assets/gem.png"; 

import boyStandingImg from "../assets/boyMining.png"; 
import boyMiningImg from "../assets/boyStanding.png"; 

// === 2. مصفوفة الكلمات ===
const INITIAL_WORDS = [
  { id: 1, word: "كِتَابٌ", hasYaa: false },
  { id: 2, word: "كِتَابِي", hasYaa: true },
  { id: 3, word: "قَلَمٌ", hasYaa: false },
  { id: 4, word: "قَلَمِي", hasYaa: true },
  
  { id: 5, word: "بَيْتٌ", hasYaa: false },
  { id: 6, word: "بَيْتِي", hasYaa: true },
  { id: 7, word: "لُعْبَةٌ", hasYaa: false },
  { id: 8, word: "لُعْبَتِي", hasYaa: true },

  { id: 9, word: "كُرَةٌ", hasYaa: false },
  { id: 10, word: "كُرَتِي", hasYaa: true },
  { id: 11, word: "أُمِّي", hasYaa: true },
  { id: 12, word: "مَدْرَسَةٌ", hasYaa: false },
];

export default function YaaElMalkeyaGame() {
  const navigate = useNavigate();

  const totalTargetWords = INITIAL_WORDS.filter((w) => w.hasYaa).length;

  const [isMining, setIsMining] = useState(false);
  const [brokenRocks, setBrokenRocks] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  // موقع الولد الافتراضي (على اليسار)
  const [boyPosition, setBoyPosition] = useState({ left: "4%", top: "32%" });
  // eslint-disable-next-line no-unused-vars
  const [activeRockId, setActiveRockId] = useState(null);

  const audioCtxRef = useRef(null);

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

  const handleRockClick = (item, event) => {
    if (isGameOver || isProcessing || brokenRocks.includes(item.id)) return;

    speakWord(item.word);
    setIsProcessing(true);
    setActiveRockId(item.id);

    // 🎯 حساب موقع الحجر وتحديد الإزاحة حسب حجم الشاشة
    const rect = event.currentTarget.getBoundingClientRect();
    const parentRect = document.getElementById("game-container").getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    // زدنا الـ offsetX في الموبايل ليرجع الولد للخلف أكثر وتأتي ضربة الفأس على الصخرة تماماً
    const offsetX = isMobile ? 18 : 8; 
    const offsetY = isMobile ? 12 : 14;

    const targetLeft = ((rect.left + rect.width / 2 - parentRect.left) / parentRect.width) * 100 - offsetX;
    const targetTop = ((rect.top + rect.height / 2 - parentRect.top) / parentRect.height) * 100 - offsetY;

    setBoyPosition({ left: `${targetLeft}%`, top: `${targetTop}%` });
    setIsMining(true);

    if (item.hasYaa) {
      playSound("success");

      setTimeout(() => {
        let newBroken = [...brokenRocks, item.id];
        setBrokenRocks(newBroken);
        setScore((prev) => prev + 10);
        setMessage({ text: "رائع! ياء ملكية 💎", type: "success" });

        setTimeout(() => {
          setIsMining(false);
          setBoyPosition({ left: "4%", top: "32%" });
          setActiveRockId(null);

          if (newBroken.length === totalTargetWords) {
            setTimeout(() => {
              setIsGameOver(true);
              setIsProcessing(false);
              triggerConfetti();
            }, 500);
          } else {
            setIsProcessing(false);
          }
        }, 500);

      }, 600);
    } else {
      playSound("error");
      setMessage({ text: "لا تحتوي على ياء ملكية ❌", type: "error" });
      
      setTimeout(() => {
        setIsMining(false);
        setBoyPosition({ left: "4%", top: "32%" });
        setActiveRockId(null);
        setIsProcessing(false);
      }, 900);
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
    setBrokenRocks([]);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
    setIsProcessing(false);
    setIsMining(false);
    setBoyPosition({ left: "4%", top: "32%" });
    setActiveRockId(null);
  };

  return (
    <div id="game-container" style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🖼️ الخلفيات */}
      <img src={mineBg} alt="خلفية المنجم" style={styles.bgImg} className="bg-desktop" />
      <img src={mineBgMobile} alt="خلفية المنجم موبايل" style={styles.bgImgMobile} className="bg-mobile" />

      {/* 🏷️ الهيدر */}
      <div style={styles.headerAreaWrapper} className="header-area-responsive">
        <div style={styles.titleCard} className="title-card-responsive">
          <h1 style={styles.mainTitle} className="title-responsive">منجم ياء الملكية ⛏️</h1>
        </div>
        <div style={styles.subtitleCard} className="subtitle-card-responsive">
          <h2 style={styles.highlightTitle} className="highlight-responsive">
            اكسر الصخور التي تحتوي على ياء الملكية (ي) 💎
          </h2>
        </div>
      </div>

      {/* 🌟 الإحصائيات */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score} 
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive timer-position">
        <Clock size={20} color="#0284c7" /> {timer} 
      </div>

      {/* 👦 شخصية الولد */}
      <div 
        className="boy-dynamic-responsive"
        style={{
          left: boyPosition.left,
          top: boyPosition.top,
        }}
      >
        <img
          src={isMining ? boyMiningImg : boyStandingImg}
          alt="شخصية الولد"
          style={styles.fullImg}
        />
      </div>

      {/* 🪨 شبكة الصخور */}
      <div style={styles.gridContainer} className="mine-grid-responsive">
        {INITIAL_WORDS.map((item) => {
          const isBroken = brokenRocks.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={(e) => handleRockClick(item, e)}
              className="rock-item-responsive"
              style={styles.rockBox}
            >
              {isBroken ? (
                <div style={styles.gemWrapper} className="gem-appear-anim">
                  <img src={gemImg} alt="جوهرة" style={styles.fullImg} />
                  <span style={styles.wordOnGem}>{item.word}</span>
                </div>
              ) : (
                <div style={styles.rockWrapper}>
                  <img src={rockNormalImg} alt="صخرة" style={styles.fullImg} />
                  <span style={styles.wordOnRock}>{item.word}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 💬 الرسائل */}
      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }} className="feedback-responsive">
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
              ألف مبروك يا بطل 🎉
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

      {/* 🔘 الأزرار السفلى */}
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

// === 🎨 CSS التجاوب والتنسيقات ===
const responsiveCSS = `
  @keyframes gemPop {
    0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
    70% { transform: scale(1.15) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0); }
  }

  .gem-appear-anim {
    animation: gemPop 0.4s ease-out forwards;
  }

  .boy-dynamic-responsive {
    position: absolute;
    width: 160px;
    z-index: 35;
    pointer-events: none;
    transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .mine-grid-responsive {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    width: 52%;
    max-width: 600px;
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
  }

  .rock-item-responsive {
    position: relative;
    cursor: pointer;
    max-width: 110px;
    margin: 0 auto;
    transition: transform 0.15s ease;
  }
  .rock-item-responsive:hover {
    transform: scale(1.06);
  }

  .stat-badge-responsive {
    font-size: 1.1rem !important;
    padding: 6px 16px !important;
    position: absolute;
    z-index: 40;
  }

  .score-position { top: 16px; left: 20px; }
  .timer-position { top: 16px; right: 20px; }

  .win-card-responsive { width: 270px !important; padding: 18px 22px !important; }
  .trophy-icon-responsive { width: 50px; height: 50px; }
  .win-title-responsive { font-size: 1.35rem !important; margin: 6px 0 10px 0 !important; }
  .win-stats-responsive { padding: 8px 14px !important; margin-bottom: 12px !important; }
  .win-stat-label-responsive { font-size: 1.05rem !important; }
  .star-icon-responsive { width: 20px; height: 20px; }
  .btn-icon-responsive { width: 22px; height: 22px; }
  .win-btn-responsive { padding: 9px !important; }

  .control-btn-responsive { padding: 9px !important; border-width: 2.5px !important; }
  .ctrl-icon-responsive { width: 28px; height: 28px; }

  .bg-mobile { display: none; }

  @media (max-width: 768px) {
    .bg-desktop { display: none !important; }
    .bg-mobile { display: block !important; }

    /* تقليل حجم الولد في الموبايل لتناسب الضربات */
    .boy-dynamic-responsive {
      width: 130px !important;
    }

    .mine-grid-responsive {
      width: 75% !important;
      gap: 6px !important;
      bottom: 15% !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
    }

    .header-area-responsive { top: 6px !important; }
    .title-card-responsive { padding: 4px 14px !important; }
    .subtitle-card-responsive { padding: 4px 10px !important; margin-top: 3px !important; }
    .title-responsive { font-size: 0.95rem !important; }
    .highlight-responsive { font-size: 0.82rem !important; }

    .score-position { top: 10px; left: 10px; }
    .timer-position { top: 10px; right: 10px; }

    .win-card-responsive { width: 235px !important; padding: 14px 16px !important; }
    .trophy-icon-responsive { width: 40px; height: 40px; }
    .win-title-responsive { font-size: 1.15rem !important; }
    .win-stat-label-responsive { font-size: 0.95rem !important; }

    .control-btn-responsive { padding: 8px !important; }
    .ctrl-icon-responsive { width: 28px; height: 28px; }
  }
`;

// === 🎨 الـ Styles ===
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    backgroundColor: "#1c120c",
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
    backgroundColor: "rgba(101, 52, 24, 0.95)",
    padding: "6px 28px",
    borderRadius: "16px",
    border: "3px solid #f2ab27",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
  },
  subtitleCard: {
    backgroundColor: "rgba(45, 24, 16, 0.9)",
    padding: "6px 20px",
    borderRadius: "14px",
    border: "2px solid #f59e0b",
    marginTop: "6px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
    textAlign: "center",
  },
  mainTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  highlightTitle: {
    margin: 0,
    color: "#ffe082",
    fontSize: "1.2rem",
    fontWeight: "800",
  },
  scoreBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    color: "#f57c00",
    border: "3px solid #f57c00",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  timerBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    color: "#0284c7",
    border: "3px solid #0284c7",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  rockBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  rockWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  gemWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  wordOnRock: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "900",
    color: "#ffffff",
    fontSize: "1.25rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  },
  wordOnGem: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "900",
    color: "#ffffff",
    fontSize: "1.15rem",
    textShadow: "2px 2px 5px rgba(0,0,0,0.9)",
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
    padding: "10px 24px",
    fontSize: "1.2rem",
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
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winCard: {
    background: "#ffffff",
    border: "4.5px solid #b45309",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trophyWrapper: {
    marginBottom: "3px",
    filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))",
  },
  winTitle: {
    color: "#78350f",
    fontWeight: "800",
  },
  winStatsBox: {
    background: "#fef3c7",
    borderRadius: "14px",
    border: "2px solid #fde68a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    width: "100%",
    boxSizing: "border-box",
  },
  winStatLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "bold",
    color: "#92400e",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  winIconBtn: {
    background: "#ffffff",
    border: "2.5px solid #b45309",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#b45309",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsBarCenter: {
    position: "absolute",
    bottom: "16px",
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
    color: "#b45309",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};