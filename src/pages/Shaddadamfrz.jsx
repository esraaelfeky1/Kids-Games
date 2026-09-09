/* eslint-disable react-hooks/refs */
// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, Volume2, VolumeX, ArrowLeft, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// استيراد الملفات
import bgImg from "../assets/dragbg.jpeg";
import greenBox from "../assets/sw.png";
import orangeBox from "../assets/ws.png";
import blueBox from "../assets/66.png";
import correctSound from "/sounds/hay1.mp3";
import wrongSound from "/sounds/pop.mp3";

const initialWordsData = [
  { id: 1, text: "سَلَّمَ", type: "shaddah_fatha" },
  { id: 2, text: "مُعَلِّم", type: "shaddah_kasra" },
  { id: 3, text: "يُحِبُّ", type: "shaddah_damma" },
  { id: 4, text: "شَرَّفَ", type: "shaddah_fatha" },
  { id: 5, text: "مُفَكِّر", type: "shaddah_kasra" },
  { id: 6, text: "يَشُدُّ", type: "shaddah_damma" },
  { id: 7, text: "عَلَّمَ", type: "shaddah_fatha" },
  { id: 8, text: "مُدَرِّب", type: "shaddah_kasra" },
  { id: 9, text: "يَعُدُّ", type: "shaddah_damma" },
  { id: 10, text: "صَدَّقَ", type: "shaddah_fatha" },
  { id: 11, text: "مُسَجِّل", type: "shaddah_kasra" },
  { id: 12, text: "يُرُدُّ", type: "shaddah_damma" }
];

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function DragDropGame() {
  const navigate = useNavigate();
  const [wordsData, setWordsData] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWordsData(shuffleArray(initialWordsData));
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const boxRefs = { 
    shaddah_fatha: useRef(null), 
    shaddah_kasra: useRef(null), 
    shaddah_damma: useRef(null) 
  };

  const playSound = (isCorrect) => {
    if (!isMuted) {
      const audio = new Audio(isCorrect ? correctSound : wrongSound);
      audio.play().catch(e => console.log("Audio play error:", e));
    }
  };

  const handleDragEnd = (event, info, word) => {
    Object.keys(boxRefs).forEach((key) => {
      const box = boxRefs[key].current;
      if (box) {
        const boxRect = box.getBoundingClientRect();
        if (
          info.point.x >= boxRect.left && 
          info.point.x <= boxRect.right && 
          info.point.y >= boxRect.top && 
          info.point.y <= boxRect.bottom
        ) {
          if (word.type === key) {
            playSound(true);
            setPlacedWords((prev) => [...prev, word.id]);
            setScore((s) => s + 10);
          } else {
            playSound(false);
          }
        }
      }
    });
  };

  const isFinished = wordsData.length > 0 && placedWords.length === wordsData.length;

  return (
    <div style={styles.container}>
      <style>
        {`
          @media (max-width: 1024px) {
            .mobile-word-card {
              font-size: 20px !important;
              padding: 3px 10px !important;
            }
          }
          @media (max-width: 600px) {
            .mobile-word-card {
              font-weight: 700 !important;
              font-size: 19px !important;
              padding: 2px 8px !important;
            }
            .mobile-main-header {
              font-size: 22px !important;
            }
            .mobile-sub-header {
              font-size: 13px !important;
            }
          }
        `}
      </style>

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.statBox}>⭐ {score}</div>
        
        <div style={styles.headerGroup}>
          <div style={styles.titleBg}>
            <h1 className="mobile-main-header" style={styles.header}>فرز الشدّة</h1>
          </div>
          <div style={styles.subHeaderBg}>
            <p className="mobile-sub-header" style={styles.subHeader}>اسحب الكلمة للصندوق الصحيح</p>
          </div>
        </div>

        <div style={styles.statBox}>
          <Clock size={15} /> {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
        </div>
      </div>

      {!isFinished ? (
        <>
          {/* شبكة الكلمات (تم إنزالها للأسفل بإضافة marginTop أكبر) */}
          <div style={styles.gridContainer}>
            {wordsData.map((word) => (
              <motion.div
                key={word.id}
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(e, info, word)}
                className="mobile-word-card"
                style={{
                  ...styles.wordCard,
                  visibility: placedWords.includes(word.id) ? "hidden" : "visible"
                }}
                whileDrag={{ scale: 1.15, zIndex: 100 }}
              >
                {word.text}
              </motion.div>
            ))}
          </div>

          {/* الصناديق الثلاثة (تم إنزالها للأسفل بزيادة الـ bottom) */}
          <div style={styles.fixedBoxesContainer}>
            <div ref={boxRefs.shaddah_fatha} style={{ ...styles.box, backgroundImage: `url(${greenBox})` }}></div>
            <div ref={boxRefs.shaddah_kasra} style={{ ...styles.box, backgroundImage: `url(${orangeBox})` }}></div>
            <div ref={boxRefs.shaddah_damma} style={{ ...styles.box, backgroundImage: `url(${blueBox})` }}></div>
          </div>
        </>
      ) : (
        /* شاشة الفوز */
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <Trophy size={48} color="#FFD700" style={{ marginBottom: "10px", margin: "0 auto" }} />
            <h1 style={styles.winTitle}>أحسنتِ!</h1>
            <p style={styles.winText}>مجموع نقاطك: {score}</p>
            <div style={styles.winButtonsHorizontal}>
              <button style={styles.winBtn} onClick={() => window.location.reload()}><RotateCcw size={20} style={styles.iconStyle} /></button>
              <button style={styles.winBtn} onClick={() => navigate("/Shadda")}><ArrowLeft size={20} style={styles.iconStyle} /></button>
              <button style={styles.winBtn} onClick={() => navigate("/home")}><Home size={20} style={styles.iconStyle} /></button>
            </div>
          </div>
        </div>
      )}

      {/* الأزرار السفلية */}
      {!isFinished && (
        <div style={styles.bottomButtons}>
          <button style={styles.circleBtn} onClick={() => navigate("/Shadda")}>
            <ArrowLeft size={19} style={styles.iconStyle} />
          </button>
          <button style={styles.circleBtn} onClick={() => window.location.reload()}>
            <RotateCcw size={19} style={styles.iconStyle} />
          </button>
          <button style={styles.circleBtn} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={19} style={styles.iconStyle} /> : <Volume2 size={19} style={styles.iconStyle} />}
          </button>
          <button style={styles.circleBtn} onClick={() => navigate("/home")}>
            <Home size={19} style={styles.iconStyle} />
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: `url(${bgImg}) center/cover`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px",
    boxSizing: "border-box",
    overflowX: "hidden",
    position: "relative"
  },
  
  topBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "95%",
    padding: "0 5px",
    boxSizing: "border-box",
    direction: "rtl"
  },
  headerGroup: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "3px",
    textAlign: "center",
    flex: 1
  },
  statBox: {
    background: "rgba(255,255,255,0.9)",
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "bold",
    color: "#7b1fa2",
    border: "2px solid #7b1fa2",
    fontSize: "clamp(12px, 1.8vw, 15px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px"
  },
  titleBg: { background: "rgba(255,255,255,0.85)", padding: "2px 14px", borderRadius: "8px" },
  subHeaderBg: { background: "rgba(255,255,255,0.7)", fontWeight: "bold", padding: "3px 10px", borderRadius: "8px" },
  header: { color: "#7b1fa2", fontSize: "clamp(18px, 2.8vw, 26px)", margin: "0" },
  subHeader: { color: "#c46767", fontSize: "clamp(13px, 1.6vw, 15px)", margin: "0" },
  
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, auto)",
    gap: "10px 14px",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "550px",
    marginTop: "50px" // تم إنزال شبكة الكلمات للأسفل لتكون بعيدة عن العنوان
  },
  
  wordCard: {
    background: "white",
    width: "fit-content",
    padding: "3px 10px",
    borderRadius: "8px",
    cursor: "grab",
    fontSize: "clamp(20px, 2.2vw, 28px)",
    fontWeight: "600",
    textAlign: "center",
    border: "2px solid #7b1fa2",
    boxShadow: "0 3px 6px rgba(0,0,0,0.12)",
    touchAction: "none",
    boxSizing: "border-box",
    lineHeight: "1.2",
    whiteSpace: "nowrap"
  },

  fixedBoxesContainer: {
    position: "fixed",
    bottom: "85px", // تم إنزال الصناديق السفلية للأسفل بشكل مريح
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "clamp(8px, 2.5vw, 16px)",
    width: "auto",
    zIndex: 40
  },
  box: {
    width: "clamp(90px, 22vw, 120px)",
    height: "clamp(90px, 22vw, 120px)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    transition: "transform 0.2s"
  },

  bottomButtons: { 
    position: "fixed", 
    bottom: "20px", 
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex", 
    justifyContent: "center",
    alignItems: "center",
    gap: "12px", 
    zIndex: 50,
    direction: "ltr"
  },
  circleBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "#7b1fa2",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    margin: "0",
    boxShadow: "0 3px 6px rgba(0,0,0,0.3)"
  },
  iconStyle: {
    display: "block",
    margin: "auto"
  },

  winOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    direction: "rtl"
  },
  winBox: {
    background: "white",
    padding: "24px 20px",
    borderRadius: "18px",
    textAlign: "center",
    color: "#7b1fa2",
    width: "30%",
    maxWidth: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    margin: "auto"
  },
  winTitle: { fontSize: "25px", margin: "0 0 5px 0", fontWeight: "bold" },
  winText: { fontSize: "16px", fontWeight: "bold", marginBottom: "15px" },
  winButtonsHorizontal: { display: "flex", flexDirection: "row", gap: "12px", justifyContent: "center", direction: "ltr" },
  winBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "#7b1fa2",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 3px 6px rgba(0,0,0,0.3)"
  }
};