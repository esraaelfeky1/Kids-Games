// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. صور اللعبة ===
import seaBgImg from "../assets/seabg.jpeg";       
import diverGirlImg from "../assets/divergirl.png";   
import fishingNetImg from "../assets/fishingnet.png"; 

import fishYellowImg from "../assets/fish1.png";
import fishOrangeImg from "../assets/fish2.png";
import fishPurpleImg from "../assets/fish3.png";
import fishPinkImg from "../assets/fish4.png";
import fishGreenImg from "../assets/fish1.png";
import fishTealImg from "../assets/fish2.png";

// =========================================================================
// 🎛️ إعدادات اللعبة
// =========================================================================
const CONFIG = {
  diverMoveDuration: 0.8,   // سرعة ذهاب الغواصة للسمكة
  carryMoveDuration: 1.2,   // سرعة الحركة نحو السلة
  netPos: { left: "40%", bottom: "2%" }, // مكان الشبكة
  gameTimeLimit: 60,        // الوقت الإجمالي بالثواني
};

// === 2. الكلمات ===
const initialFishData = [
  { id: 1, word: "شَجَرَة", img: fishYellowImg, hasTaMarbuta: true, left: "15%", top: "28%", delay: "0s", duration: "11s" },
  { id: 2, word: "بَنَات", img: fishOrangeImg, hasTaMarbuta: false, left: "55%", top: "26%", delay: "1.5s", duration: "13s" },
  { id: 3, word: "كُرَة", img: fishPurpleImg, hasTaMarbuta: true, left: "30%", top: "36%", delay: "2.5s", duration: "10.5s" },
  { id: 4, word: "بَيْت", img: fishOrangeImg, hasTaMarbuta: false, left: "10%", top: "48%", delay: "0.8s", duration: "14s" },
  { id: 5, word: "مَدْرَسَة", img: fishPinkImg, hasTaMarbuta: true, left: "60%", top: "46%", delay: "1.2s", duration: "12s" },
  { id: 6, word: "زَرَعَت", img: fishGreenImg, hasTaMarbuta: false, left: "20%", top: "60%", delay: "3s", duration: "12.5s" },
  { id: 7, word: "قِصَّة", img: fishTealImg, hasTaMarbuta: true, left: "45%", top: "60%", delay: "1s", duration: "11.5s" },
  { id: 8, word: "وَرْدَة", img: fishOrangeImg, hasTaMarbuta: true, left: "35%", top: "70%", delay: "0.5s", duration: "13.5s" },
  { id: 9, word: "حَدِيقَة", img: fishYellowImg, hasTaMarbuta: true, left: "75%", top: "34%", delay: "1.8s", duration: "12s" },
  { id: 10, word: "طَائِرَة", img: fishPinkImg, hasTaMarbuta: true, left: "18%", top: "74%", delay: "2.2s", duration: "11s" },
];

