/* eslint-disable react-hooks/static-components */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/lionbg.jpeg";
import lionImg from "../assets/lione.png";
import meatImg from "../assets/lionimag.png";
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

const letters = [
  { id: 0, base: "ع", harakah: " ُ" }, { id: 1, base: "ب", harakah: "ُ" }, 
  { id: 2, base: "ت", harakah: "َ" }, { id: 3, base: "ث", harakah: "ُ" },
  { id: 4, base: "ج", harakah: "َ" }, { id: 5, base: "ح", harakah: "ُ" }, 
  { id: 6, base: "خ", harakah: "َ" }, { id: 7, base: "د", harakah: "ُ" },
  { id: 8, base: "ذ", harakah: "ُ" }, { id: 9, base: "ر", harakah: "َ" }, 
  { id: 10, base: "ز", harakah: "ُ" }, { id: 11, base: "س", harakah: "َ" },
  { id: 12, base: "ش", harakah: "َ" }, { id: 13, base: "ص", harakah: "ُ" }, 
  { id: 14, base: "ض", harakah: "َ" }, { id: 15, base: "ط", harakah: "ُ" }
];

export default function HungryLionGame() {
  const navigate = useNavigate();
  const [meatItems, setMeatItems] = useState(letters);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [win, setWin] = useState(false);
  
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));

  const totalFatha = useMemo(() => letters.filter(i => i.harakah === "َ").length, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => !win && setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [win]);

  const handleDragEnd = (event, info, item, x, y) => {
    const mouthRect = document.getElementById("lion-character")?.getBoundingClientRect();
    const mouthX = mouthRect ? mouthRect.left + mouthRect.width / 2 : window.innerWidth * 0.5;
    const mouthY = mouthRect ? mouthRect.top + mouthRect.height / 2 : window.innerHeight * 0.5;
    
    const distance = Math.sqrt(Math.pow(info.point.x - mouthX, 2) + Math.pow(info.point.y - mouthY, 2));

    if (distance < 130 && item.harakah === "َ") {
      if (soundEnabled) successAudio.current.play();
      setMeatItems((prev) => prev.filter((i) => i.id !== item.id));
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= totalFatha) setWin(true);
    } else {
      if (distance < 130 && item.harakah !== "َ" && soundEnabled) errorAudio.current.play();
      x.set(0);
      y.set(0);
    }
  };

  const ActionButtons = () => (
    <div style={styles.bottomButtons}>
      <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>{soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
      <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={22}/></button>
      <button onClick={() => navigate("/Alhorof123")} style={styles.circleBtn}><ArrowRight size={22}/></button>
      <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={22}/></button>
    </div>
  );

  return (
    <div style={styles.container}>
      <img src={bgImg} alt="Background" style={styles.bg} />
      
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.mainTitle}>الأسد الجائع</div>
        <div style={styles.box}>🥩 {score}</div>
      </div>

      <div style={styles.instructionBanner}>
        اسحب اللحم الذي عليه حركة الفتح وضعه في فم الأسد
      </div>

      <div className="game-wrapper" style={styles.gameLayout}>
        <div style={styles.meatGrid}>
          <AnimatePresence>
            {meatItems.map((item) => (
              <DragItem key={item.id} item={item} onDragEnd={handleDragEnd} />
            ))}
          </AnimatePresence>
        </div>
        
        <motion.div id="lion-character" animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={styles.lionContainer}>
          <img src={lionImg} alt="Lion" className="lion-img" style={styles.lion} />
        </motion.div>
      </div>

      {!win && <ActionButtons />}

      {win && (
        <div style={styles.winStyle}>
          <h1 style={{ fontSize: "clamp(26px, 6vw, 42px)", marginBottom: "10px", color: "white" }}>🎉 أحسنت يا بطل! 🎉</h1>
          <p style={{ fontSize: "clamp(18px, 4.5vw, 26px)", marginBottom: "25px", color: "#FFE66D" }}>لقد أطعمت الأسد {score} قطعة!</p>
          <div style={styles.winButtons}>
            <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>{soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
            <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={22}/></button>
            <button onClick={() => navigate("/Alhorof123")} style={styles.circleBtn}><ArrowRight size={22}/></button>
            <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={22}/></button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .game-wrapper { 
            flex-direction: column !important; 
            justify-content: space-between !important;
            padding-top: 80px !important;
            padding-bottom: 50px !important;
          }
          .lion-img {
            width: 165px !important;
          }
          #lion-character {
            margin-bottom: -50px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .game-wrapper { 
            flex-direction: column !important; 
            justify-content: space-between !important;
            padding-top: 85px !important;
            padding-bottom: 70px !important;
          }
          .lion-img {
            width: 190px !important;
          }
        }
        @media (min-width: 1025px) {
          .game-wrapper { 
            flex-direction: row !important; 
            justify-content: space-around !important;
          }
          .lion-img {
            width: 240px !important;
          }
        }
      `}</style>
    </div>
  );
}

function DragItem({ item, onDragEnd }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return (
    <motion.div 
      style={{ x, y, ...styles.meatCard }} 
      initial={{ opacity: 1, scale: 0 }} 
      animate={{ scale: 1, y: [0, -5, 0] }} 
      transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" }, scale: { duration: 0.4 } }} 
      exit={{ scale: 0, opacity: 0, rotate: 360 }} 
      drag 
      dragMomentum={false} 
      onDragEnd={(e, info) => onDragEnd(e, info, item, x, y)}
    >
      <img src={meatImg} alt="Meat" style={styles.meatImg} />
      <div style={styles.charText}>
        <span style={styles.harakahStyle}>
          {item.harakah}
        </span>
        <span style={styles.baseStyle}>
          {item.base}
        </span>
      </div>
    </motion.div>
  );
}

const styles = {
  container: { 
    width: "100vw", 
    height: "100vh", 
    overflow: "hidden", 
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  bg: { 
    position: "absolute", 
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    objectPosition: "bottom", 
    pointerEvents: "none",
    zIndex: 1
  },
  topBar: { 
    position: "absolute", 
    top: "1vh", 
    width: "95%", 
    maxWidth: "850px", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    zIndex: 100,
    gap: "10px"
  },
  box: { 
    background: "rgba(255, 255, 255, 0.95)", 
    padding: "0.6vh 1.6vw", 
    borderRadius: 12, 
    fontWeight: "bold", 
    fontSize: "clamp(13px, 2.8vw, 18px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    whiteSpace: "nowrap"
  },
  mainTitle: { 
    background: "#6243ff", 
    color: "white", 
    padding: "0.8vh 2.8vw", 
    borderRadius: 25, 
    fontSize: "clamp(17px, 3.8vw, 25px)", 
    fontWeight: "bold",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    whiteSpace: "nowrap",
    textAlign: "center"
  },
  instructionBanner: {
    position: "absolute",
    top: "7.8vh",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "0.5vh 2.5vw",
    borderRadius: "20px",
    fontSize: "clamp(12px, 2.8vw, 16px)",
    fontWeight: "bold",
    color: "#6243ff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    zIndex: 90,
    textAlign: "center",
    border: "2px solid #6243ff"
  },
  gameLayout: { 
    display: "flex", 
    alignItems: "center", 
    width: "100%",
    height: "100%",
    paddingTop: "11vh",
    paddingBottom: "8vh",
    zIndex: 50,
    boxSizing: "border-box"
  },
  lionContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: "0vh"
  },
  lion: { 
    height: "auto",
    filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.3))"
  },
  meatGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "clamp(6px, 1.5vh, 12px)", 
    width: "clamp(260px, 85vw, 480px)",
    zIndex: 50,
    position: "relative",
    justifyItems: "center"
  },
  meatCard: { 
    cursor: "grab", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    position: "relative",
    touchAction: "none"
  },
  meatImg: { 
    width: "clamp(60px, 12.5vw, 82px)",
    height: "auto",
    filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.25))"
  },
  charText: { 
    position: "absolute", 
    fontWeight: "900", 
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  // 🎛️ تحكم مباشر وسهل في الحركة:
  harakahStyle: {
    color: "#470611",
    fontWeight: "900",
    display: "block",
    textAlign: "center",
    fontSize: "3.6em",         // حجم الحركة (لو عايزة تكبريها أو تصغريها غيري الرقم ده مثلاً 1.3 أو 1.5)
    marginBottom: "-60px",      // المسافة بين الحركة والحرف! (كل ما تزودي السالب زي -10px تقرب أكتر للحرف، وكل ما تقلليها زي -4px تبعد سيكا)
    textShadow: "1px 1px 2px rgba(255,255,255,0.9)"
  },
  // تحكم بالحرف الأساسي
  baseStyle: {
    color: "#1a1a1a",
    fontWeight: "900",
    display: "block",
    textAlign: "center",
    fontSize: "clamp(25px, 5.2vw, 33px)", // حجم الحرف الأساسي
    textShadow: "1px 1px 3px rgba(255,255,255,0.9)"
  },
  bottomButtons: { 
    position: "absolute", 
    bottom: "1vh", 
    left: "50%", 
    transform: "translateX(-50%)", 
    display: "flex", 
    gap: "2.5vw", 
    zIndex: 1000 
  },
  circleBtn: { 
    width: "clamp(36px, 7.5vw, 46px)", 
    height: "clamp(36px, 7.5vw, 46px)", 
    borderRadius: "50%", 
    border: "none", 
    background: "#6243ff", 
    color: "white", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    boxShadow: "0 3px 6px rgba(0,0,0,0.3)"
  },
  winStyle: { 
    position: "absolute", 
    inset: 0, 
    background: "rgba(0,0,0,0.85)", 
    color: "white", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 9999,
    padding: "20px",
    textAlign: "center"
  },
  winButtons: {
    display: "flex",
    gap: "3vw",
    marginTop: "10px"
  }
};