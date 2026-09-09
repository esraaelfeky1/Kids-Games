// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. صور اللعبة ===
import skyBgImg from "../assets/skybg.jpeg"; // صورة الخلفية

import parachute1 from "../assets/parachute1.png"; // المظلة الصفراء
import parachute2 from "../assets/parachute2.png"; // المظلة البنفسجية / الزرقاء
import parachute3 from "../assets/parachute3.png"; // المظلة الخضراء
import parachute4 from "../assets/parachute4.png"; // المظلة الوردية

// مصفوفة تحتوي على جميع أشكال المظلات لتبديلها عشوائياً
const PARACHUTE_IMAGES = [parachute1, parachute2, parachute3, parachute4];

// === 2. الكلمات ===
const initialWordsData = [
  { id: 1, word: "الـشَّـمْـسُ", isSun: true },
  { id: 2, word: "الْـقَـمَـرُ", isSun: false },
  { id: 3, word: "الـنَّـخْـلَـةُ", isSun: true },
  { id: 4, word: "الْـكِـتَـابُ", isSun: false },
  { id: 5, word: "الـتُّـفَّـاحَـةُ", isSun: true },
  { id: 6, word: "الْـبَـابُ", isSun: false },
  { id: 7, word: "الـزَّهْـرَةُ", isSun: true },
  { id: 8, word: "الْـمَـدْرَسَـةُ", isSun: false },
  { id: 9, word: "الـثَّـوْبُ", isSun: true },
  { id: 10, word: "الْـعَـصْـفُـورُ", isSun: false },
];

const CONFIG = {
  gameTimeLimit: 60,
  targetScore: 60,
};

