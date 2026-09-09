// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور الخاصّة بكِ ===
import bgImg from "../assets/icebg4.jpeg"; // خلفية اللابتوب والتابلت
import bgMobileImg from "../assets/ibg.jpeg"; // 📱 خلفية الموبايل
import iceBlockImg from "../assets/iceblock.png"; // صورة مكعب الثلج للكلمات
import penguinImg from "../assets/penguin.png"; // صورة البطريق

// === 2. استيراد الأصوات ===
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// === 3. بنك الكلمات ===
const correctWords = [
  "مُعَلِّمٌ", "مُفَكِّرٌ", "مُدَرِّسٌ", "مُغَنِّي", 
  "مُسَجِّلٌ", "مُصَمِّمٌ", "مُدَرِّبٌ", 
];

const wrongWords = [
  "عُصْفُورٌ", 
];

const BRIDGE_SLOTS_COUNT = 6;

export default function PenguinBridgeGame() {
  const navigate = useNavigate();

  // === الحالات (States) ===
  const [roundWords, setRoundWords] = useState([]); 
  const [bridgeItems, setBridgeItems] = useState([]); 
  const [penguinX, setPenguinX] = useState(0); 
  
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isBuildingComplete, setIsBuildingComplete] = useState(false);

  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  // 🔄 توليد جولة جديدة
  const initGame = () => {
    const shufCorrect = [...correctWords].sort(() => 0.5 - Math.random()).slice(0, BRIDGE_SLOTS_COUNT);
    const shufWrong = [...wrongWords].sort(() => 0.5 - Math.random()).slice(0, 3);

    const combined = [
      ...shufCorrect.map((w, idx) => ({ id: `c-${idx}-${Date.now()}`, word: w, isCorrect: true })),
      ...shufWrong.map((w, idx) => ({ id: `w-${idx}-${Date.now()}`, word: w, isCorrect: false })),
    ].sort(() => 0.5 - Math.random());

    setRoundWords(combined);
    setBridgeItems(Array(BRIDGE_SLOTS_COUNT).fill(null));
    setPenguinX(0);
    setIsBuildingComplete(false);
    setIsGameOver(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initGame();
  }, []);

  // ⏱️ العداد الزمني
  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  // 🎯 معالجة سحب وإفلات الثلج على الجسر
  const handleDragEnd = (item, info) => {
    if (isBuildingComplete || isGameOver) return;

    const droppedOnBridge = info.point.y < window.innerHeight * 0.70 && info.point.y > window.innerHeight * 0.45;

    if (droppedOnBridge && item.isCorrect) {
      const emptySlotIndex = bridgeItems.findIndex((slot) => slot === null);

      if (emptySlotIndex !== -1) {
        if (soundEnabled) successAudio.current.play();

        const newBridge = [...bridgeItems];
        newBridge[emptySlotIndex] = item;
        setBridgeItems(newBridge);

        setRoundWords((prev) => prev.map((w) => w.id === item.id ? { ...w, used: true } : w));
        setScore((prev) => prev + 10);

        if (emptySlotIndex === BRIDGE_SLOTS_COUNT - 1) {
          handleBridgeCompleted();
        }
      }
    } else {
      if (soundEnabled) errorAudio.current.play();
    }
  };

  // 🐧 حرك البطريق
  const handleBridgeCompleted = () => {
    setIsBuildingComplete(true);
    
    setTimeout(() => {
      const width = window.innerWidth;
      // eslint-disable-next-line no-useless-assignment
      let targetX = 70;

      if (width <= 640) {
        targetX = 84; // 📱 للموبايل
      } else if (width <= 1024) {
        targetX = 74; // 📟 للتابلت
      } else {
        targetX = 70; // 💻 للابتوب
      }

      setPenguinX(targetX); 
      
      setTimeout(() => {
        setIsGameOver(true);
      }, 3100); 
    }, 400);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🖼️ خلفية التابلت واللابتوب */}
      <img src={bgImg} alt="خلفية الجسر الثلجي" style={styles.bgImg} className="bg-desktop" />
      
      {/* 📱 خلفية الموبايل المستقلة */}
      <img src={bgMobileImg} alt="خلفية الجسر للموبايل" style={styles.bgImg} className="bg-mobile" />

      {/* 🐧 البطريق */}
      <motion.div
        animate={{ x: `${penguinX}vw` }}
        transition={{ duration: 2.9, ease: "linear" }}
        style={styles.penguinWrapper}
        className="penguin-wrapper"
      >
        <img src={penguinImg} alt="البطريق" style={styles.penguinImg} />
      </motion.div>

      {/* 🏆 نافذة الاحتفال بالفوز */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <Trophy size={50} color="#FFD700" />
              <h1 style={{ margin: "10px 0", fontSize: "22px" }}>أحسنت يا بطل 🎉</h1>
              
              <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4CAF50" }}>النتيجة: {score}</p>

              <div style={styles.resultButtons}>
                <button onClick={initGame} style={styles.circleBtn}><RotateCcw size={24}/></button>
                <button onClick={() => navigate("/ShaddaKasra")} style={styles.circleBtn}><ArrowRight size={24}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📊 الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        <div style={styles.headerGroup}>
          <div style={styles.mainTitleCard}>
            <h1 style={styles.mainTitle} className="main-title-text">لعبة بناء الجسر</h1>
          </div>
          <div style={styles.subTitleCard}>
            <span style={styles.subTitle} className="sub-title-text">اسحب الكلمة التي بها شدة لبناء الجسر</span>
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* 🌉 الجسر الشفاف (6 بلاطات) */}
      <div style={styles.bridgeArea} className="bridge-area">
        {bridgeItems.map((item, idx) => (
          <div key={idx} style={styles.bridgeSlot} className="bridge-slot">
            {item ? (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={styles.placedIceBlock}
              >
                <img src={iceBlockImg} alt="مكعب الثلج" style={styles.iceBlockImg} />
                <span style={styles.placedWordText} className="placed-word-text">{item.word}</span>
              </motion.div>
            ) : (
              <div style={styles.emptySlotBorder} />
            )}
          </div>
        ))}
      </div>

      {/* 🧊 صينية الكلمات السفلية */}
      <div style={styles.wordsTray} className="words-tray">
        {roundWords.map((item) => (
          <div key={item.id} style={styles.slotContainer} className="slot-container">
            {!item.used && (
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, info) => handleDragEnd(item, info)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.draggableIceBlock}
              >
                <img src={iceBlockImg} alt="مكعب الثلج" style={styles.iceBlockImg} />
                <span style={styles.trayWordText} className="tray-word-text">{item.word}</span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* 🔘 الأزرار السفلية */}
      <div style={styles.bottomSection}>
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}
          </button>
          <button onClick={initGame} style={styles.circleBtn}><RotateCcw size={24}/></button>
          <button onClick={() => navigate("/Shadda")} style={styles.circleBtn}><ArrowRight size={24}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
        </div>
      </div>

    </div>
  );
}

