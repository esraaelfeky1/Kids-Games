/* eslint-disable react-hooks/set-state-in-effect */

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/eggsbg.jpeg";
import egg1 from "../assets/1236.png";
import egg2 from "../assets/eggeee.png";
import egg3 from "../assets/egg33.png";
import egg4 from "../assets/egg44.png";
import egg5 from "../assets/egg55.png";
import dinoWithBasketImg from "../assets/nest1.png";

import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// eslint-disable-next-line no-unused-vars
const allEggImages = [egg1, egg2, egg3, egg4, egg5];

// كل البيض في الشبكة (بدون أي بيضة خلف الديناصور)
const allEggsData = [
  { char: "ب", tashkeel: "َ", id: 0, isTarget: false, img: egg1 },
  { char: "ت", tashkeel: "ْ", id: 1, isTarget: true, img: egg2 },
  { char: "ث", tashkeel: "َ", id: 2, isTarget: false, img: egg3 },
  { char: "ج", tashkeel: "ْ", id: 3, isTarget: true, img: egg4 },
  { char: "ح", tashkeel: "َ", id: 4, isTarget: false, img: egg5 },
  { char: "خ", tashkeel: "ْ", id: 5, isTarget: true, img: egg1 },
  { char: "د", tashkeel: "َ", id: 6, isTarget: false, img: egg2 },
  { char: "ذ", tashkeel: "ْ", id: 7, isTarget: true, img: egg3 },
  { char: "ر", tashkeel: "َ", id: 8, isTarget: false, img: egg4 },
  { char: "ز", tashkeel: "ْ", id: 9, isTarget: true, img: egg5 },
  { char: "س", tashkeel: "َ", id: 10, isTarget: false, img: egg1 },
  { char: "ش", tashkeel: "ْ", id: 11, isTarget: true, img: egg2 }
];

