// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === استيراد الصور ===
import treasureBgImg from "../assets/treasurebg.jpeg";       
import chestImg from "../assets/treasurechest.png";         
import gemRedImg from "../assets/gemred.png";               
import gemGreenImg from "../assets/gemgreen.png";           
import gemPurpleImg from "../assets/gempurple.png";         
import gemYellowImg from "../assets/gemyellow.png";         

// ==========================================
// 🎛️ لوحة التحكم العامة
// ==========================================
const CUSTOM_CONTROL = {
  gemsGrid: {
    maxWidth: "560px",
    gemSize: "105px",
    fontSize: "1.85rem",
  },
  chestArea: {
    width: "240px",
    bottom: "8%",
    right: "5%",
  }
};

const gemImages = [gemRedImg, gemGreenImg, gemPurpleImg, gemYellowImg];

const initialWordsData = [
  { id: 1, word: "مَدْرَسَة", hasTaMarbuta: true },
  { id: 2, word: "قَلَم", hasTaMarbuta: false },
  { id: 3, word: "بَيْت", hasTaMarbuta: false },
  { id: 4, word: "شَجَرَة", hasTaMarbuta: true },
  { id: 5, word: "وَرْدَة", hasTaMarbuta: true },
  { id: 6, word: "كِتَاب", hasTaMarbuta: false },
  { id: 7, word: "سَيَّارَة", hasTaMarbuta: true },
  { id: 8, word: "بَاب", hasTaMarbuta: false },
  { id: 9, word: "حَقِيبَة", hasTaMarbuta: true },
  { id: 10, word: "بِنْت", hasTaMarbuta: false },
  { id: 11, word: "مَائِدَة", hasTaMarbuta: true },
  { id: 12, word: "أَسَد", hasTaMarbuta: false },
];

