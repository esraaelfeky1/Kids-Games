// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Home, 
  ArrowRight, 
  Trophy,
  Check,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. استيراد الخلفيات الخاصة باللعبة
import bgImg from "../assets/shaddahbg.jpeg";         // خلفية اللابتوب والتابلت
import bgMobileImg from "../assets/shaddahbgmob.jpeg"; // خلفية الموبايل

// 2. الأصوات
import successSound from "/sounds/hay1.mp3"; 
import errorSound from "/sounds/pop.mp3";

// 3. بنية الأسئلة السبعة (كلمات بها شدة وكلمات ليس بها شدة)
const questionsData = [
  { id: 1, word: "مُعَلِّمٌ", hasShaddah: true },
  { id: 2, word: "كَتَبَ", hasShaddah: false },
  { id: 3, word: "مُدَرِّسٌ", hasShaddah: true },
  { id: 4, word: "قَلَمٌ", hasShaddah: false },
  { id: 5, word: "شَمْسٌ", hasShaddah: false },
  { id: 6, word: "طَبَّاخٌ", hasShaddah: true },
  { id: 7, word: "قِطَّةٌ", hasShaddah: true },
];

export default function ShaddahGame() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0); // من 0 إلى 6
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wrongClick, setWrongClick] = useState(false);

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

  // التعامل مع اختيار الطفل (هل الكلمة بها شدة أم لا؟)
  const handleAnswer = (userChoiceHasShaddah) => {
    const currentQ = questionsData[currentQuestion];

    if (userChoiceHasShaddah === currentQ.hasShaddah) {
      // إجابة صحيحة
      playAudio(successAudio);
      setScore((s) => s + 10);
      setWrongClick(false);

      const nextQ = currentQuestion + 1;
      if (nextQ < questionsData.length) {
        setCurrentQuestion(nextQ);
      } else {
        setTimeout(() => {
          setIsGameOver(true);
        }, 1000);
      }
    } else {
      // إجابة خاطئة
      playAudio(errorAudio);
      setWrongClick(true);
      setTimeout(() => setWrongClick(false), 600);
    }
  };

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
                <Trophy size={48} color="#FFD700" />
                <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>مبروك يا بطل 🚦</h1>

                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4CAF50", margin: "8px 0" }}>النتيجة: {score}</p>
              </div>

              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtnSmall}><RotateCcw size={20}/></button>
                <button onClick={() => navigate("/Nunation")} style={styles.circleBtnSmall}><ArrowRight size={20}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtnSmall}><Home size={20}/></button>
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
            هَلِ الكَلِمَةُ المَعْرُوضَةُ فِيَهَا شَدَّةٌ ( ّ ) ؟
          </div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* منطقة التفاعل واللعبة */}
      {!isGameOver && currentQuestion < questionsData.length && (
        <div style={styles.gameCenterArea} className="game-center-area">
          
          {/* مربع عرض الكلمة */}
          <motion.div 
            key={currentQuestion}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`word-card-box ${wrongClick ? "shake-anim" : ""}`}
            style={styles.wordBox}
          >
            <span style={styles.wordText} className="word-text">
              {questionsData[currentQuestion].word}
            </span>
          </motion.div>

          {/* أزرار الاختيار (الأخضر للشَّدَّة، والأحمر لِبِدُون شَدَّة) */}
          <div style={styles.buttonsContainer} className="buttons-choice-container">
            
            {/* الزر الأخضر (فيها شدة) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(true)}
              style={styles.greenBtn}
              className="choice-btn green-btn"
            >
              <div style={styles.btnTitle} className="choice-title-text">شَدَّة</div>
              <div style={styles.circleBadgeGreen}>
                <Check size={28} color="#FFF" strokeWidth={3} />
              </div>
            
            </motion.button>

            {/* الزر الأحمر (بدون شدة) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(false)}
              style={styles.redBtn}
              className="choice-btn red-btn"
            >
              <div style={styles.btnTitle} className="choice-title-text">بِدُون شَدَّة</div>
              <div style={styles.circleBadgeRed}>
                <X size={28} color="#FFF" strokeWidth={3} />
              </div>
            
            </motion.button>

          </div>

        </div>
      )}

      {/* أزرار التحكم السفلي */}
      <div style={styles.bottomSection} className="bottom-section-center">
        <div style={styles.controlButtonsGroup}>
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

// التنسيقات المتجاوبة والتأثيرات
const responsiveCSS = `
  @keyframes shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
    100% { transform: translateX(0); }
  }
  .shake-anim {
    animation: shake 0.5s ease-in-out;
    border-color: #E57373 !important;
  }

  .main-title-text {
    font-size: clamp(15px, 2vw, 22px) !important;
  }

  .mobile-bg { display: none !important; }
  .desktop-bg { display: block !important; }

  /* ==========================================
     1) شاشات الكمبيوتر واللابتوب
     ========================================== */
  @media (min-width: 1025px) {
    .game-center-area {
      top: 52% !important;
    }
    .word-card-box {
      width: 300px !important;
      height: 100px !important;
    }
    .word-text {
      font-size: 70px !important;
    }
    .buttons-choice-container {
      gap: 50px !important;
    }
     
    .choice-btn {
      width: 130px !important;
      height: 150px !important;
      border-radius: 15px !important;
    }
  }

  /* ==========================================
     2) شاشات التابلت
     ========================================== */
  @media (min-width: 601px) and (max-width: 1024px) {
    .game-center-area {
      top: 52% !important;
    }
    .word-card-box {
      width: 300px !important;
      height: 120px !important;
    }
    .word-text {
      font-size: 70px !important;
    }
    .buttons-choice-container {
      gap: 20px !important;
    }
    .choice-btn {
      width: 150px !important;
      height: 150px !important;
    }
  }

  /* ==========================================
     3) شاشات الموبايل (تكبير إضافي لنص الأزرار)
     ========================================== */
  @media (max-width: 600px) {
    .desktop-bg { display: none !important; }
    .mobile-bg { display: block !important; }

    .game-center-area {
      top: 48% !important;
      width: 85vw !important;
    }
    .word-card-box {
      width: 42vw !important;
      height: 100px !important;
      border-radius: 20px !important;
    }
    .word-text {
      font-size: 54px !important;
    }
    .buttons-choice-container {
      gap: 15px !important;
      margin-top: 15px !important;
    }
    .choice-btn {
      width: 23vw !important;  /* تم توسيع الزر قليلاً ليناسب التكبير */
      height: 110px !important;
      border-radius: 16px !important;
      padding: 6px !important;
    }
    /* تم تكبير حجم الخط هنا أكثر ليكون أوضح على الموبايل */
    .choice-title-text {
      font-size: 20.5px !important; 
      margin-top: 17px !important;
      margin-bottom: 2px !important;
      line-height: 1.15 !important;
      font-weight: 900 !important;
    }
    .choice-btn svg {
      width: 18px !important;
      height: 18px !important;
    }
    .choice-btn div:last-child {
      width: 32px !important;
      height: 32px !important;
    }
    .bottom-section-center {
      bottom: 10px !important;
    }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 },
  
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "20px 24px", borderRadius: "20px", textAlign: "center", width: "85%", maxWidth: "160px", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" },
  winContent: { marginBottom: "15px" },
  resultButtons: { display: "flex", gap: "12px", justifyContent: "center" },
  circleBtnSmall: { width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },

  // الشريط العلوي
  topBar: { position: "absolute", top: "12px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(16px, 1.6vw, 16px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center" },
  mainTitleBox: { background: "#FFF8E1", padding: "6px 18px", borderRadius: "16px", border: "3px solid #8D6E63", color: "#3E2723", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", textAlign: "center" },

  // المنطقة المركزية للعب
  gameCenterArea: {
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 10
  },

  // مربع عرض الكلمة
  wordBox: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "4px dashed #0288D1",
    borderRadius: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    transition: "border-color 0.2s"
  },
  wordText: {
    fontWeight: "bold",
    color: "#1565C0",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif"
  },

  // أزرار الاختيارات
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px"
  },

  // الزر الأخضر
  greenBtn: {
    background: "#4CAF50",
    border: "4px solid #388E3C",
    boxShadow: "0 8px 0 #2E7D32, 0 10px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: "12px 8px"
  },

  // الزر الأحمر
  redBtn: {
    background: "#F44336",
    border: "4px solid #D32F2F",
    boxShadow: "0 8px 0 #C62828, 0 10px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: "12px 8px"
  },

  btnTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: "clamp(25px, 2.2vw, 30px)",
    marginBottom: "10px",
    marginTop: "10px"
  },

  circleBadgeGreen: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#2E7D32",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
  },

  circleBadgeRed: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#B71C1C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
  },

  // أزرار التحكم السفلي
  bottomSection: { position: "absolute", bottom: "14px", left: "50%", transform: "translateX(-50%)", zIndex: 200 },
  controlButtonsGroup: { display: "flex", gap: "14px", justifyContent: "center" },
  circleBtn: { width: "clamp(42px, 4.2vw, 56px)", height: "clamp(42px, 4.2vw, 56px)", borderRadius: "50%", border: "none", background: "#0288D1", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }
};