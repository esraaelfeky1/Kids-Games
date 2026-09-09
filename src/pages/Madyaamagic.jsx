// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/magicbg.jpeg";
import wizardImg from "../assets/saher.png";
import ball1 from "../assets/ball1.png";
import ball2 from "../assets/ball2.png";
import ball3 from "../assets/ball3.png";
import ball4 from "../assets/ball4.png";
import ball5 from "../assets/ball5.png";
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

const ballImages = [ball1, ball2, ball3, ball4, ball5];

export default function MagicGame() {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 600 && window.innerWidth <= 1024);
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(0); 
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [revealed, setRevealed] = useState(Array(12).fill(false));
  const [isMoving, setIsMoving] = useState(false);
  const [activeBall, setActiveBall] = useState(null);
  const [isCasting, setIsCasting] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);

  const [items] = useState([
    { text: "عارف", type: "alif" }, { text: "فِيل", type: "ya" }, { text: "نَار", type: "alif" }, { text: "عِيد", type: "ya" },
    { text: "قال", type: "alif" }, { text: "رِيح", type: "ya" }, { text: "كاتب", type: "ya" }, { text: "دِين", type: "ya" },
    { text: "شفيع", type: "ya" }, { text: "ساد", type: "alif" }, { text: "صديق", type: "ya" }, { text: "عاد", type: "alif" }
  ]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 600);
      setIsTablet(width > 600 && width <= 1024);
    };
    window.addEventListener('resize', handleResize);
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => { window.removeEventListener('resize', handleResize); clearInterval(t); };
  }, []);

  const ballSize = isMobile ? 70 : (isTablet ? 90 : 80);
  // تم تكبير حجم الساحر على التابلت بناءً على طلبك
  const wizardSize = isMobile ? 170 : (isTablet ? 170 : 180);
  const startPos = isMobile ? { x: 15, y: 400 } : { x: 30, y: 400 };
  const [wizardPos, setWizardPos] = useState(startPos);
  
  const playSound = (src) => { 
    if (soundEnabled) {
      new Audio(src).play();
    }
  };

  const handleBallClick = async (idx) => {
    if (isMoving || revealed[idx] || !gridRef.current) return;
    
    const rect = gridRef.current.children[idx].getBoundingClientRect();
    setIsMoving(true);
    setWizardPos({ x: rect.left - (isMobile ? 30 : 60), y: rect.top - (isMobile ? 60 : 40) });
    
    await new Promise(r => setTimeout(r, 800));

    if (items[idx].type === "ya") {
      setIsCasting(true); 
      setActiveBall(idx);
      playSound(successSound);
      await new Promise(r => setTimeout(r, 1000));
      
      const updated = [...revealed]; 
      updated[idx] = true; 
      setRevealed(updated);
      
      const newPoints = points + 1;
      setPoints(newPoints);
      
      setEnergy(e => Math.min(e + 16.66, 100));
      
      if (newPoints === 6) {
        setShowWinMessage(true);
      }
      
      setIsCasting(false); 
      setActiveBall(null);
    } else {
      playSound(errorSound);
      setEnergy(e => Math.max(e - 10, 0));
    }

    await new Promise(r => setTimeout(r, 500));
    setWizardPos(startPos); 
    setIsMoving(false);
  };

  return (
    <div style={styles.game}>
      {showWinMessage && (
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <h1 style={{margin: '0 0 10px 0'}}>🎉أحسنت🎉</h1>
            <p style={{fontSize: '24px', margin: '0 0 20px 0'}}>لقد جمعت {points} </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={20}/></button>
              <button onClick={() => navigate("/Mad")} style={styles.circleBtn}><ArrowRight size={20}/></button>
              <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={20}/></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        .wizard { transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); position: fixed; z-index: 100; pointer-events: none; }
        .magicEffect { filter: drop-shadow(0 0 30px #ffeb3b) brightness(1.8); transform: scale(1.2); }
        .vanish { animation: vanishAnim 1s forwards; }
        @keyframes vanishAnim { 
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.2); filter: brightness(2.5); }
          100% { transform: scale(0); opacity: 0; } 
        }

        /* تصغير الوقت، النقاط، والأزرار خصيصاً على الموبايل */
        @media (max-width: 600px) {
          .responsive-box {
            padding: 5px 8px !important;
            font-size: 13px !important;
            border-radius: 8px !important;
          }
          .responsive-btn {
            width: 39px !important;
            height: 39px !important;
          }
          .responsive-btn svg {
            width: 20px !important;
            height: 20px !important;
          }
          .game-grid-container {
            grid-template-columns: repeat(4, 70px) !important;
            margin-top: 21vh !important;
          }
        }

        @media (max-width: 1024px) and (min-width: 601px) {
          .game-grid-container {
            grid-template-columns: repeat(4, clamp(65px, 18vw, 85px)) !important;
            margin-top: 19vh !important;
          }
        }
      `}</style>

      <div style={styles.topBar}>
        <div className="responsive-box" style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.titleWrapper}>
            <div style={styles.mainTitle}>عصا الساحر</div>
            <div style={styles.instruction}>اضغط على الكلمة التي بها مد بالياء</div>
        </div>
        <div className="responsive-box" style={styles.box}>⭐ {points}</div>
      </div>

      <div ref={gridRef} className="game-grid-container" style={{...styles.grid, gridTemplateColumns: `repeat(4, ${ballSize}px)`}}>
        {items.map((item, idx) => (
          <div key={idx} onClick={() => handleBallClick(idx)} 
               className={activeBall === idx ? "vanish" : ""}
               style={{...styles.tile, width: ballSize, height: ballSize, opacity: revealed[idx] ? 0 : 1}}>
            <img src={ballImages[idx % 5]} style={{width: '100%'}} alt="ball" />
            <span style={styles.word}>{item.text}</span>
          </div>
        ))}
      </div>

      <img src={wizardImg} className={`wizard ${isCasting ? 'magicEffect' : ''}`} 
           style={{ left: wizardPos.x, top: wizardPos.y, width: wizardSize }} alt="wizard" />

      <div style={styles.energyBarContainer}><div style={{...styles.energyFill, width: `${energy}%`}}></div></div>

      <div style={styles.bottomButtons}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} className="responsive-btn" style={styles.circleBtn}>{soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}</button>
        <button onClick={() => window.location.reload()} className="responsive-btn" style={styles.circleBtn}><RotateCcw size={24}/></button>
        <button onClick={() => navigate("/Mad")} className="responsive-btn" style={styles.circleBtn}><ArrowRight size={24}/></button>
        <button onClick={() => navigate("/home")} className="responsive-btn" style={styles.circleBtn}><Home size={24}/></button>
      </div>
    </div>
  );
}

const styles = {
  game: { width: "100%", height: "100vh", background: `url(${bgImg}) center/cover`, display: "flex", flexDirection: "column", alignItems: "center", position: "fixed", top: 0, left: 0 },
  topBar: { position: "absolute", top: 15, width: "95%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 10px" },
  titleWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  box: { background: "white", padding: "8px 12px", borderRadius: 12, fontWeight: "bold", fontSize: "16px" },
  mainTitle: { background: "#7b1fa2", color: "white", padding: "5px 20px", borderRadius: 20, fontSize: "25px" },
  instruction: { background: "rgba(255, 255, 255, 0.95)", color: "#7b1fa2", padding: "2px 12px", borderRadius: 10, fontSize: "17px", fontWeight: "bold", border: "1px solid #7b1fa2" },
  grid: { display: "grid", gap: "8px", marginTop: "21vh" }, 
  tile: { cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
  word: { fontSize: "23px", color: "#fff", fontWeight: "bold", position: "absolute", textShadow: "1px 1px 2px black" },
  energyBarContainer: { width: "200px", height: "15px", background: "#333", borderRadius: 10, position: "absolute", bottom: "85px", border: "2px solid white" },
  energyFill: { height: "100%", background: "#4caf50", transition: "width 0.3s", borderRadius: 10 },
  bottomButtons: { display: "flex", gap: "10px", position: "absolute", bottom: "15px" }, 
  circleBtn: { width: 46, height: 46, borderRadius: "50%", border: "none", background: "#7b1fa2", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  winOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000 },
  winBox: { background: "white", padding: "40px", borderRadius: "30px", textAlign: "center", color: "#7b1fa2", boxShadow: "0 0 20px rgba(0,0,0,0.5)", zIndex: 1001 }
};