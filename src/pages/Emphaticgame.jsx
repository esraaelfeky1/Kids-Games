// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🖼️ مسارات الصور
import spaceBgImg from "../assets/fbg2.jpeg";         
import spaceBgMobileImg from "../assets/fbg.jpeg"; 
import spaceshipImg from "../assets/s1.png";      
import chicken1Img from "../assets/f1.png";        
import chicken2Img from "../assets/f2.png";        
import chicken3Img from "../assets/f3.png";        
import winChickenImg from "../assets/f5.png";    

// 🐔 الفراخ متفرقة في النصف العلوي والوسط فقط
const INITIAL_CHICKENS = [
  { id: "c1", text: "بَا", isTarget: true, health: 3, maxHealth: 3, type: 1, x: 10, y: 24 },
  { id: "c2", text: "تَا", isTarget: true, health: 3, maxHealth: 3, type: 2, x: 32, y: 22 },
  { id: "c3", text: "ثَا", isTarget: true, health: 3, maxHealth: 3, type: 3, x: 60, y: 25 },
  { id: "c4", text: "جَ", isTarget: false, health: 3, maxHealth: 3, type: 1, x: 84, y: 28 },
  { id: "c5", text: "حَا", isTarget: true, health: 3, maxHealth: 3, type: 2, x: 14, y: 40 },
  { id: "c6", text: "خَا", isTarget: true, health: 3, maxHealth: 3, type: 3, x: 38, y: 38 },
  { id: "c7", text: "دَا", isTarget: true, health: 3, maxHealth: 3, type: 1, x: 68, y: 42 },
  { id: "c8", text: "ذَا", isTarget: true, health: 3, maxHealth: 3, type: 2, x: 88, y: 36 },
  { id: "c9", text: "رَا", isTarget: true, health: 3, maxHealth: 3, type: 3, x: 18, y: 55 },
  { id: "c10", text: "كَ", isTarget: false, health: 3, maxHealth: 3, type: 1, x: 45, y: 52 },
  { id: "c11", text: "سَا", isTarget: true, health: 3, maxHealth: 3, type: 2, x: 74, y: 50 },
  { id: "c12", text: "لَ", isTarget: false, health: 3, maxHealth: 3, type: 3, x: 88, y: 46 },
];

