// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, Volume2, VolumeX, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// الصور والأصوات
import bgImg from "../assets/ballonbg.jpeg";
import balloonBoy from "../assets/balloon-boy.png";
import greenBox from "../assets/green-box.png";
import pinkBox from "../assets/pink-box.png";
import orangeBox from "../assets/orange-box.png";
import cloudImg from "../assets/cloud.png";
import smallBalloon from "../assets/small-balloon.png";
import correctSound from "/sounds/hay1.mp3";
import wrongSound from "/sounds/pop.mp3";

const levels = [
  { options: ["بَا", "بِي", "بُو"], correct: "بُو" },
  { options: ["تُو", "تَا", "تِي"], correct: "تُو" },
  { options: ["سِي", "سَا", "سُو"], correct: "سُو" },
  { options: ["جُو", "جِي", "جَا"], correct: "جُو" },
  { options: ["دَا", "دُو", "دِي"], correct: "دُو" },
  { options: ["رِي", "رَا", "رُو"], correct: "رُو" },
  { options: ["زُو", "زِي", "زَا"], correct: "زُو" },
];

export default function BalloonGame() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const playSound = (isCorrect) => {
    if (!isMuted) new Audio(isCorrect ? correctSound : wrongSound).play();
  };

  const handleSelection = (char) => {
    if (char === levels[currentLevel].correct) {
      playSound(true);
      const newScore = score + 1;
      setScore(newScore);
      if (currentLevel + 1 < levels.length) {
        setCurrentLevel(currentLevel + 1);
      } else {
        setShowWin(true);
      }
    } else {
      playSound(false);
    }
  };

  const boxImages = [greenBox, pinkBox, orangeBox];

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.statBox}>⭐ {score}/7</div>
        <div style={styles.headerWrapper}>
          <div style={styles.titleBg}><h1 style={styles.title}>رحلة المنطاد</h1></div>
          <div style={styles.instructionBg}><p style={styles.instruction}>اختر الحرف الذي يحتوي على مد بالواو</p></div>
        </div>
        <div style={styles.statBox}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
      </div>

      <div style={styles.mainLayout}>
        <motion.img src={balloonBoy} style={styles.balloon} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        <div style={styles.boxesContainer}>
          {levels[currentLevel].options.map((char, i) => (
            <div key={i} style={{...styles.box, backgroundImage: `url(${boxImages[i]})`}} onClick={() => handleSelection(char)}>
              <div style={styles.boxContent}>
                <img src={smallBalloon} style={styles.smallBalloon} alt="balloon" />
                <img src={cloudImg} style={styles.cloud} alt="cloud" />
                <span style={styles.char}>{char}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showWin && (
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <h1 style={styles.winTitle}>🎉 أحسنت 🎉</h1>
            <p style={styles.winText}>لقد أنهيت الرحلة بـ 7 نقاط</p>
            <div style={styles.winButtons}>
              <button style={styles.circleBtn} onClick={() => window.location.reload()}><RotateCcw /></button>
              <button style={styles.circleBtn} onClick={() => navigate(-1)}><ArrowLeft /></button>
              <button style={styles.circleBtn} onClick={() => navigate("/home")}><Home /></button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.bottomButtons}>
        <button style={styles.circleBtn} onClick={() => window.location.reload()}><RotateCcw /></button>
        <button style={styles.circleBtn} onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX /> : <Volume2 />}</button>
        <button style={styles.circleBtn} onClick={() => navigate("/Mad")}><ArrowRight /></button>
        <button style={styles.circleBtn} onClick={() => navigate("/home")}><Home /></button>
      </div>
    </div>
  );
}

const styles = {
  container: { width: "100vw", minHeight: "100vh", background: `url(${bgImg}) center/cover`, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px", boxSizing: "border-box" },
  topBar: { width: "100%", maxWidth: "900px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" },
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  titleBg: { background: "rgba(255,255,255,0.9)", padding: "2px 15px", borderRadius: "10px" },
  instructionBg: { background: "rgba(255,255,255,0.7)", padding: "2px 10px", borderRadius: "8px" },
  title: { fontSize: "clamp(20px, 2vw, 24px)", color: "#7b1fa2", margin: 0 },
  instruction: { fontSize: "clamp(14px, 1.2vw, 16px)", margin: 0, fontWeight: "bold" },
  statBox: { background: "white", padding: "5px 15px", borderRadius: "12px", fontWeight: "bold", border: "2px solid #7b1fa2", fontSize: "clamp(14px, 1.5vw, 18px)" },
  mainLayout: { display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "50px", marginTop: "20px" },
  balloon: { width: "clamp(120px, 20vw, 220px)" },
  boxesContainer: { display: "flex", flexDirection: "row", gap: "20px", flexWrap: "wrap", justifyContent: "center" },
  box: { width: "clamp(130px, 16vw, 180px)", height: "clamp(150px, 18vw, 200px)", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", cursor: "pointer", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" },
  boxContent: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
  cloud: { width: "80%", position: "absolute", zIndex: 0 },
  smallBalloon: { width: "25%", position: "absolute", top: "-10%", zIndex: 1 },
  char: { position: "absolute", fontSize: "clamp(25px, 4vw, 45px)", zIndex: 2, fontWeight: "bold", textAlign: "center" },
  bottomButtons: { position: "fixed", bottom: "20px", display: "flex", gap: "15px" },
  circleBtn: { width: "clamp(40px, 5vw, 50px)", height: "clamp(40px, 5vw, 50px)", borderRadius: "50%", border: "none", background: "#7b1fa2", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  winOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 },
  winBox: { background: "white", padding: "clamp(16px, 3vw, 15px)", borderRadius: "20px", textAlign: "center", color: "#7b1fa2", width: "clamp(200px, 40vw, 300px)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" },
  winTitle: { fontSize: "clamp(23px, 4vw, 30px)", margin: "5px" },
  winText: { fontSize: "clamp(18px, 2.5vw, 19px)", fontWeight: "bold", margin: "5px 0" },
  winButtons: { display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }
};