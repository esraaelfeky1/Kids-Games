/* eslint-disable react-hooks/set-state-in-effect */

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/fish1.jpeg";
import egg1 from "../assets/1lo.png";
import egg2 from "../assets/2lo.png";
import egg3 from "../assets/3lo.png";
import egg4 from "../assets/4lo.png";
import egg5 from "../assets/5lo.png";
import dinoWithBasketImg from "../assets/ss.png";

import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

const allEggImages = [egg1, egg2, egg3, egg4, egg5];

const initialEggsData = [
  { char: "با", tashkeel: "ً" },  // تنوين فتح (هدف)
  { char: "ت", tashkeel: "ْ" },   // سكون
  { char: "ثا", tashkeel: "ً" },  // تنوين فتح (هدف)
  { char: "ج", tashkeel: "ْ" },   // سكون
  { char: "ح", tashkeel: "ُ" },   // ضمة
  { char: "خا", tashkeel: "ً" },  // تنوين فتح (هدف)
  { char: "د", tashkeel: "َ" },   // فتحة
  { char: "ذا", tashkeel: "ً" },  // تنوين فتح (هدف)
  { char: "را", tashkeel: "ً" },  // تنوين فتح (هدف)
  { char: "ز", tashkeel: "ْ" },   // سكون
  { char: "سا", tashkeel: "ً" },  // تنوين فتح (هدف)
  { char: "ش", tashkeel: "ْ" }   // سكون
];

