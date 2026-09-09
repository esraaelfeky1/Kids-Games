// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور ===
import bgImg from "../assets/333.jpeg"; 
import firefighterImg from "../assets/ssf.png"; 

// === 2. استيراد الأصوات ===
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// === 3. 🎯 بنك الأسئلة الـ 7 ===
const QUESTIONS_BANK = [
  { correct: "سَيَّارَة", wrongs: ["مَدْرَسَة", "قَلَم"] },
  { correct: "دَرَّاجَة", wrongs: ["كِتَاب", "زَهْرَة"] },
  { correct: "طَيَّار", wrongs: ["وَلَد", "بَاب"] },
  { correct: "سَلَّم", wrongs: ["فَتَح", "بَيْت"] },
  { correct: "صَيَّاد", wrongs: ["شَجَرَة", "لَعِب"] },
  { correct: "نَجَّار", wrongs: ["مُعَلِّم", "قَرَأ"] },
  { correct: "تُفَّاح", wrongs: ["سَمَك", "جَبَل"] }
];

const TOTAL_QUESTIONS = 7;

// 📍 القيم الافتراضية (للاب توب والشاشات الكبيرة)
const INITIAL_HOUSES_POSITIONS = [
  { id: 1, left: 17.5, top: 38.0 }, // الكلمة الأولى
  { id: 2, left: 50.0, top: 38.0 }, // الكلمة الثانية (نزلت تحت لتتوسط المربع)
  { id: 3, left: 82.5, top: 38.0 }, // الكلمة الثالثة (تحركت لليمين قليلاً)
];

const NOZZLE_POS = { x: 13, y: 72 };

