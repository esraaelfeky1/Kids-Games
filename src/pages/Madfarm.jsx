// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import farmBG from "../assets/ffr.jpeg";
import mobileBg from "../assets/ffrnm.jpeg"; 
import seedBagImg from "../assets/bb.png";
import treeImg from "../assets/tree2.png";
import roseImg from "../assets/flwor.png";

const successSoundFile = "/sounds/hay1.mp3";

export default function PlantingGame() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [screenType, setScreenType] = useState("desktop"); 
  const [showWinMessage, setShowWinMessage] = useState(false);

  const plotRefs = useRef([]);
  const successSound = useRef(null);

  // =====================================================================================
  // 🎛️ لوحة التحكم اليدوية الكاملة لأماكن الشجر والورد (لكل فئة وتغطي جميع أحجام الأجهزة)
  // =====================================================================================
  const gameConfig = {
    desktop: {
      plotsBottom: "25%",      
      plotsGap: "80px",        
      plantWidth: "160px",
      plantHeight: "160px",
      tolerance: 90,           
      plantOffsets: [
        { left: "-39%", top: "-66px" }, 
        { left: "-36%", top: "-66px" }, 
        { left: "-33%", top: "-67px" }, 
        { left: "-33%", top: "-66px" }  
      ]
    },
    tablet: {
      plotsBottom: "22%", 
      plotsGap: "50px",        
      plantWidth: "150px",
      plantHeight: "130px",
      tolerance: 85,
      plantOffsets: [
        { left: "-70%", top: "-75px" }, 
        { left: "-44%", top: "-75px" }, 
        { left: "-19%", top: "-74px" }, 
        { left: "9%", top: "-75px" }  
      ]
    },
    mobile: {
      plotsBottom: "34%",
      plotsGap: "20px",        
      plantWidth: "95px",
      plantHeight: "95px",
      tolerance: 75,
      plantOffsets: [
        { left: "22%", top: "-35px" },  
        { left: "5%", top: "-35px" },   
        { left: "-10%", top: "-35px" }, 
        { left: "-25%", top: "-35px" }  
      ]
    }
  };

  const initialPlots = [
    { id: 1, targetSeedId: 1, plantType: "rose" },
    { id: 2, targetSeedId: 2, plantType: "tree" },
    { id: 3, targetSeedId: 3, plantType: "rose" },
    { id: 4, targetSeedId: 4, plantType: "tree" },
  ];

  const [plotStates, setPlotStates] = useState(
    initialPlots.map(p => ({ ...p, plant: null }))
  );

  useEffect(() => {
    successSound.current = new Audio(successSoundFile);
    
    const checkScreen = () => {
      const width = window.innerWidth;
      let currentType = "desktop";
      if (width <= 768) {
        currentType = "mobile";
      } else if (width > 768 && width <= 1024) {
        currentType = "tablet";
      }
      setScreenType(currentType);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // ⏱️ إصلاح الـ Timer بحيث يعد تنازلياً بطريقة سليمة وثابتة
  useEffect(() => {
    if (showWinMessage || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWinMessage, timeLeft]);

  const initialSeeds = [
    { id: 1, word: "صَاحَ", isMad: true }, 
    { id: 2, word: "نَامَ", isMad: true },
    { id: 3, word: "بَاب", isMad: true }, 
    { id: 4, word: "تَاج", isMad: true },
    { id: 5, word: "فَارِس", isMad: true },
    { id: 6, word: "دَار", isMad: true },
    { id: 7, word: "تُوت", isMad: false }, 
    { id: 8, word: "قِط", isMad: false },  
  ];

  const [seeds, setSeeds] = useState(initialSeeds);
  const currentConfig = gameConfig[screenType];

  const handleDragEnd = (event, info, seed) => {
    if (showWinMessage) return;
    if (!seed.isMad) return; 

    let matchedPlotIndex = -1;

    plotRefs.current.forEach((ref, index) => {
      if (!ref || plotStates[index]?.plant !== null) return;
      
      const rect = ref.getBoundingClientRect();
      const x = info.point.x;
      const y = info.point.y;
      const tolerance = currentConfig.tolerance; 

      if (
        x >= rect.left - tolerance &&
        x <= rect.right + tolerance &&
        y >= rect.top - tolerance &&
        y <= rect.bottom + tolerance
      ) {
        matchedPlotIndex = index;
      }
    });

    if (matchedPlotIndex !== -1) {
      if (soundEnabled && successSound.current) {
        successSound.current.currentTime = 0;
        successSound.current.play().catch((err) => console.log(err));
      }

      const newPlots = [...plotStates];
      newPlots[matchedPlotIndex].plant = newPlots[matchedPlotIndex].plantType === "rose" ? roseImg : treeImg;
      setPlotStates(newPlots);
      
      const updatedSeeds = seeds.filter((s) => s.id !== seed.id);
      setSeeds(updatedSeeds);
      setScore((prev) => prev + 10);

      const filledCount = newPlots.filter(p => p.plant !== null).length;
      if (filledCount === 4) {
        setTimeout(() => {
          setShowWinMessage(true);
        }, 400);
      }
    }
  };

  const restartGame = () => {
    setShowWinMessage(false);
    setScore(0);
    setTimeLeft(60);
    setPlotStates(initialPlots.map(p => ({ ...p, plant: null })));
    setSeeds(initialSeeds);
  };

  function renderSeed(seed) {
    let bagStyle = styles.bagBoxDesktop;
    let textStyle = styles.txtStyleDesktop;

    if (screenType === 'mobile') {
      bagStyle = styles.bagBoxMobile;
      textStyle = styles.txtStyleMobile;
    } else if (screenType === 'tablet') {
      bagStyle = styles.bagBoxTablet;
      textStyle = styles.txtStyleTablet;
    }

    return (
      <motion.div 
        key={seed.id} 
        drag 
        dragSnapToOrigin 
        dragElastic={0.2}
        onDragEnd={(e, info) => handleDragEnd(e, info, seed)} 
        style={bagStyle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 1.15 }}
      >
        <img src={seedBagImg} style={styles.imgFull} alt="bag" />
        <div style={textStyle}>
          {seed.word}
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ ...styles.gameArea, backgroundImage: `url(${screenType === 'mobile' ? mobileBg : farmBG})` }}>
      
      <div style={styles.headerContainer}>
        <h1 style={styles.gameTitle}>مزرعتي </h1>
      </div>

      <div style={styles.descriptionContainer}>
        <p style={styles.gameDescription}>اسحب كيس المد بالألف للحفره</p>
      </div>

      <div style={styles.scoreBox}>⭐ النقاط: {score}</div>
      <div style={styles.timerBox}>⏳ الوقت: {timeLeft}</div>

      <div style={{ 
        ...styles.plotsContainer, 
        bottom: currentConfig.plotsBottom, 
        gap: currentConfig.plotsGap 
      }}>
        {plotStates.map((plot, index) => {
          const offset = currentConfig.plantOffsets[index];
          return (
            <div 
              key={plot.id} 
              ref={(el) => (plotRefs.current[index] = el)} 
              style={styles.plotZone}
            >
              {plot.plant && (
                <motion.img 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  transition={{ duration: 0.3, type: "spring", stiffness: 220 }}
                  src={plot.plant} 
                  style={{ 
                    position: "absolute",
                    left: offset.left,
                    top: offset.top,
                    width: currentConfig.plantWidth, 
                    height: currentConfig.plantHeight,
                    transform: "translateX(-50%)",
                    zIndex: 6 
                  }} 
                  alt="plant"
                />
              )}
            </div>
          );
        })}
      </div>

      {!showWinMessage && (
        screenType === 'mobile' ? (
          <div style={styles.seedsContainerMobile}>
            <div style={styles.seedRow}>{seeds.slice(0, 4).map(renderSeed)}</div>
            <div style={styles.seedRow}>{seeds.slice(4, 8).map(renderSeed)}</div>
          </div>
        ) : (
          <div style={styles.seedsContainerDesktop}>
            <div style={styles.seedRow}>{seeds.map(renderSeed)}</div>
          </div>
        )
      )}

      {/* نافذة الفوز */}
      <AnimatePresence>
        {showWinMessage && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={styles.winOverlay}
          >
            <div style={styles.winCard}>
              <h2 style={styles.winTitle}>أحسنت يا بطل! 🌟</h2>
              <p style={styles.winScore}>مجموع النتيجة: {score} نقطة</p>
              <div style={styles.winButtons}>
                <button onClick={() => navigate("/home")} title="الرئيسية" style={{ ...styles.winBtn, background: "#4cd137" }}>
                  <Home size={18} />
                </button>
                <button onClick={restartGame} title="إعادة المحاولة" style={{ ...styles.winBtn, background: "#e67e22" }}>
                  <RotateCcw size={18} />
                </button>
                <button onClick={() => navigate(-1)} title="الرجوع" style={{ ...styles.winBtn, background: "#3498db" }}>
                  <ArrowLeft size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.leftButtons}>
        <button onClick={() => navigate("/home")} style={styles.smallBtn}><Home size={20} /></button>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.smallBtn}>
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button onClick={restartGame} style={styles.smallBtn}><RotateCcw size={20} /></button>
        <button onClick={() => navigate(-1)} style={styles.smallBtn}><ArrowLeft size={20} /></button>
      </div>
    </div>
  );
}

