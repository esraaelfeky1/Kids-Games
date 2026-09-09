
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/pp.jpeg";
import chefImg from "../assets/chef.png";
import trayImg from "../assets/tray.png";
import pizzaPiece from "../assets/pizza.png";

import correctSound from "/sounds/hay1.mp3";
import wrongSound from "/sounds/pop.mp3";

const initialWords = [
  { id: 1, text: "كتابًا", isTanween: true },
  { id: 2, text: "قلمٌ", isTanween: false },
  { id: 3, text: "شارعًا", isTanween: true },
  { id: 4, text: "بابٌ", isTanween: false },
  { id: 5, text: "تفاحًا", isTanween: true },
  { id: 6, text: "عنبٌ", isTanween: false },
  { id: 7, text: "صديقًا", isTanween: true },
  { id: 8, text: "بيتًا", isTanween: true },
];

const positions = [
  { top: "12%", left: "15%" }, 
  { top: "12%", left: "48%" }, 
  { top: "48%", left: "15%" }, 
  { top: "48%", left: "48%" }, 
];

export default function PizzaGame() {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState(initialWords);
  const [placedPieces, setPlacedPieces] = useState([]);
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

  const processPieceSelection = (piece) => {
    if (piece) {
      if (piece.isTanween) {
        playSound(true);
        const newPlaced = [...placedPieces, piece];
        setPlacedPieces(newPlaced);
        setPieces(pieces.filter((p) => p.id !== piece.id));
        if (newPlaced.length === initialWords.filter((p) => p.isTanween).length) {
          setShowWin(true);
        }
      } else {
        playSound(false);
      }
    }
  };

  const handleDragStart = (e, piece) => {
    e.dataTransfer.setData("pieceId", piece.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("pieceId"));
    const piece = pieces.find((p) => p.id === id);
    processPieceSelection(piece);
  };

  return (
    <div style={styles.container}>
      <style>{noScrollResponsiveCSS}</style>

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.statBox}>⭐ {placedPieces.length}/{initialWords.filter((p) => p.isTanween).length}</div>
        <div style={styles.headerWrapper}>
          <div style={styles.titleBg}><h1 style={styles.title} className="main-title-text">لعبة شيف البيتزا</h1></div>
        </div>
        <div style={styles.statBox}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
      </div>

      {/* منطقة اللعب الرئيسية */}
      <div style={styles.mainLayout} className="pizza-main-layout">
        <motion.img 
          src={chefImg} 
          style={styles.chef} 
          className="pizza-chef"
          animate={{ y: [0, -6, 0] }} 
          transition={{ repeat: Infinity, duration: 3 }} 
        />
        <div 
          onDrop={handleDrop} 
          onDragOver={(e) => e.preventDefault()} 
          style={styles.tray} 
          className="pizza-tray-box"
        >
          <img src={trayImg} alt="Tray" style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
          {placedPieces.map((p, i) => (
            <div key={p.id} style={{ ...styles.placedPiece, ...positions[i % positions.length] }} className="pizza-placed-item">
              <img src={pizzaPiece} style={styles.pizzaImg} alt="Piece" />
              <span style={styles.placedText} className="pizza-text-size">{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* صندوق قطع البيتزا */}
      <div style={styles.piecesContainer} className="pizza-pieces-container">
        {pieces.map((p) => (
          <motion.div 
            key={p.id} 
            draggable 
            onDragStart={(e) => handleDragStart(e, p)} 
            onClick={() => processPieceSelection(p)} 
            whileTap={{ scale: 0.9 }}
            style={styles.pieceBox} 
            className="pizza-piece-box"
          >
            <img src={pizzaPiece} style={styles.pizzaImg} alt="Piece" />
            <span style={styles.pieceText} className="pizza-text-size">{p.text}</span>
          </motion.div>
        ))}
      </div>

      {/* الأزرار السفلية الأربعة الرئيسية */}
      <div style={styles.bottomButtons} className="pizza-bottom-buttons">
        <button style={styles.circleBtn} onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
        <button style={styles.circleBtn} onClick={() => window.location.reload()}><RotateCcw size={24}/></button>
        <button style={styles.circleBtn} onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
        </button>
        <button style={styles.circleBtn} onClick={() => navigate("/home")}><Home size={24}/></button>
      </div>

      {/* نافذة الفوز (تحتوي الآن على الثلاث أزرار: رجوع، إعادة، هوم) */}
      {showWin && (
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <h1 style={{ margin: "0 0 10px 0", color: "#c2410c", fontSize: "clamp(22px, 4vw, 28px)" }}>🎉 أحسنت!</h1>
            <p style={{ margin: "0 0 20px 0", fontSize: "clamp(15px, 2.5vw, 18px)", color: "#333", fontWeight: "bold" }}>لقد صنعت أحلى بيتزا تنوين بنجاح!</p>
            
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button style={styles.winBtn} onClick={() => navigate(-1)} title="الرجوع"><ArrowLeft size={22}/></button>
              <button style={styles.winBtn} onClick={() => window.location.reload()} title="إعادة المحاولة"><RotateCcw size={22}/></button>
              <button style={styles.winBtn} onClick={() => navigate("/home")} title="الرئيسية"><Home size={22}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const noScrollResponsiveCSS = `
  html, body, #root {
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
    position: fixed !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'Cairo', sans-serif;
  }

  .main-title-text {
    font-size: clamp(22px, 3.8vw, 31px) !important;
  }

  /* تكبير الخط وإظهار التنوين والحركات بوضوح تام */
  .pizza-text-size {
    font-size: clamp(20px, 3.8vw, 26px) !important;
    font-weight: 900 !important;
    -webkit-font-smoothing: antialiased;
    text-shadow: 0px 1px 2px rgba(255,255,255,0.9);
  }

  /* تصميم اللابتوب والتابلت (تكبير قطع البيتزا لتكون واضحة) */
  @media (min-width: 901px) {
    .pizza-pieces-container {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 15px !important;
      padding: 12px 25px !important;
      max-width: 95vw !important;
      overflow-x: auto !important;
    }
    .pizza-piece-box {
      width: 95px !important; /* تكبير القطع بشكل ممتاز للشاشات الكبيرة */
      flex-shrink: 0 !important;
    }
  }

  /* تخصيص الموبايل (تكبير قطع البيتزا وضبط الأماكن) */
  @media (max-width: 900px) {
    .pizza-main-layout {
      gap: 12px !important;
      margin-top: 95px !important;
      align-items: flex-end !important;
    }
    
    .pizza-chef {
      width: clamp(110px, 28vw, 140px) !important;
    }

    .pizza-tray-box {
      width: clamp(155px, 38vw, 195px) !important;
      height: clamp(135px, 33vw, 170px) !important;
    }

    .pizza-pieces-container {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      grid-template-rows: repeat(2, auto) !important;
      gap: 8px 10px !important;
      padding: 8px 12px !important;
      margin-top: 12px !important;
      margin-bottom: 58px !important;
      max-width: 95vw !important;
      background: rgba(255, 255, 255, 0.9) !important;
      justify-items: center;
      align-items: center;
    }

    .pizza-piece-box {
      width: clamp(62px, 15vw, 78px) !important; /* تكبير قطع البيتزا على الموبايل لتصبح سهلة اللمس والرؤية */
    }
  }

  @media (max-height: 500px) and (orientation: landscape) {
    .pizza-main-layout {
      flex-direction: row !important;
      gap: 20px !important;
      margin-top: 20px !important;
    }
    .pizza-chef {
      width: 80px !important;
    }
    .pizza-tray-box {
      width: 95px !important;
      height: 80px !important;
    }
    .pizza-pieces-container {
      display: flex !important;
      flex-direction: row !important;
      margin-top: 8px !important;
      margin-bottom: 42px !important;
      padding: 4px 10px !important;
      gap: 10px !important;
    }
    .pizza-piece-box {
      width: 65px !important;
    }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", background: `url(${bgImg}) center/cover`, display: "flex", flexDirection: "column", alignItems: "center", padding: "6px", boxSizing: "border-box", overflow: "hidden", position: "relative" },
  topBar: { width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", zIndex: 10 },
  headerWrapper: { textAlign: "center" },
  titleBg: { background: "rgba(255,255,255,0.95)", padding: "4px 14px", borderRadius: "12px", border: "2px solid #c2410c" },
  title: { fontSize: "20px", color: "#c2410c", margin: 0 },
  statBox: { background: "white", padding: "4px 10px", borderRadius: "8px", fontWeight: "bold", border: "2px solid #c2410c", fontSize: "clamp(12px, 1.8vw, 15px)", boxShadow: "0 2px 5px rgba(0,0,0,0.15)" },
  
  mainLayout: { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "3vw", marginTop: "55px" },
  chef: { width: "clamp(130px, 17vw, 190px)", objectFit: "contain" },
  tray: { width: "clamp(160px, 20vw, 205px)", height: "clamp(140px, 17vw, 175px)", position: "relative", flexShrink: 0 },
  placedPiece: { position: "absolute", width: "42%", display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "none" },
  
  piecesContainer: { background: "rgba(255,255,255,0.85)", borderRadius: "16px", marginTop: "12px", marginBottom: "50px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  pieceBox: { cursor: "grab", position: "relative", textAlign: "center", userSelect: "none" },
  
  pizzaImg: { width: "100%", objectFit: "contain", pointerEvents: "none" },
  pieceText: { position: "absolute", top: "39%", left: "0", right: "0", textAlign: "center", fontWeight: "900", color: "#111", userSelect: "none", pointerEvents: "none" },
  placedText: { position: "absolute", textAlign: "center", fontWeight: "900", color: "#111", userSelect: "none", pointerEvents: "none" },
  
  bottomButtons: { position: "absolute", bottom: "14px", display: "flex", gap: "8px", padding: "2px", zIndex: 10 },
  circleBtn: { width: "clamp(44px, 4.8vw, 52px)", height: "clamp(44px, 4.8vw, 52px)", borderRadius: "50%", border: "none", background: "#c2410c", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(0,0,0,0.3)" },
  
  winOverlay: { position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 },
  winBox: { background: "white", padding: "24px 35px", borderRadius: "18px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" },
  winBtn: { width: "48px", height: "48px", borderRadius: "50%", border: "none", background: "#c2410c", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(0,0,0,0.3)" }
};