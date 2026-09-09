/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/pom1.jpeg";

import balloon1 from "../assets/balloon1.png";
import balloon2 from "../assets/balloon2.png";
import balloon3 from "../assets/balloon3.png";
import balloon4 from "../assets/balloon4.png";
import balloon5 from "../assets/balloon5.png";
import balloon6 from "../assets/balloon6.png";
import balloon7 from "../assets/balloon7.png";

export default function BubblePopGame() {
  const navigate = useNavigate();
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [nextNeedsSukoon, setNextNeedsSukoon] = useState(true);

  const balloonImages = [balloon1, balloon2, balloon3, balloon4, balloon5, balloon6, balloon7];

  const wordsWithSukoon = [
    { text: "بَيْت", hasSukoon: true }, { text: "بَحْر", hasSukoon: true }, 
    { text: "خُبْز", hasSukoon: true }, { text: "رَأْسُ", hasSukoon: true }, 
    { text: "شَمْسُ", hasSukoon: true }, { text: "غُصْنُ", hasSukoon: true }, 
    { text: "أًتْقَنَ", hasSukoon: true }
  ];
  const wordsWithoutSukoon = [
    { text: "طَبِيبُ", hasSukoon: false }, { text: "رَحِيمُ", hasSukoon: false }, 
    { text: "حَليِبُ", hasSukoon: false }, { text: "صَدِيقُ", hasSukoon: false }, 
    { text: "قُتِلَ", hasSukoon: false }
  ];

  const playSound = (isCorrect) => {
    if (!soundEnabled) return;
    const audio = new Audio(isCorrect ? "/sounds/hay1.mp3" : "/sounds/pop.mp3");
    audio.play().catch(() => {});
  };

  const popBalloon = (b) => {
    if (b.popping || gameOver) return;
    if (b.hasSukoon) {
      playSound(true);
      const newCount = poppedCount + 1;
      setPoppedCount(newCount);
      setScore((s) => s + 10);
      setBalloons((prev) => prev.map((item) => (item.id === b.id ? { ...item, popping: true } : item)));
      setTimeout(() => { setBalloons((prev) => prev.filter((item) => item.id !== b.id)); }, 200);
      if (newCount >= 10) setGameOver(true);
    } else {
      playSound(false);
    }
  };

  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setBalloons((prev) => prev.map((b) => ({ ...b, y: b.y - 0.5 })).filter((b) => b.y > -20));
    }, 50);
    return () => clearInterval(move);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const pool = nextNeedsSukoon ? wordsWithSukoon : wordsWithoutSukoon;
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      setBalloons((prev) => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        ...randomItem,
        image: balloonImages[Math.floor(Math.random() * balloonImages.length)],
        x: Math.random() * 65 + 5,
        y: 100,
        popping: false
      }]);
      setNextNeedsSukoon(!nextNeedsSukoon);
    }, 1600);
    return () => clearInterval(interval);
  }, [gameOver, nextNeedsSukoon]);

  return (
    <div style={styles.container}>
      <img src={bgImg} alt="BG" style={styles.bg} />
      
      {/* شريط الإحصائيات مع تكبير العنوان والعدادات للموبايل */}
      <div style={styles.statsBar}>
        <div style={styles.box}>🎯 {poppedCount}/10</div>
        <div style={styles.titleText}>فرقع البالونات التي بها سكون</div>
        <div style={styles.box}>⭐ {score}</div>
      </div>

      {gameOver && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={{ fontSize: "clamp(22px, 4.5vw, 28px)", margin: "0 0 10px 0" }}>🎉 أحسنتِ 🎉</h2>
            <p style={{ fontSize: "clamp(15px, 3vw, 19px)", marginBottom: "15px" }}>مجموع نقاطك: {score}</p>
            <button style={styles.restartBtn} onClick={() => window.location.reload()}>إعادة اللعب</button>
          </div>
        </div>
      )}

      {/* البالونات بالحجم المطلوب مع تكبير الكلمات بداخلها */}
      {balloons.map((b) => (
        <div key={b.id} onClick={() => popBalloon(b)} style={{
          ...styles.balloonContainer, 
          left: `${b.x}%`, 
          top: `${b.y}%`, 
          transform: b.popping ? "scale(0)" : "scale(1)", 
          opacity: b.popping ? 0 : 1
        }}>
          <img src={b.image} alt="balloon" style={styles.balloonImg} />
          <span style={styles.balloonText}>{b.text}</span>
        </div>
      ))}

      {/* الأزرار السفلية */}
      <div style={styles.bottomButtons}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
        <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={20} /></button>
        <button onClick={() => navigate("/Sukoon")} style={styles.circleBtn}><ArrowRight size={20} /></button>
        <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={20} /></button>
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
    boxSizing: "border-box" 
  },
  bg: { 
    position: "absolute", 
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    zIndex: -1 
  },
  statsBar: { 
    position: "absolute", 
    top: "10px", 
    width: "100%", 
    display: "flex", 
    justifyContent: "space-around", 
    alignItems: "center", 
    padding: "0 8px", 
    boxSizing: "border-box", 
    zIndex: 100,
    gap: "5px"
  },
  box: { 
    background: "white", 
    padding: "clamp(5px, 1.2vw, 9px) clamp(10px, 1.8vw, 15px)", 
    borderRadius: "10px", 
    fontSize: "clamp(13px, 2.2vw, 16px)", 
    fontWeight: "bold", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    color: "#16a34a",
    whiteSpace: "nowrap"
  },
  titleText: { 
    background: "white", 
    padding: "clamp(6px, 1.5vw, 10px) clamp(12px, 2.5vw, 20px)", 
    borderRadius: "20px", 
    fontSize: "clamp(15px, 3vw, 21px)", /* تم تكبير العنوان بوضوح على الموبايل */
    fontWeight: "bold", 
    color: "#00aaff", 
    border: "2px solid #00aaff",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
  },
  balloonContainer: { 
    position: "absolute", 
    width: "110px",   /* رجعنا حجم البالون الأصلي زي الأول */
    height: "110px",  /* رجعنا حجم البالون الأصلي زي الأول */
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    cursor: "pointer", 
    transition: "transform 0.3s ease, opacity 0.3s ease",
    touchAction: "manipulation"
  },
  balloonImg: { 
    width: "100%", 
    height: "100%", 
    objectFit: "contain", 
    pointerEvents: "none" 
  },
  balloonText: { 
    position: "absolute", 
    color: "black", 
    fontSize: "clamp(18px, 3vw, 22px)", /* تكبير حجم الكلمات داخل البالون لتكون واضحة */
    marginTop: "-30px", 
    fontWeight: "bold", 
    pointerEvents: "none",
    background: "rgba(255,255,255,0.75)",
    padding: "1px 7px",
    borderRadius: "6px"
  },
  bottomButtons: { 
    position: "absolute", 
    bottom: "10px", 
    width: "100%", 
    display: "flex", 
    justifyContent: "center", 
    gap: "10px", 
    zIndex: 100 
  },
  circleBtn: { 
    width: "45px", 
    height: "45px", 
    borderRadius: "50%", 
    border: "none", 
    background: "#16a34a", 
    color: "white", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    boxShadow: "0 3px 6px rgba(0,0,0,0.3)"
  },
  overlay: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    background: "rgba(0,0,0,0.6)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 2000 
  },
  modal: { 
    background: "white", 
    padding: "20px", 
    borderRadius: "20px", 
    textAlign: "center", 
    border: "4px solid #16a34a", 
    width: "80%", 
    maxWidth: "280px" 
  },
  restartBtn: { 
    padding: "9px 20px", 
    fontSize: "clamp(16px, 2.8vw, 19px)", 
    cursor: "pointer", 
    background: "#16a34a", 
    color: "white", 
    border: "none", 
    borderRadius: "10px",
    fontWeight: "bold"
  }
};