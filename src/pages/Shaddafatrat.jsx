// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور الخاصة بك ===
import bgDesktopImg from "../assets/rabbitdesktop.png"; // خلفية اللاب والتابلت
import bgMobileImg from "../assets/rabbitmobile.jpeg";   // خلفية الموبايل
import rabbitImg from "../assets/rabbit1.png";          // صورة الأرنب

// صور الطوبات الثلاث المختلفة
import stoneType1 from "../assets/stone1.png"; 
import stoneType2 from "../assets/stone2.png"; 
import stoneType3 from "../assets/stone3.png"; 

// === 2. استيراد الأصوات ===
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// دالة لجلب صورة الطوبة المناسبة
const getStoneImage = (index) => {
  const stones = [stoneType1, stoneType2, stoneType3];
  return stones[index % 3];
};

// === 3. التحكم في أماكن الحجارة وموقع هبوط الأرنب لكل كلمة (لاب وموبايل) ===
const initialStonesData = [
  { 
    id: 1, word: "مُعَلِّمٌ", hasShaddah: true,  
    x: 35, y: 50, rabbitX: 30, rabbitY: 30, 
    mobileX: 35, mobileY: 63, mobileRabbitX: 30, mobileRabbitY: 50 
  },
  { 
    id: 2, word: "قَلَمٌ",   hasShaddah: false, 
    x: 30, y: 60, rabbitX: 25, rabbitY: 43, 
    mobileX: 27, mobileY: 70, mobileRabbitX: 27, mobileRabbitY: 60 
  },
  { 
    id: 3, word: "سَيَّارَةٌ", hasShaddah: true,  
    x: 20, y: 64, rabbitX: 15, rabbitY: 43, 
    mobileX: 48, mobileY: 65, mobileRabbitX: 43, mobileRabbitY: 53 
  },
  { 
    id: 4, word: "شَجَرَةٌ", hasShaddah: false, 
    x: 28, y: 83, rabbitX: 25, rabbitY: 65, 
    mobileX: 42, mobileY: 73, mobileRabbitX: 42, mobileRabbitY: 63 
  },
  { 
    id: 5, word: "قِطَّةٌ",   hasShaddah: true,  
    x: 39, y: 76, rabbitX: 35, rabbitY: 54, 
    mobileX: 35, mobileY: 80, mobileRabbitX: 29, mobileRabbitY: 68 
  },
  { 
    id: 6, word: "وَلَدٌ",   hasShaddah: false, 
    x: 49, y: 67, rabbitX: 45, rabbitY: 47, 
    mobileX: 50, mobileY: 83, mobileRabbitX: 50, mobileRabbitY: 73 
  },
  { 
    id: 7, word: "دَرَّاجَةٌ", hasShaddah: true,  
    x: 58, y: 78, rabbitX: 54, rabbitY: 56, 
    mobileX: 60, mobileY: 78, mobileRabbitX: 55, mobileRabbitY: 65 
  },
  { 
    id: 8, word: "مَدْرَسَةٌ",hasShaddah: false, 
    x: 69, y: 80, rabbitX: 65, rabbitY: 64, 
    mobileX: 63, mobileY: 69, mobileRabbitX: 63, mobileRabbitY: 59 
  },
  { 
    id: 9, word: "طَيَّارٌ",  hasShaddah: true,  
    x: 80, y: 78, rabbitX: 75, rabbitY: 55, 
    mobileX: 78, mobileY: 68, mobileRabbitX: 71, mobileRabbitY: 55 
  },
];

// موقع البداية فوق المنصة الخشبية (للاب والموبايل)
const START_POS_DESKTOP = { x: 19, y: 20 };
const START_POS_MOBILE = { x: 8, y: 45 };

// موقع أمام باب النهاية (للاب والموبايل)
const DOOR_POS_DESKTOP = { x: 88, y: 62 };
const DOOR_POS_MOBILE = { x: 85, y: 60 };

