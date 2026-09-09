// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Home, 
  ArrowRight, 
  Trophy 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. استيراد الصور الخاصة باللعبة
import bgImg from "../assets/tuol1.jpeg";           // خلفية اللابتوب والتابلت
import bgMobileImg from "../assets/tuol2.jpeg";     // خلفية الموبايل
import turtleImg from "../assets/turtle.png";    // صورة السلحفاة
import trophyImg from "../assets/trophy.png";    // صورة الكأس

// 2. الأصوات
import successSound from "/sounds/hay1.mp3"; 
import errorSound from "/sounds/pop.mp3";

// 3. بنية الأسئلة السبعة
const questionsData = [
  {
    id: 1,
    options: [
      { text: "قَلَمٍ", isKasra: true },
      { text: "قَلَمٌ", isKasra: false },
      { text: "قَلَمًا", isKasra: false },
    ]
  },
  {
    id: 2,
    options: [
      { text: "كِتَابًا", isKasra: false },
      { text: "كِتَابٍ", isKasra: true },
      { text: "كِتَابٌ", isKasra: false },
    ]
  },
  {
    id: 3,
    options: [
      { text: "بَيْتٌ", isKasra: false },
      { text: "بَيْتًا", isKasra: false },
      { text: "بَيْتٍ", isKasra: true },
    ]
  },
  {
    id: 4,
    options: [
      { text: "شَمْسٍ", isKasra: true },
      { text: "شَمْسًا", isKasra: false },
      { text: "شَمْسٌ", isKasra: false },
    ]
  },
  {
    id: 5,
    options: [
      { text: "وَرْدَةٌ", isKasra: false },
      { text: "وَرْدَةٍ", isKasra: true },
      { text: "وَرْدَةً", isKasra: false },
    ]
  },
  {
    id: 6,
    options: [
      { text: "جَبَلًا", isKasra: false },
      { text: "جَبَلٌ", isKasra: false },
      { text: "جَبَلٍ", isKasra: true },
    ]
  },
  {
    id: 7,
    options: [
      { text: "نَهْرٍ", isKasra: true },
      { text: "نَهْرًا", isKasra: false },
      { text: "نَهْرٌ", isKasra: false },
    ]
  },
];

