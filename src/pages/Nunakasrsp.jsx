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

// 1. استيراد خلفية اللابتوب والتابلت + خلفية الموبايل
import bgImgDesktop from "../assets/he.jpeg";      // للابتوب والتابلت
import bgImgMobile from "../assets/he1.jpeg";     // للموبايل فقط

// استيراد الأولاد والكرة
import boyStandingImg from "../assets/boystand1.png";       
import boyShootingImg from "../assets/boybow1.png";         
import ballImg from "../assets/e2.png";                  

// 2. استيراد صور العصافير
import bird1 from "../assets/bird1.png";
import bird2 from "../assets/bird2.png";
import bird3 from "../assets/bird3.png";
import bird4 from "../assets/bird4.png";
import bird5 from "../assets/bird5.png";
import bird6 from "../assets/bird3.png";
import bird7 from "../assets/bird2.png";

const birdImages = [bird1, bird2, bird3, bird4, bird5, bird6, bird7]; 

// الأصوات
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// 8 كلمات (4 في الصف الأول و4 في الصف الثاني) بالترتيب التبادلي
const initialWords = {
  row1: [
    { id: "o1", text: "قَلَمًا", type: "fatha" },
    { id: "o2", text: "كِتَابٍ", type: "kasra" },
    { id: "o3", text: "بَيْتًا", type: "fatha" },
    { id: "o4", text: "جَبَلٍ", type: "kasra" },
  ],
  row2: [
    { id: "o5", text: "وَرْدَةً", type: "fatha" },
    { id: "o6", text: "بَابٍ", type: "kasra" },
    { id: "o7", text: "سَحَابًا", type: "fatha" },
    { id: "o8", text: "قَمَرٍ", type: "kasra" },
  ],
};