// === CSS التكيف للشاشات (لابتوب / تابلت / موبايل) ===
const responsiveCSS = `
  .main-title-text { font-size: clamp(17px, 2vw, 24px) !important; }
  .sub-title-text { font-size: clamp(16px, 1.2vw, 15px) !important; }

  /* إظهار خلفية التابلت واللابتوب */
  .bg-desktop { display: block; }
  .bg-mobile { display: none; }

  /* 📟 1. التعديلات الخاصة بالتابلت (من 641px إلى 1024px) */
  @media (min-width: 641px) and (max-width: 1024px) {
    .bg-desktop { display: block !important; }
    .bg-mobile { display: none !important; }

    /* 🐧 موقع البطريق في التابلت */
    .penguin-wrapper {
      left: 6% !important;
      bottom: 45% !important;
      width: 90px !important;
    }



    /* 🌉 الجسر الشفاف في التابلت - تم التكبير */
    .bridge-area {
      width: 60% !important;
      left: 56% !important;
      top: 55% !important;
      gap: 6px !important;
    }
    .bridge-slot {
      width: 78px !important;
      height: 58px !important;
    }
    .placed-word-text {
      font-size: 20px !important;
    }

    /* 🧊 صينية الكلمات في التابلت - تم التكبير */
    .words-tray {
      bottom: 13% !important;
      max-width: 580px !important;
      gap: 10px 14px !important;
    }
    .slot-container {
      width: 110px !important;
      height: 65px !important;
    }
    .tray-word-text {
      font-size: 29px !important;
      margin-Bottom: 8px !important;
    }
  }

  /* 📱 2. التعديلات المخصصة للموبايل (أقل من 640px) */
  @media (max-width: 640px) {
    .bg-desktop { display: none !important; }
    .bg-mobile { display: block !important; }

    /* 🐧 نقطة بداية البطريق للموبايل */
    .penguin-wrapper {
      left: 1% !important;
      bottom: 44% !important;
      width: 80px !important;
    }

    /* 🌉 الجسر الشفاف للموبايل - تم التكبير */
    .bridge-area {
      width: 82% !important;
      left: 54% !important;
      top: 54% !important;
      gap: 4px !important;
    }
    .bridge-slot {
      width: 58px !important;
      height: 48px !important;
    }
    .placed-word-text {
      font-size: 18px !important;
    }

    /* 🧊 صينية الكلمات للموبايل - تم التكبير */
    .words-tray {
      bottom: 16% !important;
      max-width: 100vw !important;
      gap: 8px 10px !important;
    }
    .slot-container {
      width: 92px !important;
      height: 55px !important;
    }
    .tray-word-text {
      font-size: 24px !important;
      margin-Bottom: 8px !important;
    }
  }
`;

