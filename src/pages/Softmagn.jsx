// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🖼️ استيراد الصور الخاصة باللعبة
import bgImg from "../assets/magnetBg.jpeg";         // صورة الخلفية
import boyMagnetImg from "../assets/boyMagnet.png";   // صورة الولد مع المغناطيس
import stone1Img from "../assets/ston1.png";         // صورة الحجر الأول
import stone2Img from "../assets/ston2.png";         // صورة الحجر الثاني

// 🎯 قائمة الكلمات
const INITIAL_WORDS = [
  { id: "w1", text: "سما", isTarget: true, stoneType: 1 },
  { id: "w2", text: "كتاب", isTarget: false, stoneType: 2 },
  { id: "w3", text: "دنيا", isTarget: true, stoneType: 1 },
  { id: "w4", text: "قلم", isTarget: false, stoneType: 2 },
  { id: "w5", text: "هدى", isTarget: true, stoneType: 1 },
  { id: "w6", text: "سماء", isTarget: false, stoneType: 2 },
  { id: "w7", text: "مستشفى", isTarget: true, stoneType: 1 },
  { id: "w8", text: "مدرسة", isTarget: false, stoneType: 2 },
  { id: "w9", text: "مرتضى", isTarget: true, stoneType: 1 },
  { id: "w10", text: "شاي", isTarget: false, stoneType: 2 },
  { id: "w11", text: "فتى", isTarget: true, stoneType: 1 },
  { id: "w12", text: "باب", isTarget: false, stoneType: 2 },
];

