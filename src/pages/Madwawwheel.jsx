// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { RotateCcw, ArrowRight, Home, Volume2, VolumeX, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/whellbg.jpeg";
import wheelImg from "../assets/wheel.png";
import baseImg from "../assets/iiii.png";
import pinImg from "../assets/pin2.png";
import correctSound from "/sounds/hay1.mp3";
import wrongSound from "/sounds/pop.mp3";

const gameData = [
  { letter: "عُو", correct: "يَعُومُ", options: ["يَعُومُ", "صَغِيرُ", "نَامَ"], top: "25%", left: "35%" },
  { letter: "جُو", correct: "يَجُوعُ", options: ["كَبِيرُ", "يَجُوعُ", "جَاعَ"], top: "25%", left: "60%" },
  { letter: "طُو", correct: "يَطُوفُ", options: ["سَعِيدُ", "صَامَ", "يَطُوفُ"], top: "48%", left: "70%" },
  { letter: "صُو", correct: "يَصُومُ", options: ["حَزِينُ", "يَصُومُ", "تَابَ"], top: "70%", left: "60%" },
  { letter: "نُو", correct: "جُنُودُ", options: ["نَحِيفُ", "فَازَ", "جُنُودُ"], top: "67%", left: "35%" },
  { letter: "فًو", correct: "يَفُوزُ", options: ["يَفُوزُ", "خَافَ", "جَمِيلُ"], top: "45%", left: "25%" },
];

