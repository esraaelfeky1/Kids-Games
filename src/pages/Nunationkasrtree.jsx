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

// 1. استيراد الخلفية
import bgImg from "../assets/rs.jpeg";

// 2. استيراد الشجرة والسلات
import treeImg from "../assets/tree1.png";              // صورة الشجرة
import basketKasra from "../assets/basketkasra.png";   // سلة تنوين الكسر
import basketDamma from "../assets/basketdamma.png";   // سلة تنوين الضم
import basketFatha from "../assets/basketfatha.png";   // سلة تنوين الفتح

// 3. استيراد صور التفاح الأربعة
import appleGreen from "../assets/applegree.png";
import appleRed from "../assets/applere.png";
import appleBlue from "../assets/appleblu.png";
import applePurple from "../assets/applepurpl.png";

const appleImages = [appleGreen, appleRed, appleBlue, applePurple];

// 4. الأصوات
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// الكلمات الثمانية من الصورة
const initialApples = [
  { id: "a1", text: "جَبَلًا", type: "fatha", imgIndex: 0 },
  { id: "a2", text: "قَلَمٌ", type: "damma", imgIndex: 1 },
  { id: "a3", text: "كِتَابًا", type: "fatha", imgIndex: 2 },
  { id: "a4", text: "بَيْتٍ", type: "kasra", imgIndex: 3 },
  { id: "a5", text: "نَهْرٍ", type: "kasra", imgIndex: 3 },
  { id: "a6", text: "طَعَامٌ", type: "damma", imgIndex: 1 },
  { id: "a7", text: "وَرْدَةً", type: "fatha", imgIndex: 0 },
  { id: "a8", text: "شَمْسٍ", type: "kasra", imgIndex: 2 },
];

