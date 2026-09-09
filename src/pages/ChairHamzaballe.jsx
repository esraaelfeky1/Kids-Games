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

// استيراد الصور
import bgImg from "../assets/ballbg.jpeg";         
import ballImg from "../assets/ballw.png";        
import netImg from "../assets/goal.png";          
import cardBgImg from "../assets/cardbg.png";    

// الأصوات
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// قائمة الجولات (كراسي الهمزة)
const gameRounds = [
  {
    id: 1,
    targetChair: "على الألف (أ / إ)",
    options: [
      { id: "o1", text: "يَأْكُلُ", isCorrect: true },
      { id: "o2", text: "كِتَابٌ", isCorrect: false },
      { id: "o3", text: "قَلَمٌ", isCorrect: false },
    ],
  },
  {
    id: 2,
    targetChair: "على الواو (ؤ)",
    options: [
      { id: "o1", text: "مَدْرَسَةٌ", isCorrect: false },
      { id: "o2", text: "سُؤَالٌ", isCorrect: true },
      { id: "o3", text: "شَمْسٌ", isCorrect: false },
    ],
  },
  {
    id: 3,
    targetChair: "على الياء / النبرة (ئـ / ئ)",
    options: [
      { id: "o1", text: "بِئْرٌ", isCorrect: true },
      { id: "o2", text: "بَابٌ", isCorrect: false },
      { id: "o3", text: "زَهْرَةٌ", isCorrect: false },
    ],
  },
  {
    id: 4,
    targetChair: "على السطر (ء)",
    options: [
      { id: "o1", text: "بَيْتٌ", isCorrect: false },
      { id: "o2", text: "إِمْلَاءٌ", isCorrect: true },
      { id: "o3", text: "شَجَرَةٌ", isCorrect: false },
    ],
  },
  {
    id: 5,
    targetChair: "على الواو (ؤ)",
    options: [
      { id: "o1", text: "مُؤْمِنٌ", isCorrect: true },
      { id: "o2", text: "كُرَةٌ", isCorrect: false },
      { id: "o3", text: "نَهْرٌ", isCorrect: false },
    ],
  },
  {
    id: 6,
    targetChair: "على الياء / النبرة (ئـ / ئ)",
    options: [
      { id: "o1", text: "طَالِبٌ", isCorrect: false },
      { id: "o2", text: "شَاطِئٌ", isCorrect: true },
      { id: "o3", text: "قَمَرٌ", isCorrect: false },
    ],
  },
  {
    id: 7,
    targetChair: "على الألف (أ / إ)",
    options: [
      { id: "o1", text: "سَمَكٌ", isCorrect: false },
      { id: "o2", text: "رَأْسٌ", isCorrect: true },
      { id: "o3", text: "حَدِيقَةٌ", isCorrect: false },
    ],
  },
];

