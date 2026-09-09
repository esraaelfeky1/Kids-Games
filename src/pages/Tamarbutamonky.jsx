
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور الخاصة بكِ ===
import jungleBgImg from "../assets/junglebg1.jpeg";     // خلفية التابلت واللاب توب
import jungleBgMobileImg from "../assets/junglebgmobile.jpeg"; // 📱 خلفية الموبايل
import rockImg from "../assets/stone.png";            
import monkeyImg from "../assets/monkey.png";          
import bananaImg from "../assets/banana.png";          

// =========================================================================
// 🎛️ ⚙️ إعدادات التحكم الذكية (تعمل كنسب مئوية لضمان التجاوب الذكي)
// =========================================================================
const CONFIG = {
  monkeyStart: { left: "8%", bottom: "35%" },
  bananaPos: { right: "4%", bottom: "36%" },
  topRowY: "64%",    
  bottomRowY: "78%", 
};

// === 2. مراحل الجسر ===
const bridgeStages = [
  {
    stage: 1,
    leftPos: "22%",
    optionA: { id: "1a", word: "شجره", hasTaMarbuta: true, topPos: CONFIG.topRowY },
    optionB: { id: "1b", word: "بيت", hasTaMarbuta: false, topPos: CONFIG.bottomRowY },
  },
  {
    stage: 2,
    leftPos: "40%",
    optionA: { id: "2a", word: "بنات", hasTaMarbuta: false, topPos: CONFIG.topRowY },
    optionB: { id: "2b", word: "كره", hasTaMarbuta: true, topPos: CONFIG.bottomRowY },
  },
  {
    stage: 3,
    leftPos: "58%",
    optionA: { id: "3a", word: "مدرسه", hasTaMarbuta: true, topPos: CONFIG.topRowY },
    optionB: { id: "3b", word: "صوت", hasTaMarbuta: false, topPos: CONFIG.bottomRowY },
  },
  {
    stage: 4,
    leftPos: "76%",
    optionA: { id: "4a", word: "كتابات", hasTaMarbuta: false, topPos: CONFIG.topRowY },
    optionB: { id: "4b", word: "حقيبه", hasTaMarbuta: true, topPos: CONFIG.bottomRowY },
  },
];