export default function BirdKasraGame() {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [isAiming, setIsAiming] = useState(false);
  const [ballTarget, setBallTarget] = useState({ x: 0, y: 0, isShooting: false });
  
  // مصفوفة لتخزين معرفات الكلمات التي تم اصطيادها وتختفي
  const [hitOptionIds, setHitOptionIds] = useState([]);

  const ballRef = useRef(null);
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  // إجمالي كلمات الكسر المطلوبة للفوز (4 كلمات)
  const totalKasraCount = [...initialWords.row1, ...initialWords.row2].filter(
    (item) => item.type === "kasra"
  ).length;

  // العداد الزمني
  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  // دالة تصويب الكرة بدقة متناهية لتهبط في منتصف المربع الخشبي تماماً دون خطأ
  const handleOptionClick = (option, event) => {
    if (ballTarget.isShooting || hitOptionIds.includes(option.id)) return; 

    setIsAiming(true);

    // تحديد المربع الخشبي الهدف بدقة من العنصر
    const cardBoardElem = event.currentTarget.querySelector(".card-board-target") || event.currentTarget;
    const boardRect = cardBoardElem.getBoundingClientRect();

    // حساب مركز المربع المستهدف بدقة بالبكسل على الشاشة
    const boardCenterX = boardRect.left + boardRect.width / 2;
    const boardCenterY = boardRect.top + boardRect.height / 2;

    // حساب نقطة انطلاق الكرة الفعلية من داخل عنصر الكرة نفسه
    let startCenterX = window.innerWidth * 0.15;
    let startCenterY = window.innerHeight * 0.75;
    
    if (ballRef.current) {
      const ballRect = ballRef.current.getBoundingClientRect();
      startCenterX = ballRect.left + ballRect.width / 2; 
      startCenterY = ballRect.top + ballRect.height / 2;
    }

    // حساب المسافة الدقيقة (الإحداثيات الفعلية للوصول للمنتصف تماماً مع تصحيح الأبعاد)
    const targetX = boardCenterX - startCenterX;
    const targetY = boardCenterY - startCenterY;

    setBallTarget({ x: targetX, y: targetY, isShooting: true });

    setTimeout(() => {
      if (option.type === "kasra") {
        if (soundEnabled) successAudio.current.play();
        setScore((s) => s + 10);
        
        // إخفاء الكلمة بشكل دائم
        const newHitIds = [...hitOptionIds, option.id];
        setHitOptionIds(newHitIds);
        setIsAiming(false); 
        setBallTarget({ x: 0, y: 0, isShooting: false });

        // التحقق من الفوز
        if (newHitIds.length >= totalKasraCount) {
          setTimeout(() => setIsGameOver(true), 500);
        }
      } else {
        if (soundEnabled) errorAudio.current.play();
        setTimeout(() => {
          setIsAiming(false);
          setBallTarget({ x: 0, y: 0, isShooting: false });
        }, 150);
      }
    }, 450);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللابتوب والتابلت */}
      <img src={bgImgDesktop} alt="الخلفية" style={styles.bg} className="bg-desktop" />

      {/* خلفية الموبايل */}
      <img src={bgImgMobile} alt="خلفية الموبايل" style={styles.bg} className="bg-mobile" />

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
                <Trophy size={38} color="#FFD700" />
                <h1 style={{ margin: "6px 0", fontSize: "18px", color: "#333" }}>أحسنت يا بطل! 🎯</h1>
                <p style={{ fontSize: "13px", margin: "4px 0", color: "#555" }}>اصطدت كل كلمات تنوين الكسر بنجاح 🎉</p>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#4CAF50", margin: "4px 0" }}>النتيجة: {score}</p>
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
          <div style={styles.mainTitleBox} className="main-title-text">لعبة صيد العصافير</div>
          <div style={styles.subTitleBox} className="sub-title-text">
            اضرب الكلمة التي تحتوي على تنوين الكسر 
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* --- الصف الأول (4 كلمات) --- */}
      <div style={styles.ropeRow1} className="rope-row row-1">
        {initialWords.row1.map((option, idx) => {
          const isHit = hitOptionIds.includes(option.id);
          return (
            <div key={option.id} style={{ ...styles.birdWrapper, visibility: isHit ? "hidden" : "visible" }} className="bird-card">
              {!isHit && (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleOptionClick(option, e)}
                  style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
                >
                  <img 
                    src={birdImages[idx % 7]} 
                    alt="عصفور" 
                    style={styles.birdImg} 
                  />
                  <div style={styles.cardBoard} className="card-board-target">
                    <span style={styles.birdText} className="bird-text-size">{option.text}</span>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- الصف الثاني (4 كلمات) --- */}
      <div style={styles.ropeRow2} className="rope-row row-2">
        {initialWords.row2.map((option, idx) => {
          const isHit = hitOptionIds.includes(option.id);
          return (
            <div key={option.id} style={{ ...styles.birdWrapper, visibility: isHit ? "hidden" : "visible" }} className="bird-card">
              {!isHit && (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleOptionClick(option, e)}
                  style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
                >
                  <img 
                    src={birdImages[(idx + 4) % 7]} 
                    alt="عصفور" 
                    style={styles.birdImg} 
                  />
                  <div style={styles.cardBoard} className="card-board-target">
                    <span style={styles.birdText} className="bird-text-size">{option.text}</span>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* قسم الولد والكرة */}
      <div style={styles.shooterSection} className="shooter-section">
        <img 
          src={isAiming ? boyShootingImg : boyStandingImg} 
          alt="الولد" 
          style={styles.boyImg} 
          className="boy-img" 
        />

        {isAiming && (
          <motion.img
            ref={ballRef}
            src={ballImg}
            alt="الكرة"
            style={styles.ballImg}
            className="ball-element"
            animate={
              ballTarget.isShooting
                ? {
                    x: ballTarget.x,
                    y: ballTarget.y,
                    scale: 0.7,
                  }
                : { x: 0, y: 0, scale: 1 }
            }
            transition={{ duration: 0.45, ease: "easeOut" }} 
          />
        )}
      </div>

      {/* التحكم السفلي */}
      <div style={styles.bottomSection} className="bottom-section-center">
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={20}/></button>
          <button onClick={() => navigate("/Nunation")} style={styles.circleBtn}><ArrowRight size={20}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={20}/></button>
        </div>
      </div>

    </div>
  );
}

// التنسيقات وتبديل الخلفيات
const responsiveCSS = `
  .main-title-text {
    font-size: clamp(20px, 2.5vw, 26px) !important;
  }
  .sub-title-text {
    font-size: clamp(13px, 1.5vw, 16px) !important;
  }

  /* الوضع الافتراضي (لابتوب وكمبيوتر) */
  .bg-desktop {
    display: block !important;
  }
  .bg-mobile {
    display: none !important;
  }

  /* ==========================================
     1) شاشات التابلت (601px - 1024px)
     ========================================== */
  @media (min-width: 601px) and (max-width: 1024px) {
    .bg-desktop {
      display: block !important;
      object-fit: 100% 100% !important;
    }
    .bg-mobile {
      display: none !important;
    }

    .row-1 {
      top: 43% !important;
      left: 50% !important;
      width: 92vw !important;
      gap: 28px !important;
    }

    .row-2 {
      top: 57% !important;
      left: 50% !important;
      width: 92vw !important;
      gap: 28px !important;
    }

    .bird-card {
      width: 65px !important;
    }

    .bird-card img {
      width: 70px !important;
      height: 50px !important;
    }

    .card-board-target {
      min-width: 58px !important;
      padding: 1px 5px !important;
    }

    .bird-text-size {
      font-size: 23px !important;
    }

    .shooter-section {
      left: 20px !important;
      bottom: 15px !important;
    }

    .boy-img {
      width: 150px !important;
    }

    .ball-element {
      width: 38px !important;
      left: 80px !important;
      bottom: 60px !important;
    }
  }

  /* ==========================================
     2) شاشات الموبايل (0px - 600px)
     ========================================== */
  @media (max-width: 600px) {
    .bg-desktop {
      display: none !important;
    }
    .bg-mobile {
      display: block !important;
      object-fit: 100% 100% !important;
    }

    .row-1 {
      top: 49% !important;
      left: 50% !important;
      width: 98vw !important;
      gap: 12px !important;
    }

    .row-2 {
      top: 64% !important;
      left: 50% !important;
      width: 98vw !important;
      gap: 12px !important;
    }

    .bird-card {
      width: 58px !important;
    }

    .bird-card img {
      width: 52px !important;
      height: 45px !important;
    }

    .card-board-target {
      min-width: 52px !important;
      padding: 1px 4px !important;
      margin-top: -3px !important;
    }

    .bird-text-size {
      font-size: 23px !important;
    }

    .shooter-section {
      left: 5px !important;
      bottom: 10px !important;
    }

    .boy-img {
      width: 145px !important;
    }

    .ball-element {
      width: 30px !important; 
      left: 68px !important;
      bottom: 70px !important;
    }

    .bottom-section-center {
      bottom: 8px !important;
    }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bg: { position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: -1 },
  
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "14px 18px", borderRadius: "16px", textAlign: "center", width: "85%", maxWidth: "260px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" },
  winContent: { marginBottom: "10px" },
  resultButtons: { display: "flex", gap: "10px", justifyContent: "center" },
  circleBtnSmall: { width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },

  topBar: { position: "absolute", top: "10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(14px, 1.8vw, 17px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  mainTitleBox: { background: "#0288D1", padding: "4px 15px", borderRadius: "15px", border: "2px solid #FFD700", color: "#FFF", fontWeight: "bold", boxShadow: "0 3px 6px rgba(0,0,0,0.2)" },
  subTitleBox: { background: "#ffffffee", padding: "3px 16px", borderRadius: "12px", border: "2px solid #0288D1", color: "#01579B", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },

  ropeRow1: { 
    position: "absolute", 
    top: "42%", 
    left: "50%", 
    transform: "translateX(-50%)", 
    width: "85vw", 
    display: "flex", 
    justifyContent: "center", 
    gap: "55px", 
    zIndex: 5 
  },

  ropeRow2: { 
    position: "absolute", 
    top: "62%", 
    left: "50%", 
    transform: "translateX(-50%)", 
    width: "85vw", 
    display: "flex", 
    justifyContent: "center", 
    gap: "55px", 
    zIndex: 5 
  },
  
  birdWrapper: { width: "68px", display: "flex", flexDirection: "column", alignItems: "center" },
  birdImg: { width: "65px", height: "65px", objectFit: "contain" },
  
  cardBoard: { 
    background: "#FFFDE7", 
    border: "2px dashed #795548", 
    borderRadius: "6px", 
    padding: "1px 6px", 
    marginTop: "-2px", 
    boxShadow: "0 3px 6px rgba(0,0,0,0.2)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    minWidth: "70px" 
  },
  
  birdText: { fontSize: "27px", fontWeight: "bold", color: "#121212", fontFamily: "'Traditional Arabic', 'Cairo', sans-serif" },

  shooterSection: { position: "absolute", bottom: "18px", left: "60px", zIndex: 6, display: "flex", alignItems: "flex-end" },
  boyImg: { width: "170px", objectFit: "contain" },
  ballImg: { position: "absolute", left: "90px", bottom: "90px", width: "42px", objectFit: "contain" },

  bottomSection: { position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 10 },
  buttonsContainer: { display: "flex", gap: "10px", justifyContent: "center" },
  circleBtn: { width: "clamp(40px, 3.8vw, 50px)", height: "clamp(40px, 3.8vw, 50px)", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.25)" }
};