export default function RabbitJumpGame() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);
  
  // اختيار إحداثيات البداية المناسبة لنوع الشاشة
  const initialPos = isMobile ? START_POS_MOBILE : START_POS_DESKTOP;
  const doorPos = isMobile ? DOOR_POS_MOBILE : DOOR_POS_DESKTOP;

  // الحالات (States)
  const [rabbitPos, setRabbitPos] = useState(initialPos); 
  const [isJumping, setIsJumping] = useState(false);
  const [isDisappearing, setIsDisappearing] = useState(false); 
  const [completedStones, setCompletedStones] = useState([]); 
  
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  useEffect(() => {
    const handleResize = () => {
      const mobileState = window.innerWidth <= 850;
      setIsMobile(mobileState);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // العداد
  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  // عند الضغط على أي طوبة
  const handleStoneClick = (stone) => {
    if (isJumping || isGameOver) return;

    // تحديد مكان قفز الأرنب بناءً على نوع الجهاز
    const targetX = isMobile 
      ? (stone.mobileRabbitX ?? stone.mobileX) 
      : (stone.rabbitX ?? stone.x);

    const targetY = isMobile 
      ? (stone.mobileRabbitY ?? stone.mobileY) 
      : (stone.rabbitY ?? stone.y);

    // 1. القفز على الكلمة المختارة
    setIsJumping(true);
    setRabbitPos({ x: targetX, y: targetY });

    if (stone.hasShaddah) {
      // ✅ إجابة صحيحة
      setScore((prev) => prev + 10);

      setTimeout(() => {
        setIsJumping(false);
        setCompletedStones((prev) => [...prev, stone.id]);

        const remainingShaddah = initialStonesData.filter(
          (s) => s.hasShaddah && !completedStones.includes(s.id) && s.id !== stone.id
        );

        if (remainingShaddah.length === 0) {
          handleFinalDoorJump();
        }
      }, 500);

    } else {
      // ❌ إجابة خاطئة
      if (soundEnabled) errorAudio.current.play();

      setTimeout(() => {
        setIsJumping(false);
        // إرجاع الأرنب فوراً لمنصة البداية
        setTimeout(() => {
          setIsJumping(true);
          setRabbitPos(isMobile ? START_POS_MOBILE : START_POS_DESKTOP);
          setTimeout(() => setIsJumping(false), 500);
        }, 300);
      }, 500);
    }
  };

  // القفز النهائي للباب
  const handleFinalDoorJump = () => {
    setTimeout(() => {
      setIsJumping(true);
      setRabbitPos(doorPos); 

      setTimeout(() => {
        setIsJumping(false);
        setIsDisappearing(true);

        if (soundEnabled) successAudio.current.play();

        setTimeout(() => {
          setIsGameOver(true);
        }, 1200);
      }, 600);
    }, 400);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللعبة المتجاوبة */}
      <picture style={styles.bgPicture}>
        <source media="(max-width: 768px)" srcSet={bgMobileImg} />
        <img src={bgDesktopImg} alt="خلفية اللعبة" style={styles.bgImg} />
      </picture>

      {/* نافذة الفوز النهائي */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={50} color="#FFD700" />
                <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>أحسنت يا بطل🎉</h1>
                
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4CAF50" }}>النتيجة: {score}</p>
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
            <h1 style={styles.mainTitle} className="main-title-text">لعبة قفزة الأرنب</h1>
          </div>
          <div style={styles.subTitleCard}>
            <span style={styles.subTitle} className="sub-title-text">اقفز فقط على الكلمة التي بها شدّة</span>
            
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* مسرح اللعبة */}
      <div style={styles.gameStage}>

        {/* الأرنب */}
        <motion.div
          animate={{
            left: `${rabbitPos.x}%`,
            top: `${rabbitPos.y}%`,
            scale: isDisappearing ? 0 : 1,
            opacity: isDisappearing ? 0 : 1,
            y: isJumping ? -35 : 0,
          }}
          transition={{ duration: isJumping ? 0.45 : 0.6, ease: "easeInOut" }}
          style={styles.rabbitWrapper}
          className="rabbit-character"
        >
          <img src={rabbitImg} alt="الأرنب" style={styles.rabbitImg} />
        </motion.div>

        {/* رسم الطوبات والكلمات */}
        {initialStonesData.map((stone, index) => {
          const posX = isMobile ? stone.mobileX : stone.x;
          const posY = isMobile ? stone.mobileY : stone.y;
          const isWordHidden = completedStones.includes(stone.id);

          return (
            <div
              key={stone.id}
              onClick={() => handleStoneClick(stone)}
              style={{
                ...styles.stoneContainer,
                left: `${posX}%`,
                top: `${posY}%`,
              }}
              className="stone-item"
            >
              <img src={getStoneImage(index)} alt="طوبة" style={styles.stoneImg} />

              {!isWordHidden && (
                <>
                  <span style={styles.stoneNumber}>{stone.id}</span>
                  <span style={styles.stoneWord} className="stone-word-text">{stone.word}</span>
                </>
              )}
            </div>
          );
        })}

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

// === CSS التكيف للشاشات ===
const responsiveCSS = `
  .main-title-text { font-size: clamp(18px, 2.2vw, 24px) !important; }
  .sub-title-text { font-size: clamp(13px, 1.3vw, 15px) !important; }
  .badge-text { font-size: clamp(15px, 1.1vw, 14px) !important; padding: 2px 8px !important; }

  /* أحجام عناصر الكمبيوتر/اللابتوب */
  .stone-item {
    width: clamp(75px, 9.5vw, 110px) !important;
    height: clamp(48px, 5.5vw, 70px) !important;
  }

  .stone-word-text {
    font-size: clamp(15px, 1.7vw, 21px) !important;
  }

  .rabbit-character {
    width: clamp(78px, 10vw, 105px) !important;
  }

  /* 📱 التعديلات الخاصة بالموبايل فقط (الشاشات أصغر من 850px) */
  @media (max-width: 850px) {
    .rabbit-character { 
      width: clamp(60px, 12vw, 75px) !important; 
    }
    
    /* أبعاد الطوبة على الموبايل */
    .stone-item {
      width: clamp(68px, 14vw, 85px) !important;
      height: clamp(46px, 9.5vw, 58px) !important;
    }

    /* ✂️ تصغير خط الكلمات على الموبايل فقط لمظهر متناسق */
    .stone-word-text {
      font-size: clamp(16px, 3.8vw, 20px) !important;
      font-weight: 800 !important;
    }
  }
`;

// === التنسيقات العامة ===
const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bgPicture: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 },
  bgImg: { width: "100%", height: "100%", objectFit: "cover" },

  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "20px", borderRadius: "20px", textAlign: "center", width: "90%", maxWidth: "190px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  winContent: { marginBottom: "15px" },
  resultButtons: { display: "flex", gap: "12px", justifyContent: "center" },

  topBar: { position: "absolute", top: "8px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(12px, 1.5vw, 15px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerGroup: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  mainTitleCard: { background: "#ffffffee", padding: "4px 20px", borderRadius: "15px", border: "3px solid #6A1B9A", boxShadow: "0 3px 8px rgba(0,0,0,0.15)", textAlign: "center" },
  mainTitle: { color: "#4A148C", fontWeight: "900", margin: 0 },

  subTitleCard: { background: "#ffffffee", padding: "3px 14px", borderRadius: "12px", border: "2px solid #E91E63", boxShadow: "0 3px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "8px", },
  subTitle: { color: "#E91E63", fontWeight: "bold", },
  badge: { background: "#6A1B9A", color: "white", borderRadius: "8px", fontWeight: "bold" },

  gameStage: { position: "absolute", width: "100%", height: "100%", top: 0, left: 0 },

  rabbitWrapper: {
    position: "absolute",
    transform: "translate(-50%, -75%)",
    zIndex: 100,
    pointerEvents: "none"
  },
  rabbitImg: { width: "100%", height: "auto", objectFit: "contain" },

  stoneContainer: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  stoneImg: { width: "100%", height: "100%", objectFit: "contain", position: "absolute", pointerEvents: "none" },
  stoneNumber: {
    position: "absolute",
    top: "-12px",
    background: "#FF9800",
    color: "white",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
    border: "2px solid white",
    pointerEvents: "none"
  },
  stoneWord: {
    position: "relative",
    zIndex: 2,
    fontWeight: "900",
    color: "#1A237E",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
    pointerEvents: "none"
  },

  bottomSection: { position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 10 },
  buttonsContainer: { display: "flex", gap: "10px" },
  circleBtn: { width: "clamp(44px, 3.5vw, 42px)", height: "clamp(44px, 3.5vw, 42px)", borderRadius: "50%", border: "none", background: "#7B1FA2", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }
};