export default function MonkeyGame() {
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState(0); 
  const [monkeyPos, setMonkeyPos] = useState(CONFIG.monkeyStart);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);

  const audioCtxRef = useRef(null);

  // تشغيل المؤقت
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

  const startNewGame = () => {
    setCurrentStage(0);
    setMonkeyPos(CONFIG.monkeyStart);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
  };

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  const handleRockClick = (stageIndex, option) => {
    if (isGameOver) return;
    if (stageIndex !== currentStage + 1) return;

    speakWord(option.word);

    const targetStageConfig = bridgeStages[stageIndex - 1];
    const topVal = parseFloat(option.topPos);
    const calculatedBottom = `${100 - topVal - 6}%`;

    setMonkeyPos({
      left: targetStageConfig.leftPos,
      bottom: calculatedBottom,
    });

    if (option.hasTaMarbuta) {
      playSound("success");
      setScore((prev) => prev + 10);
      setCurrentStage(stageIndex);

      if (stageIndex === bridgeStages.length) {
        setTimeout(() => {
          setMonkeyPos({ left: "85%", bottom: CONFIG.bananaPos.bottom });
          setTimeout(() => {
            setIsGameOver(true);
            triggerConfetti();
          }, 600);
        }, 600);
      }
    } else {
      playSound("error");
      setTimeout(() => {
        setCurrentStage(0);
        setMonkeyPos(CONFIG.monkeyStart);
      }, 700);
    }
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🌴 1. الصور الخلفية */}
      <img src={jungleBgImg} alt="خلفية النهر والغابة" style={styles.bgImg} className="bg-desktop" />
      <img src={jungleBgMobileImg} alt="خلفية الموبايل" style={styles.bgImg} className="bg-mobile" />

      {/* 👑 2. العنوان والتعليمات المختصرة */}
      <div style={styles.headerAreaWrapper} className="header-area-responsive">
        <h1 style={styles.mainTitle} className="title-responsive">
          اقفز مع ميمون🐒
        </h1>
        <p style={styles.instructionText} className="instruction-responsive">
          اختر الحجر الذي يحمل <strong>تاء مربوطة (ـة / ة)</strong> ليعبر القرد
        </p>
      </div>

      {/* ⭐ النقاط */}
      <div style={styles.topLeftBox} className="score-box-responsive">
        ⭐ {score}
      </div>

      {/* ⏱️ الوقت */}
      <div style={styles.topRightBox} className="time-box-responsive">
        <Clock size={16} style={{ marginLeft: "4px" }} /> {timer} 
      </div>

      {/* 🍌 3. الموز المضيء */}
      <div 
        style={{
          ...styles.bananaWrapper,
          right: CONFIG.bananaPos.right,
          bottom: CONFIG.bananaPos.bottom
        }} 
        className="banana-responsive glowing-banana"
      >
        <img src={bananaImg} alt="الموز المضيء" style={styles.fullImg} />
      </div>

      {/* 🪨 4. جسر الأحجار عبر النهر */}
      <div style={styles.riverPathContainer}>
        <div 
          style={{
            ...styles.monkeyWrapper,
            left: monkeyPos.left,
            bottom: monkeyPos.bottom,
          }} 
          className="monkey-responsive"
        >
          <img src={monkeyImg} alt="القرد" style={styles.fullImg} />
        </div>

        {bridgeStages.map((stg) => {
          const isCurrentTargetStage = stg.stage === currentStage + 1;

          return (
            <React.Fragment key={stg.stage}>
              {/* الصف العلوي */}
              <div
                onClick={() => handleRockClick(stg.stage, stg.optionA)}
                style={{
                  ...styles.rockWrapper,
                  left: stg.leftPos,
                  top: stg.optionA.topPos,
                  cursor: isCurrentTargetStage ? "pointer" : "default",
                  filter: isCurrentTargetStage ? "drop-shadow(0 0 12px #ffee58)" : "none",
                }}
                className="rock-item-responsive rock-top-row"
              >
                <img src={rockImg} alt="حجر" style={styles.fullImg} />
                <div style={styles.wordBoxOnRock} className="word-box-responsive">
                  <span style={styles.rockText} className="rock-text-responsive">{stg.optionA.word}</span>
                </div>
              </div>

              {/* الصف السفلي */}
              <div
                onClick={() => handleRockClick(stg.stage, stg.optionB)}
                style={{
                  ...styles.rockWrapper,
                  left: stg.leftPos,
                  top: stg.optionB.topPos,
                  cursor: isCurrentTargetStage ? "pointer" : "default",
                  filter: isCurrentTargetStage ? "drop-shadow(0 0 12px #ffee58)" : "none",
                }}
                className="rock-item-responsive rock-bottom-row"
              >
                <img src={rockImg} alt="حجر" style={styles.fullImg} />
                <div style={styles.wordBoxOnRock} className="word-box-responsive">
                  <span style={styles.rockText} className="rock-text-responsive">{stg.optionB.word}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 🔘 5. أزرار التحكم السفلية */}
      <div style={styles.controlsBarCenter} className="controls-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="control-btn-mobile" title="الصوت">
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} className="control-btn-mobile" title="إعادة اللعب">
          <RotateCcw size={20} />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="control-btn-mobile" title="الصفحة الرئيسية">
          <Home size={20} />
        </button>
        <button onClick={() => navigate(-1)} style={styles.iconBtn} className="control-btn-mobile" title="رجوع للخلف">
          <ArrowRight size={20} />
        </button>
      </div>

      {/* 🏆 شاشة الفوز (تم تكبير الخطوط والعناصر الداخلية قليلاً لتصبح أوضح) */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winBox}>
            <Trophy size={42} color="#FFD700" style={{ marginBottom: 3 }} />
            <h2 style={{ color: "#2e7d32", marginBottom: 6, fontSize: "1.3rem", marginTop: 0, fontWeight: "bold" }}>
              🎉 أحسنت يا بطل 🎉
            </h2>
            <div style={styles.finalStats}>
              <p style={{ fontSize: "1rem", margin: "0" }}>
                النتيجة: <strong>{score}</strong>
              </p>
            </div>
            <div style={styles.winActionButtons}>
              <button onClick={startNewGame} style={styles.smallIconBtn} title="إعادة المحاولة">
                <RotateCcw size={20} />
              </button>
              <button onClick={() => navigate(-1)} style={styles.smallIconBtn} title="رجوع للخلف">
                <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate("/home")} style={styles.smallIconBtn} title="الصفحة الرئيسية">
                <Home size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === CSS التجاوب الذكي (Smart Responsive) المطور لكل الشاشات ===
const responsiveCSS = `
  .bg-desktop { display: block; }
  .bg-mobile { display: none; }

  @keyframes bananaGlow {
    0% {
      filter: drop-shadow(0 0 12px #ffea00) drop-shadow(0 0 25px #ffab00);
      transform: scale(1);
    }
    50% {
      filter: drop-shadow(0 0 25px #ffff00) drop-shadow(0 0 45px #ff6d00);
      transform: scale(1.06);
    }
    100% {
      filter: drop-shadow(0 0 12px #ffea00) drop-shadow(0 0 25px #ffab00);
      transform: scale(1);
    }
  }

  .glowing-banana {
    animation: bananaGlow 2.2s infinite ease-in-out;
  }

  /* 📱 ميديا كويري متكامل لجميع أحجام الموبايل والشاشات الصغيرة */
  @media (max-width: 640px) {
    .bg-desktop { display: none !important; }
    .bg-mobile { display: block !important; }

    .header-area-responsive { top: 4px !important; }
    .title-responsive { font-size: 1.05rem !important; padding: 3px 14px !important; }
    
    .instruction-responsive { 
      font-size: 0.85rem !important; 
      padding: 3px 12px !important; 
      max-width: 90% !important;
    }
    
    .banana-responsive { width: 75px !important; }
    
    .monkey-responsive { 
      width: 85px !important; 
      z-index: 40 !important;
      transform: translate(-50%, 0) !important;
    }
    
    .rock-item-responsive { 
      width: 95px !important; 
      height: 60px !important; 
    }

    .rock-top-row { top: 67% !important; }
    .rock-bottom-row { top: 81% !important; }

    .rock-text-responsive { font-size: 1.15rem !important; }

    .control-btn-mobile {
      padding: 8px !important;
    }
  }
`;

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "hidden",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    backgroundColor: "#1b5e20",
    userSelect: "none",
    touchAction: "none",
    boxSizing: "border-box",
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
  fullImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    pointerEvents: "none",
  },
  headerAreaWrapper: {
    position: "absolute",
    top: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  mainTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "1.6rem",
    fontWeight: "900",
    backgroundColor: "rgba(139, 90, 43, 0.92)",
    padding: "4px 20px",
    borderRadius: "20px",
    border: "2.5px solid #ffecb3",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  instructionText: {
    margin: "4px 0 0 0",
    color: "#2b1704",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    padding: "3px 16px",
    borderRadius: "16px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
    border: "2px solid #8b5a2b",
    textAlign: "center",
  },
  topLeftBox: {
    position: "absolute",
    top: "12px",
    left: "12px",
    zIndex: 25,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "4px 10px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    color: "#4a2c11",
    border: "2px solid #8b5a2b",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
  },
  topRightBox: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 25,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "4px 10px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    color: "#4a2c11",
    border: "2px solid #8b5a2b",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
  },
  bananaWrapper: {
    position: "absolute",
    width: "105px",
    zIndex: 15,
  },
  riverPathContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  monkeyWrapper: {
    position: "absolute",
    width: "105px",
    zIndex: 30,
    transform: "translate(-50%, 0)",
    transition: "left 0.5s ease-in-out, bottom 0.5s ease-in-out",
  },
  rockWrapper: {
    position: "absolute",
    width: "115px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
    transition: "transform 0.2s ease, filter 0.3s ease",
  },
  wordBoxOnRock: {
    position: "absolute",
    backgroundColor: "#ffffff",
    border: "2px solid #b71c1c",
    borderRadius: "10px",
    padding: "1px 6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rockText: {
    color: "#b71c1c",
    fontSize: "1.3rem",
    fontWeight: "900",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
  },
  controlsBarCenter: {
    position: "absolute",
    bottom: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px",
    zIndex: 30,
  },
  iconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2px solid #8b5a2b",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#4a2c11",
    boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winBox: {
    background: "#fffde7",
    border: "3.5px solid #8b5a2b",
    padding: "13px 10px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    width: "fit-content",
    minWidth: "210px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  finalStats: {
    background: "#e8f5e9",
    padding: "4px 12px",
    borderRadius: "10px",
    marginBottom: "10px",
    color: "#1b5e20",
    border: "1px solid #c8e6c9",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  smallIconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2px solid #8b5a2b",
    padding: "9px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#4a2c11",
    boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};