export default function DiverFishGame() {
  const navigate = useNavigate();

  const [fishList, setFishList] = useState(initialFishData);
  const [fishInNet, setFishInNet] = useState([]);
  const [diverPos, setDiverPos] = useState({ left: "18%", top: "40%" });
  const [isCarryingFish, setIsCarryingFish] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });

  // ⏱️ حالة المؤقت الزمني
  const [timeLeft, setTimeLeft] = useState(CONFIG.gameTimeLimit);

  const audioCtxRef = useRef(null);

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }, []);

  // ⏱️ عداد الوقت التنازلي
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const totalCorrectFish = initialFishData.filter((f) => f.hasTaMarbuta).length;

  const startNewGame = () => {
    setFishList(initialFishData);
    setFishInNet([]);
    setDiverPos({ left: "18%", top: "40%" });
    setIsCarryingFish(null);
    setScore(0);
    setTimeLeft(CONFIG.gameTimeLimit);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
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

  // 🎣 منطق اصطياد الأسماك
  const handleFishClick = (clickedFish) => {
    if (isGameOver || isCarryingFish) return;

    speakWord(clickedFish.word);

    // 1. ذهاب الغواصة للسمكة
    setDiverPos({ left: clickedFish.left, top: clickedFish.top, bottom: "auto" });

    setTimeout(() => {
      setIsCarryingFish(clickedFish);
      
      // إخفاء السمكة من البحر
      setFishList((prev) => prev.filter((f) => f.id !== clickedFish.id));

      // 2. التحرك نحو الشبكة
      const netTop = `calc(${CONFIG.netPos.bottom} + 90px)`;
      setDiverPos({ left: CONFIG.netPos.left, bottom: netTop, top: "auto" });

      setTimeout(() => {
        // 3. التحقق من الإجابة
        if (clickedFish.hasTaMarbuta) {
          playSound("success");
          setScore((prev) => prev + 10);
          setMessage({ text: "رائع", type: "success" });
          setFishInNet((prev) => [...prev, clickedFish]);
          setIsCarryingFish(null);

          if (fishInNet.length + 1 === totalCorrectFish) {
            setTimeout(() => {
              setIsGameOver(true);
              triggerConfetti();
            }, 600);
          }
        } else {
          playSound("error");
          setMessage({ text: "خطأ", type: "error" });

          // إرجاع السمكة للبحر
          setFishList((prev) => [...prev, clickedFish]);
          setIsCarryingFish(null);
        }

        setTimeout(() => setMessage({ text: "", type: "" }), 2200);

      }, CONFIG.carryMoveDuration * 1000);

    }, CONFIG.diverMoveDuration * 1000);
  };

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية البحر */}
      <img src={seaBgImg} alt="خلفية البحر" style={styles.bgImg} />

      {/* لوحة العنوان (تم تصغيرها قليلاً بناءً على طلبك) */}
      <div style={styles.headerAreaWrapper} className="header-area-responsive">
        <div style={styles.woodSign}>
          <h1 style={styles.mainTitle}>اصطد الكلمات التي تنتهي بـ</h1>
          <h2 style={styles.highlightTitle}>تاء مربوطة (ـة / ة) 🎯</h2>
        </div>
      </div>

      {/* 📊 عداد النقاط والوقت (تم تكبيرهما 1 بكسل بناءً على طلبك) */}
      <div style={styles.scoreBadge} className="score-position-responsive">
        ⭐ <span>{score}</span> نقاط
      </div>
      <div 
        style={{ 
          ...styles.timerBadge, 
          color: timeLeft <= 15 ? "#d32f2f" : "#0277bd", 
          borderColor: timeLeft <= 15 ? "#d32f2f" : "#0277bd" 
        }} 
        className="timer-position-responsive"
      >
        <Clock size={16} /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
      </div>

      {/* 🕸️ الشبكة */}
      <div style={{ ...styles.netWrapper, ...CONFIG.netPos }} className="net-responsive">
        <img src={fishingNetImg} alt="شبكة الصيد" style={styles.fullImg} />
        
        {/* الأسماك المستقرة داخل السلة */}
        <div style={styles.fishInNetContainer}>
          {fishInNet.map((fish, index) => (
            <div
              key={`net-${fish.id}`}
              className="fish-in-net-item-responsive"
              style={{
                position: "absolute",
                width: "58px",
                left: `${(index % 3) * 28 + 6}%`,
                bottom: `${Math.floor(index / 3) * 22 + 8}%`,
                zIndex: index + 2,
                transform: `rotate(${index % 2 === 0 ? 12 : -12}deg)`,
              }}
            >
              <img src={fish.img} alt="سمكة في الشبكة" style={styles.fullImg} />
            </div>
          ))}
        </div>
      </div>

      {/* 🧜‍♀️ الغواصة */}
      <div
        style={{
          ...styles.diverWrapper,
          left: diverPos.left,
          top: diverPos.top,
          bottom: diverPos.bottom,
          transitionDuration: `${isCarryingFish ? CONFIG.carryMoveDuration : CONFIG.diverMoveDuration}s`,
        }}
        className="diver-responsive"
      >
        <div className="diver-floating-animation" style={{ width: "100%", height: "100%" }}>
          <img src={diverGirlImg} alt="الغواصة" style={styles.fullImg} />

          {/* 🖐️ السمكة المحمولة */}
          {isCarryingFish && (
            <div style={styles.carryingFishWrapper} className="carrying-fish-responsive">
              <img src={isCarryingFish.img} alt="سمكة محمولة" style={styles.fullImg} />
              <div style={styles.wordOnFish}>{isCarryingFish.word}</div>
            </div>
          )}
        </div>
      </div>

      {/* 🐟 الأسماك السابحة في البحر */}
      <div style={styles.fishContainer}>
        {fishList.map((fish) => (
          <div
            key={fish.id}
            onClick={() => handleFishClick(fish)}
            style={{
              position: "absolute",
              width: "130px",
              left: fish.left,
              top: fish.top,
              cursor: isCarryingFish ? "default" : "pointer",
              animationDuration: fish.duration,
              animationDelay: fish.delay,
            }}
            className="fish-item-responsive long-swim-animation"
          >
            <div className="fish-img-container" style={{ width: "100%", height: "100%" }}>
              <img src={fish.img} alt="سمكة" style={styles.fullImg} />
            </div>
            
            <div style={styles.wordOnFish}>
              {fish.word}
            </div>
          </div>
        ))}
      </div>

      {/* التغذية الراجعة */}
      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }}>
          {message.text}
        </div>
      )}

      {/* 🏆 شاشة الفوز أو انتهاء الوقت (بحجم المحتوى تماماً Fitted Card) 🏆 */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winCard}>
            <div style={styles.trophyWrapper}>
              <Trophy size={32} color="#FFD700" />
            </div>
            <h2 style={styles.winTitle}>{timeLeft === 0 ? "انتهى الوقت! ⏳" : "أحسنت يا بطل! 🎉"}</h2>
            
            <div style={styles.winStatsBox}>
              <span style={styles.winStatLabel}><Star size={15} color="#f57c00" /> النقاط:</span>
              <span style={styles.winStatValue}>{score}</span>
            </div>

            {/* أزرار شاشة النهاية */}
            <div style={styles.winActionButtons}>
              <button onClick={startNewGame} style={styles.winIconBtn} title="إعادة اللعب">
                <RotateCcw size={17} />
              </button>
              <button onClick={() => navigate("/home")} style={styles.winIconBtn} title="الصفحة الرئيسية">
                <Home size={17} />
              </button>
              <button onClick={() => navigate(-1)} style={styles.winIconBtn} title="رجوع">
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* أزرار التحكم السفلى */}
      <div style={styles.controlsBarCenter}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} title="الصوت">
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} title="إعادة اللعب">
          <RotateCcw size={20} />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} title="الصفحة الرئيسية">
          <Home size={20} />
        </button>
        <button onClick={() => navigate(-1)} style={styles.iconBtn} title="رجوع">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

