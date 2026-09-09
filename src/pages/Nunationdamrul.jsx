
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

// استيراد الصور الخاصة بك
import bgImg from "../assets/archerybg.jpeg";              // صورة خلفية الحديقة
import boyStandingImg from "../assets/boystand.png";       // صورة الولد وهو واقف عادي (بدون قوس)
import boyShootingImg from "../assets/boybow.png";         // صورة الولد وهو ماسك درع السهم والقوس
import arrowImg from "../assets/arrow.png";                // صورة السهم
import targetBoardImg from "../assets/2.png";              // صورة لوحة الهدف (الدرع)

// الأصوات
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// قائمة الـ 7 جولات
const gameRounds = [
  {
    id: 1,
    targetWord: "كِتَابٌ",
    options: [
      { id: "o1", text: "كِتَابًا", type: "fatha" },
      { id: "o2", text: "كِتَابٌ", type: "damma" },
      { id: "o3", text: "كِتَابٍ", type: "kasra" },
    ],
  },
  {
    id: 2,
    targetWord: "قَلَمٌ",
    options: [
      { id: "o1", text: "قَلَمٌ", type: "damma" },
      { id: "o2", text: "قَلَمًا", type: "fatha" },
      { id: "o3", text: "قَلَمٍ", type: "kasra" },
    ],
  },
  {
    id: 3,
    targetWord: "بَيْتٌ",
    options: [
      { id: "o1", text: "بَيْتٍ", type: "kasra" },
      { id: "o2", text: "بَيْتًا", type: "fatha" },
      { id: "o3", text: "بَيْتٌ", type: "damma" },
    ],
  },
  {
    id: 4,
    targetWord: "وَلَدٌ",
    options: [
      { id: "o1", text: "وَلَدٌ", type: "damma" },
      { id: "o2", text: "وَلَدًا", type: "fatha" },
      { id: "o3", text: "وَلَدٍ", type: "kasra" },
    ],
  },
  {
    id: 5,
    targetWord: "شَجَرَةٌ",
    options: [
      { id: "o1", text: "شَجَرَةً", type: "fatha" },
      { id: "o2", text: "شَجَرَةٌ", type: "damma" },
      { id: "o3", text: "شَجَرَةٍ", type: "kasra" },
    ],
  },
  {
    id: 6,
    targetWord: "سَيَّارَةٌ",
    options: [
      { id: "o1", text: "سَيَّارَةٍ", type: "kasra" },
      { id: "o2", text: "سَيَّارَةً", type: "fatha" },
      { id: "o3", text: "سَيَّارَةٌ", type: "damma" },
    ],
  },
  {
    id: 7,
    targetWord: "زَهْرَةٌ",
    options: [
      { id: "o1", text: "زَهْرَةٌ", type: "damma" },
      { id: "o2", text: "زَهْرَةً", type: "fatha" },
      { id: "o3", text: "زَهْرَةٍ", type: "kasra" },
    ],
  },
];

export default function ArcheryDammaGame() {
  const navigate = useNavigate();

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [isAiming, setIsAiming] = useState(false);
  const [arrowTarget, setArrowTarget] = useState({ x: 0, y: 0, angle: 0, isShooting: false });

  const arrowRef = useRef(null);
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  const currentRound = gameRounds[currentRoundIndex];

  // العداد الزمني
  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  // دالة تصويب السهم نحو منتصف اللوحة تماماً
  const handleOptionClick = (option, event) => {
    if (arrowTarget.isShooting) return; 

    setIsAiming(true);

    // حساب مركز لوحة الهدف بالضبط
    const boardRect = event.currentTarget.getBoundingClientRect();
    const boardCenterX = boardRect.left + boardRect.width / 2;
    const boardCenterY = boardRect.top + boardRect.height / 2;

    // حساب نقطة بداية رأس السهم
    let startX = window.innerWidth * 0.18;
    let startY = window.innerHeight * 0.8;
    
    if (arrowRef.current) {
      const arrowRect = arrowRef.current.getBoundingClientRect();
      startX = arrowRect.left; 
      startY = arrowRect.top + arrowRect.height / 2;
    }

    const targetX = boardCenterX - startX;
    const targetY = boardCenterY - startY;
    const angleRad = Math.atan2(targetY, targetX);
    const angleDeg = angleRad * (180 / Math.PI);

    setArrowTarget({ x: targetX, y: targetY, angle: angleDeg, isShooting: true });

    setTimeout(() => {
      if (option.type === "damma") {
        if (soundEnabled) successAudio.current.play();
        setScore((s) => s + 10);

        setTimeout(() => {
          if (currentRoundIndex + 1 < gameRounds.length) {
            setCurrentRoundIndex((prev) => prev + 1);
            setArrowTarget({ x: 0, y: 0, angle: 0, isShooting: false });
            setIsAiming(false);
          } else {
            setIsGameOver(true);
          }
        }, 600);
      } else {
        if (soundEnabled) errorAudio.current.play();
        setTimeout(() => {
          setArrowTarget({ x: 0, y: 0, angle: 0, isShooting: false });
          setIsAiming(false);
        }, 500);
      }
    }, 350);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      <img src={bgImg} alt="الخلفية" style={styles.bg} />

      {/* نافذة الفوز النهائي */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={styles.overlay}
          >
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={38} color="#FFD700" />
                <h1 style={{ margin: "6px 0", fontSize: "18px", color: "#333" }}>أحسنت يا بطل الرماية 🎯</h1>
                
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#4CAF50", margin: "4px 0" }}>النتيجة: {score}</p>
              </div>

              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtnSmall}><RotateCcw size={19}/></button>
                <button onClick={() => navigate("/Nunation")} style={styles.circleBtnSmall}><ArrowRight size={19}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtnSmall}><Home size={19}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        <div style={styles.headerWrapper}>
          <div style={styles.mainTitleBox} className="main-title-text">لعبة رمي السهم</div>
          <div style={styles.subTitleBox} className="sub-title-text">
            اضغط على الكلمة التي تحتوي على تنوين الضم 
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* لوحات الهدف */}
      <div style={styles.targetSection} className="targets-row">
        {currentRound.options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleOptionClick(option, e)}
            style={styles.targetWrapper}
            className="target-card"
          >
            <img src={targetBoardImg} alt="لوحة الهدف" style={styles.targetImg} />
            <span style={styles.targetText}>{option.text}</span>
          </motion.div>
        ))}
      </div>

      {/* منطقة الرامي */}
      <div style={styles.shooterSection} className="shooter-section">
        <img 
          src={isAiming ? boyShootingImg : boyStandingImg} 
          alt="الولد" 
          style={styles.boyImg} 
          className="boy-img" 
        />

        {isAiming && (
          <motion.img
            ref={arrowRef}
            src={arrowImg}
            alt="السهم"
            style={styles.arrowImg}
            className="arrow-element"
            animate={
              arrowTarget.isShooting
                ? {
                    x: arrowTarget.x,
                    y: arrowTarget.y,
                    rotate: arrowTarget.angle,
                    scale: 0.8,
                  }
                : { x: 0, y: 0, rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        )}
      </div>

      {/* أزرار التحكم السفلية */}
      <div style={styles.bottomSection} className="bottom-section-center">
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={19}/> : <VolumeX size={19}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={19}/></button>
          <button onClick={() => navigate("/Nunation")} style={styles.circleBtn}><ArrowRight size={19}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={19}/></button>
        </div>
      </div>

    </div>
  );
}

