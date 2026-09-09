

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import mountainBgImg from "../assets/mountainbg.jpeg";       // خلفية اللاب والتابلت
import mountainBgMobileImg from "../assets/hhk.jpeg"; // خلفية الموبايل
import boyStandingImg from "../assets/boyclimbing.png";      // صورة الولد وهو بيتسلق
import boySuccessImg from "../assets/boysuccess.png";        // صورة الولد عند النجاح

const CONFIG = {
  boyStartPosDesktop: { left: "18%", top: "75%" },
  boyStartPosMobile: { left: "22%", top: "75%" },
  
  boySizeDesktop: "125px",
  boySizeMobile: "93px", // حجم الولد بعد التصغير للموبايل
};

// ==========================================
// 🛠️ تحكم في أماكن الكلمات للاب توب والتابلت من هنا مباشرة
// ==========================================
const stagesDesktop = [
  {
    stage: 1, 
    optionA: { id: "1a_d", word: "حَقِيقَة", hasTaMarbuta: true, leftPos: "54%", topPos: "68%" }, 
    optionB: { id: "1b_d", word: "حَقِيقَت", hasTaMarbuta: false, leftPos: "74%", topPos: "70%" }, 
  },
  {
    stage: 2, 
    optionA: { id: "2a_d", word: "بَطَّت", hasTaMarbuta: false, leftPos: "55%", topPos: "50%" }, 
    optionB: { id: "2b_d", word: "بَطَّة", hasTaMarbuta: true, leftPos: "74%", topPos: "55%" }, 
  },
  {
    stage: 3, 
    optionA: { id: "3a_d", word: "شَجَرَة", hasTaMarbuta: true, leftPos: "57%", topPos: "33%" }, 
    optionB: { id: "3b_d", word: "شَجَرَت", hasTaMarbuta: false, leftPos: "74%", topPos: "40%" }, 
  },
  {
    stage: 4, 
    optionB: { id: "4b_d", word: "كُرَة", hasTaMarbuta: true, leftPos: "72%", topPos: "28%" }, 
  },
  {
    stage: 5, 
    optionA: { id: "5a_d", word: "مَدْرَسَة", hasTaMarbuta: true, leftPos: "65%", topPos: "18%" }, 
  },
];

// === مراحل الموبايل ===
const stagesMobile = [
  {
    stage: 1, 
    optionA: { id: "1a_m", word: "بَطَّت", hasTaMarbuta: false, leftPos: "44%", topPos: "63%" },
    optionB: { id: "1b_m", word: "بَطَّة", hasTaMarbuta: true, leftPos: "68%", topPos: "65%" },
  },
  {
    stage: 2, 
    optionA: { id: "2a_m", word: "شَجَرَة", hasTaMarbuta: true, leftPos: "45%", topPos: "51%" },
    optionB: { id: "2b_m", word: "شَجَرَت", hasTaMarbuta: false, leftPos: "67%", topPos: "53%" },
  },
  {
    stage: 3, 
    optionA: { id: "3a_m", word: "كُرَت", hasTaMarbuta: false, leftPos: "47%", topPos: "39%" },
    optionB: { id: "3b_m", word: "كُرَة", hasTaMarbuta: true, leftPos: "66%", topPos: "41%" },
  },
  {
    stage: 4, 
    optionA: { id: "4a_m", word: "مَدْرَسَة", hasTaMarbuta: true, leftPos: "57%", topPos: "28%" },
  },
];

