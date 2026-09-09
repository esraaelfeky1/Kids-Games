// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/bg.jpeg";
import basketImg from "../assets/sl.png";
import b1 from "../assets/butterfly1.png";
import b2 from "../assets/butterfly2.png";
import b3 from "../assets/butterfly3.png";
import b4 from "../assets/butterfly4.png";
import b5 from "../assets/butterfly5.png";

const successSound = new Audio("/sounds/hay1.mp3");
const errorSound = new Audio("/sounds/pop.mp3");

const butterflyImgs = [b1, b2, b3, b4, b5];

// نقسّم الحرف إلى جزأين: الحرف الأساسي، وحركة الإعراب لتكبيرها بشكل مستقل
const initialData = [
  { id: 1, base: "ب", haraka: "ِ", hasKasra: true }, 
  { id: 2, base: "ت", haraka: "َ", hasKasra: false },
  { id: 3, base: "ث", haraka: "ُ", hasKasra: false }, 
  { id: 4, base: "م", haraka: "ِ", hasKasra: true },
  { id: 5, base: "ج", haraka: "ِ", hasKasra: true }, 
  { id: 6, base: "ح", haraka: "َ", hasKasra: false },
  { id: 7, base: "خ", haraka: "ُ", hasKasra: false }, 
  { id: 8, base: "د", haraka: "ِ", hasKasra: true },
  { id: 9, base: "ذ", haraka: "ِ", hasKasra: true }, 
  { id: 10, base: "ر", haraka: "َ", hasKasra: false },
  { id: 11, base: "ز", haraka: "ُ", hasKasra: false }, 
  { id: 12, base: "س", haraka: "ِ", hasKasra: true }
].map((item, index) => ({ ...item, img: butterflyImgs[index % 5] }));

const TARGET_SCORE = initialData.filter(i => i.hasKasra).length;