export default function MagnetGame() {
  const navigate = useNavigate();

  const [words, setWords] = useState(INITIAL_WORDS);
  const [attractingId, setAttractingId] = useState(null); 
  const [beamStyle, setBeamStyle] = useState(null); // 📏 أبعاد وحساب الشعاع الضوئي
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const audioCtxRef = useRef(null);
  const magnetTipRef = useRef(null); // 📍 نقطة بوز المغناطيس الثابتة
  const stoneRefs = useRef({});     // 📍 مراجع الأحجار/الكلمات
  const messageTimeoutRef = useRef(null); // ⏱️ مرجع لتوقيت إخفاء الرسالة

  // عداد الوقت
  useEffect(() => {
    let interval = null;
    if (!isGameOver) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);

  // إعداد الصوت
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

  // 📐 حساب اتجاه الشعاع الثابت من بوز المغناطيس إلى الكلمة المطلوبة
  const calculateBeam = (wordId) => {
    const magnetElem = magnetTipRef.current;
    const stoneElem = stoneRefs.current[wordId];

    if (!magnetElem || !stoneElem) return;

    const magnetRect = magnetElem.getBoundingClientRect();
    const stoneRect = stoneElem.getBoundingClientRect();

    const startX = magnetRect.left + magnetRect.width / 2;
    const startY = magnetRect.top + magnetRect.height / 2;

    const endX = stoneRect.left + stoneRect.width / 2;
    const endY = stoneRect.top + stoneRect.height / 2;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.hypot(deltaX, deltaY);
    const angleDeg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    setBeamStyle({
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${distance}px`,
      transform: `rotate(${angleDeg}deg)`,
    });
  };

  // 💬 دالة لإظهار إشعار سريع وإخفائه تلقائياً
  const showQuickMessage = (text, type) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage({ text, type });

    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 1500); // تختفي بعد 1.5 ثانية
  };

  // 🧲 عند الضغط على الكلمة
  const handleWordClick = (word) => {
    if (isGameOver || attractingId !== null) return;

    speakWord(word.text);

    if (word.isTarget) {
      playSound("success");
      calculateBeam(word.id); 
      setAttractingId(word.id); 
      showQuickMessage("صح! ✨", "success");

      setTimeout(() => {
        setWords((prevWords) => {
          const updated = prevWords.map((w) => 
            w.id === word.id ? { ...w, isHidden: true } : w
          );
          
          const remainingTargets = updated.filter((w) => w.isTarget && !w.isHidden).length;
          
          if (remainingTargets === 0) {
            setTimeout(() => {
              setIsGameOver(true);
            }, 300);
          }
          return updated;
        });

        setScore((prev) => prev + 50);
        setAttractingId(null);
        setBeamStyle(null);
      }, 1200);

    } else {
      playSound("error");
      showQuickMessage("خطأ! ❌", "error");
    }
  };

  const startNewGame = () => {
    setWords(INITIAL_WORDS);
    setAttractingId(null);
    setBeamStyle(null);
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

      {/* 🖼️ خلفية اللعبة */}
      <img src={bgImg} alt="الخلفية" style={styles.bgImg} />

      {/* 🏷️ العنوان */}
      <div style={styles.headerContainer} className="header-container-responsive">
        <h1 style={styles.gameTitle} className="game-title-responsive">
          اجذب بالمغناطيس الكلمات 
          التي بها ألف لينة
        </h1>
      </div>

      {/* ⚡ الشعاع الضوئي الثابت المصدر والممتد للكلمة */}
      {attractingId && beamStyle && (
        <div 
          className="fixed-magnetic-beam" 
          style={{
            position: "fixed",
            left: beamStyle.left,
            top: beamStyle.top,
            width: beamStyle.width,
            transform: beamStyle.transform,
          }} 
        />
      )}

      {/* 🧱 شبكة الكلمات بالحجارة */}
      <div style={styles.gridContainer} className="grid-container-responsive">
        {words.map((word) => {
          const isAttracting = attractingId === word.id;
          const stoneImage = word.stoneType === 1 ? stone1Img : stone2Img;

          return (
            <div
              key={word.id}
              ref={(el) => (stoneRefs.current[word.id] = el)}
              onClick={() => !word.isHidden && handleWordClick(word)}
              style={{
                ...styles.stoneWrapper,
                visibility: word.isHidden ? "hidden" : "visible"
              }}
              className={`stone-responsive ${isAttracting ? "attract-to-tip-anim" : ""}`}
            >
              <img src={stoneImage} alt="حجر" style={styles.stoneImg} />
              <span style={styles.stoneText} className="stone-text-responsive">{word.text}</span>
            </div>
          );
        })}
      </div>

      {/* 👦🧲 الولد والمغناطيس */}
      <div style={styles.boyContainer} className="boy-container-responsive">
        <div ref={magnetTipRef} style={styles.magnetTipPoint} />
        <div className={`magnet-glow-effect ${attractingId ? "active-glow" : ""}`} />
        <img src={boyMagnetImg} alt="الولد والمغناطيس" style={styles.boyImg} />
      </div>

      {/* 🌟 النقاط والوقت */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score}
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive timer-position">
        <Clock size={22} color="#0284c7" /> {timer}
      </div>

      {/* 💬 التغذية الراجعة الموجزة والسريرة */}
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
              أحسنت يا بطل🧲🎉
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
              <button onClick={handleBack} style={styles.winIconBtn} className="win-btn-responsive" title="رجوع لصفحة شدة">
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
        <button onClick={handleBack} style={styles.iconBtn} className="control-btn-responsive" title="رجوع لصفحة شدة">
          <ArrowRight className="ctrl-icon-responsive" />
        </button>
      </div>
    </div>
  );
}

// === 🎨 CSS المنسق للتجاوب ===
const responsiveCSS = `
  .fixed-magnetic-beam {
    height: 42px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 1) 0%, 
      rgba(56, 189, 248, 0.85) 40%, 
      rgba(250, 204, 21, 0.6) 80%, 
      rgba(255, 255, 255, 0) 100%
    );
    clip-path: polygon(0% 30%, 100% 0%, 100% 100%, 0% 70%);
    transform-origin: 0% 50%;
    pointer-events: none;
    z-index: 35;
    filter: drop-shadow(0 0 12px #38bdf8) drop-shadow(0 0 25px #facc15);
    animation: fixedBeamPulse 0.25s infinite alternate ease-in-out;
  }

  @keyframes fixedBeamPulse {
    0% { opacity: 0.8; filter: drop-shadow(0 0 10px #38bdf8) brightness(1.2); }
    100% { opacity: 1; filter: drop-shadow(0 0 25px #facc15) brightness(1.7); }
  }

  .magnet-glow-effect {
    position: absolute;
    top: 22%;
    right: 8%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(56, 189, 248, 0.9) 50%, rgba(250, 204, 21, 0) 80%);
    box-shadow: 0 0 30px #38bdf8, 0 0 60px #facc15;
    opacity: 0;
    transform: scale(0.3);
    transition: all 0.2s ease;
    pointer-events: none;
    z-index: 30;
  }

  .magnet-glow-effect.active-glow {
    opacity: 1;
    transform: scale(1.6);
    animation: pulseLight 0.3s infinite alternate ease-in-out;
  }

  @keyframes pulseLight {
    from { transform: scale(1.4); filter: brightness(1.2); }
    to { transform: scale(1.9); filter: brightness(1.7); }
  }

  @keyframes pullToMagnetTipDesktop {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
    20% { transform: scale(1.08) rotate(5deg); opacity: 1; }
    85% { transform: translate(-30vw, 30vh) scale(0.3) rotate(-35deg); opacity: 1; }
    100% { transform: translate(-33vw, 34vh) scale(0) rotate(-45deg); opacity: 0; }
  }

  .attract-to-tip-anim {
    animation: pullToMagnetTipDesktop 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards !important;
    z-index: 100 !important;
    pointer-events: none !important;
  }

  .stat-badge-responsive {
    font-size: 1.2rem !important;
    padding: 6px 18px !important;
    position: absolute;
    z-index: 40;
  }

  .score-position { top: 16px; left: 20px; }
  .timer-position { top: 16px; right: 20px; }

  .header-container-responsive {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 35;
    width: auto;
    max-width: 85%;
  }

  .game-title-responsive {
    margin: 0;
    padding: 10px 28px;
    font-size: 1.3rem;
    font-weight: 700;
    color: #451A03;
    background: #fde68a;
    border: 3px solid #b45309;
    border-radius: 18px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  .grid-container-responsive {
    position: absolute;
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 65%;
    max-width: 650px;
    z-index: 20;
  }

  .stone-responsive {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    max-width: 100px;
    margin: 0 auto;
  }

  .stone-responsive:hover {
    transform: scale(1.05);
  }

  .stone-text-responsive {
    font-size: 1.9rem;
  }

  .boy-container-responsive {
    position: absolute;
    bottom: 2%;
    left: 3%;
    width: 250px;
    z-index: 25;
    pointer-events: none;
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

  .win-card-responsive { width: 250px !important; padding: 14px 18px !important; }
  .trophy-icon-responsive { width: 40px !important; height: 40px !important; }
  .win-title-responsive { font-size: 1rem !important; margin: 4px 0 8px 0 !important; }
  .win-stats-responsive { padding: 6px 12px !important; margin-bottom: 10px !important; }
  .win-stat-label-responsive { font-size: 0.9rem !important; }
  .star-icon-responsive { width: 18px !important; height: 18px !important; }
  .btn-icon-responsive { width: 20px !important; height: 20px !important; }
  .win-btn-responsive { padding: 8px !important; }

  /* 📱 للموبايل والتابلت فقط */
  @media (max-width: 900px) {
    .fixed-magnetic-beam {
      height: 28px !important;
    }

    .header-container-responsive {
      top: 10px !important;
    }

    .game-title-responsive { 
      font-size: 0.98rem !important; 
      padding: 5px 12px !important;
      border-width: 2px !important;
    }

    .grid-container-responsive {
      top: 15% !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 8px !important;
      width: 70% !important;
    }

    .stone-responsive {
      max-width: 85px !important;
    }

    /* 🔍 تكبير النص على الحجر للموبايل */
    .stone-text-responsive {
      font-size: 1.45rem !important;
      font-weight: 900 !important;
    }

    .boy-container-responsive {
      width: 150px !important;
      left: 1% !important;
      bottom: 5% !important;
    }

    .magnet-glow-effect {
      width: 40px !important;
      height: 40px !important;
      top: 20% !important;
      right: 5% !important;
    }

    @keyframes pullToMagnetTipMobile {
      0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
      20% { transform: scale(1.05) rotate(4deg); opacity: 1; }
      85% { transform: translate(-24vw, 26vh) scale(0.3) rotate(-25deg); opacity: 1; }
      100% { transform: translate(-28vw, 30vh) scale(0) rotate(-35deg); opacity: 0; }
    }

    .attract-to-tip-anim {
      animation: pullToMagnetTipMobile 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards !important;
    }

    .controls-bottom-responsive {
      bottom: 5.5% !important;
      gap: 12px !important;
    }

    .control-btn-responsive {
      padding: 8px !important;
    }

    .ctrl-icon-responsive {
      width: 25px !important;
      height: 25px !important;
    }

    .stat-badge-responsive {
      font-size: 0.85rem !important;
      padding: 4px 10px !important;
    }

    .win-card-responsive { width: 190px !important; padding: 12px 5px !important; }
    .trophy-icon-responsive { width: 34px !important; height: 34px !important; }
    .win-title-responsive { font-size: 1.0rem !important; }
    .win-stat-label-responsive { font-size: 0.90rem !important; }
    .star-icon-responsive { width: 16px !important; height: 16px !important; }
    .btn-icon-responsive { width: 18px !important; height: 18px !important; }
    .win-btn-responsive { padding: 6px !important; }
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
    backgroundColor: "#7dd3fc",
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
  gridContainer: {},
  stoneWrapper: {
    width: "100%",
    height: "auto",
  },
  stoneImg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  stoneText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "900",
    color: "#451A03",
    whiteSpace: "nowrap",
    pointerEvents: "none",
  },
  boyContainer: {
    position: "absolute",
  },
  magnetTipPoint: {
    position: "absolute",
    top: "22%",
    right: "12%",
    width: "1px",
    height: "1px",
    pointerEvents: "none",
  },
  boyImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  headerContainer: {},
  gameTitle: {},
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
  feedbackMessage: {
    position: "absolute",
    top: "14%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 60,
    borderRadius: "16px",
    fontWeight: "bold",
    color: "#fff",
    padding: "6px 22px",
    fontSize: "1.2rem",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    pointerEvents: "none",
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
    border: "3px solid #854D0E",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trophyWrapper: {
    marginBottom: "2px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
  },
  winTitle: {
    color: "#78350F",
    fontWeight: "800",
  },
  winStatsBox: {
    background: "#FEF3C7",
    borderRadius: "10px",
    border: "1.5px solid #FDE68A",
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
    color: "#92400E",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  winIconBtn: {
    background: "#ffffff",
    border: "2px solid #854D0E",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#854D0E",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsBarBottom: {},
  iconBtn: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "50%",
    border: "3px solid #854D0E",
    cursor: "pointer",
    color: "#854D0E",
    boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  },
};