export default function TreeNunationGame() {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  // الكلمات التي اصطادها الطفل وتختفي
  const [collectedAppleIds, setCollectedAppleIds] = useState([]);

  // مراجع السلات للتحقق من أبعادها
  const kasraBasketRef = useRef(null);
  const dammaBasketRef = useRef(null);
  const fathaBasketRef = useRef(null);

  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  // العداد الزمني
  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  // دالة فحص الإفلات داخل حدود السلة
  const isInsideBasket = (point, basketRef) => {
    if (!basketRef.current) return false;
    const rect = basketRef.current.getBoundingClientRect();
    return (
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom
    );
  };

  // منطق سحب وإفلات التفاحة
  const handleDragEnd = (apple, event, info) => {
    const dropPoint = { x: info.point.x, y: info.point.y };

    let targetType = null;
    if (isInsideBasket(dropPoint, kasraBasketRef)) targetType = "kasra";
    else if (isInsideBasket(dropPoint, dammaBasketRef)) targetType = "damma";
    else if (isInsideBasket(dropPoint, fathaBasketRef)) targetType = "fatha";

    if (targetType === apple.type) {
      if (soundEnabled) successAudio.current.play();
      setScore((s) => s + 10);

      const newCollected = [...collectedAppleIds, apple.id];
      setCollectedAppleIds(newCollected);

      if (newCollected.length >= initialApples.length) {
        setTimeout(() => setIsGameOver(true), 500);
      }
    } else if (targetType !== null) {
      if (soundEnabled) errorAudio.current.play();
    }
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية الشاشة */}
      <img src={bgImg} alt="الخلفية" style={styles.bg} />

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
                <h1 style={{ margin: "6px 0", fontSize: "18px", color: "#333" }}>أحسنت يا بطل 🎯</h1>
                
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
          <div style={styles.mainTitleBox} className="main-title-text">شجرة الكلمات</div>
          <div style={styles.subTitleBox} className="sub-title-text">
            اسحب التفاحات الى السلات الصحيحة
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* 1. الشجرة في الخلف تماماً */}
      <div style={styles.treeContainer} className="tree-container">
        <img src={treeImg} alt="الشجرة" style={styles.treeImg} className="tree-img" />
      </div>

      {/* 2. التفاح منفصل وفي المقدمة (أعلى من السلات) */}
      <div style={styles.applesGrid} className="apples-grid">
        {initialApples.map((apple) => {
          const isCollected = collectedAppleIds.includes(apple.id);
          if (isCollected) return <div key={apple.id} style={styles.appleSlot} className="apple-slot-size" />;

          return (
            <div key={apple.id} style={styles.appleSlot} className="apple-slot-size">
              <motion.div
                drag
                dragSnapToOrigin={true}
                whileDrag={{ scale: 1.2, zIndex: 99999 }}
                onDragEnd={(e, info) => handleDragEnd(apple, e, info)}
                style={styles.appleWrapper}
              >
                <img
                  src={appleImages[apple.imgIndex]}
                  alt="تفاحة"
                  style={styles.appleImg}
                  className="apple-img-size"
                />
                <span style={styles.appleText} className="apple-text-size">
                  {apple.text}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 3. السلات أمام الشجرة ولكن خلف التفاح */}
      <div style={styles.basketsContainer} className="baskets-container">
        <div ref={kasraBasketRef} style={styles.basketWrapper} className="basket-card">
          <img src={basketKasra} alt="تنوين كسر" style={styles.basketImg} className="basket-img-size" />
        </div>

        <div ref={dammaBasketRef} style={styles.basketWrapper} className="basket-card">
          <img src={basketDamma} alt="تنوين ضم" style={styles.basketImg} className="basket-img-size" />
        </div>

        <div ref={fathaBasketRef} style={styles.basketWrapper} className="basket-card">
          <img src={basketFatha} alt="تنوين فتح" style={styles.basketImg} className="basket-img-size" />
        </div>
      </div>

      {/* التحكم السفلي */}
      <div style={styles.bottomSection} className="bottom-section-center">
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={21}/> : <VolumeX size={21}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={21}/></button>
          <button onClick={() => navigate("/Nunation")} style={styles.circleBtn}><ArrowRight size={21}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={21}/></button>
        </div>
      </div>

    </div>
  );
}

// التنسيقات المتجاوبة
const responsiveCSS = `
  .main-title-text {
    font-size: clamp(20px, 2.5vw, 26px) !important;
  }
  .sub-title-text {
    font-size: clamp(13px, 1.5vw, 16px) !important;
  }

  /* ==========================================
     1) شاشات التابلت (601px - 1024px)
     ========================================== */
  @media (min-width: 601px) and (max-width: 1024px) {
    .tree-container {
      top: 16% !important;
      width: 60vw !important;
    }
    .apples-grid {
      top: 23% !important;
      width: 60vw !important;
      gap: 12px 18px !important;
    }
    .apple-slot-size {
      width: 80px !important;
      height: 80px !important;
    }
    .apple-img-size {
      width: 82px !important;
      height: 82px !important;
    }
    .apple-text-size {
      font-size: 22px !important;
    }
    .baskets-container {
      bottom: 60px !important;
      gap: 15px !important;
    }
    .basket-img-size {
      width: 130px !important;
    }
  }

  /* ==========================================
     2) شاشات الموبايل (0px - 600px)
     ========================================== */
  @media (max-width: 600px) {
    .tree-container {
      top: 16% !important;
      width: 88vw !important;
    }
    .apples-grid {
      top: 22% !important;
      width: 80vw !important;
      gap: 8px 10px !important;
    }
    .apple-slot-size {
      width: 68px !important;
      height: 68px !important;
    }
    .apple-img-size {
      width: 68px !important;
      height: 68px !important;
    }
    .apple-text-size {
      font-size: 19px !important;
    }
    .baskets-container {
      bottom: 50px !important;
      gap: 6px !important;
      width: 100vw !important;
    }
    .basket-img-size {
      width: 105px !important;
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
  winBox: { background: "white", padding: "14px 18px", borderRadius: "16px", textAlign: "center", width: "70%", maxWidth: "200px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" },
  winContent: { marginBottom: "10px" },
  resultButtons: { display: "flex", gap: "10px", justifyContent: "center" },
  circleBtnSmall: { width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },

  topBar: { position: "absolute", top: "10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(14px, 1.8vw, 17px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  mainTitleBox: { background: "#0288D1", padding: "4px 15px", borderRadius: "15px", border: "2px solid #FFD700", color: "#FFF", fontWeight: "bold", boxShadow: "0 3px 6px rgba(0,0,0,0.2)" },
  subTitleBox: { background: "#ffffffee", padding: "3px 16px", borderRadius: "12px", border: "2px solid #0288D1", color: "#01579B", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },

  // 1. الشجرة في الخلفية فقط (zIndex = 1)
  treeContainer: { position: "absolute", top: "14%", left: "50%", transform: "translateX(-50%)", width: "55vw", maxWidth: "500px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1, pointerEvents: "none" },
  treeImg: { width: "100%", height: "auto", objectFit: "contain" },

  // 2. شبكة التفاح في الطبقة الأولى والعليا فوق كل شيء (zIndex = 100)
  applesGrid: { position: "absolute", top: "21%", left: "51%", transform: "translateX(-50%)", width: "50vw", maxWidth: "520px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px 20px", justifyContentItems: "center", zIndex: 100 },
  appleSlot: { width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center" },
  
  appleWrapper: { position: "relative", cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none" },
  appleImg: { width: "88px", height: "88px", objectFit: "contain" },
  appleText: { position: "absolute", top: "52%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "23px", fontWeight: "bold", color: "#111", fontFamily: "'Traditional Arabic', 'Cairo', sans-serif", pointerEvents: "none", whiteSpace: "nowrap" },

  // 3. السلات في الوسط (أمام الشجرة وتحت التفاح) (zIndex = 10)
  basketsContainer: { position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", zIndex: 10 },
  basketWrapper: { cursor: "pointer", display: "flex", justifyContent: "center" },
  basketImg: { width: "110px", height: "auto", objectFit: "contain" },

  // شريط التحكم السفلي
  bottomSection: { position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 200 },
  buttonsContainer: { display: "flex", gap: "10px", justifyContent: "center" },
  circleBtn: { width: "clamp(43px, 3.8vw, 48px)", height: "clamp(43px, 3.8vw, 48px)", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.25)" }
};