export default function MountainClimberGame() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [currentStage, setCurrentStage] = useState(0); 
  const [boyPos, setBoyPos] = useState(
    window.innerWidth <= 640 ? CONFIG.boyStartPosMobile : CONFIG.boyStartPosDesktop
  );
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);

  const audioCtxRef = useRef(null);

  const activeStages = isMobile ? stagesMobile : stagesDesktop;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setBoyPos(isMobile ? CONFIG.boyStartPosMobile : CONFIG.boyStartPosDesktop);
    setIsSuccessState(false);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
  };

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
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

  const handleStepClick = (stageIndex, option) => {
    if (isGameOver) return;
    if (stageIndex !== currentStage + 1) return;

    speakWord(option.word);

    if (option.hasTaMarbuta) {
      playSound("success");
      setScore((prev) => prev + 10);
      setCurrentStage(stageIndex);
      
      setBoyPos({
        left: option.leftPos,
        top: option.topPos,
      });

      if (stageIndex === activeStages.length) {
        setTimeout(() => {
          setIsSuccessState(true);
          triggerConfetti();
          setTimeout(() => {
            setIsGameOver(true);
          }, 800);
        }, 500);
      }
    } else {
      playSound("error");
      setTimeout(() => {
        setCurrentStage(0);
        setBoyPos(isMobile ? CONFIG.boyStartPosMobile : CONFIG.boyStartPosDesktop);
      }, 600);
    }
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفيات الجبل */}
      <img src={mountainBgImg} alt="خلفية الجبل" style={styles.bgImg} className="bg-desktop" />
      <img src={mountainBgMobileImg} alt="خلفية الجبل للموبايل" style={styles.bgImg} className="bg-mobile" />

      {/* العنوان والفقرة */}
      <div style={styles.headerAreaWrapper} className="header-area-responsive">
        <h1 style={styles.mainTitle} className="title-responsive">
          مغامرة تسلق الجبل 
        </h1>
        <p style={styles.instructionText} className="instruction-responsive">
          اختر الكلمات التي تنتهي بـ <strong>(ـة / ة)</strong> للتسلق!
        </p>
      </div>

      {/* النقاط */}
      <div style={styles.topLeftBox} className="top-box-responsive">
        ⭐ {score}
      </div>

      {/* الوقت */}
      <div style={styles.topRightBox} className="top-box-responsive">
        <Clock className="clock-icon-responsive" style={{ marginLeft: "5px" }} /> {timer} ث
      </div>

      {/* الولد المتحرك */}
      <div
        style={{
          ...styles.boyWrapper,
          left: boyPos.left,
          top: boyPos.top,
        }}
        className="boy-responsive"
      >
        <img
          src={isSuccessState ? boySuccessImg : boyStandingImg}
          alt="الولد المتسلق"
          style={styles.fullImg}
        />
      </div>

      {/* الكلمات والخيارات */}
      <div style={styles.stepsContainer}>
        {activeStages.map((stg) => {
          const isCurrentTargetStage = stg.stage === currentStage + 1;

          return (
            <React.Fragment key={stg.stage}>
              {stg.optionA && (
                <div
                  onClick={() => handleStepClick(stg.stage, stg.optionA)}
                  style={{
                    ...styles.wordCard,
                    left: stg.optionA.leftPos,
                    top: stg.optionA.topPos,
                    cursor: isCurrentTargetStage ? "pointer" : "default",
                    filter: isCurrentTargetStage ? "drop-shadow(0 0 14px #ffe082)" : "none",
                  }}
                  className="word-card-responsive"
                >
                  <span>{stg.optionA.word}</span>
                </div>
              )}

              {stg.optionB && (
                <div
                  onClick={() => handleStepClick(stg.stage, stg.optionB)}
                  style={{
                    ...styles.wordCard,
                    left: stg.optionB.leftPos,
                    top: stg.optionB.topPos,
                    cursor: isCurrentTargetStage ? "pointer" : "default",
                    filter: isCurrentTargetStage ? "drop-shadow(0 0 14px #ffe082)" : "none",
                  }}
                  className="word-card-responsive"
                >
                  <span>{stg.optionB.word}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* أزرار التحكم */}
      <div style={styles.controlsBarCenter} className="controls-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="action-btn-responsive" title="الصوت">
          {soundEnabled ? <Volume2 className="btn-icon-responsive" /> : <VolumeX className="btn-icon-responsive" />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} className="action-btn-responsive" title="إعادة اللعب">
          <RotateCcw className="btn-icon-responsive" />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="action-btn-responsive" title="الصفحة الرئيسية">
          <Home className="btn-icon-responsive" />
        </button>
        <button onClick={() => navigate(-1)} style={styles.iconBtn} className="action-btn-responsive" title="رجوع للخلف">
          <ArrowRight className="btn-icon-responsive" />
        </button>
      </div>

      {/* شاشة الفوز */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winBox} className="win-box-responsive">
            <Trophy className="win-trophy-responsive" color="#FFD700" style={{ marginBottom: 4 }} />
            <h2 className="win-title-responsive" style={{ color: "#2e7d32", margin: "0 0 4px 0", fontWeight: "bold" }}>
              🎉 أحسنت يا بطل 🎉
            </h2>
            <div style={styles.finalStats}>
              <p className="win-score-responsive" style={{ margin: "0" }}>
                النتيجة النهائية: <strong>{score}</strong>
              </p>
            </div>
            <div style={styles.winActionButtons}>
              <button onClick={startNewGame} style={styles.smallIconBtn} className="win-small-btn-responsive" title="إعادة المحاولة">
                <RotateCcw className="win-btn-icon-responsive" />
              </button>
              <button onClick={() => navigate(-1)} style={styles.smallIconBtn} className="win-small-btn-responsive" title="رجوع للخلف">
                <ArrowRight className="win-btn-icon-responsive" />
              </button>
              <button onClick={() => navigate("/home")} style={styles.smallIconBtn} className="win-small-btn-responsive" title="الصفحة الرئيسية">
                <Home className="win-btn-icon-responsive" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === CSS التجاوب الذكي والشامل ===
const responsiveCSS = `
  .bg-desktop { display: block; }
  .bg-mobile { display: none; }

  .btn-icon-responsive { width: 25px; height: 25px; }
  .clock-icon-responsive { width: 18px; height: 18px; }

  /* 💻 حجم أيقونات أزرار رسالة الفوز الافتراضية */
  .win-btn-icon-responsive { width: 20px; height: 20px; }
  .win-small-btn-responsive { padding: 9px !important; }

  /* 💻 شاشات اللاب توب والتابلت */
  @media (min-width: 641px) {
    .title-responsive { font-size: 1.45rem !important; padding: 5px 18px !important; }
    .instruction-responsive { font-size: 0.95rem !important; padding: 4px 14px !important; }
  }

  /* 📱 شاشات الموبايل */
  @media (max-width: 640px) {
    .bg-desktop { display: none; }
    .bg-mobile { display: block; }

    .header-area-responsive { top: 3px !important; }
    
    .title-responsive { 
      font-size: 1.02rem !important; 
      padding: 3px 14px !important; 
    }
    
    .instruction-responsive { 
      font-size: 0.8rem !important; 
      padding: 2px 10px !important; 
      line-height: 1.15 !important;
    }

    .boy-responsive { 
      width: ${CONFIG.boySizeMobile} !important; 
      z-index: 35 !important;
    }

    .word-card-responsive {
      padding: 3px 10px !important;
      font-size: 1.05rem !important;
      border-radius: 7px !important;
    }

    .action-btn-responsive {
      padding: 9px !important;
    }
    .btn-icon-responsive {
      width: 22px !important;
      height: 22px !important;
    }

    .top-box-responsive {
      font-size: 0.86rem !important;
      padding: 4px 8px !important;
      border-width: 1.5px !important;
    }
    .clock-icon-responsive {
      width: 16px !important;
      height: 16px !important;
    }

    /* 📱 رفع أزرار التحكم السفلية للموبايل قليلاً لتكون أعلى */
    .controls-responsive {
      bottom: 24px !important;
    }

    .win-box-responsive {
      padding: 12px 16px !important;
      max-width: 180px !important;
      border-radius: 14px !important;
    }
    .win-trophy-responsive {
      width: 36px !important;
      height: 36px !important;
    }
    .win-title-responsive {
      font-size: 1.05rem !important;
    }
    .win-score-responsive {
      font-size: 0.85rem !important;
    }
    .win-small-btn-responsive {
      padding: 8px !important;
    }
    .win-btn-icon-responsive {
      width: 18px !important;
      height: 18px !important;
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
    backgroundColor: "#1e3d59",
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
    fontWeight: "800",
    backgroundColor: "rgba(30, 86, 49, 0.94)",
    borderRadius: "20px",
    border: "2.5px solid #a5d6a7",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  instructionText: {
    margin: "4px 0 0 0",
    color: "#1b5e20",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: "14px",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    border: "2px solid #388e3c",
    textAlign: "center",
  },
  topLeftBox: {
    position: "absolute",
    top: "12px",
    left: "12px",
    zIndex: 25,
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "10px",
    fontWeight: "800",
    color: "#1b5e20",
    border: "2px solid #388e3c",
    boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
  },
  topRightBox: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 25,
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "10px",
    fontWeight: "800",
    color: "#1b5e20",
    border: "2px solid #388e3c",
    boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "center",
  },
  boyWrapper: {
    position: "absolute",
    width: CONFIG.boySizeDesktop,
    zIndex: 30,
    transform: "translate(-50%, -60%)",
    transition: "left 0.6s ease-in-out, top 0.6s ease-in-out",
  },
  stepsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  wordCard: {
    position: "absolute",
    backgroundColor: "rgba(255, 253, 231, 0.96)",
    border: "2.5px solid #5d4037",
    color: "#3e2723",
    fontSize: "1.4rem",
    fontWeight: "800",
    padding: "4px 14px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
    transform: "translate(-50%, -50%)",
    transition: "transform 0.2s ease, filter 0.3s ease",
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
    border: "2.5px solid #2e7d32",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#1b5e20",
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
    background: "#f1f8e9",
    border: "3px solid #33691e",
    padding: "14px 18px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    width: "fit-content",
    minWidth: "190px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  finalStats: {
    backgroundColor: "#ffffff",
    padding: "4px 10px",
    borderRadius: "8px",
    marginBottom: "8px",
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
    border: "2px solid #2e7d32",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#1b5e20",
    boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};