export default function ParachuteGame() {
  const navigate = useNavigate();

  // دالة لتوليد المظلات مع إسناد شكل مظلة عشوائي لكل كلمة
  const createInitialParachutes = () => {
    const activeWords = initialWordsData.slice(0, 4);
    return activeWords.map((item, index) => ({
      ...item,
      uniqueId: Date.now() + index,
      left: 5 + index * 23, // توزيع أفقياً بمسافات أكبر للمظلات الضخمة
      top: -30 - Math.random() * 30, // البداية من أعلى الشاشة
      speed: 0.12 + Math.random() * 0.08, // سرعة الهبوط
      imgIndex: index % PARACHUTE_IMAGES.length,
      img: PARACHUTE_IMAGES[index % PARACHUTE_IMAGES.length],
    }));
  };

  const [parachutes, setParachutes] = useState(createInitialParachutes);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CONFIG.gameTimeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const audioCtxRef = useRef(null);

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }, []);

  // ⏱️ عداد الوقت
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

  // 🪂 حلقة هبوط المناطيد المستمرة
  useEffect(() => {
    if (isGameOver) return;

    const animFrame = requestAnimationFrame(() => {
      setParachutes((prevList) =>
        prevList.map((chute) => {
          let newTop = chute.top + chute.speed;

          // عند الوصول إلى القاع تعاد الكلمة من الأعلى بمظلة ورسمة جديدة
          if (newTop > 105) {
            const randomWord = initialWordsData[Math.floor(Math.random() * initialWordsData.length)];
            const randomImgIndex = Math.floor(Math.random() * PARACHUTE_IMAGES.length);
            return {
              ...randomWord,
              uniqueId: Date.now() + Math.random(),
              left: Math.floor(Math.random() * 65) + 5,
              top: -35,
              speed: 0.12 + Math.random() * 0.08,
              imgIndex: randomImgIndex,
              img: PARACHUTE_IMAGES[randomImgIndex],
            };
          }

          return { ...chute, top: newTop };
        })
      );
    });

    return () => cancelAnimationFrame(animFrame);
  }, [parachutes, isGameOver]);

  // الصوتيات ونطق الكلمات
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

  // 🎯 عند الضغط على المظلة
  const handleChuteClick = (clickedChute) => {
    if (isGameOver) return;

    speakWord(clickedChute.word);

    if (clickedChute.isSun) {
      // ✅ لام شمسية -> تختفي وتُستبدل بمظلة جديدة من الأعلى
      playSound("success");
      setScore((prev) => {
        const newScore = prev + 10;
        if (newScore >= CONFIG.targetScore) {
          setIsGameOver(true);
          triggerConfetti();
        }
        return newScore;
      });

      setMessage({ text: "رائع! لام شمسية ☀️", type: "success" });

      setParachutes((prev) =>
        prev.map((c) => {
          if (c.uniqueId === clickedChute.uniqueId) {
            const randomWord = initialWordsData[Math.floor(Math.random() * initialWordsData.length)];
            const randomImgIndex = Math.floor(Math.random() * PARACHUTE_IMAGES.length);
            return {
              ...randomWord,
              uniqueId: Date.now() + Math.random(),
              left: Math.floor(Math.random() * 65) + 5,
              top: -35,
              speed: 0.12 + Math.random() * 0.08,
              imgIndex: randomImgIndex,
              img: PARACHUTE_IMAGES[randomImgIndex],
            };
          }
          return c;
        })
      );
    } else {
      // ❌ لام قمرية -> نغمة خطأ وتستمر في الهبوط
      playSound("error");
      setMessage({ text: "انتبه! هذه لام قمرية 🌙", type: "error" });
    }

    setTimeout(() => setMessage({ text: "", type: "" }), 1800);
  };

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  const startNewGame = () => {
    setParachutes(createInitialParachutes());
    setScore(0);
    setTimeLeft(CONFIG.gameTimeLimit);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية السماء */}
      <img src={skyBgImg} alt="خلفية السماء" style={styles.bgImg} />

      {/* الخشبة العلوية */}
      <div style={styles.headerAreaWrapper} className="header-area-responsive">
        <div style={styles.woodSign} className="wood-sign-responsive">
          <h1 style={styles.mainTitle} className="title-responsive">اجمع الكلمات التي تحتوي على</h1>
          <h2 style={styles.highlightTitle} className="highlight-responsive">اللَّام الشَّمْسِيَّة ☀️</h2>
        </div>
      </div>

      {/* ⭐ النقاط */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position-responsive">
        ⭐ {score} نقاط
      </div>

      {/* ⏱️ الوقت */}
      <div
        style={{
          ...styles.timerBadge,
          color: timeLeft <= 15 ? "#d32f2f" : "#0277bd",
          borderColor: timeLeft <= 15 ? "#d32f2f" : "#0277bd",
        }}
        className="stat-badge-responsive timer-position-responsive"
      >
        <Clock className="clock-icon-responsive" /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
      </div>

      {/* 🪂 منطقة اللعب مع المظلات */}
      <div style={styles.gameArea}>
        {parachutes.map((chute) => {
          const isYellowOrBlue = chute.imgIndex === 0 || chute.imgIndex === 1;
          const chuteClass = isYellowOrBlue ? "chute-extra-large" : "chute-item-responsive";

          return (
            <div
              key={chute.uniqueId}
              onClick={() => handleChuteClick(chute)}
              style={{
                position: "absolute",
                left: `${chute.left}%`,
                top: `${chute.top}%`,
                cursor: "pointer",
              }}
              className={chuteClass}
            >
              {/* صورة المظلة */}
              <img src={chute.img} alt="مظلة" style={styles.fullImg} />

              {/* الكلمة داخل السحابة */}
              <div style={styles.wordOnCloud} className="word-on-cloud-responsive">
                {chute.word}
              </div>
            </div>
          );
        })}
      </div>

      {/* رسالة الفيدباك */}
      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }} className="feedback-responsive">
          {message.text}
        </div>
      )}

      {/* 🏆 شاشة الفوز / انتهاء الوقت (بادنج رأسي قليل وعلى قد المحتوى تماماً) */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winCard} className="win-card-responsive">
            <div style={styles.trophyWrapper}>
              <Trophy className="trophy-icon-responsive" color="#FFD700" />
            </div>
            <h2 style={styles.winTitle} className="win-title-responsive">
              {score >= CONFIG.targetScore ? "أحسنت يا بطل! 🎉" : "انتهى الوقت! ⏳"}
            </h2>

            <div style={styles.winStatsBox} className="win-stats-responsive">
              <span style={styles.winStatLabel} className="win-stat-label-responsive">
                <Star color="#f57c00" className="star-icon-responsive" /> النقاط:
              </span>
              <span style={styles.winStatValue} className="win-stat-value-responsive">{score}</span>
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
  /* 💻 شاشات اللابتوب */
  .chute-item-responsive {
    width: 235px;
    height: auto;
    transition: transform 0.12s ease;
  }
  .chute-extra-large {
    width: 265px;
    height: auto;
    transition: transform 0.12s ease;
  }
  .chute-item-responsive:active, .chute-extra-large:active {
    transform: scale(0.92);
  }

  .word-on-cloud-responsive {
    font-size: 1.95rem !important;
  }

  .clock-icon-responsive {
    width: 22px;
    height: 22px;
  }

  .score-position-responsive { top: 18px; left: 22px; position: absolute; }
  .timer-position-responsive { top: 18px; right: 22px; position: absolute; }

  .stat-badge-responsive {
    font-size: 1.25rem !important;
    padding: 8px 18px !important;
    border-width: 3px !important;
  }

  /* 🏆 تعديلات رسالة الفوز للابتوب (بادنج رأسي قليل جداً لتلتصق بالمحتوى) */
  .win-card-responsive {
    width: max-content !important;
    min-width: 260px !important;
    padding: 8px 22px !important;
  }
  .trophy-icon-responsive { width: 44px !important; height: 44px !important; }
  .win-title-responsive { font-size: 1.4rem !important; margin: 2px 0 6px 0 !important; }
  .win-stats-responsive { padding: 4px 14px !important; margin-bottom: 8px !important; }
  .win-stat-label-responsive { font-size: 1.1rem !important; }
  .win-stat-value-responsive { font-size: 1.2rem !important; }
  .star-icon-responsive { width: 18px !important; height: 18px !important; }
  
  .btn-icon-responsive { width: 28px !important; height: 28px !important; }
  .win-btn-responsive { padding: 12px !important; border-width: 2.5px !important; }

  .ctrl-icon-responsive { width: 30px; height: 30px; }
  .control-btn-responsive { padding: 13px !important; }

  .feedback-responsive {
    font-size: 1.6rem !important;
    padding: 12px 26px !important;
    white-space: nowrap !important;
    width: max-content !important;
    max-width: 90vw !important;
  }

  /* 📱 شاشات التابلت */
  @media (min-width: 641px) and (max-width: 1024px) {
    .wood-sign-responsive { padding: 8px 24px !important; }
    .title-responsive { font-size: 1.15rem !important; }
    .highlight-responsive { font-size: 1.45rem !important; }

    .chute-item-responsive { width: 195px !important; }
    .chute-extra-large { width: 220px !important; }
    .word-on-cloud-responsive { font-size: 1.6rem !important; }

    .stat-badge-responsive { font-size: 1.1rem !important; padding: 6px 14px !important; }
    .control-btn-responsive { padding: 11px !important; }
    .ctrl-icon-responsive { width: 27px !important; height: 27px !important; }
    
    .feedback-responsive {
      font-size: 1.4rem !important;
      padding: 10px 22px !important;
    }

    .win-card-responsive { width: max-content !important; min-width: 240px !important; padding: 7px 18px !important; }
    .trophy-icon-responsive { width: 40px !important; height: 40px !important; }
    .win-title-responsive { font-size: 1.25rem !important; margin: 2px 0 5px 0 !important; }
    .win-btn-responsive { padding: 10px !important; }
    .btn-icon-responsive { width: 25px !important; height: 25px !important; }
  }

  /* 📱 شاشات الموبايل */
  @media (max-width: 640px) {
    .header-area-responsive { top: 6px !important; }
    .wood-sign-responsive { padding: 6px 14px !important; border-width: 3px !important; }
    .title-responsive { font-size: 0.95rem !important; }
    .highlight-responsive { font-size: 1.2rem !important; }

    .score-position-responsive { top: 10px !important; right: 10px !important; left: auto !important; }
    .timer-position-responsive { top: 10px !important; left: 10px !important; right: auto !important; }

    .stat-badge-responsive { font-size: 0.9rem !important; padding: 4px 10px !important; border-width: 2px !important; }
    .clock-icon-responsive { width: 16px; height: 16px; }

    .chute-item-responsive { width: 148px !important; }
    .chute-extra-large { width: 170px !important; }
    .word-on-cloud-responsive { font-size: 1.3rem !important; }

    .feedback-responsive { 
      font-size: 1.15rem !important; 
      padding: 8px 16px !important; 
      white-space: nowrap !important;
      width: max-content !important;
      max-width: 85vw !important;
    }

    /* 🏆 رسالة الفوز للموبايل: بادنج رأسي ضيق ومضبوط تماماً على قد المحتوى */
    .win-card-responsive { 
      width: max-content !important; 
      min-width: 210px !important; 
      padding: 6px 14px !important; 
      border-width: 3px !important; 
    }
    .trophy-icon-responsive { width: 34px !important; height: 34px !important; }
    .win-title-responsive { font-size: 1.1rem !important; margin: 2px 0 4px 0 !important; }
    .win-stats-responsive { padding: 3px 10px !important; margin-bottom: 6px !important; }
    .win-stat-label-responsive { font-size: 0.95rem !important; }
    .win-stat-value-responsive { font-size: 1.05rem !important; }
    .star-icon-responsive { width: 16px !important; height: 16px !important; }
    
    .win-btn-responsive { padding: 9px !important; border-width: 2px !important; }
    .btn-icon-responsive { width: 22px !important; height: 22px !important; }

    .control-btn-responsive { padding: 9px !important; border-width: 2px !important; }
    .ctrl-icon-responsive { width: 22px !important; height: 22px !important; }
    .controls-responsive { bottom: 12px !important; gap: 10px !important; }
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
    backgroundColor: "#87ceeb",
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
  gameArea: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 5,
  },
  headerAreaWrapper: {
    position: "absolute",
    top: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  woodSign: {
    backgroundColor: "rgba(139, 90, 43, 0.95)",
    padding: "8px 28px",
    borderRadius: "18px",
    border: "3.5px solid #5d3a1a",
    boxShadow: "0 5px 14px rgba(0, 0, 0, 0.4)",
    textAlign: "center",
  },
  mainTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "700",
  },
  highlightTitle: {
    margin: "3px 0 0 0",
    color: "#ffdd00",
    fontSize: "1.5rem",
    fontWeight: "900",
  },
  scoreBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    color: "#f57c00",
    border: "3px solid #f57c00",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 25,
  },
  timerBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    border: "3px solid",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 25,
  },
  wordOnCloud: {
    position: "absolute",
    bottom: "16%",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: "900",
    color: "#1a252c",
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
    zIndex: 50,
    borderRadius: "18px",
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
    background: "rgba(0, 0, 0, 0.68)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winCard: {
    background: "#ffffff",
    border: "4px solid #8b5a2b",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trophyWrapper: {
    marginBottom: "0px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
  },
  winTitle: {
    color: "#2e7d32",
    fontWeight: "800",
  },
  winStatsBox: {
    background: "#fdf8e1",
    borderRadius: "10px",
    border: "2px solid #ffe082",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    width: "100%",
    boxSizing: "border-box",
  },
  winStatLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "bold",
    color: "#5d4037",
  },
  winStatValue: {
    fontWeight: "900",
    color: "#e65100",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  winIconBtn: {
    background: "#ffffff",
    border: "2px solid #8b5a2b",
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
    borderRadius: "50%",
    cursor: "pointer",
    color: "#8b5a2b",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};