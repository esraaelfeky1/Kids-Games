// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Home, 
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// الصور والأصوات
import bgImg from "../assets/tuol6.jpeg";           
import bgMobileImg from "../assets/tuol10.jpeg";     
import snailImg from "../assets/snail.png";         
import trophyImg from "../assets/trophy3.png";       
import successSound from "/sounds/hay1.mp3"; 
import errorSound from "/sounds/pop.mp3";

// -------------------------------------------------------------
// 🎛️ 📌 [أماكن البلاطات الأصلية للاب توب تماماً]
// -------------------------------------------------------------
const TILE_CONFIG = {
  row1Top: "31%",  
  row2Top: "53%",  
  row3Top: "76%",  

  col1Left: "33%", 
  col2Left: "51%", 
  col3Left: "70%", 
};

const tilePositions = [
  // الصف الأول (من اليسار إلى اليمين)
  { top: TILE_CONFIG.row1Top, left: TILE_CONFIG.col1Left },
  { top: TILE_CONFIG.row1Top, left: TILE_CONFIG.col2Left },
  { top: TILE_CONFIG.row1Top, left: TILE_CONFIG.col3Left },

  // الصف الثاني (من اليمين إلى اليسار)
  { top: TILE_CONFIG.row2Top, left: TILE_CONFIG.col3Left },
  { top: TILE_CONFIG.row2Top, left: TILE_CONFIG.col2Left },
  { top: TILE_CONFIG.row2Top, left: TILE_CONFIG.col1Left },

  // الصف الثالث (من اليسار إلى اليمين)
  { top: TILE_CONFIG.row3Top, left: TILE_CONFIG.col1Left },
  { top: TILE_CONFIG.row3Top, left: TILE_CONFIG.col2Left },
  { top: TILE_CONFIG.row3Top, left: TILE_CONFIG.col3Left },
];

// -------------------------------------------------------------
// 🐌 📌 [مسار حركة الحلزون الأصلي للاب توب]
// -------------------------------------------------------------
const pathPositions = [
  { top: "29%", left: "18%", facingLeft: false }, 
  { top: "27%", left: "33%", facingLeft: false }, 
  { top: "25%", left: "51%", facingLeft: false }, 
  { top: "24%", left: "70%", facingLeft: false }, 
  { top: "49%", left: "70%", facingLeft: true },  
  { top: "49%", left: "51%", facingLeft: true },  
  { top: "49%", left: "33%", facingLeft: true },  
  { top: "72%", left: "33%", facingLeft: false }, 
  { top: "72%", left: "51%", facingLeft: false }, 
  { top: "72%", left: "70%", facingLeft: false }, 
  { top: "82%", left: "86%", facingLeft: false }  
];

// 📝 بيانات الأسئلة
const questionsData = [
  { id: 1, text: "ما أجمل الحديقة", correctAnswer: "!" },
  { id: 2, text: "أين تذهب يا حلزون", correctAnswer: "?" },
  { id: 3, text: "احذر الطريق", correctAnswer: "." },
  { id: 4, text: "لدي بيت صغير", correctAnswer: "." },
  { id: 5, text: "هل تحب الخضروات", correctAnswer: "?" },
  { id: 6, text: "أنا أحب الحلزون", correctAnswer: "." },
  { id: 7, text: "ما أضخم الفيل", correctAnswer: "!" },
  { id: 8, text: "لنصل معاً إلى القمة", correctAnswer: "." },
  { id: 9, text: "ما رأيك في السباق", correctAnswer: "?" }
];

const optionSymbols = [".", "!", "?"];

