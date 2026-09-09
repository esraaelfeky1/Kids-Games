// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🖼️ استيراد الصور
import farmBgImg from "../assets/farmBg6.jpeg";         // خلفية المزرعة (للاجهزة الكبيرة والتابلت)
import mobileBgImg from "../assets/mobileBg.jpeg";     // 📱 خلفية المزرعة الخاصة بالموبايل فقط
import boyDownImg from "../assets/boyDown.png";       // الولد يده للأسفل
import boyUpImg from "../assets/boyUp.png";           // الولد يرفع يده للقطف
import basketImg from "../assets/basket.png";         // السلة فارغة
import redAppleImg from "../assets/redApple.png";     // تفاحة حمراء
import greenAppleImg from "../assets/greenApple.png"; // تفاحة خضراء

// 🎯 قائمة التفاحات: 4 تفاحات على كل شجرة (إجمالي 20 تفاحة)
const INITIAL_APPLES = [
  // 🌲 الشجرة 1 (أعلى اليسار - 4 تفاحات)
  { id: "a1_1", text: "دنيا", isTarget: true, type: "red", pos: { top: "25%", left: "11%" } },
  { id: "a1_2", text: "قلم", isTarget: false, type: "green", pos: { top: "35%", left: "16%" } },
  { id: "a1_3", text: "سعى", isTarget: true, type: "red", pos: { top: "42%", left: "9%" } },
  { id: "a1_4", text: "كتاب", isTarget: false, type: "green", pos: { top: "28%", left: "20%" } },

  // 🌲 الشجرة 2 (أسفل اليسار - 4 تفاحات)
  { id: "a2_1", text: "مستشفى", isTarget: true, type: "red", pos: { top: "60%", left: "12%" } },
  { id: "a2_2", text: "علم", isTarget: false, type: "green", pos: { top: "70%", left: "6%" } },
  { id: "a2_3", text: "على", isTarget: true, type: "red", pos: { top: "65%", left: "18%" } },
  { id: "a2_4", text: "شمس", isTarget: false, type: "green", pos: { top: "76%", left: "14%" } },

  // 🌲 الشجرة 3 (المنتصف - 4 تفاحات)
  { id: "a3_1", text: "فتى", isTarget: true, type: "red", pos: { top: "28%", left: "46%" } },
  { id: "a3_2", text: "بيت", isTarget: false, type: "green", pos: { top: "36%", left: "54%" } },
  { id: "a3_3", text: "إلى", isTarget: true, type: "red", pos: { top: "44%", left: "42%" } },
  { id: "a3_4", text: "ولد", isTarget: false, type: "green", pos: { top: "50%", left: "50%" } },

  // 🌲 الشجرة 4 (أعلى اليمين - 4 تفاحات)
  { id: "a4_1", text: "هدى", isTarget: true, type: "red", pos: { top: "26%", left: "77%" } },
  { id: "a4_2", text: "شجر", isTarget: false, type: "green", pos: { top: "36%", left: "83%" } },
  { id: "a4_3", text: "منى", isTarget: true, type: "red", pos: { top: "43%", left: "74%" } },
  { id: "a4_4", text: "زهر", isTarget: false, type: "green", pos: { top: "30%", left: "86%" } },

  // 🌲 الشجرة 5 (أسفل اليمين - 4 تفاحات)
  { id: "a5_1", text: "أعطى", isTarget: true, type: "red", pos: { top: "60%", left: "80%" } },
  { id: "a5_2", text: "باب", isTarget: false, type: "green", pos: { top: "70%", left: "73%" } },
  { id: "a5_3", text: "رمى", isTarget: true, type: "red", pos: { top: "74%", left: "84%" } },
  { id: "a5_4", text: "قمر", isTarget: false, type: "green", pos: { top: "64%", left: "88%" } }
];