// === 🌊 CSS الحركات والتنسيقات المتكفة الذكية (Smart Responsive) ===
const responsiveCSS = `
  @keyframes swimPathLong {
    0% { transform: translate(-50%, -50%) translate(0px, 0px); }
    25% { transform: translate(-50%, -50%) translate(180px, -12px); }
    48% { transform: translate(-50%, -50%) translate(340px, 0px); }
    50% { transform: translate(-50%, -50%) translate(340px, 0px); }
    75% { transform: translate(-50%, -50%) translate(180px, 12px); }
    98% { transform: translate(-50%, -50%) translate(0px, 0px); }
    100% { transform: translate(-50%, -50%) translate(0px, 0px); }
  }

  @keyframes fishBodyFlipLong {
    0%, 47% { transform: scaleX(1); }
    50%, 97% { transform: scaleX(-1); }
    100% { transform: scaleX(1); }
  }

  @keyframes diverFloating {
    0% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-18px) rotate(4deg); }
    66% { transform: translateY(14px) rotate(-4deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  .diver-floating-animation {
    animation: diverFloating 3.2s infinite ease-in-out;
  }

  .long-swim-animation {
    animation: swimPathLong 11s infinite ease-in-out;
  }

  .long-swim-animation .fish-img-container {
    animation: fishBodyFlipLong 11s infinite ease-in-out;
  }

  /* ميديا كويري ريسبونسيف ذكي للشاشات الصغيرة والمتوسطة */
  @media (max-width: 992px) {
    @keyframes swimPathLong {
      0% { transform: translate(-50%, -50%) translate(0px, 0px); }
      25% { transform: translate(-50%, -50%) translate(90px, -8px); }
      48% { transform: translate(-50%, -50%) translate(180px, 0px); }
      50% { transform: translate(-50%, -50%) translate(180px, 0px); }
      75% { transform: translate(-50%, -50%) translate(90px, 8px); }
      98% { transform: translate(-50%, -50%) translate(0px, 0px); }
      100% { transform: translate(-50%, -50%) translate(0px, 0px); }
    }

    .header-area-responsive { 
      top: 8px !important; 
      transform: translateX(-50%) scale(0.82);
      transform-origin: top center;
    }
    
    .score-position-responsive { top: 6px !important; right: 8px !important; left: auto !important; font-size: 0.84rem !important; padding: 4px 10px !important; }
    .timer-position-responsive { top: 6px !important; left: 8px !important; right: auto !important; font-size: 0.84rem !important; padding: 4px 10px !important; }

    .fish-item-responsive { width: 90px !important; }
    .diver-responsive { width: 160px !important; }
    .net-responsive { width: 160px !important; height: 130px !important; }
    .fish-in-net-item-responsive { width: 42px !important; }
    .carrying-fish-responsive { width: 70px !important; }
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
    backgroundColor: "#0d47a1",
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
    top: "14px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  woodSign: {
    backgroundColor: "rgba(139, 90, 43, 0.95)",
    padding: "5px 15px", // تم تصغير الحشوة قليلاً لتصغير العنوان
    borderRadius: "16px",
    border: "3.5px solid #5d3a1a",
    boxShadow: "0 5px 12px rgba(0, 0, 0, 0.35)",
    textAlign: "center",
  },
  mainTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "0.95rem", // تم تصغيره بمقدار بسيط
    fontWeight: "600",
  },
  highlightTitle: {
    margin: "1px 0 0 0",
    color: "#ffeb3b",
    fontSize: "1.10rem", // تم تصغيره بمقدار بسيط
    fontWeight: "800",
  },
  scoreBadge: {
    position: "absolute",
    top: "16px",
    left: "16px",
    background: "rgba(255, 255, 255, 0.92)",
    padding: "5px 12px", // تم تكبيره 1 بكسل
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.9rem", // تم تكبيره 1 بكسل تقريباً
    fontWeight: "bold",
    color: "#f57c00",
    border: "2px solid #f57c00",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    zIndex: 25,
  },
  timerBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(255, 255, 255, 0.92)",
    padding: "5px 12px", // تم تكبيره 1 بكسل
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.9rem", // تم تكبيره 1 بكسل تقريباً
    fontWeight: "bold",
    border: "2px solid",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    zIndex: 25,
  },
  netWrapper: {
    position: "absolute",
    width: "210px",
    height: "165px",
    transform: "translateX(-50%)",
    zIndex: 10,
    pointerEvents: "none",
  },
  fishInNetContainer: {
    position: "absolute",
    top: "18%",
    left: "10%",
    right: "10%",
    bottom: "15%",
    pointerEvents: "none",
  },
  diverWrapper: {
    position: "absolute",
    width: "250px",
    height: "auto",
    zIndex: 15,
    transitionProperty: "left, top, bottom",
    transitionTimingFunction: "ease-in-out",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  carryingFishWrapper: {
    position: "absolute",
    width: "100px",
    right: "12%",
    top: "22%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wordOnFish: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.5rem",
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "'Cairo', sans-serif",
    textAlign: "center",
    filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.6))",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    zIndex: 10,
  },
  fishContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 5,
  },
  feedbackMessage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 50,
    padding: "14px 28px",
    borderRadius: "20px",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
  },
  success: { backgroundColor: "#2e7d32" },
  error: { backgroundColor: "#c62828" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winCard: {
    background: "#ffffff",
    border: "3.5px solid #8b5a2b",
    padding: "15px 12px",
    borderRadius: "18px",
    textAlign: "center",
    width: "fit-content",
    minWidth: "210px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trophyWrapper: {
    marginBottom: "2px",
    filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))",
  },
  winTitle: {
    color: "#2e7d32",
    fontSize: "1.2rem",
    margin: "2px 0 6px 0",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },
  winStatsBox: {
    background: "#fdf8e1",
    borderRadius: "10px",
    padding: "4px 12px",
    marginBottom: "10px",
    border: "1.5px solid #ffe082",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    boxSizing: "border-box",
  },
  winStatLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#5d4037",
  },
  winStatValue: {
    fontSize: "1.05rem",
    fontWeight: "900",
    color: "#e65100",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  winIconBtn: {
    background: "#ffffff",
    border: "2px solid #8b5a2b",
    padding: "7px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#8b5a2b",
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
    zIndex: 30,
  },
  iconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2.5px solid #8b5a2b",
    padding: "11px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#8b5a2b",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};