// === التنسيقات العامة (للشاشات الكبيرة / اللابتوب) ===
const styles = {
  container: { 
    width: "100vw", 
    height: "100vh", 
    position: "relative", 
    overflow: "hidden", 
    fontFamily: "'Cairo', sans-serif",
    backgroundColor: "#0F2027"
  },
  
  bgImg: { 
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    position: "absolute", 
    top: 0, 
    left: 0, 
    zIndex: 1 
  },

  // 🐧 البطريق
  penguinWrapper: {
    position: "absolute",
    bottom: "44.5%", 
    left: "9.5%", 
    width: "clamp(75px, 8vw, 105px)",
    zIndex: 12,
    pointerEvents: "none",
  },
  penguinImg: { width: "100%", height: "auto", objectFit: "contain" },

  // 🌉 مسرح الجسر الشفاف (تم التكبير للابتوب)
  bridgeArea: {
    position: "absolute",
    top: "55%", 
    left: "52%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    gap: "8px",
    zIndex: 10,
    width: "52%", 
    justifyContent: "flex-start",
    alignItems: "center"
  },
  bridgeSlot: {
    width: "clamp(62px, 8.5vw, 95px)",
    height: "clamp(45px, 6vw, 68px)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptySlotBorder: {
    width: "100%",
    height: "100%",
    border: "2px dashed rgba(255, 255, 255, 0.85)",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    boxShadow: "inset 0 0 6px rgba(255, 255, 255, 0.5)",
  },
  placedIceBlock: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  placedWordText: {
    position: "relative",
    zIndex: 2,
    fontWeight: "900",
    color: "#0c3b5e",
    fontSize: "clamp(15px, 1.8vw, 23px)",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
    userSelect: "none",
  },

  // 🧊 صينية الكلمات السفلية (تم التكبير للابتوب)
  wordsTray: {
    position: "absolute",
    bottom: "12%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px 14px",
    zIndex: 15,
    maxWidth: "600px",
    width: "90vw",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  slotContainer: {
    width: "clamp(90px, 10vw, 125px)",
    height: "clamp(54px, 6.5vw, 75px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  draggableIceBlock: {
    position: "relative",
    width: "100%",
    height: "100%",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none",
  },
  iceBlockImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    position: "absolute",
    top: 0,
    left: 0,
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
  },
  trayWordText: {
    position: "relative",
    zIndex: 2,
    fontWeight: "900",
    color: "#0c3b5e",
    fontSize: "clamp(17px, 2vw, 25px)",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
    userSelect: "none",
  },

  // النافذة المنبثقة للنتائج
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  winBox: { background: "white", padding: "25px", borderRadius: "20px", textAlign: "center", width: "90%", maxWidth: "150px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  resultButtons: { display: "flex", gap: "12px", justifyContent: "center", marginTop: "15px" },

  // الشريط العلوي
  topBar: { position: "absolute", top: "10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(12px, 1.5vw, 15px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerGroup: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  mainTitleCard: { background: "#ffffffee", padding: "4px 20px", borderRadius: "15px", border: "3px solid #0288D1", boxShadow: "0 3px 8px rgba(0,0,0,0.15)", textAlign: "center" },
  mainTitle: { color: "#01579B", fontWeight: "900", margin: 0 },

  subTitleCard: { background: "#ffffffee", padding: "3px 14px", borderRadius: "12px", border: "2px solid #00ACC1", boxShadow: "0 3px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "8px" },
  subTitle: { color: "#006064", fontWeight: "bold" },

  // الأزرار السفلية
  bottomSection: { position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", zIndex: 20 },
  buttonsContainer: { display: "flex", gap: "10px" },
  circleBtn: { width: "clamp(40px, 3vw, 42px)", height: "clamp(40px, 3vw, 42px)", marginBottom: "8px", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }
};