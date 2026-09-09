// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور والوسائط ===
import roomBgImg from "../assets/closetBg.jpeg"; 
import closetImg from "../assets/closet.png";   
import boyImg from "../assets/boyStanding1.png"; 

import shirtImg from "../assets/shirt.png";
import pantsImg from "../assets/pants.png";
import shoesImg from "../assets/shoes1.png";
import hatImg from "../assets/hat.png";
import bagImg from "../assets/bag1.png";

// === 2. مصفوفة العناصر (الملابس) ===
const CLOTHES_ITEMS = [
  { id: "shirt", name: "قَمِيصِي", img: shirtImg },
  { id: "pants", name: "بَنْطَلُونِي", img: pantsImg },
  { id: "shoes", name: "حِذَائِي", img: shoesImg },
  { id: "hat", name: "قُبَّعَتِي", img: hatImg },
  { id: "bag", name: "حَقِيبَتِي", img: bagImg },
];

// ⚙️ [1] تحكم كامل بأبعاد القطع داخل الدولاب للشاشات الكبيرة (Desktop / Laptop)
const IN_CLOSET_ITEMS_CONFIG = {
  shirt: { top: "32%", left: "42%", width: "22%", height: "25%", scale: 1.0 },
  pants: { top: "29%", left: "56%", width: "29%", height: "35%", scale: 1.0 },
  shoes: { top: "65%", left: "20%", width: "22%", height: "20%", scale: 1.0 },
  hat:   { top: "11%", left: "19%", width: "22%", height: "28%", scale: 1.0 },
  bag:   { top: "30%", left: "13%", width: "35%", height: "38%", scale: 1.0 },
};

// ⚙️ [2] تحكم كامل بأبعاد القطع داخل الدولاب للشاشات الصغيرة (Mobile / Tablet)
const IN_CLOSET_ITEMS_CONFIG_MOBILE = {
  shirt: { top: "35%", left: "42%", width: "22%", height: "25%", scale: 1.0 },
  pants: { top: "35%", left: "56%", width: "28%", height: "27%", scale: 1.0 },
  shoes: { top: "56%", left: "19%", width: "24%", height: "20%", scale: 1.0 },
  hat:   { top: "23%", left: "19%", width: "24%", height: "20%", scale: 1.0 },
  bag:   { top: "36%", left: "14%",  width: "35%", height: "27%", scale: 1.0 },
};

