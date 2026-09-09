/* eslint-disable react-hooks/static-components */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import iceBg from "../assets/Untitled.jpg";
import snowmanImg from "../assets/WhatsApp Image 2026-06-07 at 9.13.52 PM.png";
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

export default function MeltIceGame() {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [revealed, setRevealed] = useState(Array(15).fill(false));
  const [win, setWin] = useState(false);
  const [snowmanPos, setSnowmanPos] = useState({ x: 90, y: 400 });
  const [isMoving, setIsMoving] = useState(false);

  const letters = ["َح", "أُ", "شِ", "زُ", "ثَ", "وُ", "دُ", "قُ", "َذ", "كُ", "أَ", "ُس", "وِ", "رُ", "دُ"];
  const cutLetters = ["أُ", "دُ", "ذُ", "رُ", "زُ", "وُ","كُ","ُس","قُ"];

  const playSound = (src) => {
    if (!soundEnabled) return;
    new Audio(src).play();
  };

  const handleFastReload = () => {
    window.location.replace(window.location.pathname);
  };

  useEffect(() => {
    const t = setInterval(() => !win && setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [win]);

  const handleTileClick = async (idx) => {
    if (isMoving || revealed[idx] || !gridRef.current) return;

    const rect = gridRef.current.children[idx].getBoundingClientRect();
    setIsMoving(true);
    setSnowmanPos({ x: rect.left + 5, y: rect.top - 20 });
    
    await new Promise(r => setTimeout(r, 800));

    if (cutLetters.includes(letters[idx])) {
      playSound(successSound);
      const updated = [...revealed];
      updated[idx] = true;
      setRevealed(updated);
      setPoints(p => p + 1);
      if (points + 1 >= 8) setWin(true);
      await new Promise(r => setTimeout(r, 800));
    } else {
      playSound(errorSound);
      await new Promise(r => setTimeout(r, 800));
    }

    setSnowmanPos({ x: 90, y: 400 });
    setIsMoving(false);
  };

  const ActionButtons = () => (
    <div className="action-buttons-container" style={styles.bottomButtons}>
      <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>{soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}</button>
      <button onClick={handleFastReload} style={styles.circleBtn}><RotateCcw size={24}/></button>
      <button onClick={() => navigate(-1)} style={styles.circleBtn}><ArrowRight size={24}/></button>
      <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
    </div>
  );

  return (
    <div style={styles.game}>
      <div style={styles.topBar}>
        <div className="game-box" style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.mainTitle}>ذوّب الجليد</div>
        <div className="game-box" style={styles.box}>❄️ {points}</div>
      </div>

      <div className="game-subtitle" style={styles.subTitle}>اضغط على حروف الضمة لتذويب الجليد</div>

      <div ref={gridRef} className="game-grid" style={styles.grid}>
        {letters.map((letter, idx) => (
          <div key={idx} onClick={() => handleTileClick(idx)}
            className="game-tile"
            style={{ ...styles.tile, animation: revealed[idx] ? "meltAway 1s forwards" : "none" }}>
            <span className="game-letter" style={styles.letter}>{letter}</span>
            <div className="game-ice-layer" style={styles.iceLayer}></div>
          </div>
        ))}
      </div>

      <img src={snowmanImg} alt="snowman" style={{ ...styles.snowman, left: snowmanPos.x, top: snowmanPos.y }} />

      {!win && <ActionButtons />}

      {win && (
        <div style={styles.winStyle}>
          <h1 style={{fontSize: "43px"}}>🎉 أحسنت يا بطل! 🎉</h1>
          <p style={{fontSize: "23px"}}>لقد أتممت المهمة بنجاح.</p>
          <div className="action-buttons-container" style={{ display: "flex", gap: "15px", marginTop: "15px", justifyContent: "center" }}>
            <button onClick={handleFastReload} style={styles.circleBtn}><RotateCcw size={24}/></button>
            <button onClick={() => navigate(-1)} style={styles.circleBtn}><ArrowRight size={24}/></button>
            <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; overflow: hidden; height: 100%; }
        @keyframes meltAway { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0); } }

        @media (max-width: 767px) {
          .game-box {
            padding: 5px 10px !important;
            font-size: 14px !important;
            width: fit-content !important;
          }
          .game-subtitle {
            font-size: 13px !important;
            padding: 4px 12px !important;
            margin-top: 6px !important;
            margin-bottom: 12px !important;
          }
          .game-grid {
            grid-template-columns: repeat(5, clamp(44px, 12.5vw, 56px)) !important;
            gap: 6px !important;
            margin-top: 18px !important;
          }
          .game-tile {
            width: clamp(44px, 12.5vw, 56px) !important;
            height: clamp(44px, 12.5vw, 56px) !important;
          }
          .game-ice-layer {
            width: 100% !important;
            height: 100% !important;
          }
          /* تم تكبير الحروف على الموبايل لتكون أضح وأكبر */
          .game-letter {
            font-size: clamp(26px, 7vw, 32px) !important;
          }
          .action-buttons-container {
            bottom: 25px !important;
            gap: 12px !important;
            margin-top: 0 !important;
          }
          .action-buttons-container button {
            width: 40px !important;
            height: 40px !important;
            margin-top: 0 !important;
          }
          .action-buttons-container button svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  game: { 
    width: "100%", 
    height: "100vh", 
    background: `url(${iceBg}) center/cover no-repeat`, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "flex-start",
    paddingTop: "12px",
    direction: "rtl", 
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0
  },
  topBar: { width: "100%", display: "flex", justifyContent: "space-around", padding: "0 20px", alignItems: "center", marginBottom: "2px" },
  box: { background: "white", padding: "8px 10px", borderRadius: 10, fontWeight: "bold", fontSize: "16px", width: "fit-content" },
  mainTitle: { background: "#29b6f6", color: "white", padding: "5px 15px", borderRadius: 20, fontSize: "27px", fontWeight: "bold" },
  subTitle: { 
    background: "rgba(255,255,255,0.8)", 
    padding: "8px 15px", 
    borderRadius: 10, 
    color: "#0277bd", 
    fontWeight: "bold", 
    fontSize: "15px", 
    marginTop: "6px",
    marginBottom: "10px" 
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(5, 70px)", 
    gap: "10px", 
    marginTop: "20px",
  },
  tile: { width: 65, height: 65, borderRadius: 15, background: "#dff4ff", position: "relative", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid white", },
  // تم زيادة حجم الخط على الشاشات الكبيرة ليصبح 38px بدلاً من 32px
  letter: { fontSize: "38px", fontWeight: "bold", color: "#5c3b1e", zIndex: 3 },
  iceLayer: { position: "absolute", inset: 0, background: "rgba(180, 230, 255, 0.7)", borderRadius: 15, zIndex: 2, width: "100%", height: "100%" },
  snowman: { position: "absolute", width: "140px", zIndex: 10, left: "25px", bottom: "30px", transition: "all 0.8s ease" },
  bottomButtons: { position: "absolute", bottom: "20px", display: "flex", gap: "20px", zIndex: 10 },
  circleBtn: { width: 45, height: 45, borderRadius: "50%", border: "none", background: "#29b6f6", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" },
  winStyle: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 9999 }
};