// التنسيقات الاستجابية
const responsiveCSS = `
  .main-title-text {
    font-size: clamp(20px, 2.5vw, 26px) !important;
  }
  .sub-title-text {
    font-size: clamp(12px, 1.3vw, 15px) !important;
  }

  @media (max-width: 850px) {
    .targets-row {
      top: 30% !important;
      gap: 12px !important;
    }

    .target-card {
      width: 95px !important;
      height: 95px !important;
    }

    .target-card span {
      font-size: 25px !important;
    }

    /* إرجاع الولد للخلف أكثر في شاشات الموبايل فقط */
    .shooter-section {
      left: -10px !important;
      bottom: 15px !important;
    }

    .boy-img {
      width: 170px !important;
    }

    .arrow-element {
      width: 100px !important;
      left: 60px !important;
      bottom: 25px !important;
    }

    .bottom-section-center {
      bottom: 10px !important;
    }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bg: { position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: -1 },
  
  // النافذة المنبثقة
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "14px 18px", borderRadius: "16px", textAlign: "center", width: "85%", maxWidth: "260px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" },
  winContent: { marginBottom: "10px" },
  resultButtons: { display: "flex", gap: "10px", justifyContent: "center" },
  circleBtnSmall: { width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "#8E24AA", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },

  // الشريط العلوي
  topBar: { position: "absolute", top: "10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(15px, 2vw, 18px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  mainTitleBox: { background: "#6A1B9A", padding: "4px 15px", borderRadius: "15px", border: "2px solid #FFD700", color: "#FFF", fontWeight: "300", boxShadow: "0 3px 6px rgba(0,0,0,0.2)" },
  subTitleBox: { background: "#ffffffee", padding: "3px 16px", borderRadius: "12px", border: "2px solid #6A1B9A", color: "#4A148C", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },

  // لوحات الهدف
  targetSection: { position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", gap: "30px", zIndex: 5, justifyContent: "center" },
  targetWrapper: { width: "120px", height: "130px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  targetImg: { position: "absolute", width: "100%", height: "100%", objectFit: "contain" },
  targetText: { position: "absolute", fontSize: "28px", fontWeight: "900", color: "#0D47A1", fontFamily: "'Traditional Arabic', 'Cairo', sans-serif" },

  // الولد لشاشات الكمبيوتر/اللابتوب (لم تتغير)
  shooterSection: { position: "absolute", bottom: "18px", left: "70px", zIndex: 6, display: "flex", alignItems: "flex-end" },
  boyImg: { width: "180px", objectFit: "contain" },
  arrowImg: { position: "absolute", left: "90px", bottom: "10px", width: "110px", objectFit: "contain", transformOrigin: "left center" },

  // الأزرار السفلية
  bottomSection: { position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 10 },
  buttonsContainer: { display: "flex", gap: "10px", justifyContent: "center" },
  circleBtn: { width: "clamp(38px, 3.8vw, 42px)", height: "clamp(38px, 3.8vw, 42px)", borderRadius: "50%", border: "none", background: "#8E24AA", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.25)" }
};