// === 4. أنيميشن النار 🔥 ===
function FireAnimation() {
  return (
    <div style={fireStyles.container}>
      <motion.div
        animate={{ scale: [1, 1.1, 0.95, 1.08, 1], opacity: [0.85, 1, 0.85, 1, 0.85], rotate: [-2, 2, -1, 2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ ...fireStyles.flame, ...fireStyles.flameMain }}
      />
      <motion.div
        animate={{ scale: [0.9, 1.15, 1, 1.1, 0.9], opacity: [0.75, 0.95, 1, 0.85, 0.75], rotate: [2, -2, 1, -2, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        style={{ ...fireStyles.flame, ...fireStyles.flameInner }}
      />
    </div>
  );
}

// === 5. تدفق المياه 💦 ===
function RealisticWaterStream({ targetX, targetY }) {
  const droplets = Array.from({ length: 30 });

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
      {droplets.map((_, i) => {
        const delay = (i % 6) * 0.04;
        // eslint-disable-next-line react-hooks/purity
        const spreadX = (Math.random() - 0.5) * 3; 
        // eslint-disable-next-line react-hooks/purity
        const spreadY = (Math.random() - 0.5) * 4;

        return (
          <motion.div
            key={i}
            initial={{ left: `${NOZZLE_POS.x}%`, top: `${NOZZLE_POS.y}%`, scale: 0.4, opacity: 0.9 }}
            animate={{ left: `${targetX + spreadX}%`, top: `${targetY + spreadY}%`, scale: [0.5, 1.5, 0.3], opacity: [1, 0.9, 0] }}
            transition={{ duration: 0.45, repeat: Infinity, delay: delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: "14px",
              height: "14px",
              background: "radial-gradient(circle, #E0F7FA 0%, #00BCD4 60%, #0288D1 100%)",
              borderRadius: "50%",
              boxShadow: "0 0 10px #00E5FF, 0 0 4px #FFF",
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </div>
  );
}

// === 6. المكوّن الرئيسي ===
export default function FirefighterGame() {
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [housesData, setHousesData] = useState([]);
  const [activeWaterTarget, setActiveWaterTarget] = useState(null);
  const [extinguishedHouse, setExtinguishedHouse] = useState(null); 
  
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  const setupQuestion = (index) => {
    if (index >= TOTAL_QUESTIONS) {
      setIsGameOver(true);
      return;
    }

    const q = QUESTIONS_BANK[index];
    const roundWords = [
      { word: q.correct, isCorrect: true },
      { word: q.wrongs[0], isCorrect: false },
      { word: q.wrongs[1], isCorrect: false },
    ].sort(() => 0.5 - Math.random());

    const updatedHouses = roundWords.map((item, i) => ({
      id: i + 1,
      word: item.word,
      isCorrect: item.isCorrect,
      left: INITIAL_HOUSES_POSITIONS[i].left,
      top: INITIAL_HOUSES_POSITIONS[i].top,
      fireX: INITIAL_HOUSES_POSITIONS[i].left,
      fireY: INITIAL_HOUSES_POSITIONS[i].top,
    }));

    setHousesData(updatedHouses);
    setActiveWaterTarget(null);
    setExtinguishedHouse(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setupQuestion(currentQuestionIndex);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  const handleHouseClick = (house) => {
    if (activeWaterTarget || isGameOver) return;

    setActiveWaterTarget(house);

    if (house.isCorrect) {
      if (soundEnabled) successAudio.current.play();
      setScore((prev) => prev + 10);

      setTimeout(() => {
        setExtinguishedHouse(house.id);

        setTimeout(() => {
          if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
            setIsGameOver(true);
          } else {
            setCurrentQuestionIndex((prev) => prev + 1);
          }
        }, 900);
      }, 600);

    } else {
      if (soundEnabled) errorAudio.current.play();
      setTimeout(() => {
        setActiveWaterTarget(null);
      }, 700);
    }
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللعبة */}
      <img src={bgImg} alt="خلفية اللعبة" style={styles.bgImg} />

      {/* رجل الإطفاء */}
      <div style={styles.firefighterWrapper} className="firefighter-character">
        <img src={firefighterImg} alt="رجل الإطفاء" style={styles.firefighterImg} />
      </div>

      {/* شاشة الفوز */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={60} color="#FFD700" />
                <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>مبروك يا بطل 👨‍🚒</h1>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4CAF50" }}>النتيجة  : {score} </p>
              </div>

              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={24}/></button>
                <button onClick={() => navigate("/Shadda")} style={styles.circleBtn}><ArrowRight size={24}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        <div style={styles.headerGroup}>
          <div style={styles.mainTitleCard}>
            <h1 style={styles.mainTitle} className="main-title-text">لعبة رجل الإطفاء</h1>
          </div>
          <div style={styles.subTitleCard}>
            <span style={styles.subTitle} className="sub-title-text">
              السؤال {Math.min(currentQuestionIndex + 1, TOTAL_QUESTIONS)} من {TOTAL_QUESTIONS}: أطفئ النار على الكلمة التي بها شدّة وفتحة
            </span>
            <span style={styles.badge} className="badge-text">(  َّ )</span>
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* مسرح اللعبة */}
      <div style={styles.gameStage}>
        {housesData.map((house) => {
          const isExtinguished = extinguishedHouse === house.id;

          return (
            <div
              key={house.id}
              onClick={() => handleHouseClick(house)}
              style={{
                ...styles.houseCard,
                left: `${house.left}%`,
                top: `${house.top}%`,
              }}
              // نربط كل بيت بكلاس خاص به لسهولة التحكم عبر الشاشات المختلفة في الأسفل
              className={`house-interactive-area house-${house.id}`}
            >
              {!isExtinguished && <FireAnimation />}

              <span style={styles.wordText} className="house-word-text">
                {house.word}
              </span>

              {isExtinguished && (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.extinguishBadge}>
                  💦 تم الإطفاء!
                </motion.div>
              )}
            </div>
          );
        })}

        {activeWaterTarget && (
          <RealisticWaterStream
            targetX={activeWaterTarget.fireX}
            targetY={activeWaterTarget.fireY}
          />
        )}
      </div>

      {/* الأزرار السفلية */}
      <div style={styles.bottomSection}>
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={24}/></button>
          <button onClick={() => navigate("/Shadda")} style={styles.circleBtn}><ArrowRight size={24}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
        </div>
      </div>

    </div>
  );
}

// === تحكم شامل للشاشات (لاب توب، تابلت، موبايل) ===
const responsiveCSS = `
  .main-title-text { font-size: clamp(14px, 1.8vw, 22px) !important; }
  .sub-title-text { font-size: clamp(11px, 1.1vw, 14px) !important; }
  .badge-text { font-size: clamp(11px, 1vw, 13px) !important; padding: 2px 6px !important; }

  .house-interactive-area {
    width: 25vw !important;
    height: 12vh !important;
  }
  .house-word-text {
    font-size: clamp(20px, 2.5vw, 32px) !important;
  }
  .firefighter-character {
    width: clamp(200px, 24vw, 310px) !important;
    bottom: 3% !important;
    left: 3% !important;
  }

  /* 💻 شاشات اللابتوب والكمبيوتر (أكبر من 1024 بكسل) */
  .house-1 { left: 30.5% !important; top: 36% !important; }
  .house-2 { left: 50.0% !important; top: 36% !important; }
  .house-3 { left: 75.5% !important; top: 36% !important; }

  /* 📱 شاشات التابلت (بين 768 و 1024 بكسل) - يمكنك تعديل الأرقام هنا حسب الحاجة */
  @media (max-width: 1024px) and (min-width: 769px) {
    .house-1 { left: 27.5% !important; top: 40% !important; }
    .house-2 { left: 50.0% !important; top: 40% !important; }
    .house-3 { left: 75.5% !important; top: 40% !important; }
  }

  /* 📱 شاشات الموبايل (أقل من 768 بكسل) - يمكنك تعديل الأرقام هنا لتناسب الموبايل */
  @media (max-width: 768px) {
    .house-interactive-area {
      width: 28vw !important;
      height: 10vh !important;
    }
    .firefighter-character {
      width: 220px !important;
      bottom: 5% !important;
      left: 1% !important;
    }
    .house-1 { left: 15.5% !important; top: 40% !important; }
    .house-2 { left: 53.0% !important; top: 40% !important; }
    .house-3 { left: 86.5% !important; top: 40% !important; }
  }
`;

const fireStyles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 1,
  },
  flame: {
    position: "absolute",
    borderRadius: "50% 50% 20% 20%",
    transformOrigin: "bottom center",
  },
  flameMain: {
    width: "80%",
    height: "80%",
    background: "radial-gradient(circle, #FFD700 20%, #FF5722 60%, #D32F2F 95%)",
    boxShadow: "0 0 8px #FF5722",
    filter: "blur(1px)",
  },
  flameInner: {
    width: "55%",
    height: "55%",
    background: "radial-gradient(circle, #FFF 15%, #FFEB3B 50%, #FF9800 85%)",
    filter: "blur(0.5px)",
  },
};

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bgImg: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 1 },

  firefighterWrapper: {
    position: "absolute",
    zIndex: 12,
    pointerEvents: "none",
  },
  firefighterImg: { width: "100%", height: "auto", objectFit: "contain" },

  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "25px", borderRadius: "20px", textAlign: "center", width: "90%", maxWidth: "150px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  winContent: { marginBottom: "15px" },
  resultButtons: { display: "flex", gap: "12px", justifyContent: "center" },

  topBar: { position: "absolute", top: "12px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 20px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "14px", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerGroup: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  mainTitleCard: { background: "#ffffffee", padding: "4px 18px", borderRadius: "15px", border: "3px solid #D32F2F", boxShadow: "0 3px 8px rgba(0,0,0,0.15)", textAlign: "center" },
  mainTitle: { color: "#B71C1C", fontWeight: "900", margin: 0 },

  subTitleCard: { background: "#ffffffee", padding: "3px 12px", borderRadius: "12px", border: "2px solid #F57C00", boxShadow: "0 3px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "6px" },
  subTitle: { color: "#E65100", fontWeight: "bold" },
  badge: { background: "#D32F2F", color: "white", borderRadius: "8px", fontWeight: "bold" },

  gameStage: { position: "absolute", width: "100%", height: "100%", top: 0, left: 0, zIndex: 5 },

  houseCard: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    borderRadius: "15px",
    zIndex: 10,
  },
  wordText: {
    fontWeight: "900",
    color: "#000000",
    textShadow: "0px 0px 6px #FFFFFF, 0px 0px 10px #FFFFFF, 0px 0px 2px #000000",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 3,
  },
  extinguishBadge: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(2, 136, 209, 0.95)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    zIndex: 10,
    whiteSpace: "nowrap",
  },

  bottomSection: { position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 10 },
  buttonsContainer: { display: "flex", gap: "10px" },
  circleBtn: { width: "38px", height: "38px", borderRadius: "50%", border: "none", background: "#D32F2F", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }
};