export default function DinoGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [collected, setCollected] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const dinoRef = useRef(null);
  
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  const eggs = useMemo(() => initialEggsData.map((item, i) => ({
    ...item, 
    id: i, 
    isTarget: item.tashkeel === "ً", 
    img: allEggImages[i % 5]
  })), []);

  const totalTargets = eggs.filter(e => e.isTarget).length;

  useEffect(() => {
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (score === totalTargets && totalTargets > 0) {
      setIsGameOver(true);
    }
  }, [score, totalTargets]);

  const handleDragEnd = (event, info, egg) => {
    const dinoRect = dinoRef.current?.getBoundingClientRect();
    if (!dinoRect) return;

    const PADDING = 35;
    const isInsideDino = 
      info.point.x >= (dinoRect.left - PADDING) &&
      info.point.x <= (dinoRect.right + PADDING) &&
      info.point.y >= (dinoRect.top - PADDING) &&
      info.point.y <= (dinoRect.bottom + PADDING);

    if (isInsideDino) {
      if (egg.isTarget && !collected.includes(egg.id)) {
        if (soundEnabled) {
          successAudio.current.currentTime = 0;
          successAudio.current.play();
        }
        setCollected(prev => [...prev, egg.id]);
        setScore(s => s + 1);
      } else if (!egg.isTarget) {
        if (soundEnabled) {
          errorAudio.current.currentTime = 0;
          errorAudio.current.play();
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <img src={bgImg} alt="" style={styles.bg} />

      {/* رسالة الفوز المصغرة */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={45} color="#FFD700" />
                <h2 style={{margin: "5px 0", color: "#333", fontSize: "22px"}}>أحسنت</h2>
                <p style={{fontSize: "18px", fontWeight: "bold", color: "#4CAF50", margin: "5px 0"}}>النتيجة: {score}</p>
              </div>
              
              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={22}/></button>
                <button onClick={() => navigate("/Nunation")} style={styles.circleBtn}><ArrowRight size={22}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={22}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.mainTitle}>لعبة اللؤلؤ</div>
        <div style={styles.box}>🐚 {score}</div>
      </div>
      
      {/* فقرة التوجيه تحت العنوان */}
      <div style={styles.subTitleContainer}>اسحب التنوين بالفتح للسلة</div>

      {/* لوحة البيض */}
      <div style={styles.gameBoard}>
        {eggs.map((egg) => (
          <motion.div 
            key={egg.id}
            drag={!collected.includes(egg.id)}
            dragSnapToOrigin
            onDragEnd={(e, info) => handleDragEnd(e, info, egg)}
            whileDrag={{ zIndex: 9999, scale: 1.15 }}
            style={{ 
              ...styles.eggWrapper, 
              visibility: collected.includes(egg.id) ? "hidden" : "visible" 
            }}
          >
            <img src={egg.img} style={styles.egg} alt="egg" />
            <div style={styles.charOnEgg}>
              <span style={styles.tashkeelStyle}>{egg.tashkeel}</span>
              <span style={styles.charStyle}>{egg.char}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* شخصية الديناصور والسلة */}
      <div style={styles.dinoContainer}>
        <img ref={dinoRef} src={dinoWithBasketImg} alt="Dino" style={styles.dino} />
      </div>

      {/* أزرار التحكم السفلية في المنتصف */}
      <div style={styles.buttonsContainer}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>{soundEnabled ? <Volume2 size={26}/> : <VolumeX size={26}/>}</button>
        <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={26}/></button>
        <button onClick={() => navigate("/Nunation")} style={styles.circleBtn}><ArrowRight size={26}/></button>
        <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={26}/></button>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    width: "100vw", 
    height: "100vh", 
    position: "relative", 
    overflow: "hidden", 
    userSelect: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box"
  },
  bg: { 
    position: "absolute", 
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    zIndex: -1 
  },
  overlay: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    background: "rgba(0,0,0,0.6)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 9999 
  },
  winBox: { 
    background: "white", 
    padding: "15px 20px", 
    borderRadius: "18px", 
    textAlign: "center", 
    width: "fit-content", 
    minWidth: "220px",
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)" 
  },
  winContent: { marginBottom: "10px", display: "flex", flexDirection: "column", alignItems: "center" },
  resultButtons: { display: "flex", gap: "10px", justifyContent: "center", marginTop: "5px" },
  
  topBar: { 
    position: "absolute", 
    top: "clamp(8px, 1.5vh, 18px)", 
    width: "92%", 
    maxWidth: "800px", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    zIndex: 10 
  },
  box: { 
    background: "white", 
    padding: "clamp(5px, 1.2vh, 9px) clamp(12px, 2.2vw, 20px)", 
    borderRadius: 12, 
    fontWeight: "bold", 
    fontSize: "clamp(15px, 2.8vw, 20px)", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
  },
  mainTitle: { 
    background: "#4c89af", 
    color: "white", 
    padding: "clamp(5px, 1.2vh, 9px) clamp(18px, 3.5vw, 30px)", 
    borderRadius: 25, 
    fontSize: "clamp(18px, 3.5vw, 26px)", 
    fontWeight: "bold",
    textAlign: "center"
  },
  subTitleContainer: { 
    position: "absolute", 
    top: "clamp(55px, 8.5vh, 78px)", 
    left: "50%", 
    transform: "translateX(-50%)", 
    background: "white", 
    padding: "clamp(4px, 1vh, 8px) clamp(16px, 3vw, 25px)", 
    borderRadius: 12, 
    color: "#2e5c7d", 
    fontSize: "clamp(14px, 2.5vw, 20px)", 
    border: "2px solid #4c93af", 
    zIndex: 10, 
    fontWeight: "bold", 
    whiteSpace: "nowrap" 
  },
  gameBoard: { 
    position: "absolute", 
    left: "50%", 
    top: "54%", 
    transform: "translate(-50%, -50%)", 
    display: "grid", 
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "clamp(8px, 1.8vw, 18px)", 
    width: "92%", 
    maxWidth: "600px", 
    zIndex: 1000,
    justifyItems: "center"
  },
  eggWrapper: { 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    position: "relative", 
    cursor: "grab", 
    pointerEvents: "auto" 
  },
  egg: { 
    width: "clamp(60px, 14vw, 95px)", 
    pointerEvents: "none",
    objectFit: "contain"
  }, 
  charOnEgg: { 
    position: "absolute", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    lineHeight: "0.1", 
    marginTop: "clamp(-8px, -1.5vw, -12px)", 
    pointerEvents: "none" 
  },
  tashkeelStyle: { 
    color: "#232121", 
    fontSize: "clamp(38px, 8vw, 57px)", 
    fontWeight: "900", 
    marginBottom: "clamp(-3px, -0.5vw, -5px)" 
  },
  charStyle: { 
    fontSize: "clamp(27px, 5.5vw, 40px)", 
    fontWeight: "900", 
    color: "black" 
  },
  dinoContainer: { 
    position: "absolute", 
    bottom: "clamp(65px, 11vh, 90px)", 
    left: "clamp(10px, 3vw, 40px)", 
    zIndex: 50 
  },
  dino: { 
    width: "clamp(160px, 30vw, 300px)", 
    pointerEvents: "none",
    objectFit: "contain"
  }, 
  buttonsContainer: { 
    position: "absolute", 
    bottom: "clamp(12px, 2.5vh, 25px)", 
    left: "50%", 
    transform: "translateX(-50%)", 
    display: "flex", 
    gap: "clamp(10px, 2vw, 16px)", 
    zIndex: 10 
  },
  circleBtn: { 
    width: "clamp(42px, 8.5vw, 50px)", 
    height: "clamp(42px, 8.5vw, 50px)", 
    borderRadius: "50%", 
    border: "none", 
    background: "#4c89af", 
    color: "white", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)" 
  }
};