export default function TurtleKasraGame() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0); // من 0 إلى 6
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wrongOptionIndex, setWrongOptionIndex] = useState(null);

  // مراجع الأصوات
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  // العداد الزمني
  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  // دالة تشغيل الصوت
  const playAudio = (audioRef) => {
    if (!soundEnabled || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((err) => console.log("خطأ صوت:", err));
  };

  // اختيار الإجابة
  const handleOptionClick = (option, index) => {
    if (option.isKasra) {
      // إجابة صحيحة
      playAudio(successAudio);
      setScore((s) => s + 10);
      setWrongOptionIndex(null);

      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);

      // إذا وصلنا لنهاية الأسئلة السبعة
      if (nextQ === questionsData.length) {
        setTimeout(() => {
          setIsGameOver(true);
        }, 1200);
      }
    } else {
      // إجابة خاطئة
      playAudio(errorAudio);
      setWrongOptionIndex(index);
      setTimeout(() => setWrongOptionIndex(null), 600);
    }
  };

  // حساب مسافة تقدم السلحفاة لتصل للكأس تماماً عند السؤال 7
  const turtleProgressPercent = (currentQuestion / 7) * 80; 

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللاب توب / التابلت */}
      <img src={bgImg} alt="الخلفية" style={styles.bg} className="desktop-bg" />
      {/* خلفية الموبايل */}
      <img src={bgMobileImg} alt="خلفية الموبايل" style={styles.bg} className="mobile-bg" />

      {/* نافذة الفوز */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={styles.overlay}
          >
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={42} color="#FFD700" />
                <h1 style={{ margin: "8px 0", fontSize: "20px", color: "#333" }}>رَائِعٌ جِدًّا يَا بَطَلُ! 🐢🏆</h1>
                <p style={{ fontSize: "14px", margin: "4px 0", color: "#555" }}>وَصَلَتِ السُّلَحْفَاةُ إِلَى الكَأْسِ بِنَجَاحٍ!</p>
                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#4CAF50", margin: "6px 0" }}>النتيجة: {score}</p>
              </div>

              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtnSmall}><RotateCcw size={18}/></button>
                <button onClick={() => navigate("/Nunation")} style={styles.circleBtnSmall}><ArrowRight size={18}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtnSmall}><Home size={18}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        <div style={styles.headerWrapper}>
          <div style={styles.mainTitleBox} className="main-title-text">
            اخْتَرِ الكَلِمَةَ الَّتِي تَنْتَهِي بِتَنْوِينِ الكَسْرِ ( ٍ )
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* مضمار الحركة (السلحفاة والمسار) */}
      <div style={styles.trackArea} className="track-area">
        
        {/* السلحفاة */}
        <motion.div 
          style={{
            ...styles.turtleWrapper,
            left: `${turtleProgressPercent}%`
          }}
          animate={{ left: `${turtleProgressPercent}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="turtle-wrapper"
        >
          <img src={turtleImg} alt="السلحفاة" style={styles.turtleImg} className="turtle-img" />
        </motion.div>

        {/* الكأس */}
        <div style={styles.trophyWrapper} className="trophy-wrapper">
          <img src={trophyImg} alt="الكأس" style={styles.trophyImg} className="trophy-img" />
        </div>
      </div>

      {/* أزرار الخيارات الثلاثة */}
      {!isGameOver && currentQuestion < 7 && (
        <div style={styles.optionsContainer} className="options-container">
          {questionsData[currentQuestion].options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={wrongOptionIndex === idx ? { x: [-8, 8, -8, 8, 0] } : {}}
              onClick={() => handleOptionClick(option, idx)}
              style={{
                ...styles.optionCard,
                backgroundColor: idx === 0 ? "#E8F5E9" : idx === 1 ? "#FFEBEE" : "#FFF8E1",
                borderColor: idx === 0 ? "#81C784" : idx === 1 ? "#E57373" : "#FFB74D",
                color: idx === 0 ? "#2E7D32" : idx === 1 ? "#C62828" : "#E65100",
              }}
              className="option-card"
            >
              {option.text}
            </motion.button>
          ))}
        </div>
      )}

      {/* أزرار التحكم السفلي */}
      <div style={styles.bottomSection} className="bottom-section-center">
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={24}/></button>
          <button onClick={() => navigate("/Nunation")} style={styles.circleBtn}><ArrowRight size={24}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
        </div>
      </div>

    </div>
  );
}

// التنسيقات المتجاوبة
const responsiveCSS = `
  .main-title-text {
    font-size: clamp(16px, 2vw, 22px) !important;
  }

  /* التحكم في عرض الخلفيات */
  .mobile-bg { display: none !important; }
  .desktop-bg { display: block !important; }

  /* ==========================================
     1) شاشات الكمبيوتر واللابتوب (1025px فما فوق)
     ========================================== */
  @media (min-width: 1025px) {
    .track-area {
      top: 35% !important;
      width: 72vw !important;
      height: 200px !important;
    }
    .turtle-img {
      width: 155px !important;
    }
    .trophy-wrapper {
      right: -30px !important;
    }
    .trophy-img {
      width: 145px !important;
    }
    .options-container {
      bottom: 90px !important;
      gap: 20px !important;
    }
    .option-card {
      width: 160px !important;
      height: 68px !important;
      font-size: 34px !important; /* تكبير الخط داخل المربع */
    }
  }

  /* ==========================================
     2) شاشات التابلت (601px - 1024px)
     ========================================== */
  @media (min-width: 601px) and (max-width: 1024px) {
    .track-area {
      top: 38% !important;
      width: 82vw !important;
      height: 160px !important;
    }
    .turtle-img {
      width: 135px !important;
    }
    .trophy-wrapper {
      right: -25px !important;
    }
    .trophy-img {
      width: 120px !important;
    }
    .options-container {
      bottom: 80px !important;
      gap: 14px !important;
    }
    .option-card {
      width: 140px !important;
      height: 60px !important;
      font-size: 28px !important; /* تكبير الخط داخل المربع */
    }
  }

  /* ==========================================
     3) شاشات الموبايل (0px - 600px)
     ========================================== */
  @media (max-width: 600px) {
    .desktop-bg { display: none !important; }
    .mobile-bg { display: block !important; }

    .track-area {
      top: 48% !important;
      width: 86vw !important;
      height: 110px !important;
    }
    .turtle-img {
      width: 90px !important;
    }
    .trophy-wrapper {
      right: -35px !important;
    }
    .trophy-img {
      width: 85px !important;
    }
    .options-container {
      bottom: 75px !important;
      gap: 8px !important;
      width: 98vw !important;
    }
    .option-card {
      width: 22% !important;      /* الحفاظ على المربع صغيراً */
      height: 48px !important;     /* الحفاظ على ارتفاع صغير */
      font-size: 25px !important;  /* تكبير خط الكلمة بشكل واضح ومقروء */
      line-height: 1 !important;
      border-width: 3px !important;
      padding: 0 4px !important;
    }
    .bottom-section-center {
      bottom: 8px !important;
    }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 },
  
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "20px 24px", borderRadius: "20px", textAlign: "center", width: "85%", maxWidth: "320px", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" },
  winContent: { marginBottom: "15px" },
  resultButtons: { display: "flex", gap: "12px", justifyContent: "center" },
  circleBtnSmall: { width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },

  // الشريط العلوي
  topBar: { position: "absolute", top: "12px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(14px, 1.6vw, 16px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center" },
  mainTitleBox: { background: "#FFF8E1", padding: "6px 18px", borderRadius: "16px", border: "3px solid #8D6E63", color: "#3E2723", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", textAlign: "center" },

  // مضمار السلحفاة
  trackArea: { position: "absolute", left: "50%", transform: "translateX(-50%)", zIndex: 5, display: "flex", alignItems: "center" },
  turtleWrapper: { position: "absolute", bottom: "5px", zIndex: 6 },
  turtleImg: { height: "auto", objectFit: "contain" },

  trophyWrapper: { position: "absolute", bottom: "5px", zIndex: 4 },
  trophyImg: { height: "auto", objectFit: "contain" },

  // خيارات الأسئلة
  optionsContainer: { position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 },
  optionCard: { borderRadius: "16px", borderStyle: "solid", borderWidth: "3px", fontWeight: "bold", fontFamily: "'Traditional Arabic', 'Cairo', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 5px 12px rgba(0,0,0,0.15)", transition: "all 0.2s" },

  // أزرار التحكم السفلي
  bottomSection: { position: "absolute", bottom: "14px", left: "50%", transform: "translateX(-50%)", zIndex: 200 },
  buttonsContainer: { display: "flex", gap: "14px", justifyContent: "center" },
  circleBtn: { width: "clamp(42px, 4.2vw, 56px)", height: "clamp(42px, 4.2vw, 56px)", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }
};