export default function FootballHamzaGame() {
  const navigate = useNavigate();

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [ballTarget, setBallTarget] = useState({ x: 0, y: 0, isShooting: false });

  const ballRef = useRef(null);
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  const currentRound = gameRounds[currentRoundIndex];

  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  const handleOptionClick = (option, event) => {
    if (ballTarget.isShooting) return; 

    const cardRect = event.currentTarget.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    let ballCenterX = window.innerWidth / 2;
    let ballCenterY = window.innerHeight * 0.75;
    
    if (ballRef.current) {
      const ballRect = ballRef.current.getBoundingClientRect();
      ballCenterX = ballRect.left + ballRect.width / 2;
      ballCenterY = ballRect.top + ballRect.height / 2;
    }

    const targetX = cardCenterX - ballCenterX;
    const targetY = cardCenterY - ballCenterY;

    setBallTarget({ x: targetX, y: targetY, isShooting: true });

    setTimeout(() => {
      if (option.isCorrect) {
        if (soundEnabled) successAudio.current.play();
        setScore((s) => s + 10);

        setTimeout(() => {
          if (currentRoundIndex + 1 < gameRounds.length) {
            setCurrentRoundIndex((prev) => prev + 1);
            setBallTarget({ x: 0, y: 0, isShooting: false });
          } else {
            setIsGameOver(true);
          }
        }, 800);
      } else {
        if (soundEnabled) errorAudio.current.play();
        setTimeout(() => {
          setBallTarget({ x: 0, y: 0, isShooting: false });
        }, 600);
      }
    }, 450);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      <img src={bgImg} alt="الخلفية" style={styles.bg} />

      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={38} color="#FFD700" />
                <h1 style={{ margin: "6px 0", fontSize: "18px", color: "#333" }}>أحسنت يا بطل المرمى ⚽</h1>
          
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#4CAF50", margin: "4px 0" }}>النتيجة: {score}</p>
              </div>
              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtnSmall}><RotateCcw size={18}/></button>
                <button onClick={() => navigate(-1)} style={styles.circleBtnSmall}><ArrowRight size={18}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtnSmall}><Home size={18}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.headerWrapper}>
          <div style={styles.mainTitleBox} className="main-title-text">لعبة كراسي الهمزة ⚽</div>
          <div style={styles.subTitleBox} className="sub-title-text">
            سدد الكلمة التي تحتوي على همزة {currentRound.targetChair}
          </div>
        </div>
        <div style={styles.box}>⭐ {score}</div>
      </div>

      <div style={styles.gameArea} className="football-game-area">
        <div style={styles.goalContainer} className="goal-container">
          <img src={netImg} alt="المرمى" style={styles.netImg} />
          <div style={styles.cardsRow} className="cards-row">
            {currentRound.options.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleOptionClick(option, e)}
                style={styles.cardWrapper}
                className="word-card"
              >
                <img src={cardBgImg} alt="خلفية الكلمة" style={styles.cardBg} />
                <span style={styles.cardText}>{option.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={styles.ballContainer} className="ball-container">
          <motion.img
            ref={ballRef}
            src={ballImg}
            alt="كرة القدم"
            style={styles.ballImg}
            animate={
              ballTarget.isShooting
                ? { x: ballTarget.x, y: ballTarget.y, scale: 0.5, rotate: 720 }
                : { x: 0, y: 0, scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div style={styles.bottomSection} className="bottom-section-mobile">
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={24}/></button>
          <button onClick={() => navigate(-1)} style={styles.circleBtn}><ArrowRight size={24}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
        </div>
      </div>
    </div>
  );
}

const responsiveCSS = `
  .main-title-text { font-size: clamp(20px, 2.5vw, 26px) !important; }
  .sub-title-text { font-size: clamp(14px, 1.4vw, 16px) !important; }

  @media (max-width: 850px) {
    .football-game-area { top: 58% !important; width: 95vw !important; }
    .goal-container { width: 100% !important; height: 220px !important; }
    .cards-row { gap: 8px !important; bottom: 40px !important; }
    
    .word-card { width: 95px !important; height: 95px !important; }
    .word-card span { font-size: 32px !important; font-weight: 800 !important; }

    .ball-container { margin-top: 25px !important; }
    .ball-container img { width: 80px !important; height: 80px !important; }
    .bottom-section-mobile { bottom: 10px !important; }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bg: { position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: -1 },
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "14px 10px", borderRadius: "16px", textAlign: "center", width: "75%", maxWidth: "200px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" },
  winContent: { marginBottom: "10px" },
  resultButtons: { display: "flex", gap: "10px", justifyContent: "center" },
  circleBtnSmall: { width: "38px", height: "38px", borderRadius: "50%", border: "none", background: "#1E88E5", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" },
  topBar: { position: "absolute", top: "10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(15px, 2vw, 18px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  mainTitleBox: { background: "#ffffffee", padding: "4px 20px", borderRadius: "15px", border: "2px solid #1E88E5", color: "#1565C0", fontWeight: "900", boxShadow: "0 3px 6px rgba(0,0,0,0.12)" },
  subTitleBox: { background: "#ffffffee", padding: "3px 16px", borderRadius: "12px", border: "2px solid #4CAF50", color: "#2E7D32", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  gameArea: { position: "absolute", top: "56%", left: "50%", transform: "translate(-50%, -45%)", display: "flex", flexDirection: "column", alignItems: "center", width: "90%", maxWidth: "750px", justifyContent: "center" },
  goalContainer: { position: "relative", width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "flex-end" },
  netImg: { position: "absolute", width: "100%", height: "100%", objectFit: "contain", top: 0, left: 0 },
  cardsRow: { position: "absolute", bottom: "60px", display: "flex", gap: "25px", zIndex: 2, justifyContent: "center", alignItems: "center" },
  cardWrapper: { width: "110px", height: "110px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  cardBg: { position: "absolute", width: "100%", height: "100%", objectFit: "contain" },
  cardText: { position: "absolute", fontSize: "28px", fontWeight: "900", color: "#1A237E", fontFamily: "'Traditional Arabic', 'Cairo', sans-serif" },
  ballContainer: { marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 5 },
  ballImg: { width: "105px", height: "105px", objectFit: "contain", cursor: "pointer" },
  bottomSection: { position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 10 },
  buttonsContainer: { display: "flex", gap: "12px" },
  circleBtn: { width: "clamp(40px, 4vw, 46px)", height: "clamp(40px, 4vw, 46px)", borderRadius: "50%", border: "none", background: "#1E88E5", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }
};