export default function AppleGame() {
  const navigate = useNavigate();

  const [apples, setApples] = useState(INITIAL_APPLES);
  const [basketItems, setBasketItems] = useState([]); 
  const [boyState, setBoyState] = useState("down"); 
  const [boyPos, setBoyPos] = useState({ transform: "translate(0px, 0px)" });
  const [heldApple, setHeldApple] = useState(null);
  const [showBox, setShowBox] = useState(false);
  
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isBusy, setIsBusy] = useState(false);

  const audioCtxRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  const appleRefs = useRef({});
  const boyRef = useRef(null);
  const basketRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (!isGameOver) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
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
      } else if (type === "pick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {
      console.warn("خطأ في الصوت:", e);
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

  const pickTargetApple = (apple) => {
    if (!boyRef.current || !appleRefs.current[apple.id] || !basketRef.current) return;

    setIsBusy(true);
    speakWord(apple.text);
    showQuickMessage("صح! ✨", "success");

    const boyRect = boyRef.current.getBoundingClientRect();
    const appleRect = appleRefs.current[apple.id].getBoundingClientRect();

    const walkToAppleX = appleRect.left + appleRect.width / 2 - (boyRect.left + boyRect.width / 2);
    const walkToAppleY = appleRect.top + appleRect.height / 2 - (boyRect.top + boyRect.height / 2);

    setShowBox(true);

    setBoyPos({
      transform: `translate(${walkToAppleX}px, ${walkToAppleY + 20}px)`,
      transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
    });

    setTimeout(() => {
      setBoyState("up");
      playSound("pick");

      setApples((prev) => prev.map((a) => (a.id === apple.id ? { ...a, isPicked: true } : a)));
      setHeldApple(apple);

      setTimeout(() => {
        setBoyState("down");
        setBoyPos({
          transform: "translate(0px, 0px)",
          transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
        });

        setTimeout(() => {
          setHeldApple(null);
          setShowBox(false);
          setBasketItems((prev) => [...prev, apple]);
          playSound("success");
          setScore((prev) => prev + 50);
          setIsBusy(false);

          setApples((prevApples) => {
            const remaining = prevApples.filter((a) => a.isTarget && !a.isPicked).length;
            if (remaining === 0) {
              setTimeout(() => setIsGameOver(true), 500);
            }
            return prevApples;
          });
        }, 1200);

      }, 450);

    }, 1200);
  };

  const handleAppleClick = (apple) => {
    if (isGameOver || apple.isPicked || isBusy) return;

    if (apple.isTarget) {
      pickTargetApple(apple);
    } else {
      speakWord(apple.text);
      playSound("error");
      showQuickMessage("خطأ! ❌", "error");
    }
  };

  const startNewGame = () => {
    setApples(INITIAL_APPLES);
    setBasketItems([]);
    setBoyState("down");
    setBoyPos({ transform: "translate(0px, 0px)" });
    setHeldApple(null);
    setShowBox(false);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setIsBusy(false);
    setMessage({ text: "", type: "" });
  };

  const handleBack = () => {
    navigate("/Soft");
  };

  return (
    <div id="game-container" style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🌌 خلفية المزرعة (للاب توب والتابلت) */}
      <img src={farmBgImg} alt="خلفية المزرعة" style={styles.bgImg} className="desktop-tablet-bg" />

      {/* 📱 خلفية المزرعة (للموبايل فقط) */}
      <img src={mobileBgImg} alt="خلفية المزرعة للموبايل" style={styles.bgImg} className="mobile-only-bg" />

      {/* 🖼️ إطار العنوان بدون تشكيل */}
      <div style={styles.headerContainer} className="header-container-responsive">
        <h1 style={styles.gameTitle} className="game-title-responsive">
          اجمع الفواكه التي تحمل كلمات فيها ألف لينة
        </h1>
      </div>

      {/* 🍎 التفاح الموزع */}
      {apples.map((apple) => {
        const appleImg = apple.type === "red" ? redAppleImg : greenAppleImg;

        return (
          <div
            key={apple.id}
            ref={(el) => (appleRefs.current[apple.id] = el)}
            onClick={() => handleAppleClick(apple)}
            style={{
              ...styles.appleWrapper,
              top: apple.pos.top,
              left: apple.pos.left,
              visibility: apple.isPicked ? "hidden" : "visible",
            }}
            className={`apple-responsive apple-pos-${apple.id}`}
          >
            <img src={appleImg} alt="تفاحة" style={styles.appleImg} />
            <span style={styles.appleText} className="apple-text-responsive">
              {apple.text}
            </span>
          </div>
        );
      })}

      {/* 👦 الولد مع الصندوق الخشبي */}
      <div
        ref={boyRef}
        style={{
          ...styles.boyContainer,
          ...boyPos,
        }}
        className="boy-container-responsive"
      >
        <img
          src={boyState === "down" ? boyDownImg : boyUpImg}
          alt="الولد"
          style={styles.boyImg}
        />

        {showBox && (
          <div style={styles.woodenBox} className="wooden-box-responsive">
            <div style={styles.boxPlank}></div>
            <div style={styles.boxPlank}></div>
            <div style={styles.boxCross1}></div>
            <div style={styles.boxCross2}></div>
          </div>
        )}

        {heldApple && (
          <div style={styles.heldAppleWrapper}>
            <img
              src={heldApple.type === "red" ? redAppleImg : greenAppleImg}
              alt="تفاحة بيده"
              style={{ width: "32px" }}
            />
          </div>
        )}
      </div>

      {/* 🧺 السلة */}
      <div ref={basketRef} style={styles.basketContainer} className="basket-container-responsive">
        <img src={basketImg} alt="السلة" style={styles.basketImg} />

        <div style={styles.applesInBasketOverlay}>
          {basketItems.map((item, index) => {
            const itemImg = item.type === "red" ? redAppleImg : greenAppleImg;
            const offsetX = (index % 3) * 8 - 8;
            const offsetY = Math.floor(index / 3) * 7;

            return (
              <img
                key={index}
                src={itemImg}
                alt="تفاحة بالسلة"
                style={{
                  ...styles.stackedApple,
                  transform: `translate(${offsetX}px, -${offsetY}px) scale(0.85)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 🌟 النقاط والوقت */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score}
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive timer-position">
        <Clock size={20} color="#0284c7" /> {timer}
      </div>

      {/* 💬 التغذية الراجعة */}
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
              عاش يا بطل! جمعت تفاح الألف اللينة بنجاح 🧺✨
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

// === 🎨 CSS التجاوب والتنسيقات ===
const responsiveCSS = `
  .desktop-tablet-bg {
    display: block;
  }
  .mobile-only-bg {
    display: none;
  }

  .apple-responsive {
    position: absolute;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    transition: filter 0.2s ease, transform 0.2s ease;
    z-index: 10;
  }

  .apple-responsive:hover {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.95));
    transform: scale(1.08);
  }

  .stat-badge-responsive {
    font-size: 1.15rem !important;
    padding: 6px 16px !important;
    position: absolute;
    z-index: 40;
  }

  .score-position { top: 16px; left: 20px; }
  .timer-position { top: 16px; right: 20px; }

  .header-container-responsive {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 35;
    background: rgba(15, 23, 42, 0.85);
    border: 2px solid #38bdf8;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
    border-radius: 18px;
    padding: 6px 20px;
    max-width: 90%;
  }

  .game-title-responsive {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 900;
    color: #ffffff;
    text-align: center;
    white-space: nowrap;
  }

  .apple-text-responsive {
    font-size: 1.15rem;
    font-weight: 900;
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
  }

  .boy-container-responsive {
    position: absolute;
    bottom: 80px;
    left: calc(50% - 110px);
    width: 125px;
    z-index: 25;
    pointer-events: none;
  }

  .basket-container-responsive {
    position: absolute;
    bottom: 75px;
    left: calc(50% + 15px);
    width: 105px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .wooden-box-responsive {
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    width: 85px;
    height: 40px;
    background: #8d5524;
    border: 3px solid #5c3317;
    border-radius: 6px;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    z-index: -1;
  }

  .controls-bottom-responsive {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
    z-index: 40;
  }

  .win-card-responsive { width: 260px !important; padding: 16px 20px !important; }
  .trophy-icon-responsive { width: 42px !important; height: 42px !important; }
  .win-title-responsive { font-size: 1.05rem !important; margin: 6px 0 10px 0 !important; }
  .win-stats-responsive { padding: 6px 12px !important; margin-bottom: 12px !important; }
  .win-stat-label-responsive { font-size: 0.95rem !important; }
  .star-icon-responsive { width: 18px !important; height: 18px !important; }
  .btn-icon-responsive { width: 20px !important; height: 20px !important; }
  .win-btn-responsive { padding: 8px !important; }

  /* 💻 1. مواقع التفاح المخصصة للشاشات الكبيرة واللابتوب (أكبر من 1024px) */
  @media (min-width: 1025px) {
    .apple-pos-a1_1 { top: 25% !important; left: 11% !important; }
    .apple-pos-a1_2 { top: 25% !important; left: 16% !important; }
    .apple-pos-a1_3 { top: 12% !important; left: 17% !important; }
    .apple-pos-a1_4 { top: 14% !important; left: 10% !important; }

    .apple-pos-a2_1 { top: 60% !important; left: 12% !important; }
    .apple-pos-a2_2 { top: 70% !important; left: 6% !important; }
    .apple-pos-a2_3 { top: 65% !important; left: 18% !important; }
    .apple-pos-a2_4 { top: 76% !important; left: 14% !important; }

    .apple-pos-a3_1 { top: 35% !important; left: 46% !important; }
    .apple-pos-a3_2 { top: 32% !important; left: 54% !important; }
    .apple-pos-a3_3 { top: 14% !important; left: 52% !important; }
    .apple-pos-a3_4 { top: 20% !important; left: 48% !important; }

    .apple-pos-a4_1 { top: 26% !important; left: 77% !important; }
    .apple-pos-a4_2 { top: 30% !important; left: 83% !important; }
    .apple-pos-a4_3 { top: 17% !important; left: 79% !important; }
    .apple-pos-a4_4 { top: 20% !important; left: 84% !important; }

    .apple-pos-a5_1 { top: 60% !important; left: 80% !important; }
    .apple-pos-a5_2 { top: 70% !important; left: 73% !important; }
    .apple-pos-a5_3 { top: 74% !important; left: 80% !important; }
    .apple-pos-a5_4 { top: 60% !important; left: 72% !important; }
  }

  /* 📱💻 2. مواقع التفاح المخصصة للتابلت (بين 601px و 1024px) */
  @media (min-width: 601px) and (max-width: 1024px) {
    .apple-pos-a1_1 { top: 24% !important; left: 8% !important; }
    .apple-pos-a1_2 { top: 34% !important; left: 13% !important; }
    .apple-pos-a1_3 { top: 31% !important; left: 5% !important; }
    .apple-pos-a1_4 { top: 27% !important; left: 15% !important; }

    .apple-pos-a2_1 { top: 59% !important; left: 13% !important; }
    .apple-pos-a2_2 { top: 69% !important; left: 7% !important; }
    .apple-pos-a2_3 { top: 60% !important; left: 5% !important; }
    .apple-pos-a2_4 { top: 70% !important; left: 15% !important; }

    .apple-pos-a3_1 { top: 27% !important; left: 45% !important; }
    .apple-pos-a3_2 { top: 38% !important; left: 54% !important; }
    .apple-pos-a3_3 { top: 38% !important; left: 45% !important; }
    .apple-pos-a3_4 { top: 28% !important; left: 54% !important; }

    .apple-pos-a4_1 { top: 25% !important; left: 76% !important; }
    .apple-pos-a4_2 { top: 39% !important; left: 82% !important; }
    .apple-pos-a4_3 { top: 35% !important; left: 73% !important; }
    .apple-pos-a4_4 { top: 29% !important; left: 85% !important; }

    .apple-pos-a5_1 { top: 55% !important; left: 70% !important; }
    .apple-pos-a5_2 { top: 65% !important; left: 68% !important; }
    .apple-pos-a5_3 { top: 68% !important; left: 80% !important; }
    .apple-pos-a5_4 { top: 56% !important; left: 78% !important; }
  }

  /* 📱 3. مواقع التفاح المخصصة للموبايل (أقل من 600px) */
  @media (max-width: 600px) {
    .desktop-tablet-bg {
      display: none !important;
    }
    .mobile-only-bg {
      display: block !important;
    }

    .header-container-responsive {
      top: 10px !important;
      padding: 5px 14px !important;
      border-radius: 12px !important;
    }

    .game-title-responsive { 
      font-size: 0.95rem !important; 
    }

    .apple-responsive {
      width: 48px !important;
    }

    .apple-text-responsive {
      font-size: 0.9rem !important;
      font-weight: 900 !important;
    }

    .apple-pos-a1_1 { top: 24% !important; left: 5% !important; }
    .apple-pos-a1_2 { top: 33% !important; left: 13% !important; }
    .apple-pos-a1_3 { top: 33% !important; left: 5% !important; }
    .apple-pos-a1_4 { top: 24% !important; left: 13% !important; }

    .apple-pos-a2_1 { top: 58% !important; left: 14% !important; }
    .apple-pos-a2_2 { top: 58% !important; left: 3% !important; }
    .apple-pos-a2_3 { top: 50% !important; left: 15% !important; }
    .apple-pos-a2_4 { top: 51% !important; left: 6% !important; }

    .apple-pos-a3_1 { top: 35% !important; left: 44% !important; }
    .apple-pos-a3_2 { top: 34% !important; left: 56% !important; }
    .apple-pos-a3_3 { top: 28% !important; left: 47% !important; }
    .apple-pos-a3_4 { top: 28% !important; left: 55% !important; }

    .apple-pos-a4_1 { top: 35% !important; left: 74% !important; }
    .apple-pos-a4_2 { top: 36% !important; left: 84% !important; }
    .apple-pos-a4_3 { top: 29% !important; left: 85% !important; }
    .apple-pos-a4_4 { top: 27% !important; left: 76% !important; }

    .apple-pos-a5_1 { top: 58% !important; left: 78% !important; }
    .apple-pos-a5_2 { top: 48% !important; left: 74% !important; }
    .apple-pos-a5_3 { top: 52% !important; left: 82% !important; }
    .apple-pos-a5_4 { top: 57% !important; left: 70% !important; }

    .boy-container-responsive {
      width: 90px !important;
      left: calc(50% - 85px) !important;
      bottom: 70px !important;
    }

    .wooden-box-responsive {
      width: 65px !important;
      height: 30px !important;
      bottom: -25px !important;
    }

    .basket-container-responsive {
      width: 95px !important;
      left: calc(50% + 10px) !important;
      bottom: 65px !important;
    }

    .controls-bottom-responsive {
      bottom: 10px !important;
      gap: 10px !important;
    }

    .control-btn-responsive {
      padding: 7px !important;
    }

    .ctrl-icon-responsive {
      width: 20px !important;
      height: 20px !important;
    }

    .stat-badge-responsive {
      font-size: 0.85rem !important;
      padding: 4px 10px !important;
    }

    .win-card-responsive { width: 220px !important; padding: 12px 14px !important; }
    .trophy-icon-responsive { width: 34px !important; height: 34px !important; }
    .win-title-responsive { font-size: 0.85rem !important; }
    .win-stat-label-responsive { font-size: 0.8rem !important; }
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
  headerContainer: {},
  gameTitle: {},
  appleWrapper: {},
  appleImg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  appleText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    whiteSpace: "nowrap",
    pointerEvents: "none",
  },
  boyContainer: {
    position: "absolute",
  },
  boyImg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  woodenBox: {
    position: "absolute",
  },
  boxPlank: {
    width: "100%",
    height: "33%",
    borderBottom: "1.5px solid #5c3317",
    boxSizing: "border-box",
  },
  boxCross1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderTop: "1.5px solid #5c3317",
    transform: "rotate(15deg)",
    opacity: 0.3,
  },
  boxCross2: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderTop: "1.5px solid #5c3317",
    transform: "rotate(-15deg)",
    opacity: 0.3,
  },
  heldAppleWrapper: {
    position: "absolute",
    top: "15%",
    left: "60%",
    zIndex: 30,
  },
  basketContainer: {
    position: "absolute",
  },
  basketImg: {
    width: "100%",
    height: "auto",
    display: "block",
    position: "relative",
    zIndex: 2,
  },
  applesInBasketOverlay: {
    position: "absolute",
    bottom: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "70%",
    height: "50%",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  stackedApple: {
    position: "absolute",
    width: "28px",
    height: "auto",
    filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
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
    justifycontent: "center",
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