const styles = {
  gameArea: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", backgroundSize: "cover", backgroundPosition: "center" },
  
  headerContainer: { position: "absolute", top: "8px", zIndex: 10, textAlign: "center", width: "100%", display: "flex", justifyContent: "center" },
  gameTitle: { color: "#fff", fontSize: "1.1rem", fontWeight: "bold", background: "rgba(0,0,0,0.6)", padding: "3px 15px", borderRadius: "10px", margin: "0" },
  gameDescription: { color: "#0f0e0e", fontSize: "0.9rem", fontWeight: "bold", background: "rgba(250, 247, 247, 0.6)", padding: "3px 15px", borderRadius: "10px", marginTop: "40px" },
  scoreBox: { position: "absolute", top: "12px", left: "20px", background: "rgba(0, 0, 0, 0.6)", color: "#fff", padding: "4px 10px", borderRadius: "10px", fontWeight: "bold", fontSize: "0.85rem", zIndex: 10 },
  timerBox: { position: "absolute", top: "12px", right: "20px", background: "rgba(0, 0, 0, 0.6)", color: "#fff", padding: "4px 10px", borderRadius: "10px", fontWeight: "bold", fontSize: "0.85rem", zIndex: 10 },

  plotsContainer: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    width: "100%",
  },

  plotZone: { 
    position: "relative", 
    width: "90px", 
    height: "55px", 
    zIndex: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  seedsContainerMobile: { 
    position: "absolute", 
    bottom: "15px", 
    width: "100%", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "6px", 
    zIndex: 10 
  },
  seedsContainerDesktop: { position: "absolute", bottom: "12px", width: "100%", display: "flex", justifyContent: "center", zIndex: 10 },
  seedRow: { display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" },
  
  bagBoxMobile: { width: "68px", height: "78px", cursor: "grab", position: "relative", touchAction: "none" },
  bagBoxTablet: { width: "85px", height: "95px", cursor: "grab", position: "relative", touchAction: "none" },
  bagBoxDesktop: { width: "90px", height: "100px", cursor: "grab", position: "relative", touchAction: "none" },

  txtStyleMobile: { textAlign: "center", fontSize: "1.1rem", fontWeight: "900", marginTop: "-50px", color: "#000", textShadow: "0px 1px 2px rgba(255,255,255,0.9)" },
  txtStyleTablet: { textAlign: "center", fontSize: "1.2rem", fontWeight: "900", marginTop: "-60px", color: "#000", textShadow: "0px 1px 2px rgba(255,255,255,0.9)" },
  txtStyleDesktop: { textAlign: "center", fontSize: "1.25rem", fontWeight: "900", marginTop: "-62px", color: "#000", textShadow: "0px 1px 2px rgba(255,255,255,0.9)" },

  imgFull: { width: "100%", height: "100%", objectFit: "contain" },

  winOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
  winCard: { background: "#fff", padding: "20px 25px", borderRadius: "15px", textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.4)", maxWidth: "190px", width: "85%" },
  winTitle: { fontSize: "1.3rem", color: "#27ae60", marginBottom: "8px", fontWeight: "bold" },
  winScore: { fontSize: "1rem", color: "#e67e22", marginBottom: "15px", fontWeight: "bold" },
  winButtons: { display: "flex", gap: "10px", justifyContent: "center" },
  winBtn: { color: "#fff", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 5px rgba(0,0,0,0.2)" },

  leftButtons: { position: "absolute", bottom: 15, left: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 1000 },
  smallBtn: { width: 36, height: 36, borderRadius: "50%", border: "none", background: "#ff9f43", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }
};