export default function TreasureChestGame() {
  const navigate = useNavigate();

  const [gems, setGems] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const [activeDragId, setActiveDragId] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const chestRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
    // eslint-disable-next-line react-hooks/immutability
    startNewGame();
  }, []);

  // عداد الوقت
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

  const startNewGame = () => {
    const prepared = initialWordsData.map((item, index) => ({
      ...item,
      img: gemImages[index % gemImages.length],
      isCollected: false,
    }));
    setGems(prepared);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    if (gems.length > 0) {
      const remainingTargetGems = gems.filter(g => g.hasTaMarbuta && !g.isCollected);
      if (remainingTargetGems.length === 0) {
        setTimeout(() => {
          setIsGameOver(true);
          // eslint-disable-next-line react-hooks/immutability
          triggerConfetti();
        }, 500);
      }
    }
  }, [gems]);

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
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
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
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

  const handleDragStart = (e, gem) => {
    if (gem.isCollected) return;

    speakWord(gem.word);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });

    setActiveDragId(gem.id);
    setDragPos({ x: clientX, y: clientY });
  };

  const handleDragMove = (e) => {
    if (!activeDragId) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDragPos({ x: clientX, y: clientY });
  };

  const handleDragEnd = () => {
    if (!activeDragId) return;

    const activeGem = gems.find((g) => g.id === activeDragId);

    if (activeGem && chestRef.current) {
      const chestRect = chestRef.current.getBoundingClientRect();

      const isInsideChest =
        dragPos.x >= chestRect.left &&
        dragPos.x <= chestRect.right &&
        dragPos.y >= chestRect.top &&
        dragPos.y <= chestRect.bottom;

      if (isInsideChest) {
        if (activeGem.hasTaMarbuta) {
          playSound("success");
          setScore((prev) => prev + 10);
          setGems((prev) =>
            prev.map((g) => (g.id === activeDragId ? { ...g, isCollected: true } : g))
          );
        } else {
          playSound("error");
        }
      }
    }

    setActiveDragId(null);
  };

  const totalTargetGems = gems.filter((g) => g.hasTaMarbuta).length;
  const collectedGemsCount = gems.filter((g) => g.hasTaMarbuta && g.isCollected).length;
  const activeGemData = gems.find((g) => g.id === activeDragId);

  return (
    <div
      style={styles.container}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <style>{responsiveCSS}</style>

      {/* 🖼️ 1. خلفية اللعبة */}
      <img src={treasureBgImg} alt="خلفية الكنز" style={styles.bgImg} />

      {/* 👑 2. العنوان والفقرة الإرشادية */}
      <div style={styles.headerAreaWrapper} className="header-area-responsive">
        <h1 style={styles.mainTitle} className="title-responsive">
          لُعْبَةُ الكَنْزِ 🏴‍☠️
        </h1>
        <p style={styles.instructionText} className="instruction-responsive">
          اجْمَعِ الجَوَاهِرَ الَّتِي تَنْتَهِي بـ <strong>(ـة / ة)</strong> فَقَطْ دَاخِلَ الصَّنْدُوقِ
        </p>
      </div>

      {/* ⏱️ الوقت (يسار) و ⭐ النقاط (يمين) */}
      <div style={styles.topLeftBox} className="score-box-responsive">
        <Clock className="clock-icon-responsive" style={{ marginLeft: "4px", verticalAlign: "middle" }} /> {timer} ث
      </div>
      <div style={styles.topRightBox} className="score-box-responsive">⭐ {score}</div>

      <div style={styles.topMidBox} className="score-box-responsive">
        💎 {collectedGemsCount} / {totalTargetGems}
      </div>

      {/* 💎 3. شبكة الجواهر */}
      <div style={styles.gemsGridContainer} className="gems-grid-responsive">
        {gems.map((gem) => {
          if (gem.isCollected) {
            return <div key={gem.id} style={styles.gemPlaceholder} className="gem-item-responsive" />;
          }

          const isBeingDragged = gem.id === activeDragId;

          return (
            <div
              key={gem.id}
              style={{
                ...styles.gemWrapper,
                opacity: isBeingDragged ? 0.2 : 1,
              }}
              className="gem-item-responsive"
              onMouseDown={(e) => handleDragStart(e, gem)}
              onTouchStart={(e) => handleDragStart(e, gem)}
            >
              <img src={gem.img} alt={gem.word} style={styles.fullImg} />
              <span style={styles.gemText} className="gem-text-responsive">{gem.word}</span>
            </div>
          );
        })}
      </div>

      {/* 📦 4. صندوق الكنز (في المقدمة) */}
      <div
        ref={chestRef}
        style={styles.chestWrapper}
        className="chest-responsive"
      >
        <img src={chestImg} alt="صندوق الكنز" style={styles.fullImg} />
      </div>

      {/* 🖐️ الجوهرة أثناء السحب */}
      {activeDragId && activeGemData && (
        <div
          style={{
            ...styles.draggingGem,
            left: `${dragPos.x - dragOffset.x}px`,
            top: `${dragPos.y - dragOffset.y}px`,
          }}
          className="gem-item-responsive"
        >
          <img src={activeGemData.img} alt={activeGemData.word} style={styles.fullImg} />
          <span style={styles.gemText} className="gem-text-responsive">{activeGemData.word}</span>
        </div>
      )}

      {/* 🔘 5. أزرار التحكم السفلية */}
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

      {/* 🏆 شاشة الفوز */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winBox}>
            <Trophy size={36} color="#FFD700" style={{ marginBottom: 4 }} />
            <h2 style={{ color: "#2e7d32", marginBottom: 6, fontSize: "1.25rem", marginTop: 0, fontWeight: "900" }}>
              أَحْسَنْتَ يَا بَطَل
            </h2>
            <div style={styles.finalStats}>
              <p style={{ fontSize: "0.95rem", margin: "2px 0" }}>
                النتيجة: <strong>{score}</strong>
              </p>
            </div>
            <div style={styles.winActionButtons}>
              <button onClick={startNewGame} style={styles.smallIconBtn} title="إعادة المحاولة">
                <RotateCcw size={18} />
              </button>
              <button onClick={() => navigate("Tamarbuta")} style={styles.smallIconBtn} title="رجوع للخلف">
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/home")} style={styles.smallIconBtn} title="الصفحة الرئيسية">
                <Home size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === CSS التجاوب المخصص لشاشات اللابتوب والتابلت والموبايل ===
const responsiveCSS = `
  .btn-icon-responsive { width: 26px; height: 26px; }
  .clock-icon-responsive { width: 16px; height: 16px; }

  /* 💻 شاشات اللابتوب (تصغير العنوان والفقرة أكثر، ورفع الجواهر للأعلى قليلاً) */
  @media (min-width: 1025px) and (max-width: 1440px) {
    .header-area-responsive {
      top: 6px !important;
    }
    .title-responsive { 
      font-size: 1.6rem !important; 
      padding: 4px 18px !important; 
    }
    .instruction-responsive { 
      font-size: 0.9rem !important; 
      margin-top: 4px !important; 
      padding: 4px 16px !important;
    }
    .gems-grid-responsive {
      bottom: 26% !important; /* رفع الجواهر فوق شوية على اللابتوب */
    }
  }

  /* 📱 شاشات التابلت (تكبير العنوان والفقرة قليلاً، ورفع الجواهر للأعلى شوية) */
  @media (min-width: 641px) and (max-width: 1024px) {
    .header-area-responsive {
      top: 6px !important;
    }
    .title-responsive { 
      font-size: 1.35rem !important; /* تكبير العنوان قليلاً */
      padding: 4px 14px !important; 
      border-width: 2px !important;
    }
    .instruction-responsive { 
      font-size: 0.85rem !important; /* تكبير الفقرة قليلاً */
      margin-top: 4px !important; 
      padding: 4px 14px !important;
      border-width: 1.5px !important;
    }

    .gems-grid-responsive {
      max-width: 480px !important;
      gap: 10px !important;
      bottom: 28% !important; /* رفع الجواهر لفوق شوية على التابلت */
    }
    
    .gem-item-responsive {
      width: 90px !important;
      height: 90px !important;
    }
    .gem-text-responsive {
      font-size: 1.55rem !important;
    }
    
    .chest-responsive {
      width: 210px !important;
      bottom: 7% !important;
      right: 4% !important;
      z-index: 50 !important;
    }
  }

  /* 📱 شاشات الموبايل */
  @media (max-width: 640px) {
    .header-area-responsive {
      top: 3px !important;
    }

    .title-responsive {
      font-size: 1.15rem !important;
      padding: 3px 14px !important;
      border-width: 2px !important;
    }

    .instruction-responsive { 
      font-size: 0.82rem !important; 
      padding: 3px 10px !important;
      margin-top: 5px !important; 
      border-width: 1.5px !important;
    }

    .score-box-responsive {
      font-size: 0.9rem !important;
      padding: 4px 10px !important;
      border-width: 2px !important;
      top: 8px !important;
    }
    .clock-icon-responsive {
      width: 16px !important;
      height: 16px !important;
    }

    .gems-grid-responsive {
      max-width: 85vw !important;
      gap: 4px !important;
      bottom: 46% !important; 
      left: 50% !important;
      transform: translateX(-50%) !important;
    }

    .gem-item-responsive {
      width: 68px !important;  
      height: 68px !important;
    }

    .gem-text-responsive {
      font-size: 1.45rem !important; 
    }

    .chest-responsive {
      width: 145px !important;
      bottom: 12% !important;
      right: 2% !important;
      z-index: 50 !important;
    }

    .controls-responsive { 
      bottom: 18px !important; 
      gap: 14px !important; 
    }
    .action-btn-responsive {
      padding: 12px !important;
    }
    .btn-icon-responsive {
      width: 22px !important;
      height: 22px !important;
    }
  }
`;

// === التنسيقات العامة ===
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    backgroundColor: "#29b6f6",
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
    fontSize: "2.3rem",
    fontWeight: "900",
    backgroundColor: "rgba(139, 90, 43, 0.92)",
    padding: "6px 28px",
    borderRadius: "24px",
    border: "2.5px solid #ffecb3",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  instructionText: {
    margin: "8px 0 0 0",
    color: "#2b1704",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    padding: "5px 22px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "1.15rem",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
    border: "2.5px solid #8b5a2b",
    textAlign: "center",
  },
  gemsGridContainer: {
    position: "absolute",
    bottom: "21%",
    left: "35%",
    transform: "translateX(-35%)",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    width: "100%",
    maxWidth: CUSTOM_CONTROL.gemsGrid.maxWidth,
    zIndex: 10,
  },
  gemWrapper: {
    position: "relative",
    width: CUSTOM_CONTROL.gemsGrid.gemSize,
    height: CUSTOM_CONTROL.gemsGrid.gemSize,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.1s ease",
  },
  gemPlaceholder: {
    width: CUSTOM_CONTROL.gemsGrid.gemSize,
    height: CUSTOM_CONTROL.gemsGrid.gemSize,
  },
  gemText: {
    position: "absolute",
    color: "#111111",
    fontSize: CUSTOM_CONTROL.gemsGrid.fontSize,
    fontWeight: "900",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
    textShadow: "0 0 4px #ffffff, 0 0 8px #ffffff",
    pointerEvents: "none",
  },
  draggingGem: {
    position: "fixed",
    width: CUSTOM_CONTROL.gemsGrid.gemSize,
    height: CUSTOM_CONTROL.gemsGrid.gemSize,
    zIndex: 999,
    pointerEvents: "none",
    transform: "scale(1.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chestWrapper: {
    position: "absolute",
    bottom: CUSTOM_CONTROL.chestArea.bottom,
    right: CUSTOM_CONTROL.chestArea.right,
    width: CUSTOM_CONTROL.chestArea.width,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.4))",
  },
  topLeftBox: {
    position: "absolute",
    top: "12px",
    left: "15px",
    zIndex: 25,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    color: "#4a2c11",
    border: "2px solid #8b5a2b",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
  },
  topRightBox: {
    position: "absolute",
    top: "12px",
    right: "15px",
    zIndex: 25,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    color: "#4a2c11",
    border: "2px solid #8b5a2b",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
  },
  topMidBox: {
    position: "absolute",
    top: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 25,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    color: "#4a2c11",
    border: "2px solid #8b5a2b",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    display: "none",
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
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#4a2c11",
    boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  smallIconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2px solid #8b5a2b",
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#4a2c11",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
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
    background: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winBox: {
    background: "#fffde7",
    border: "3px solid #8b5a2b",
    padding: "14px 5px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    width: "fit-content",
    minWidth: "200px",
  },
  finalStats: {
    background: "#e8f5e9",
    padding: "5px 10px",
    borderRadius: "8px",
    marginBottom: "10px",
    color: "#1b5e20",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
};