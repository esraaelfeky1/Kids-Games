// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/trubg.jpeg"; 
import chestClosed from "../assets/boxclo.png";
import chestOpen from "../assets/boxopn.png";
import explorerImg from "../assets/turman.png";

import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

export default function TreasureGame() {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 600 && window.innerWidth <= 1024);
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [chests, setChests] = useState(Array(9).fill({ isOpen: false, isGlowing: false }));
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  
  const startPos = isMobile ? { x: 10, y: window.innerHeight - 120 } : (isTablet ? { x: 20, y: 380 } : { x: 30, y: 350 });
  const [explorerPos, setExplorerPos] = useState(startPos);

  const items = [
    { char: "بَا", type: "alif" }, { char: "تِي", type: "ya" }, { char: "جَا", type: "alif" },
    { char: "حِي", type: "ya" }, { char: "دَا", type: "alif" }, { char: "رِي", type: "ya" },
    { char: "سَا", type: "alif" }, { char: "شِي", type: "ya" }, { char: "صَا", type: "alif" }
  ];
  const totalYa = items.filter(i => i.type === "ya").length;

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

  const chestSize = isMobile ? 75 : (isTablet ? 95 : 100);
  const explorerSize = isMobile ? 110 : (isTablet ? 145 : 155);

  const handleChestClick = async (idx) => {
    if (isMoving || chests[idx].isOpen || !gridRef.current) return;
    
    setIsMoving(true);
    const rect = gridRef.current.children[idx].getBoundingClientRect();
    
    // تم زيادة المسافة الأفقية قليلاً (بحيث يبتعد الولد عن الصندوق مسافة إضافية واضحة)
    const offsetX = isMobile ? 65 : 95;
    const offsetY = isMobile ? -5 : 10;
    
    setExplorerPos({ x: rect.left - offsetX, y: rect.top - offsetY });
    
    await new Promise(r => setTimeout(r, 600));

    const newChests = [...chests];
    const isCorrect = items[idx].type === "ya";
    newChests[idx] = { isOpen: true, isGlowing: isCorrect };
    setChests(newChests);
    
    const sound = new Audio(isCorrect ? successSound : errorSound);
    if (soundEnabled) {
      sound.play();
    }
    
    await new Promise(r => sound.onended = r);
    
    if (isCorrect) {
      const newPoints = points + 1;
      setPoints(newPoints);
      if (newPoints === totalYa) setShowWinMessage(true);
    } else {
      // eslint-disable-next-line react-hooks/immutability
      newChests[idx] = { isOpen: false, isGlowing: false };
      setChests(newChests);
    }
    
    setExplorerPos(startPos);
    setIsMoving(false);
  };

  return (
    <div style={styles.game}>
      {showWinMessage && (
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <h1 style={{color: '#7b1fa2', margin: '0 0 10px 0'}}>أحسنت! 🎉</h1>
            <p style={{fontSize: '22px', margin: '0 0 20px 0'}}>جمعت {points} كنوز</p>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
              <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={20}/></button>
              <button onClick={() => navigate("/Mad")} style={styles.circleBtn}><ArrowRight size={20}/></button>
              <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={20}/></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        .explorer { transition: all 0.5s ease; position: fixed; z-index: 50; width: ${explorerSize}px; pointer-events: none; }
        .glow { filter: drop-shadow(0 0 15px gold) brightness(1.5); }

        @media (max-width: 600px) {
          .responsive-box {
            padding: 5px 8px !important;
            font-size: 13px !important;
            border-radius: 8px !important;
          }
          .responsive-btn {
            width: 36px !important;
            height: 36px !important;
          }
          .responsive-btn svg {
            width: 18px !important;
            height: 18px !important;
          }
          .game-grid-container {
            grid-template-columns: repeat(3, 75px) !important;
            margin-top: 21vh !important;
          }
          .responsive-title {
            font-size: 20px !important;
            padding: 2px 10px !important;
          }
          .responsive-instruction {
            font-size: 15px !important;
          }
        }

        @media (max-width: 1024px) and (min-width: 601px) {
          .game-grid-container {
            grid-template-columns: repeat(3, clamp(80px, 20vw, 95px)) !important;
            margin-top: 19vh !important;
          }
        }
      `}</style>

      <div style={styles.topBar}>
        <div className="responsive-box" style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.titleArea}>
           <h1 className="responsive-title" style={styles.mainTitle}>لعبة الكنز</h1>
           <div style={styles.instructionBg}><p className="responsive-instruction" style={styles.instruction}>ابحث عن حروف المد بالياء</p></div>
        </div>
        <div className="responsive-box" style={styles.box}>⭐ {points}</div>
      </div>

      <div ref={gridRef} className="game-grid-container" style={{...styles.grid, gridTemplateColumns: `repeat(3, ${chestSize}px)`}}>
        {items.map((item, idx) => (
          <div key={idx} onClick={() => handleChestClick(idx)} style={{...styles.chestContainer, width: chestSize, height: chestSize}}>
            <img src={chests[idx].isOpen ? chestOpen : chestClosed} alt="chest" className={chests[idx].isGlowing ? "glow" : ""} style={{width: '100%'}} />
            {chests[idx].isOpen && <span style={styles.char}>{item.char}</span>}
          </div>
        ))}
      </div>

      <img src={explorerImg} className="explorer" style={{ left: explorerPos.x, top: explorerPos.y }} alt="explorer" />

      <div style={styles.bottomButtons}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} className="responsive-btn" style={styles.circleBtn}>{soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
        <button onClick={() => window.location.reload()} className="responsive-btn" style={styles.circleBtn}><RotateCcw size={22}/></button>
        <button onClick={() => navigate("/Mad")} className="responsive-btn" style={styles.circleBtn}><ArrowRight size={22}/></button>
        <button onClick={() => navigate("/home")} className="responsive-btn" style={styles.circleBtn}><Home size={22}/></button>
      </div>
    </div>
  );
}

const styles = {
  game: { width: "100%", height: "100vh", background: `url(${bgImg}) center/cover`, display: "flex", flexDirection: "column", alignItems: "center", position: "fixed", top: 0, left: 0 },
  topBar: { position: "absolute", top: 10, width: "95%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 10px" },
  titleArea: { display: "flex", flexDirection: "column", alignItems: "center" },
  mainTitle: { margin: 0, color: "#f9f9f9", fontSize: "34px", background: "rgba(230, 129, 5, 0.8)", padding: "2px 15px", borderRadius: 15 },
  instructionBg: { background: "rgba(245, 203, 53, 0.8)", padding: "1px 10px", borderRadius: 10, marginTop: "4px" },
  instruction: { margin: 0, fontSize: "20px", color: "#444", fontWeight: "bold" },
  box: { backgroundColor: "#e39323", padding: "6px 12px", borderRadius: 8, fontWeight: "bold", fontSize: "18px" },
  grid: { display: "grid", gap: "12px", marginTop: "22vh" },
  chestContainer: { position: "relative", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" },
  char: { position: "absolute", fontSize: "35px", fontWeight: "bold", color: "#eafa0b", textShadow: "2px 2px 4px #000", pointerEvents: 'none' },
  bottomButtons: { display: "flex", gap: "10px", position: "absolute", bottom: "15px" },
  circleBtn: { width: 46, height: 46, borderRadius: "50%", border: "none", background: "#ed8a09", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  winOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000 },
  winBox: { background: "white", padding: "40px", borderRadius: "30px", textAlign: "center", boxShadow: "0 0 20px rgba(0,0,0,0.5)", zIndex: 1001 }
};