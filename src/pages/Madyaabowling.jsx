// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/bolivngbg.jpeg";
import ballImg from "../assets/pin.png"; 
import pinPurple from "../assets/ballpurple.png";
import pinBlue from "../assets/ballblue.png";
import pinGreen from "../assets/ballgreen.png";
import pinRed from "../assets/ballred.png";

import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

export default function BowlingGame() {
  const navigate = useNavigate();
  
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ballPos, setBallPos] = useState({ x: '50%', y: '85%' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [fallenPins, setFallenPins] = useState([]);
  const [showWinMessage, setShowWinMessage] = useState(false);

  const pinsData = [
    { id: 0, text: "باب", type: "other", img: pinRed }, { id: 1, text: "كبير", type: "ya", img: pinBlue },
    { id: 2, text: "تاج", type: "other", img: pinGreen }, { id: 3, text: "جميل", type: "ya", img: pinPurple },
    { id: 4, text: "نار", type: "other", img: pinRed }, { id: 5, text: "عصير", type: "ya", img: pinBlue },
    { id: 6, text: "حمار", type: "other", img: pinGreen }, { id: 7, text: "سفير", type: "ya", img: pinPurple }
  ];

  const yaPins = pinsData.filter(p => p.type === "ya");
  const totalYa = yaPins.length;
  const row1 = pinsData.slice(0, 4);
  const row2 = pinsData.slice(4, 8);

  useEffect(() => {
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const handlePinClick = async (index) => {
    if (isAnimating || fallenPins.includes(pinsData[index].id)) return;
    setIsAnimating(true);
    
    const pinElements = document.querySelectorAll('.pin-wrapper');
    const rect = pinElements[index].getBoundingClientRect();
    
    setBallPos({ 
      x: `${rect.left + rect.width / 2}px`, 
      y: `${rect.top + rect.height / 2 + 10}px` 
    });

    await new Promise(r => setTimeout(r, 500));

    if (pinsData[index].type === "ya") {
      if(soundEnabled) new Audio(successSound).play();
      const newFallen = [...fallenPins, pinsData[index].id];
      setFallenPins(newFallen);
      setPoints(p => p + 1);
      if (newFallen.length === totalYa) setShowWinMessage(true);
    } else {
      if(soundEnabled) new Audio(errorSound).play();
    }

    setBallPos({ x: '50%', y: '85%' });
    setIsAnimating(false);
  };

  const renderPin = (pin, index) => (
    <div key={pin.id} className="pin-wrapper" onClick={() => handlePinClick(index)} style={{ 
      ...styles.pinContainer, 
      visibility: fallenPins.includes(pin.id) ? "hidden" : "visible"
    }}>
      <img src={pin.img} alt="pin" className="pin-img" />
      <span style={styles.pinText}>{pin.text}</span>
    </div>
  );

  return (
    <div style={styles.game}>
      <style>{`
        .pin-img { width: 70px; }
        @media (min-width: 768px) {
          .pin-img { width: 85px; }
        }
        @media (min-width: 1024px) {
          .pin-img { width: 95px; }
        }
      `}</style>

      {showWinMessage && (
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <h1 style={{color: '#7b1fa2', margin: '0 0 10px 0'}}>أحسنت! 🎉</h1>
            <p style={{fontSize: '20px', margin: '0 0 20px 0'}}>لقد جمعت {points} نقاط!</p>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
              <button onClick={() => window.location.reload()} style={styles.smallBtn}><RotateCcw size={20} /></button>
              <button onClick={() => navigate("/Mad")} style={styles.smallBtn}><ArrowRight size={20} /></button>
              <button onClick={() => navigate("/home")} style={styles.smallBtn}><Home size={20} /></button>
            </div>
          </div>
        </div>
      )}

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.titleArea}>
           <h1 style={styles.mainTitle}>لعبة البولينج</h1>
           <p style={styles.instruction}>صوب على الكلمات التي بها مد بالياء</p>
        </div>
        <div style={styles.box}>⭐ {points}</div>
      </div>

      {/* منطقة الدبابيس */}
      <div style={styles.rowsWrapper}>
        <div style={styles.row1}>{row1.map((p, i) => renderPin(p, i))}</div>
        <div style={styles.row2}>{row2.map((p, i) => renderPin(p, i + 4))}</div>
      </div>

      {/* كرة البولينج المتحركة */}
      <img src={ballImg} alt="ball" style={{ ...styles.ball, left: ballPos.x, top: ballPos.y }} />
      
      {/* أزرار التحكم السفلية */}
      <div style={styles.bottomButtons}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.smallBtn}>{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
        <button onClick={() => window.location.reload()} style={styles.smallBtn}><RotateCcw size={20} /></button>
        <button onClick={() => navigate("/Mad")} style={styles.smallBtn}><ArrowRight size={20} /></button>
        <button onClick={() => navigate("/home")} style={styles.smallBtn}><Home size={20} /></button>
      </div>
    </div>
  );
}

const styles = {
  game: { 
    width: "100vw", 
    height: "100vh", 
    background: `url(${bgImg}) center/cover no-repeat`, 
    position: "fixed", 
    top: 0,
    left: 0,
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 10px",
    boxSizing: "border-box",
    overflow: "hidden",
    direction: "rtl"
  },
  topBar: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    width: "100%", 
    maxWidth: "850px",
    zIndex: 5
  },
  titleArea: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  },
  mainTitle: { 
    margin: 0, 
    color: "#7b1fa2", 
    background: "white", 
    padding: "4px 20px", 
    borderRadius: 16, 
    fontSize: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
  },
  instruction: { 
    margin: "6px 0 0 0", 
    padding: "4px 16px", 
    borderRadius: 16, 
    background: "#cca5e0", 
    fontSize: "15px", 
    fontWeight: "bold", 
    color: "#fff", 
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
  },
  rowsWrapper: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    width: "100%",
    gap: "10px",
    margin: "auto 0",
    zIndex: 2
  },
  row1: { 
    display: "flex", 
    gap: "12px", 
    justifyContent: "center" 
  },
  row2: { 
    display: "flex", 
    gap: "12px", 
    justifyContent: "center",
    marginTop: "-15px"
  },
  pinContainer: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    cursor: "pointer", 
    position: "relative",
    transition: "transform 0.2s"
  },
  pinText: { 
    fontSize: "17px", 
    fontWeight: "bold", 
    color: "#000000", 
    position: "absolute", 
    top: "50%", 
    transform: "translateY(-50%)", 
    pointerEvents: "none",
    textShadow: "0 1px 2px rgba(255,255,255,0.8)"
  },
  ball: { 
    width: "70px", 
    position: "fixed", 
    transition: "0.5s ease-in-out", 
    transform: "translate(-50%, -50%)", 
    zIndex: 10 
  },
  bottomButtons: { 
    display: "flex", 
    gap: "10px",
    zIndex: 5
  },
  smallBtn: { 
    width: 42, 
    height: 42, 
    borderRadius: "50%", 
    border: "none", 
    background: "#7b1fa2", 
    color: "white", 
    cursor: "pointer", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  box: { 
    background: "white", 
    padding: "6px 14px", 
    borderRadius: 14, 
    fontWeight: "bold", 
    fontSize: "15px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
  },
  winOverlay: { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(0,0,0,0.6)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 100 
  },
  winBox: { 
    background: "white", 
    padding: "30px 40px", 
    borderRadius: "24px", 
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  }
};