const responsiveStyles = `
  @media (max-width: 768px) {
    .main-title-responsive {
      font-size: clamp(16px, 4.5vw, 22px) !important;
      padding: 5px 14px !important;
    }
    .sub-title-responsive {
      font-size: clamp(14px, 3.5vw, 18px) !important;
      padding: 5px 12px !important;
      top: 52px !important;
    }
    .top-box-responsive {
      font-size: clamp(13px, 3.5vw, 16px) !important;
      padding: 5px 10px !important;
      border-radius: 8px !important;
    }
    .dino-responsive {
      width: clamp(130px, 32vw, 180px) !important;
    }
    .circle-btn-responsive {
      width: 48px !important;
      height: 48px !important;
    }
    .circle-btn-responsive svg {
      width: 22px !important;
      height: 22px !important;
    }
    .mobile-buttons-responsive {
      bottom: 15px !important;
      gap: 12px !important;
    }
    .egg-responsive {
      width: clamp(65px, 16vw, 80px) !important;
    }
    .tashkeel-responsive {
      font-size: clamp(36px, 9vw, 48px) !important;
      margin-bottom: -4px !important;
    }
    .char-responsive {
      font-size: clamp(24px, 6vw, 32px) !important;
    }
    .board-mobile {
      gap: clamp(10px, 2.5vw, 16px) !important;
      width: 90% !important;
      top: 55% !important;
    }
  }

  @media (max-width: 480px) {
    .board-mobile {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }
`;

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

  const totalTargets = useMemo(() => allEggsData.filter(e => e.isTarget).length, []);

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

    const PADDING = 40;
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
      <style>{responsiveStyles}</style>

      <img src={bgImg} alt="" style={styles.bg} />

      {/* رسالة الفوز الصغيرة التي تظهر فقط عند إتمام جميع أهداف السكون */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={36} color="#FFD700" />
                <h1 style={{margin: "4px 0", fontSize: "18px"}}>أحسنت</h1>
                <p style={{fontSize: "13px", margin: "2px 0"}}>لقد جمعت كل بيض السكون</p>
                <p style={{fontSize: "15px", fontWeight: "bold", color: "#4CAF50", margin: "2px 0"}}>النتيجة: {score}</p>
              </div>
              
              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.winCircleBtn}><RotateCcw size={18}/></button>
                <button onClick={() => navigate("/Sukoon")} style={styles.winCircleBtn}><ArrowRight size={18}/></button>
                <button onClick={() => navigate("/home")} style={styles.winCircleBtn}><Home size={18}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.topBar}>
        <div style={styles.box} className="top-box-responsive">⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.mainTitle} className="main-title-responsive">لعبة الديناصور</div>
        <div style={styles.box} className="top-box-responsive">🥚 {score}</div>
      </div>
      
      <div style={styles.subTitleContainer} className="sub-title-responsive">اسحب السكون للسلة</div>

      {/* الديناصور في الخلفية */}
      <div style={styles.dinoContainer} className="dino-mobile">
        <img ref={dinoRef} src={dinoWithBasketImg} alt="Dino" style={styles.dino} className="dino-responsive" />
      </div>

      {/* شبكة البيض الأساسية */}
      <div style={styles.gameBoard} className="board-mobile">
        {allEggsData.map((egg) => (
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
            <img src={egg.img} style={styles.egg} className="egg-responsive" alt="egg" />
            <div style={styles.charOnEgg}>
              <span style={styles.tashkeelStyle} className="tashkeel-responsive">{egg.tashkeel}</span>
              <span style={styles.charStyle} className="char-responsive">{egg.char}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={styles.buttonsContainer} className="mobile-buttons-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn} className="circle-btn-responsive">{soundEnabled ? <Volume2 size={26}/> : <VolumeX size={26}/>}</button>
        <button onClick={() => window.location.reload()} style={styles.circleBtn} className="circle-btn-responsive"><RotateCcw size={26}/></button>
        <button onClick={() => navigate("/Sukoon")} style={styles.circleBtn} className="circle-btn-responsive"><ArrowRight size={26}/></button>
        <button onClick={() => navigate("/home")} style={styles.circleBtn} className="circle-btn-responsive"><Home size={26}/></button>
      </div>
    </div>
  );
}

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", userSelect: "none", boxSizing: "border-box" },
  bg: { position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: -1 },
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  
  winBox: { 
    background: "white", 
    padding: "12px 15px", 
    borderRadius: "15px", 
    textAlign: "center", 
    width: "75%",
    maxWidth: "220px", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "space-between",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)" 
  },
  winContent: { marginBottom: "8px" },
  resultButtons: { display: "flex", gap: "8px", justifyContent: "center", marginTop: "4px" },
  winCircleBtn: { width: 34, height: 34, borderRadius: "50%", border: "none", background: "#4CAF50", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.3)" },
  
  topBar: { position: "absolute", top: 12, width: "100%", display: "flex", justifyContent: "space-around", zIndex: 10, padding: "0 10px", boxSizing: "border-box" },
  box: { background: "white", padding: "6px 15px", borderRadius: 12, fontWeight: "bold", fontSize: "18px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", whiteSpace: "nowrap" },
  mainTitle: { background: "#4CAF50", color: "white", padding: "6px 22px", borderRadius: 25, fontSize: "22px", fontWeight: "bold", textAlign: "center" },
  subTitleContainer: { position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", background: "white", padding: "6px 20px", borderRadius: 12, color: "#2e7d32", fontSize: "18px", border: "2px solid #4CAF50", zIndex: 10, fontWeight: "bold", whiteSpace: "nowrap", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  
  dinoContainer: { position: "absolute", bottom: "10px", left: "4%", zIndex: 5 },
  dino: { width: "260px", pointerEvents: "none" }, 

  gameBoard: { position: "absolute", left: "50%", top: "56%", transform: "translate(-50%, -44%)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", width: "90%", maxWidth: "600px", zIndex: 100, justifyItems: "center" },
  
  eggWrapper: { display: "flex", justifyContent: "center", alignItems: "center", position: "relative", cursor: "grab", pointerEvents: "auto", touchAction: "none" },
  egg: { width: "90px", pointerEvents: "none" }, 
  charOnEgg: { position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: "0.1", marginTop: "-8px", pointerEvents: "none" },
  tashkeelStyle: { color: "#232121", fontSize: "52px", fontWeight: "900", marginBottom: "-5px" },
  charStyle: { fontSize: "34px", fontWeight: "900", color: "black" },
  
  buttonsContainer: { position: "absolute", bottom: "18px", left: "55%", transform: "translateX(-50%)", display: "flex", gap: "12px", zIndex: 1000 },
  circleBtn: { width: 50, height: 50, borderRadius: "50%", border: "none", background: "#4CAF50", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }
};