export default function SnailRaceGame() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0); 
  const [snailPathIndex, setSnailPathIndex] = useState(0); 
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [wrongSymbol, setWrongSymbol] = useState(null);

  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  const playAudio = (audioRef) => {
    if (!soundEnabled || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const handleAnswerClick = (symbol, qIdx) => {
    if (qIdx !== currentQuestion) return;

    if (symbol === questionsData[qIdx].correctAnswer) {
      playAudio(successAudio);
      setScore((s) => s + 10);
      setWrongSymbol(null);

      const nextQ = qIdx + 1;
      setCurrentQuestion(nextQ); 

      if (nextQ === questionsData.length) {
        setSnailPathIndex(pathPositions.length - 1);
        setTimeout(() => {
          setIsGameOver(true);
        }, 1200);
      } else {
        setSnailPathIndex(nextQ);
      }
    } else {
      playAudio(errorAudio);
      setWrongSymbol(symbol);
      setTimeout(() => setWrongSymbol(null), 500);
    }
  };

  const currentSnailPos = pathPositions[snailPathIndex] || pathPositions[0];

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🖼️ الخلفيات */}
      <img src={bgImg} alt="الخلفية" style={styles.bg} className="desktop-bg" />
      <img src={bgMobileImg} alt="خلفية الموبايل" style={styles.bg} className="mobile-bg" />

      {/* 📊 الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        <div style={styles.headerWrapper}>
          <div style={styles.mainTitleBox} className="main-title-text">سِبَاقُ الحَلَزُونِ 🐌</div>
          <div style={styles.subTitleBox} className="sub-title-text">سَاعِدِ الحَلَزُونَ لِلْوُصُولِ إِلَى خَطِّ النِّهَايَةِ بِاخْتِيَارِ علاَمَةِ التَّرْقِيمِ المُنَاسِبَةِ</div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* 🏆 الكأس */}
      <div style={styles.trophyAtFinish} className="finish-trophy">
        <img src={trophyImg} alt="الكأس" style={styles.trophyImgFinish} className="trophy-img" />
      </div>

      {/* 🐌 الحلزون - تمت إضافة كلاس ديناميكي يحدد الخطوة التي يقف عليها */}
      <motion.div 
        className={`snail-box snail-step-${snailPathIndex}`}
        style={{
          ...styles.snailWrapper,
          top: currentSnailPos.top,
          left: currentSnailPos.left,
        }}
        animate={{ 
          top: currentSnailPos.top,
          left: currentSnailPos.left,
          scaleX: currentSnailPos.facingLeft ? -1 : 1
        }}
        transition={{ type: "spring", stiffness: 45, damping: 13 }}
      >
        <img src={snailImg} alt="الحلزون" style={styles.snailImg} className="snail-img" />
      </motion.div>

      {/* 🧩 الأسئلة والخيارات */}
      {questionsData.map((q, qIdx) => {
        const isActive = qIdx === currentQuestion;
        const isPassed = qIdx < currentQuestion;
        const pos = tilePositions[qIdx];

        return (
          <div 
            key={q.id} 
            className={`tile-item tile-item-${qIdx}`}
            style={{
              ...styles.tileContent,
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -50%)" + (isActive ? " scale(1.05)" : " scale(1)"),
              zIndex: isActive ? 30 : 15,
            }}
          >
            {/* السؤال */}
            <div style={styles.questionLine} className="q-line">
              <span style={styles.qText} className="q-text">{q.text}</span>
              <div 
                className="dashed-box"
                style={{
                  ...styles.dashedBox,
                  borderColor: isActive ? "#1B5E20" : "#222",
                  backgroundColor: isPassed ? "#C8E6C9" : "#FFFFFF"
                }}
              >
                {isPassed ? q.correctAnswer : ""}
              </div>
            </div>

            {/* الخيارات */}
            <div style={styles.optionsLine} className="opts-line">
              {optionSymbols.map((sym) => (
                <motion.button
                  key={sym}
                  className="symbol-btn"
                  whileHover={isActive ? { scale: 1.2 } : {}}
                  whileTap={isActive ? { scale: 0.9 } : {}}
                  onClick={() => handleAnswerClick(sym, qIdx)}
                  disabled={!isActive}
                  style={{
                    ...styles.symBtn,
                    cursor: isActive ? "pointer" : "default",
                    backgroundColor: isPassed && sym === q.correctAnswer ? "#81C784" : "#FFFFFF",
                    borderColor: isActive ? "#2E7D32" : "#455A64",
                    pointerEvents: "auto"
                  }}
                >
                  {sym}
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}

      {/* 🔘 أزرار التحكم السفلية */}
      <div style={styles.bottomSection}>
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={24}/></button>
          <button onClick={() => navigate(-1)} style={styles.circleBtn}><ArrowRight size={24}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
        </div>
      </div>

      {/* 🎉 نافذة الفوز */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <h2 style={{ margin: "4px 0", color: "#2E7D32", fontSize: "20px", fontWeight: "bold" }}>رَائِعٌ جِدًّا يَا بَطَلُ🏆</h2>
              
              <p style={{ fontSize: "18px", fontWeight: "bold", color: "#1565C0", margin: "6px 0" }}>النتيجة: {score}</p>
              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtnSmall}><RotateCcw size={16}/></button>
                <button onClick={() => navigate(-1)} style={styles.circleBtnSmall}><ArrowRight size={16}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtnSmall}><Home size={16}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// 🎛️ 📌 [التحكم بالمواقع للموبايل والتابلت فقط]
// -------------------------------------------------------------
const responsiveCSS = `
  .mobile-bg { display: none !important; }
  .desktop-bg { display: block !important; }

  /* =========================================================
     📱 1) إعدادات التابلت (Tablet: 601px - 1024px)
     ========================================================= */
  @media (min-width: 601px) and (max-width: 1024px) {
    .tile-item { width: 30% !important; }

    /* 📍 أماكن الأسئلة للتابلت */
    .tile-item-0 { top: 36% !important; left: 33% !important; }
    .tile-item-1 { top: 36% !important; left: 51% !important; }
    .tile-item-2 { top: 36% !important; left: 70% !important; }
    .tile-item-3 { top: 53% !important; left: 70% !important; }
    .tile-item-4 { top: 53% !important; left: 51% !important; }
    .tile-item-5 { top: 53% !important; left: 30% !important; }
    .tile-item-6 { top: 69% !important; left: 30% !important; }
    .tile-item-7 { top: 69% !important; left: 51% !important; }
    .tile-item-8 { top: 69% !important; left: 70% !important; }

    /* 🏆 📍 مكان الكأس للتابلت */
    .finish-trophy {
      top: 71% !important;
      left: 95% !important;
    }

    /* 🐌 📍 تحكم بأماكن الحلزون للتابلت بكل خطوة */
    /* بداية اللعبة */
    .snail-step-0 { top: 29% !important; left: 10% !important; }
    /* الصف الأول */
    .snail-step-1 { top: 27% !important; left: 33% !important; }
    .snail-step-2 { top: 25% !important; left: 51% !important; }
    .snail-step-3 { top: 24% !important; left: 70% !important; }
    /* الصف الثاني */
    .snail-step-4 { top: 49% !important; left: 70% !important; }
    .snail-step-5 { top: 49% !important; left: 51% !important; }
    .snail-step-6 { top: 49% !important; left: 33% !important; }
    /* الصف الثالث */
    .snail-step-7 { top: 62% !important; left: 33% !important; }
    .snail-step-8 { top: 62% !important; left: 51% !important; }
    .snail-step-9 { top: 62% !important; left: 70% !important; }
    /* النهاية عند الكأس */
    .snail-step-10 { top: 65% !important; left: 80% !important; }

    /* الأحجام للتابلت */
    .q-text { font-size: 16px !important; font-weight: 900 !important; color: #000 !important; text-shadow: 0px 0px 6px #FFF !important; }
    .dashed-box { width: 28px !important; height: 28px !important; font-size: 18px !important; }
    .symbol-btn { width: 34px !important; height: 34px !important; font-size: 18px !important; }
    .q-line { gap: 6px !important; margin-bottom: 6px !important; }
    .opts-line { gap: 8px !important; }
    .main-title-text { font-size: 17px !important; padding: 5px 14px !important; }
    .sub-title-text { font-size: 12px !important; padding: 3px 10px !important; }
    .trophy-img { width: 75px !important; }
    .snail-img { width: 65px !important; }
  }

  /* =========================================================
     📱 2) إعدادات الموبايل (Mobile: أقل من 600px)
     ========================================================= */
  @media (max-width: 600px) {
    .desktop-bg { display: none !important; }
    .mobile-bg { display: block !important; }

    .tile-item { width: 35% !important; }

    /* 🚫 إخفاء المربع المنقط الأبيض بالموبايل */
    .dashed-box { display: none !important; }

    /* 📍 أماكن الأسئلة للموبايل */
    .tile-item-0 { top: 48% !important; left: 28% !important; }
    .tile-item-1 { top: 48% !important; left: 50% !important; }
    .tile-item-2 { top: 48% !important; left: 72% !important; }
    .tile-item-3 { top: 61% !important; left: 72% !important; }
    .tile-item-4 { top: 61% !important; left: 50% !important; }
    .tile-item-5 { top: 61% !important; left: 28% !important; }
    .tile-item-6 { top: 78% !important; left: 28% !important; }
    .tile-item-7 { top: 78% !important; left: 50% !important; }
    .tile-item-8 { top: 78% !important; left: 72% !important; }

    /* 🏆 📍 مكان الكأس للموبايل */
    .finish-trophy {
      top: 80% !important;  
      left: 90% !important; 
    }

    /* 🐌 📍 🎯 [تحكم كامل بمكان الحلزون لكل خطوة على الموبايل] 🎯 */

    /* 🏁 بداية اللعبة (قبل الإجابة على السؤال الأول) */
    .snail-step-0 { top: 40% !important; left: 7% !important;  }

    /* 🟢 الصف الأول للموبايل (عدلي top و left لكل خطوة براحتك) */
    .snail-step-1 { top: 42% !important; left: 28% !important; }
    .snail-step-2 { top: 42% !important; left: 50% !important; }
    .snail-step-3 { top: 42% !important; left: 72% !important; }

    /* 🟡 الصف الثاني للموبايل (الحلزون يرجع من اليمين لليسام) */
    .snail-step-4 { top: 55% !important; left: 72% !important; }
    .snail-step-5 { top: 55% !important; left: 50% !important; }
    .snail-step-6 { top: 55% !important; left: 28% !important; }

    /* 🔴 الصف الثالث للموبايل */
    .snail-step-7 { top: 72% !important; left: 28% !important; }
    .snail-step-8 { top: 72% !important; left: 50% !important; }
    .snail-step-9 { top: 72% !important; left: 72% !important; }

    /* 🏆 خط النهاية للموبايل */
    .snail-step-10 { top: 73% !important; left: 78% !important; }

    /* الأحجام للخطوط والأزرار للموبايل */
    .q-text { font-size: 15px !important; font-weight: 900 !important; color: #000 !important; text-shadow: 0px 0px 6px #FFF, 0px 0px 8px #FFF !important; }
    .symbol-btn { width: 28px !important; height: 28px !important; font-size: 14px !important; font-weight: 900 !important; border-width: 2px !important; }
    .q-line { gap: 4px !important; margin-bottom: 4px !important; justify-content: center !important; }
    .opts-line { gap: 4px !important; }
    .main-title-text { font-size: 18px !important; padding: 3px 8px !important; }
    .sub-title-text { font-size: 13px !important; padding: 2px 6px !important; }
    .trophy-img { width: 55px !important; }
    .snail-img { width: 66px !important; }
  }
`;

// 🎨 أسطايل اللاب توب الأصلي بالكامل
const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 },
  topBar: { position: "absolute", top: "8px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 40, alignItems: "flex-start" },
  box: { background: "rgba(255, 255, 255, 0.95)", padding: "6px 14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", boxShadow: "0 3px 8px rgba(0,0,0,0.15)", color: "#333" },
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  mainTitleBox: { background: "#FFF8E1", padding: "4px 18px", borderRadius: "14px", border: "2px solid #8D6E63", color: "#3E2723", fontWeight: "bold", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  subTitleBox: { background: "rgba(255, 255, 255, 0.95)", padding: "3px 12px", borderRadius: "10px", border: "2px solid #2E7D32", color: "#1B5E20", fontWeight: "bold" },
  
  trophyAtFinish: { position: "absolute", top: "84%", left: "86%", transform: "translate(-50%, -50%)", zIndex: 25, pointerEvents: "none" },
  trophyImgFinish: { width: "clamp(70px, 7vw, 100px)", height: "auto", filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.45))" },
  
  snailWrapper: { position: "absolute", zIndex: 35, transform: "translate(-50%, -50%)", pointerEvents: "none" },
  snailImg: { width: "clamp(50px, 5.5vw, 85px)", height: "auto" },
  tileContent: { position: "absolute", width: "20%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", pointerEvents: "auto" },
  questionLine: { display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", width: "100%", marginBottom: "8px", direction: "rtl" },
  qText: { fontSize: "clamp(13px, 1.4vw, 19px)", fontWeight: "900", color: "#0B0C10", textShadow: "0px 0px 8px #FFFFFF, 0px 0px 12px #FFFFFF", whiteSpace: "nowrap" },
  dashedBox: { width: "30px", height: "30px", border: "2.5px dashed #000", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: "#000", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" },
  optionsLine: { display: "flex", gap: "10px", justifyContent: "center" },
  symBtn: { width: "38px", height: "38px", borderRadius: "50%", border: "2.5px solid #263238", fontSize: "18px", fontWeight: "900", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 6px rgba(0,0,0,0.25)" },
  bottomSection: { position: "absolute", bottom: "26px", left: "50%", transform: "translateX(-50%)", zIndex: 40 },
  buttonsContainer: { display: "flex", gap: "12px", justifyContent: "center" },
  circleBtn: { width: "39px", height: "39px", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(0,0,0,0.25)" },
  
  overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  winBox: { background: "white", padding: "14px 10px", borderRadius: "16px", textAlign: "center", width: "70%", maxWidth: "180px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" },
  resultButtons: { display: "flex", gap: "8px", justifyContent: "center", marginTop: "10px" },
  circleBtnSmall: { width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
};