export default function ClosetYaaGame() {
  const navigate = useNavigate();

  const [placedItems, setPlacedItems] = useState([]);
  const [activeDragId, setActiveDragId] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // حالة لمعرفة هل الشاشة موبايل/تابلت أم شاشة كبيرة
  const [isMobile, setIsMobile] = useState(false);

  const audioCtxRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const handlePointerDown = (item, e) => {
    if (placedItems.includes(item.id) || isGameOver) return;
    speakWord(item.name);
    setActiveDragId(item.id);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!activeDragId) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    if (!activeDragId) return;

    const currentItem = CLOTHES_ITEMS.find((it) => it.id === activeDragId);
    const dropZone = document.getElementById(`target-${activeDragId}`);

    if (dropZone && currentItem) {
      const rect = dropZone.getBoundingClientRect();
      const dropX = e.clientX;
      const dropY = e.clientY;

      if (
        dropX >= rect.left &&
        dropX <= rect.right &&
        dropY >= rect.top &&
        dropY <= rect.bottom
      ) {
        playSound("success");
        const nextPlaced = [...placedItems, activeDragId];
        setPlacedItems(nextPlaced);
        setScore((prev) => prev + 20);
        setMessage({ text: `رائع! وضعت ${currentItem.name} 👏`, type: "success" });

        if (nextPlaced.length === CLOTHES_ITEMS.length) {
          setTimeout(() => {
            setIsGameOver(true);
            triggerConfetti();
          }, 800);
        }
      } else {
        playSound("error");
        setMessage({ text: "ضع القطعة في مكانها الصحيح بالخزانة ❌", type: "error" });
      }
    }

    setActiveDragId(null);
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
    setPlacedItems([]);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
    setActiveDragId(null);
  };

  // اختيار الإعدادات المناسبة بناءً على حجم الشاشة
  const activeConfigMap = isMobile ? IN_CLOSET_ITEMS_CONFIG_MOBILE : IN_CLOSET_ITEMS_CONFIG;

  return (
    <div
      id="game-container"
      ref={containerRef}
      style={styles.container}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <style>{responsiveCSS}</style>

      {/* 🖼️ خلفية الغرفة */}
      <img src={roomBgImg} alt="خلفية الغرفة" style={styles.bgImg} />

      {/* 🏷️ العنوان */}
      <div style={styles.headerContainer} className="header-container-responsive">
        <h1 style={styles.gameTitle} className="game-title-responsive">
          ياء الملكية 👕
        </h1>
        <p style={styles.gameSubtitle} className="game-subtitle-responsive">
     ضع الملابس في الدلاب المناسب لتتعلم ياء الملكية
        </p>
      </div>

      {/* 👦 الولد */}
      <div style={styles.boyWrapper} className="boy-wrapper-responsive">
        <img src={boyImg} alt="الولد" style={styles.fullImg} />
      </div>

      {/* 👔 شريط كروت الملابس */}
      <div style={styles.sideBar} className="side-bar-responsive">
        {CLOTHES_ITEMS.map((item) => {
          const isPlaced = placedItems.includes(item.id);
          const isDraggingThis = activeDragId === item.id;

          return (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(item, e)}
              className={`item-card-responsive ${isPlaced ? "item-disabled" : ""}`}
              style={{
                ...styles.itemCard,
                opacity: isPlaced ? 0.3 : isDraggingThis ? 0 : 1,
              }}
            >
              <img src={item.img} alt={item.name} style={styles.itemImg} />
              <span style={styles.itemText} className="item-text-responsive">{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* 🚪 الدولاب والأغراض بداخلها */}
      <div style={styles.closetWrapper} className="closet-wrapper-responsive">
        <img src={closetImg} alt="الخزانة" style={styles.fullImg} />

        {/* 🎯 الأماكن المخصصة للقطع مع الحجم القابل للتعديل */}
        {CLOTHES_ITEMS.map((item) => {
          const isPlaced = placedItems.includes(item.id);
          const config = activeConfigMap[item.id] || { top: "35%", left: "50%", width: "20%", height: "20%", scale: 1 };

          return (
            <div
              key={`target-${item.id}`}
              id={`target-${item.id}`}
              style={{
                position: "absolute",
                top: config.top,
                left: config.left,
                width: config.width,
                height: config.height,
                transform: `scale(${config.scale})`,
                zIndex: 25,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {isPlaced && (
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  className="placed-anim"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 🌟 الإحصائيات */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score}
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive timer-position">
        <Clock size={24} color="#0284c7" /> {timer}
      </div>

      {/* 🖐️ عنصر السحب */}
      {activeDragId && (
        <div
          style={{
            position: "fixed",
            left: dragPos.x - 60,
            top: dragPos.y - 60,
            width: "120px",
            height: "120px",
            pointerEvents: "none",
            zIndex: 999,
            transform: "scale(1.2)",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
          }}
        >
          <img
            src={CLOTHES_ITEMS.find((i) => i.id === activeDragId)?.img}
            alt="سحب"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* 💬 الرسائل والتغذية الراجعة */}
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
              أحسنت يا بطل👕🎉
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
        <button onClick={() => navigate(-1)} style={styles.iconBtn} className="control-btn-responsive" title="رجوع">
          <ArrowRight className="ctrl-icon-responsive" />
        </button>
      </div>
    </div>
  );
}

// === 🎨 الـ CSS والتنسيقات ===
const responsiveCSS = `
  .placed-anim {
    animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes popIn {
    0% { transform: scale(0.4); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .item-disabled {
    pointer-events: none;
    filter: grayscale(0.6);
  }

  .stat-badge-responsive {
    font-size: 1.25rem !important;
    padding: 8px 20px !important;
    position: absolute;
    z-index: 40;
  }

  .score-position { top: 16px; left: 20px; }
  .timer-position { top: 16px; right: 20px; }

  .boy-wrapper-responsive {
    position: absolute;
    bottom: 12%;
    left: 1%;
    width: 25%;
    height: 72%;
    z-index: 8;
  }

  .side-bar-responsive {
    position: absolute;
    top: 24%;
    left: 25%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    z-index: 30;
  }

  .closet-wrapper-responsive {
    position: absolute;
    bottom: -20%;
    left: 5%;
    transform: translateX(-20%);
    width: 48%;
    height: 72%;
    z-index: 10;
  }

  .controls-bottom-responsive {
    position: absolute;
    bottom: 2%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
    z-index: 40;
  }

  .item-card-responsive {
    width: 90px;
    height: 110px;
    background: #fffef2;
    border: 3.5px dashed #8B5CF6;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: grab;
    user-select: none;
    touch-action: none;
    box-shadow: 0 6px 14px rgba(0,0,0,0.18);
    transition: transform 0.15s ease, border-color 0.2s;
  }

  .item-card-responsive:active {
    cursor: grabbing;
    transform: scale(0.95);
  }

  .item-text-responsive {
    font-size: 1.50rem !important;
    font-weight: 900 !important;
    color: #4C1D95 !important;
  }

  .control-btn-responsive {
    padding: 12px !important;
    border-width: 3px !important;
  }

  .ctrl-icon-responsive {
    width: 25px !important;
    height: 25px !important;
  }

  .header-container-responsive {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 35;
    background: rgba(255, 255, 255, 0.88);
    padding: 6px 24px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    backdrop-filter: blur(4px);
  }

  .game-title-responsive {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 900;
    color: #5B21B6;
  }

  .game-subtitle-responsive {
    margin: 2px 0 0 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: #4C1D95;
  }

  .win-card-responsive { width: 200px !important; padding: 22px 26px !important; }
  .trophy-icon-responsive { width: 60px; height: 60px; }
  .win-title-responsive { font-size: 1.4rem !important; margin: 6px 0 10px 0 !important; }
  .win-stats-responsive { padding: 10px 16px !important; margin-bottom: 14px !important; }
  .win-stat-label-responsive { font-size: 1.1rem !important; }
  .star-icon-responsive { width: 22px; height: 22px; }
  .btn-icon-responsive { width: 20px; height: 20px; }
  .win-btn-responsive { padding: 10px !important; }

  /* 📱 للموبايل والتابلت */
  @media (max-width: 900px) {
    .game-title-responsive { font-size: 1.2rem !important; }
    .game-subtitle-responsive { font-size: 0.8rem !important; }
    
    .boy-wrapper-responsive {
      width: 32% !important;
      height: 60% !important;
      left: -2% !important;
      bottom: 12% !important;
      z-index: 5 !important;
    }

    .closet-wrapper-responsive {
      width: 70% !important;
      height: 62% !important;
      left: 30% !important;
      bottom: -25% !important;
      transform: translateX(-50%) !important;
      z-index: 10 !important;
    }

    .side-bar-responsive {
      position: absolute !important;
      top: auto !important;
      bottom: 10.5% !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      display: flex !important;
      flex-direction: row !important;
      gap: 6px !important;
      width: 96% !important;
      justify-content: center !important;
      z-index: 30 !important;
    }

    .item-card-responsive {
      width: 66px !important;
      height: 72px !important;
      border-width: 2px !important;
      border-radius: 12px !important;
      padding: 2px !important;
    }

    .item-text-responsive {
      font-size: 1.2rem !important;
    }

    .controls-bottom-responsive {
      bottom: 2% !important;
      gap: 16px !important;
    }

    .control-btn-responsive {
      padding: 8px !important;
    }

    .ctrl-icon-responsive {
      width: 22px !important;
      height: 22px !important;
    }

    .stat-badge-responsive {
      font-size: 1rem !important;
      padding: 4px 12px !important;
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
    backgroundColor: "#e2f1db",
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
  headerContainer: {},
  gameTitle: {},
  gameSubtitle: {},
  boyWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  sideBar: {},
  closetWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
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
  itemImg: {
    width: "65%",
    height: "65%",
    objectFit: "contain",
    pointerEvents: "none",
  },
  itemText: {
    marginTop: "2px",
    pointerEvents: "none",
  },
  feedbackMessage: {
    position: "absolute",
    top: "16%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 60,
    borderRadius: "20px",
    fontWeight: "bold",
    color: "#fff",
    padding: "8px 22px",
    fontSize: "1.2rem",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
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
    border: "4.5px solid #6D28D9",
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
    color: "#5B21B6",
    fontWeight: "800",
  },
  winStatsBox: {
    background: "#F3E8FF",
    borderRadius: "14px",
    border: "2px solid #DDD6FE",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    width: "70%",
    boxSizing: "border-box",
  },
  winStatLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "bold",
    color: "#6D28D9",
    
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",

  },
  winIconBtn: {
    background: "#ffffff",
    border: "2.5px solid #6D28D9",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#6D28D9",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsBarBottom: {},
  iconBtn: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "50%",
    border: "3px solid #6D28D9",
    cursor: "pointer",
    color: "#6D28D9",
    boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};