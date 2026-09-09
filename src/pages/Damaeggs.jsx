/* eslint-disable react-hooks/static-components */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/eggsbg.jpeg";
import egg1 from "../assets/egg1.png";
import egg2 from "../assets/egg2.png";
import egg3 from "../assets/egg3.png";
import egg4 from "../assets/egg4.png";
import egg5 from "../assets/egg5.png";
import nestImg from "../assets/nest.png";
import chickImg from "../assets/chekin.png";

const allEggImages = [egg1, egg2, egg3, egg4, egg5];

export default function ChickGame() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialEggs = useMemo(() => {
    const data = [
      { char: "ب", tashkeel: "ُ" }, { char: "ت", tashkeel: "َ" }, { char: "ث", tashkeel: "ُ" }, 
      { char: "ش", tashkeel: "َ" }, { char: "ج", tashkeel: "ُ" }, { char: "ح", tashkeel: "َ" }, 
      { char: "خ", tashkeel: "ُ" }, { char: "د", tashkeel: "َ" }, { char: "ذ", tashkeel: "ُ" }, 
      { char: "ر", tashkeel: "َ" }, { char: "ز", tashkeel: "ُ" }, { char: "س", tashkeel: "َ" }
    ];
    
    const activeData = isMobile ? data.slice(0, 9) : data;

    return activeData.map((item, i) => ({
      ...item,
      id: i,
      hasDamma: item.tashkeel === "ُ",
      img: allEggImages[i % 5]
    }));
  }, [isMobile]);

  const [eggs, setEggs] = useState([]);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEggs(initialEggs.map(e => ({ ...e, hatched: false })));
    setScore(0);
    setGameWon(false);
  }, [initialEggs]);

  const TARGET_SCORE = initialEggs.filter(i => i.hasDamma).length;

  const successAudio = useMemo(() => new Audio("/sounds/hay1.mp3"), []);
  const errorAudio = useMemo(() => new Audio("/sounds/pop.mp3"), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (score === TARGET_SCORE && TARGET_SCORE > 0) setGameWon(true);
  }, [score, TARGET_SCORE]);

  useEffect(() => {
    if (!gameWon) {
      const t = setInterval(() => setTime((p) => p + 1), 1000);
      return () => clearInterval(t);
    }
  }, [gameWon]);

  const handleEggClick = (id) => {
    const egg = eggs.find(e => e.id === id);
    if (!egg) return;
    
    if (egg.hasDamma && !egg.hatched) {
      if (soundEnabled) {
        const sound = successAudio.cloneNode();
        sound.play().catch(() => {});
      }
      setEggs(prev => prev.map(e => e.id === id ? { ...e, hatched: true } : e));
      setScore(s => s + 1);
    } else if (!egg.hasDamma) {
      if (soundEnabled) {
        const sound = errorAudio.cloneNode();
        sound.play().catch(() => {});
      }
    }
  };

  const ActionButtons = () => (
    <div style={styles.buttonsRow}>
      <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>{soundEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
      <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={18}/></button>
      <button onClick={() => navigate("/Alhorof123")} style={styles.circleBtn}><ArrowRight size={18}/></button>
      <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={18}/></button>
    </div>
  );

  return (
    <div style={styles.container}>
      <img src={bgImg} alt="BG" style={styles.bg} />
      
      <div style={styles.header}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>لعبة الكتكوت</h1>
          <p style={styles.subTitle}>اضغط على البيض الذي يحتوي على ضمة</p>
        </div>
        
        <div style={styles.box}>🐣 {score}</div>
      </div>

      <div style={{
        ...styles.grid, 
        gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)"
      }}>
        {eggs.map((egg) => (
          <div key={egg.id} style={{
            ...styles.eggWrapper,
            width: isMobile ? "clamp(72px, 18vw, 110px)" : "clamp(82px, 14vw, 120px)",
            height: isMobile ? "clamp(78px, 20vw, 120px)" : "clamp(90px, 16vw, 135px)"
          }} onClick={() => handleEggClick(egg.id)}>
            <img src={nestImg} style={{
              ...styles.nest,
              width: isMobile ? "clamp(62px, 16vw, 100px)" : "clamp(75px, 13vw, 110px)"
            }} alt="nest" />
            
            {!egg.hatched ? (
              <motion.div style={{
                ...styles.eggContainer,
                bottom: isMobile ? "18px" : "20px"
              }}>
                <img src={egg.img} style={{
                  ...styles.egg,
                  width: isMobile ? "clamp(70px, 18vw, 105px)" : "clamp(80px, 13vw, 115px)"
                }} alt="egg" />
                <div style={{
                  ...styles.charWrapper,
                  top: isMobile ? "clamp(12px, 3vw, 22px)" : "clamp(14px, 2.5vw, 24px)"
                }}>
                   <span style={{
                     ...styles.char,
                     fontSize: isMobile ? "clamp(20px, 5vw, 30px)" : "clamp(22px, 3.5vw, 32px)"
                   }}>{egg.char}</span>
                   <span style={{
                     ...styles.tashkeel,
                     fontSize: isMobile ? "clamp(27px, 6.5vw, 38px)" : "clamp(30px, 4.5vw, 42px)",
                     top: isMobile ? "clamp(-10px, -2.2vw, -15px)" : "clamp(-12px, -2.5vw, -18px)"
                   }}>{egg.tashkeel}</span>
                </div>
              </motion.div>
            ) : (
              <motion.img 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                src={chickImg} 
                style={{
                  ...styles.chick,
                  bottom: isMobile ? "10px" : "12px",
                  width: isMobile ? "clamp(85px, 21vw, 135px)" : "clamp(95px, 16vw, 150px)"
                }} 
                alt="chick" 
              />
            )}
          </div>
        ))}
      </div>

      <div style={styles.footerButtonsArea}>
        <ActionButtons />
      </div>

      <AnimatePresence>
        {gameWon && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <h2 style={styles.winTitle}>🎉 أحسنت</h2>
              <p style={styles.winText}>لقد جمعت {score} بيضات بنجاح</p>
              <ActionButtons />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: { 
    width: "100vw", 
    height: "100vh", 
    maxHeight: "100vh",
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "space-between",
    overflow: "hidden", 
    position: "relative",
    boxSizing: "border-box",
    padding: "8px 0"
  },
  bg: { 
    position: "absolute", 
    top: 0,
    left: 0,
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    zIndex: -1 
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    width: "92%", 
    zIndex: 10,
    flexShrink: 0
  },
  titleContainer: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    gap: "4px"
  },
  title: { 
    background: "#0b77f3", 
    color: "white", 
    padding: "clamp(5px, 1.2vw, 10px) clamp(18px, 4vw, 32px)", 
    borderRadius: 22, 
    fontSize: "clamp(19px, 4.2vw, 30px)", 
    margin: 0,
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
  },
  subTitle: { 
    background: "white", 
    padding: "clamp(4px, 0.9vw, 8px) clamp(14px, 3vw, 26px)", 
    borderRadius: 30, 
    color: "#333", 
    fontSize: "clamp(13px, 2.7vw, 19px)", 
    margin: 0, 
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    textAlign: "center"
  },
  box: { 
    background: "white", 
    padding: "clamp(5px, 0.8vw, 8px) clamp(8px, 1.5vw, 15px)", 
    borderRadius: 12, 
    fontSize: "clamp(13px, 2.2vw, 18px)", 
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
  },
  grid: { 
    display: "grid", 
    gap: "clamp(6px, 1.5vw, 14px)", 
    width: "92%", 
    maxWidth: "850px",
    alignItems: "center",
    justifyItems: "center",
    margin: "auto 0"
  },
  eggWrapper: { 
    position: "relative", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    cursor: "pointer",
    touchAction: "manipulation"
  },
  nest: { 
    position: "absolute", 
    bottom: "2px"
  },
  eggContainer: { 
    position: "absolute", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center"
  },
  egg: {},
  charWrapper: { 
    position: "absolute", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  },
  char: { 
    fontWeight: "700", 
    color: "black", 
    lineHeight: "0.9" 
  },
  tashkeel: { 
    fontWeight: "900", 
    color: "black", 
    position: "absolute"
  },
  chick: { 
    position: "absolute" 
  },
  buttonsRow: {
    display: "flex", 
    gap: "clamp(8px, 2vw, 15px)",
    justifyContent: "center",
    alignItems: "center"
  },
  footerButtonsArea: {
    flexShrink: 0,
    marginBottom: "4px",
    zIndex: 10
  },
  overlay: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    background: "rgba(0,0,0,0.5)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 100 
  },
  winBox: { 
    background: "white", 
    padding: "clamp(20px, 4vw, 35px)", 
    borderRadius: 25, 
    textAlign: "center", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    width: "85%",
    maxWidth: "380px"
  },
  winTitle: { 
    fontSize: "clamp(28px, 6vw, 40px)", 
    color: "#0b77f3", 
    margin: 0, 
    fontWeight: "900" 
  },
  winText: { 
    fontSize: "clamp(18px, 4vw, 26px)", 
    fontWeight: "bold", 
    margin: 0 
  },
  circleBtn: { 
    width: "clamp(38px, 8vw, 50px)", 
    height: "clamp(38px, 8vw, 50px)", 
    borderRadius: "50%", 
    border: "none", 
    background: "#075c92", 
    color: "white", 
    cursor: "pointer", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
    touchAction: "manipulation"
  }
};