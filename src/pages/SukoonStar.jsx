// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import bg from "../assets/sukbg.jpeg";
import starImg from "../assets/star.png";
import boxImg from "../assets/starbox.png";
import astronautIdle from "../assets/astronautidle.png";
import astronautReach from "../assets/astronautreach.png";
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

const HAND_OFFSET = { top: -35, left: 65 };
const DROP_ZONE_OFFSET = { top: "78%", left: "18%" };

export default function SpaceStarsGame() {
  const navigate = useNavigate();
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));
  
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [collected, setCollected] = useState([]); 
  const [starsCount, setStarsCount] = useState(0);
  const [win, setWin] = useState(false);
  
  const [astronautState, setAstronautState] = useState('idle');
  const [astronautPos, setAstronautPos] = useState({ left: "5%", top: "70%" });
  const [holdingStar, setHoldingStar] = useState(null); 
  const [isDropping, setIsDropping] = useState(false);

  // نجوم اللعبة (منها 7 نجوم سكون مستهدفة و 3 نجوم خطأ)
  const starsData = useMemo(() => [
    { id: 1, letter: "بْ", x: "20%", y: "20%" }, // سكون (1)
    { id: 2, letter: "فُ", x: "45%", y: "25%" }, // خطأ
    { id: 3, letter: "رْ", x: "70%", y: "20%" }, // سكون (2)
    { id: 4, letter: "كُ", x: "80%", y: "35%" }, // خطأ
    { id: 5, letter: "نْ", x: "30%", y: "45%" }, // سكون (3)
    { id: 6, letter: "جْ", x: "60%", y: "40%" }, // سكون (4)
    { id: 7, letter: "صَ", x: "20%", y: "55%" }, // خطأ
    { id: 8, letter: "دْ", x: "45%", y: "60%" }, // سكون (5)
    { id: 9, letter: "مْ", x: "65%", y: "55%" }, // سكون (6)
    { id: 10, letter: "لْ", x: "80%", y: "50%" }, // سكون (7)
  ], []);

  // تحديد العدد المطلوب إنجازه ديناميكياً ليصبح 7 نجوم سكون
  const totalSukoonStars = useMemo(() => starsData.filter(item => item.letter.includes("ْ")).length, [starsData]);

  useEffect(() => {
    const t = setInterval(() => !win && setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [win]);

  const handleStarClick = async (item) => {
    if (win || holdingStar || collected.includes(item.id)) return;

    setAstronautPos({ left: item.x, top: item.y });
    setAstronautState('reach');
    await new Promise(r => setTimeout(r, 700));

    setHoldingStar(item); 
    
    setAstronautPos({ left: "8%", top: "65%" });
    await new Promise(r => setTimeout(r, 700));

    if (item.letter.includes("ْ")) {
      setIsDropping(true);
      await new Promise(r => setTimeout(r, 1000));
      if (soundEnabled) {
        successAudio.current.currentTime = 0;
        successAudio.current.play();
      }
      setCollected((prev) => [...prev, item.id]);
      setStarsCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= totalSukoonStars) setWin(true);
        return newCount;
      });
      setIsDropping(false);
    } else {
      if (soundEnabled) {
        errorAudio.current.currentTime = 0;
        errorAudio.current.play();
      }
      setAstronautPos({ left: item.x, top: item.y });
      await new Promise(r => setTimeout(r, 700));
    }
    
    setHoldingStar(null); 
    setAstronautPos({ left: "5%", top: "70%" });
    setAstronautState('idle');
  };

  return (
    <div style={containerStyle}>
      <style>{`
        .star-container {
          width: clamp(75px, 9vw, 105px) !important;
        }
        .star-letter {
          font-size: clamp(28px, 3.5vw, 40px) !important;
        }
        @media (max-width: 600px) {
          .star-container { width: 75px !important; }
          .star-letter { font-size: 30px !important; }
          .astro-img { width: 120px !important; }
          .box-img { width: 130px !important; bottom: 70px !important; left: 8% !important; }
          .top-box-res { font-size: 14px !important; padding: 6px 12px !important; }
          .main-title-res { font-size: 18px !important; padding: 6px 20px !important; }
        }
        @media (min-width: 601px) {
          .box-img { width: 160px !important; bottom: 8%; left: 15%; }
        }
      `}</style>

      <AnimatePresence>
        {win && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={winOverlay}>
            <motion.div initial={{ scale: 0.8, y: -20 }} animate={{ scale: 1, y: 0 }} style={winModal}>
              <h1 style={{margin: "0 0 10px 0", fontSize: "22px"}}>🎉 أحسنت 🎉</h1>
              <p style={{margin: "0 0 15px 0", fontSize: "16px"}}>لقد جمعت {starsCount} من نجوم السكون</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={() => window.location.reload()} style={circleBtn}><RotateCcw size={20}/></button>
                <button onClick={() => navigate("/Sukoon")} style={circleBtn}><ArrowRight size={20}/></button>
                <button onClick={() => navigate("/home")} style={circleBtn}><Home size={20}/></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={topBar}>
        <div style={box} className="top-box-res">⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={mainTitle} className="main-title-res">أجمع النجوم</div>
        <div style={box} className="top-box-res">⭐ {starsCount}</div>
      </div>

      {starsData.map((item) => (!collected.includes(item.id) && holdingStar?.id !== item.id) && (
        <motion.div 
          key={item.id} 
          onClick={() => handleStarClick(item)} 
          animate={{ y: [0, -10, 0], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          whileHover={{ scale: 1.15 }}
          style={{ position: "absolute", left: item.x, top: item.y, cursor: "pointer", zIndex: 10, textAlign: "center" }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={starImg} className="star-container" alt="star" style={{ display: "block" }} />
            <div style={letterStyle} className="star-letter">{item.letter}</div>
          </div>
        </motion.div>
      ))}

      <div style={{ position: 'absolute', left: astronautPos.left, top: astronautPos.top, transition: 'all 0.5s ease-in-out', zIndex: 50 }}>
        <img src={astronautState === 'idle' ? astronautIdle : astronautReach} className="astro-img" style={{ width: "150px" }} alt="astronaut" />
        
        {holdingStar && !isDropping && (
          <div style={{ position: 'absolute', top: HAND_OFFSET.top, left: HAND_OFFSET.left, width: "55px", textAlign: "center" }}>
            <img src={starImg} style={{ width: "100%", display: "block" }} alt="holding star" />
            <div style={{...letterStyle, fontSize: "24px"}}>{holdingStar.letter}</div>
          </div>
        )}
      </div>

      {isDropping && (
        <motion.div 
          initial={{ scale: 1, opacity: 1, top: astronautPos.top, left: astronautPos.left }} 
          animate={{ scale: 0.3, opacity: 0, top: DROP_ZONE_OFFSET.top, left: DROP_ZONE_OFFSET.left }} 
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ position: 'absolute', width: "60px", zIndex: 100, textAlign: "center" }}
        >
          <img src={starImg} style={{ width: "100%", display: "block" }} alt="dropping star" />
          <div style={{...letterStyle, fontSize: "24px"}}>{holdingStar?.letter}</div>
        </motion.div>
      )}

      <img src={boxImg} className="box-img" style={{ position: 'absolute', zIndex: 20 }} alt="star box" />

      <div style={bottomButtons}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={circleBtn}>{soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
        <button onClick={() => window.location.reload()} style={circleBtn}><RotateCcw size={22}/></button>
        <button onClick={() => navigate("/Sukoon")} style={circleBtn}><ArrowRight size={22}/></button>
        <button onClick={() => navigate("/home")} style={circleBtn}><Home size={22}/></button>
      </div>
    </div>
  );
}

const containerStyle = { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", backgroundImage: `url(${bg})`, backgroundSize: 'cover', userSelect: "none" };
const topBar = { position: "absolute", top: 15, width: "100%", display: "flex", justifyContent: "space-around", zIndex: 10, boxSizing: "border-box", padding: "0 10px" };
const box = { background: "white", padding: "6px 14px", borderRadius: 10, fontWeight: "bold", fontSize: "16px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" };
const mainTitle = { background: "#e7ad5c", color: "white", padding: "6px 25px", borderRadius: 25, fontSize: "20px", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" };
const letterStyle = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontWeight: "900", color: "white", textShadow: "2px 2px 4px #000", pointerEvents: "none", width: "100%" };
const winOverlay = { position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000 };
const winModal = { background: "white", padding: "25px 3px", borderRadius: "18px", textAlign: "center", color: "#6c5ce7", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", width: "80%", maxWidth: "260px" };
const bottomButtons = { position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "15px", zIndex: 1000 };
const circleBtn = { width: 45, height: 45, borderRadius: "50%", border: "none", background: "#e7ad5c", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" };