export default function WheelGame() {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const playSound = (isCorrect) => {
    if (!isMuted) new Audio(isCorrect ? correctSound : wrongSound).play();
  };

  const controls = useAnimation();
  const currentRotation = useRef(0);

  const calculateResult = () => {
    let rotation = currentRotation.current % 360;
    if (rotation < 0) rotation += 360;
    const normalizedRotation = (360 - rotation) % 360;
    const index = Math.round((normalizedRotation + 30) / 60) % 6;
    setCurrentChallenge(gameData[index]);
  };

  const handleAnswer = (word) => {
    if (word === currentChallenge.correct) {
      setScore((s) => s + 1);
      setFeedback("correct");
      playSound(true);
      if (score + 1 >= 6) setShowWinMessage(true);
    } else {
      setFeedback("wrong");
      playSound(false);
    }
    
    setTimeout(() => {
      setFeedback(null);
      setCurrentChallenge(null);
    }, 2000);
  };

  const toggleSpin = async () => {
    if (isSpinning) {
      setIsSpinning(false);
      controls.stop();
      calculateResult();
    } else {
      setIsSpinning(true);
      setFeedback(null);
      setCurrentChallenge(null);
      await controls.start({ rotate: 360 + 10000, transition: { duration: 40, ease: "linear", repeat: Infinity } });
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          /* تصغير العنوان والفقرة على الموبايل */
          .main-title-responsive {
            font-size: 18px !important;
            padding: 4px 18px !important;
          }
          .instruction-responsive {
            font-size: 13px !important;
            padding: 2px 10px !important;
          }
          .box-info-responsive {
            width: fit-content !important;
            min-width: unset !important;
            padding: 8px !important;
            margin-inline-start: 5px !important;
          }
          .word-btn-responsive {
            width: fit-content !important;
            min-width: 110px !important;
            font-size: 14px !important;
            padding: 4px 10px !important;
            align-self: center !important;
          }
          .btns-wrapper-responsive {
            align-items: center !important;
          }
          .challenge-title-responsive {
            font-size: 15px !important;
          }
          /* تصغير الأزرار الأربعة اللي تحت على الموبايل */
          .circle-btn-responsive {
            width: 38px !important;
            height: 38px !important;
          }
          .circle-btn-responsive svg {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {showWinMessage && (
          <div style={styles.winOverlay}>
            <div style={styles.winBox}>
              <h1>🎉 أحسنت 🎉</h1>
              <p style={{fontSize: '24px', fontWeight: 'bold'}}>لقد جمعت {score} نقاط</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => window.location.reload()} style={styles.circleBtn} className="circle-btn-responsive"><RotateCcw /></button>
                <button onClick={() => navigate("/Mad")} style={styles.circleBtn} className="circle-btn-responsive"><ArrowRight /></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtn} className="circle-btn-responsive"><Home /></button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.topBar}>
          <div style={styles.box}>⭐ {score}</div>
          <div style={styles.titleWrapper}>
              <div style={styles.mainTitle} className="main-title-responsive">عجلة الحروف</div>
              <div style={styles.instruction} className="instruction-responsive">قم بتدوير العجلة لاختيار الكلمة الصحيحة</div>
          </div>
          <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        </div>

        <div style={styles.mainLayout}>
          <div style={styles.wheelContainer} onClick={toggleSpin}>
            <img src={pinImg} alt="pin" style={styles.topPin} />
            <div style={styles.wheelWrapper}>
              <motion.div animate={controls} onUpdate={(l) => (currentRotation.current = l.rotate)} style={styles.wheel}>
                <img src={wheelImg} style={{ width: '100%', height: 'auto' }} alt="wheel" />
                {gameData.map((item, i) => (
                  <div key={i} style={{...styles.letter, top: item.top, left: item.left}}>{item.letter}</div>
                ))}
              </motion.div>
              <img src={baseImg} style={styles.base} alt="base" />
            </div>
          </div>

          <div style={{ ...styles.boxInfo, borderColor: feedback === "correct" ? "#4caf50" : feedback === "wrong" ? "#f44336" : "#7b1fa2" }} className="box-info-responsive">
            {!currentChallenge ? <div style={styles.bigIcon}><HelpCircle size={55} /></div> : 
             feedback ? (
              <div style={styles.resultView}>
                {feedback === "correct" ? <div style={{color: "#4caf50", fontSize: "24px", fontWeight: "800"}}>✔ أحسنت</div> : <div style={{color: "#f44336", fontSize: "28px", fontWeight: "800"}}>❌ حاول مجدداً</div>}
              </div>
             ) : (
              <div style={styles.wordsContainer}>
                <h3 style={{ margin: "0 0 10px 0", textAlign: "center", fontSize: "22px", fontWeight: "800" }} className="challenge-title-responsive">حرف {currentChallenge.letter}</h3>
                <div style={styles.btnsWrapper} className="btns-wrapper-responsive">
                  {currentChallenge.options.map((word, i) => (
                    <button key={i} onClick={() => handleAnswer(word)} style={styles.wordBtn} className="word-btn-responsive">{word}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.bottomButtons}>
          <button style={styles.circleBtn} className="circle-btn-responsive" onClick={toggleSpin}><RotateCcw /></button>
          <button style={styles.circleBtn} className="circle-btn-responsive" onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX /> : <Volume2 />}</button>
          <button onClick={() => navigate("/Mad")} style={styles.circleBtn} className="circle-btn-responsive"><ArrowRight /></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn} className="circle-btn-responsive"><Home /></button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { width: "100%", minHeight: "100vh", background: `url(${bgImg}) center/cover`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflowX: "hidden" },
  topBar: { position: "absolute", top: 15, width: "95%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 10px" },
  titleWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  box: { background: "white", padding: "6px 12px", borderRadius: 10, fontWeight: "bold", fontSize: "16px", border: "2px solid #7b1fa2" },
  mainTitle: { background: "#7b1fa2", color: "white", padding: "6px 28px", borderRadius: 20, fontSize: "28px", fontWeight: "800" },
  instruction: { background: "rgba(255, 255, 255, 0.95)", color: "#7b1fa2", padding: "3px 14px", borderRadius: 10, fontSize: "19px", fontWeight: "800", border: "1px solid #7b1fa2" },
  
  // نزلت العجلة والمحتوى لتحت أكتر على اللاب بمسافة مناسبة وجميلة
  mainLayout: { display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "35px", width: "100%", flexWrap: "wrap", padding: "10px", marginTop: "140px" },
  
  wheelContainer: { cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" },
  topPin: { width: "clamp(45px, 12vw, 65px)", marginBottom: "clamp(-40px, -10vw, -48px)", zIndex: 10 },
  wheelWrapper: { display: "flex", flexDirection: "column", alignItems: "center" },
  wheel: { width: "clamp(200px, 50vw, 290px)", position: "relative", zIndex: 2 },
  base: { width: "clamp(110px, 28vw, 160px)", marginTop: "clamp(-45px, -12vw, -65px)", zIndex: 1 },
  letter: { position: "absolute", fontSize: "clamp(18px, 4.5vw, 26px)", fontWeight: "bold", color: "#fff", textShadow: "1px 1px 2px #000", pointerEvents: "none", transform: "translate(-50%, -50%)" },
  
  boxInfo: { width: "fit-content", minWidth: "220px", minHeight: "auto", background: "white", borderRadius: "18px", border: "4px solid", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "18px", marginInlineStart: "20px" },
  bigIcon: { color: "#7b1fa2", padding: "12px" },
  
  wordsContainer: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" },
  btnsWrapper: { display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", alignItems: "stretch", marginTop: "6px", width: "100%" },
  wordBtn: { padding: "9px 18px", fontSize: "21px", fontWeight: "bold", cursor: "pointer", borderRadius: "10px", border: "2px solid #7b1fa2", background: "transparent", textAlign: "center", width: "100%" },
  
  bottomButtons: { position: "fixed", bottom: "20px", display: "flex", gap: "15px", zIndex: 100 },
  circleBtn: { width: 46, height: 46, borderRadius: "50%", border: "none", background: "#7b1fa2", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  winOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000 },
  winBox: { background: "white", padding: "10px", borderRadius: "30px", textAlign: "center", color: "#7b1fa2", boxShadow: "0 0 20px rgba(0,0,0,0.5)", zIndex: 1001 }
};