export default function ButterflyGame() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialData);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const basketRef = useRef(null);

  const playSound = (isCorrect) => {
    if (!soundEnabled) return;
    isCorrect ? successSound.play() : errorSound.play();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (score === TARGET_SCORE && TARGET_SCORE > 0) setGameWon(true);
  }, [score]);

  useEffect(() => {
    if (gameWon) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [gameWon]);

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        @media (max-width: 768px) {
          .butterfly-container {
            padding: 4px 4px 4px 4px !important;
            height: 100vh !important;
            height: 100dvh !important;
            justify-content: flex-start !important;
          }
          .butterfly-header-area {
            margin-top: 4px !important;
            margin-bottom: 2px !important;
          }
          .butterfly-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
            width: 98% !important;
            margin: 2px auto !important;
            flex-grow: 1 !important;
            align-content: center !important;
          }
          .butterfly-card img {
            width: 95px !important;
            height: 95px !important;
            object-fit: contain !important;
          }
          .butterfly-basket {
            width: 150px !important;
          }
          .butterfly-topbar {
            width: 96% !important;
          }
          .butterfly-title {
            font-size: 20px !important;
            padding: 2px 18px !important;
            margin: 2px 0 !important;
          }
          .butterfly-box {
            font-size: 15px !important;
            padding: 4px 8px !important;
            border-radius: 10px !important;
          }
          .butterfly-instruction {
            font-size: 13px !important;
            padding: 2px 8px !important;
            margin: 0 !important;
          }
          .butterfly-instruction-bg {
            padding: 2px 10px !important;
            margin-top: 2px !important;
          }
          .butterfly-bottom-area {
            flex-direction: row !important;
            justify-content: space-around !important;
            align-items: center !important;
            gap: 6px !important;
            padding-bottom: 6px !important;
            width: 100% !important;
          }
          .butterfly-buttons {
            gap: 6px !important;
            margin-top: 0 !important;
          }
          .butterfly-circle-btn {
            width: 45px !important;
            height: 45px !important;
            font-size: 18px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .butterfly-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            width: 90% !important;
          }
          .butterfly-card img {
            width: 100px !important;
          }
          .butterfly-basket {
            width: 170px !important;
          }
        }
      `}</style>

      <div style={styles.container} className="butterfly-container">
        <img src={bgImg} alt="BG" style={styles.bg} />
        {gameWon ? (
          <div style={styles.winOverlay}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.winBox}>
              <Trophy size={70} color="#FFD700" />
              <h1 style={{ fontSize: "35px", color: "#ff69b4", margin: "8px 0" }}>أحسنتِ!</h1>
              <p style={{ fontSize: "22px", margin: "8px 0" }}>لقد جمعتِ {score} فراشات بنجاح!</p>
              <div style={styles.bottomButtons} className="butterfly-buttons">
                <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn} className="butterfly-circle-btn">{soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
                <button onClick={() => window.location.reload()} style={styles.circleBtn} className="butterfly-circle-btn"><RotateCcw size={20}/></button>
                <button onClick={() => navigate("/Alhorof123")} style={styles.circleBtn} className="butterfly-circle-btn"><ArrowRight size={20}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtn} className="butterfly-circle-btn"><Home size={20}/></button>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <div style={styles.headerArea} className="butterfly-header-area">
              <div style={styles.topBar} className="butterfly-topbar">
                <div style={styles.box} className="butterfly-box">⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
                <h1 style={styles.mainTitle} className="butterfly-title">لعبة الفراشات</h1>
                <div style={styles.box} className="butterfly-box">🦋 {score}</div>
              </div>
              <div style={styles.instructionBg} className="butterfly-instruction-bg">
                <p style={styles.instruction} className="butterfly-instruction">اسحب الحرف الذي تحته كسرة وضعه في السلة</p>
              </div>
            </div>

            <div style={styles.butterflyGrid} className="butterfly-grid">
              <AnimatePresence>
                {items.map((item) => (
                  <DragItem key={item.id} item={item} basketRef={basketRef} playSound={playSound}
                    onMatch={() => { setItems(prev => prev.filter(i => i.id !== item.id)); setScore(s => s + 1); }}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div style={styles.bottomArea} className="butterfly-bottom-area">
              <img ref={basketRef} src={basketImg} alt="Basket" style={styles.basket} className="butterfly-basket" />
              <div style={styles.bottomButtons} className="butterfly-buttons">
                <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn} className="butterfly-circle-btn">{soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}</button>
                <button onClick={() => window.location.reload()} style={styles.circleBtn} className="butterfly-circle-btn"><RotateCcw size={20}/></button>
                <button onClick={() => navigate("/Alhorof123")} style={styles.circleBtn} className="butterfly-circle-btn"><ArrowRight size={20}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtn} className="butterfly-circle-btn"><Home size={20}/></button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function DragItem({ item, basketRef, onMatch, playSound }) {
  const [dropped, setDropped] = useState(false);
  return (
    <motion.div 
      drag={!dropped}
      dragSnapToOrigin={!item.hasKasra}
      animate={dropped ? { opacity: 0, scale: 0 } : { y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
      transition={{ duration: dropped ? 0.3 : 1.5, repeat: dropped ? 0 : Infinity, ease: "easeInOut" }}
      whileDrag={{ scale: 1.25, zIndex: 999, cursor: "grabbing" }}
      onDragEnd={(event, info) => {
        if (!basketRef.current) return;
        const b = basketRef.current.getBoundingClientRect();
        if (info.point.x >= b.left && info.point.x <= b.right && info.point.y >= b.top && info.point.y <= b.bottom) {
          if (item.hasKasra) { playSound(true); setDropped(true); setTimeout(onMatch, 300); }
          else { playSound(false); }
        }
      }}
      style={styles.card}
      className="butterfly-card"
    >
      <img src={item.img} alt="Butterfly" style={{ width: "clamp(100px, 14vw, 135px)", pointerEvents: "none" }} />
      <div style={styles.charWrapper}>
        <span style={styles.baseText}>{item.base}</span>
        {/* تكبير الحركة بصورة واضحة ومميزة جداً */}
        <span style={styles.harakaText}>{item.haraka}</span>
      </div>
    </motion.div>
  );
}

const styles = {
  container: { width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", position: "relative", boxSizing: "border-box" },
  bg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -1 },
  winOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  winBox: { textAlign: "center", background: "white", padding: "clamp(25px, 4vw, 50px)", borderRadius: 30, boxShadow: "0 0 20px rgba(0,0,0,0.2)" },
  headerArea: { width: "100%", textAlign: "center", paddingTop: "8px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "90%", padding: "0 20px", margin: "0 auto" },
  box: { background: "white", padding: "clamp(5px, 1vw, 10px) clamp(10px, 2vw, 20px)", borderRadius: 15, fontWeight: "900", fontSize: "clamp(16px, 2vw, 22px)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" },
  mainTitle: { background: "#ff69b4", color: "white", padding: "4px 35px", borderRadius: 30, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: "900", margin: "6px 0" },
  instructionBg: { background: "rgba(255, 255, 255, 0.95)", padding: "4px 18px", borderRadius: 20, border: "2px solid #ff69b4", marginTop: "2px", display: "inline-block" },
  instruction: { fontSize: "clamp(15px, 2vw, 22px)", fontWeight: "900", margin: 0 },
  butterflyGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", width: "85%", flexGrow: 1, alignItems: "center", justifyItems: "center" },
  card: { cursor: "grab", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" },
  charWrapper: { position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" },
  baseText: { fontSize: "clamp(30px, 4vw, 42px)", fontWeight: "900", color: "black", textShadow: "1px 1px 3px white" },
  // تكبير علامة الحركة (الكسرة/الفتحة/الضمة) بشكل مستقل لتكون ضخمة وواضحة جداً للأطفال
  harakaText: { fontSize: "clamp(68px, 5vw, 64px)", fontWeight: "900", color: "#fd0000", marginLeft: "-15px", textShadow: "1px 1px 3px white" },
  bottomArea: { display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", paddingBottom: "10px", width: "100%" },
  basket: { width: "clamp(150px, 18vw, 220px)", position: "relative", zIndex: 10 },
  bottomButtons: { display: "flex", gap: "12px", justifyContent: "center" },
  circleBtn: { width: "clamp(45px, 4.5vw, 55px)", height: "clamp(45px, 4.5vw, 55px)", borderRadius: "50%", border: "none", background: "#ff69b4", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
};