export default function ChickenSpaceGame() {
  const navigate = useNavigate();

  const [chickens, setChickens] = useState(INITIAL_CHICKENS);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [shipX, setShipX] = useState(50);
  const [bullets, setBullets] = useState([]);
  const [explosions, setExplosions] = useState([]); // للفرخة الصحيحة (انفجار كبير)
  const [sparks, setSparks] = useState([]);         // للفرخة الغلط (شرارة صفراء صغيرة وجميلة)

  const audioCtxRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  const gameAreaRef = useRef(null);

  // ⏱️ عداد الوقت
  useEffect(() => {
    let interval = null;
    if (!isGameOver) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);

  // 🦅 حركة الفراخ
  useEffect(() => {
    if (isGameOver) return;
    const moveInterval = setInterval(() => {
      setChickens((prevChickens) =>
        prevChickens.map((chicken) => {
          const newX = Math.max(6, Math.min(90, chicken.x + (Math.random() - 0.5) * 20));
          const newY = Math.max(20, Math.min(58, chicken.y + (Math.random() - 0.5) * 14));
          return {
            ...chicken,
            x: newX,
            y: newY,
          };
        })
      );
    }, 2400);

    return () => clearInterval(moveInterval);
  }, [isGameOver]);

  // 🔊 إعداد الصوت
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    } catch (e) {
      console.warn("AudioContext غير مدعوم", e);
    }
  }, []);

  const playChickenCluckSound = () => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const cluckNotes = [440, 520, 480, 560];
      cluckNotes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.connect(g);
        g.connect(ctx.destination);
        
        o.frequency.setValueAtTime(freq, now + i * 0.05);
        g.gain.setValueAtTime(0.15, now + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.09);
        
        o.start(now + i * 0.05);
        o.stop(now + i * 0.05 + 0.09);
      });
    } catch (e) {
      console.warn("خطأ في تشغيل صوت الفرخة:", e);
    }
  };

  const playHitSound = () => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.06);
        g.gain.setValueAtTime(0.18, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
        o.start(now + i * 0.06);
        o.stop(now + i * 0.06 + 0.12);
      });
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

  const showQuickMessage = (text, type) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage({ text, type });
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 1200);
  };

  const handlePointerMove = (e) => {
    if (!gameAreaRef.current || isGameOver) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let xPos = ((clientX - rect.left) / rect.width) * 100;
    if (xPos < 5) xPos = 5;
    if (xPos > 95) xPos = 95;
    setShipX(xPos);
  };

  const triggerShot = (targetElement, isTarget) => {
    if (!gameAreaRef.current) return;
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const startX = (gameRect.width * shipX) / 100;
    const startY = gameRect.height * 0.72; 

    const endX = targetRect.left + targetRect.width / 2 - gameRect.left;
    const endY = targetRect.top + targetRect.height / 2 - gameRect.top;

    const newBullet = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now() + Math.random(),
      startX,
      startY,
      endX,
      endY,
    };

    setBullets((prev) => [...prev, newBullet]);

    setTimeout(() => {
      setBullets((prev) => prev.filter((b) => b.id !== newBullet.id));
      
      if (isTarget) {
        const newExplosion = {
          id: Date.now() + Math.random(),
          x: endX,
          y: endY,
        };
        setExplosions((prev) => [...prev, newExplosion]);

        setTimeout(() => {
          setExplosions((prev) => prev.filter((ex) => ex.id !== newExplosion.id));
        }, 500);
      } else {
        // ✨ شرارة صفراء صغيرة ولطيفة للفرخة الغلط
        const newSpark = {
          id: Date.now() + Math.random(),
          x: endX,
          y: endY,
        };
        setSparks((prev) => [...prev, newSpark]);

        setTimeout(() => {
          setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
        }, 300);
      }
    }, 350);
  };

  const handleChickenClick = (chicken, e) => {
    if (isGameOver || chicken.isHidden) return;

    triggerShot(e.currentTarget, chicken.isTarget);
    playChickenCluckSound(); 
    speakWord(chicken.text);
    playHitSound();

    if (chicken.isTarget) {
      setChickens((prev) => {
        const updated = prev.map((c) => {
          if (c.id === chicken.id) {
            const nextHealth = c.health - 1;
            return { 
              ...c, 
              health: nextHealth, 
              isHidden: nextHealth <= 0
            };
          }
          return c;
        });

        const remainingTargets = updated.filter((c) => c.isTarget && !c.isHidden).length;
        if (remainingTargets === 0) {
          setTimeout(() => setIsGameOver(true), 600);
        }
        return updated;
      });

      setScore((prev) => prev + 50);
      showQuickMessage("أحسنت👏", "success");
    } else {
      showQuickMessage("خطأ ❌", "error");
    }
  };

  const startNewGame = () => {
    setChickens(INITIAL_CHICKENS);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
    setShipX(50);
    setBullets([]);
    setExplosions([]);
    setSparks([]);
  };

  return (
    <div
      id="game-container"
      style={styles.container}
      ref={gameAreaRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
    >
      <style>{updatedResponsiveCSS}</style>

      {/* 🌌 الخلفيات */}
      <img src={spaceBgImg} alt="خلفية الفضاء" style={styles.bgImg} className="bg-desktop-tablet" />
      <img src={spaceBgMobileImg} alt="خلفية الفضاء للموبايل" style={styles.bgImg} className="bg-mobile-only" />

      {/* 🌟 الشريط العلوي */}
      <div style={styles.topBar} className="updated-top-bar">
        <div style={styles.timerBadge} className="updated-badge">
          <Clock size={18} color="#0284c7" /> {timer} 
        </div>

        <div style={styles.headerContainerResponsive}>
          <div style={styles.headerTitleBox}>
            <h1 style={styles.mainTitle} className="updated-title">لعبة صيد الفراخ</h1>
          </div>
          <div style={styles.headerSubtitleBox}>
            <p style={styles.subTitle} className="updated-subtitle">اضغط على الفراخ قبل أن تهرب</p>
          </div>
        </div>

        <div style={styles.scoreBadge} className="updated-badge">
          ⭐ {score}
        </div>
      </div>

      {/* 🐔 الفراخ */}
      <div style={styles.freeAreaContainer}>
        {chickens.map((chicken) => {
          const currentImg = chicken.type === 1 ? chicken1Img : chicken.type === 2 ? chicken2Img : chicken3Img;
          const healthPercent = (chicken.health / chicken.maxHealth) * 100;

          return (
            <div
              key={chicken.id}
              onClick={(e) => handleChickenClick(chicken, e)}
              style={{
                position: "absolute",
                left: `${chicken.x}%`,
                top: `${chicken.y}%`,
                visibility: chicken.isHidden ? "hidden" : "visible",
                transition: "left 2.2s ease-in-out, top 2.2s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                zIndex: 20,
                pointerEvents: "auto",
              }}
              className="chicken-updated-hover"
            >
              {!chicken.isHidden && (
                <div style={styles.healthBarBg}>
                  <div style={{ ...styles.healthBarFill, width: `${healthPercent}%` }} />
                </div>
              )}

              <img src={currentImg} alt="فرخة الفضاء" style={styles.chickenImg} className="updated-chicken-img" />
              <span style={styles.chickenText} className="updated-chicken-text">
                {chicken.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🚀 المركبة الفضائية */}
      <div style={{ ...styles.spaceshipContainer, left: `${shipX}%` }}>
        <img src={spaceshipImg} alt="مركبة الفضاء" style={styles.spaceshipImg} className="updated-spaceship" />
      </div>

      {/* ⚡ الطلقات */}
      {bullets.map((b) => (
        <div
          key={b.id}
          style={{
            position: "absolute",
            left: `${b.startX}px`,
            top: `${b.startY}px`,
            width: "8px",
            height: "24px",
            background: "#fde047",
            borderRadius: "50%",
            boxShadow: "0 0 14px #f57c00, 0 0 22px #fff",
            zIndex: 50,
            pointerEvents: "none",
            animation: "bulletFly 0.35s linear forwards",
            "--endX": `${b.endX - b.startX}px`,
            "--endY": `${b.endY - b.startY}px`,
          }}
        />
      ))}

      {/* 💥 تأثيرات الانفجار الكبير للفرخة الصحيحة */}
      {explosions.map((ex) => (
        <div
          key={ex.id}
          style={{
            position: "absolute",
            left: `${ex.x}px`,
            top: `${ex.y}px`,
            transform: "translate(-50%, -50%)",
            zIndex: 55,
            pointerEvents: "none",
          }}
        >
          <div className="big-explosion-container">
            <div className="explosion-flash"></div>
            <span className="big-spark s1"></span>
            <span className="big-spark s2"></span>
            <span className="big-spark s3"></span>
            <span className="big-spark s4"></span>
            <span className="big-spark s5"></span>
            <span className="big-spark s6"></span>
          </div>
        </div>
      ))}

      {/* ✨ شرارة صفراء صغيرة وجميلة للفرخة الغلط */}
      {sparks.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}px`,
            top: `${s.y}px`,
            transform: "translate(-50%, -50%)",
            zIndex: 55,
            pointerEvents: "none",
          }}
        >
          <div className="small-spark-container">
            <div className="small-spark-flash"></div>
            <span className="small-ray sr1"></span>
            <span className="small-ray sr2"></span>
            <span className="small-ray sr3"></span>
            <span className="small-ray sr4"></span>
          </div>
        </div>
      ))}

      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }}>
          {message.text}
        </div>
      )}

      {/* 🏆 شاشة الفوز (الفرخة مفصولة وخارج رسالة الفوز) */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winWrapperContainer}>
            {/* 🐔 الفرخة مفصولة وكبيرة خارج البطاقة */}
            <div style={styles.winChickenOutside}>
              <img src={winChickenImg} alt="فرخة الفوز" style={styles.winChickenImg} className="updated-win-chicken-img" />
            </div>

            {/* 📦 رسالة الفوز (على قد المحتوى تماماً) */}
            <div style={styles.winCard} className="updated-win-card">
              <h2 style={styles.winTitle} className="updated-win-title">
                أحسنت يا بطل 🚀
              </h2>

              <div style={styles.winStatsBox} className="updated-win-stats">
                <span style={styles.winStatLabel} className="updated-win-label">
                  <Star color="#f57c00" size={16} /> النقاط النهائية: {score}
                </span>
              </div>

              <div style={styles.winActionButtons}>
                <button onClick={startNewGame} style={styles.winIconBtn} className="updated-win-btn" title="إعادة اللعب">
                  <RotateCcw size={22} />
                </button>
                <button onClick={() => navigate("/home")} style={styles.winIconBtn} className="updated-win-btn" title="الصفحة الرئيسية">
                  <Home size={22} />
                </button>
                <button onClick={() => navigate("/Mad")} style={styles.winIconBtn} className="updated-win-btn" title="رجوع">
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔘 أزرار التحكم */}
      <div style={styles.controlsBarLeft} className="updated-controls-left">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="updated-control-btn" title="الصوت">
          {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={23} />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} className="updated-control-btn" title="إعادة اللعب">
          <RotateCcw size={23} />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="updated-control-btn" title="الصفحة الرئيسية">
          <Home size={23} />
        </button>
        <button onClick={() => navigate("/Mad")} style={styles.iconBtn} className="updated-control-btn" title="رجوع">
          <ArrowRight size={23} />
        </button>
      </div>
    </div>
  );
}

const updatedResponsiveCSS = `
  .bg-desktop-tablet { display: block; }
  .bg-mobile-only { display: none; }

  @keyframes bulletFly {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(var(--endX), var(--endY)) scale(0.7); opacity: 0.9; }
  }

  /* 💥 تصميم الانفجار الكبير (للفرخة الصح) */
  .big-explosion-container {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .explosion-flash {
    position: absolute;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, #ffffff 0%, #fde047 50%, #f97316 80%, transparent 100%);
    border-radius: 50%;
    animation: flashAnim 0.5s ease-out forwards;
    box-shadow: 0 0 25px #f57c00, 0 0 40px #ff0000;
  }

  @keyframes flashAnim {
    0% { transform: scale(0.3); opacity: 1; }
    50% { transform: scale(1.6); opacity: 0.9; }
    100% { transform: scale(2.4); opacity: 0; }
  }

  .big-spark {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fde047;
    border-radius: 50%;
    box-shadow: 0 0 12px #ff4500, 0 0 20px #fff;
  }

  .s1 { animation: sparkFly1 0.5s ease-out forwards; }
  .s2 { animation: sparkFly2 0.5s ease-out forwards; }
  .s3 { animation: sparkFly3 0.5s ease-out forwards; }
  .s4 { animation: sparkFly4 0.5s ease-out forwards; }
  .s5 { animation: sparkFly5 0.5s ease-out forwards; }
  .s6 { animation: sparkFly6 0.5s ease-out forwards; }

  @keyframes sparkFly1 { 0% { transform: translate(0,0) scale(1.2); } 100% { transform: translate(-50px, -45px) scale(0.3); opacity: 0; } }
  @keyframes sparkFly2 { 0% { transform: translate(0,0) scale(1.2); } 100% { transform: translate(50px, -45px) scale(0.3); opacity: 0; } }
  @keyframes sparkFly3 { 0% { transform: translate(0,0) scale(1.2); } 100% { transform: translate(-55px, 35px) scale(0.3); opacity: 0; } }
  @keyframes sparkFly4 { 0% { transform: translate(0,0) scale(1.2); } 100% { transform: translate(55px, 35px) scale(0.3); opacity: 0; } }
  @keyframes sparkFly5 { 0% { transform: translate(0,0) scale(1.2); } 100% { transform: translate(0px, -60px) scale(0.3); opacity: 0; } }
  @keyframes sparkFly6 { 0% { transform: translate(0,0) scale(1.2); } 100% { transform: translate(0px, 60px) scale(0.3); opacity: 0; } }

  /* ✨ شرارة صفراء صغيرة ولطيفة (للفرخة الغلط) */
  .small-spark-container {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .small-spark-flash {
    position: absolute;
    width: 18px;
    height: 18px;
    background: radial-gradient(circle, #ffffff 0%, #fde047 60%, transparent 100%);
    border-radius: 50%;
    animation: smallSparkAnim 0.3s ease-out forwards;
    box-shadow: 0 0 8px #facc15;
  }

  @keyframes smallSparkAnim {
    0% { transform: scale(0.3); opacity: 1; }
    100% { transform: scale(1.2); opacity: 0; }
  }

  .small-ray {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fef08a;
    border-radius: 50%;
    box-shadow: 0 0 4px #facc15;
  }

  .sr1 { animation: sRay1 0.3s ease-out forwards; }
  .sr2 { animation: sRay2 0.3s ease-out forwards; }
  .sr3 { animation: sRay3 0.3s ease-out forwards; }
  .sr4 { animation: sRay4 0.3s ease-out forwards; }

  @keyframes sRay1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-16px, -14px) scale(0.3); opacity: 0; } }
  @keyframes sRay2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(16px, -14px) scale(0.3); opacity: 0; } }
  @keyframes sRay3 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-16px, 14px) scale(0.3); opacity: 0; } }
  @keyframes sRay4 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(16px, 14px) scale(0.3); opacity: 0; } }

  .chicken-updated-hover {
    transition: transform 0.2s ease;
  }
  .chicken-updated-hover:hover {
    transform: scale(1.15) !important;
  }

  .updated-top-bar {
    position: absolute;
    top: clamp(10px, 1.5vh, 16px);
    left: clamp(10px, 2vw, 20px);
    right: clamp(10px, 2vw, 20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 40;
  }

  .updated-title {
    font-size: clamp(1.05rem, 1.8vw + 0.5rem, 1.5rem);
    font-weight: 900;
    margin: 0;
    color: #38bdf8;
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
  }

  .updated-subtitle {
    font-size: clamp(0.85rem, 1.1vw + 0.3rem, 1rem);
    margin: 0;
    color: #e2e8f0;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.6);
  }

  .updated-badge {
    background: rgba(15, 23, 42, 0.85);
    border: 2px solid #38bdf8;
    border-radius: 22px;
    padding: clamp(4px, 0.6vh, 8px) clamp(10px, 1.5vw, 18px);
    font-size: clamp(0.85rem, 1.2vw + 0.3rem, 1.2rem);
    font-weight: bold;
    color: #f57c00;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }

  .updated-chicken-img {
    width: clamp(84px, 12vw + 26px, 122px) !important;
    height: auto;
    display: block;
    filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
  }

  .updated-chicken-text {
    position: absolute;
    top: 54% !important; 
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(1.8rem, 3.2vw + 0.8rem, 2.4rem) !important;
    font-weight: 900;
    color: #ffffff;
    text-shadow: 0 0 10px #000, 0 0 5px #000, 0 2px 4px rgba(0,0,0,0.9);
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    white-space: nowrap;
    z-index: 10;
  }

  /* 🚀 حجم المركبة الفضائية */
  .updated-spaceship {
    width: clamp(82px, 16.5vw, 119px) !important;
    height: auto;
    filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.9));
  }

  .updated-controls-left {
    position: absolute;
    bottom: clamp(10px, 2vh, 20px);
    left: clamp(10px, 2vw, 20px);
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
    z-index: 40;
  }

  .updated-control-btn {
    padding: clamp(7px, 1.2vw, 11px) !important;
    width: clamp(40px, 5.2vw, 46px) !important;
    height: clamp(40px, 5.2vw, 46px) !important;
  }

  /* 🐔 فرخة الفوز مفصولة وكبيرة في الأعلى */
  .updated-win-chicken-img {
    width: clamp(180px, 22vw, 205px) !important;
    height: auto;
    display: block;
    margin: 0 auto;
    filter: drop-shadow(0 0 18px #ffd700);
  }

  /* 📦 بطاقة الفوز (على قد المحتوى تماماً) */
  .updated-win-card {
    width: max-content !important;
    max-width: 90vw !important;
    padding: clamp(14px, 2.5vh, 20px) clamp(24px, 4vw, 36px) !important;
    border-radius: 18px !important;
    background: #0f172a;
    border: 2px solid #38bdf8;
    text-align: center;
    box-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    margin-top: 10px;
  }

  .updated-win-title {
    font-size: clamp(1.2rem, 2vw + 0.4rem, 1.6rem) !important;
    color: #f8fafc;
    margin: 0 0 10px 0 !important;
    font-weight: 900;
    white-space: nowrap;
  }

  .updated-win-stats {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 6px 14px;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: inline-block;
  }

  .updated-win-label {
    font-size: clamp(0.95rem, 1.4vw + 0.3rem, 1.15rem) !important;
    color: #fde047;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .updated-win-btn {
    padding: 6px !important;
    width: 39px !important;
    height: 39px !important;
    flex: 0 0 auto !important;
  }

  @media (max-width: 600px) {
    .bg-desktop-tablet { display: none !important; }
    .bg-mobile-only { display: block !important; }
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
  timerBadge: {},
  scoreBadge: {},
  headerContainerResponsive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  headerTitleBox: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "2px solid #38bdf8",
    borderRadius: "10px",
    padding: "4px 14px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.4)",
  },
  headerSubtitleBox: {
    background: "rgba(30, 41, 59, 0.85)",
    border: "1px solid rgba(56, 189, 248, 0.5)",
    borderRadius: "8px",
    padding: "2px 10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  freeAreaContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 20,
    pointerEvents: "none",
  },
  chickenImg: {},
  healthBarBg: {
    position: "absolute",
    top: "-8px",
    width: "45px",
    height: "5px",
    background: "rgba(0,0,0,0.6)",
    borderRadius: "3px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.3)",
    zIndex: 5,
  },
  healthBarFill: {
    height: "100%",
    background: "#ef4444",
    transition: "width 0.2s ease",
  },
  chickenText: {},
  spaceshipContainer: {
    position: "absolute",
    bottom: "6%",
    transform: "translateX(-50%)",
    zIndex: 35,
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  spaceshipImg: {},
  feedbackMessage: {
    position: "absolute",
    top: "18%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 60,
    borderRadius: "12px",
    fontWeight: "bold",
    color: "#fff",
    padding: "6px 18px",
    fontSize: "1rem",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
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
  winWrapperContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  winChickenOutside: {
    marginBottom: "-12px",
    zIndex: 102,
  },
  winChickenImg: {},
  winCard: {},
  winStatsBox: {},
  winStatLabel: {},
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
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
  controlsBarLeft: {},
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
    pointerEvents: "auto",
  },
};