/* eslint-disable react-hooks/refs */
// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, Volume2, VolumeX, ArrowLeft, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// استيراد الملفات (تأكدي من صحة المسارات في مشروعك)
import bgImg from "../assets/dragbg.jpeg";
import greenBox from "../assets/greenbox.png";
import orangeBox from "../assets/orangebox.png";
import blueBox from "../assets/bluebox.png";
import correctSound from "/sounds/hay1.mp3";
import wrongSound from "/sounds/pop.mp3";

const wordsData = [
  { id: 1, text: "قال", type: "alif" }, { id: 2, text: "نور", type: "waw" }, { id: 3, text: "فيل", type: "ya" }, { id: 4, text: "باب", type: "alif" },
  { id: 5, text: "سور", type: "waw" }, { id: 6, text: "تين", type: "ya" }, { id: 7, text: "سماء", type: "alif" }, { id: 8, text: "حوت", type: "waw" },
  { id: 9, text: "صيد", type: "ya" }, { id: 10, text: "كتاب", type: "alif" }, { id: 11, text: "فول", type: "waw" }, { id: 12, text: "عيد", type: "ya" }
];

export default function DragDropGame() {
  const navigate = useNavigate();
  const [placedWords, setPlacedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const boxRefs = { waw: useRef(null), ya: useRef(null), alif: useRef(null) };

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
        if (info.point.x >= boxRect.left && info.point.x <= boxRect.right && info.point.y >= boxRect.top && info.point.y <= boxRect.bottom) {
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

  const isFinished = placedWords.length === wordsData.length;

  return (
    <div style={styles.container}>
      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.statBox}>⭐ {score}</div>
        <div style={styles.headerGroup}>
          <div style={styles.titleBg}><h1 style={styles.header}>فرز المدود</h1></div>
          <div style={styles.subHeaderBg}><p style={styles.subHeader}>اسحب الكلمة للصندوق الصحيح</p></div>
        </div>
        <div style={styles.statBox}><Clock size={16} /> {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
      </div>

      {!isFinished ? (
        <>
          {/* الكلمات للسحب */}
          <div style={styles.gridContainer}>
            {wordsData.map((word) => (
              <motion.div key={word.id} drag dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, word)}
                style={{ ...styles.wordCard, visibility: placedWords.includes(word.id) ? "hidden" : "visible" }}
                whileDrag={{ scale: 1.1, zIndex: 10 }}>{word.text}</motion.div>
            ))}
          </div>
          {/* الصناديق */}
          <div style={styles.fixedBoxesContainer}>
            <div ref={boxRefs.waw} style={{...styles.box, backgroundImage: `url(${greenBox})`}}></div>
            <div ref={boxRefs.ya} style={{...styles.box, backgroundImage: `url(${orangeBox})`}}></div>
            <div ref={boxRefs.alif} style={{...styles.box, backgroundImage: `url(${blueBox})`}}></div>
          </div>
        </>
      ) : (
        /* رسالة الفوز المصغرة */
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <Trophy size={35} color="#FFD700" style={{marginBottom: "5px"}} />
            <h1 style={styles.winTitle}>أحسنتِ!</h1>
            <p style={styles.winText}>مجموع نقاطك: {score}</p>
            <div style={styles.winButtonsHorizontal}>
              <button style={styles.winBtn} onClick={() => window.location.reload()}><RotateCcw size={18} /></button>
              <button style={styles.winBtn} onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
              <button style={styles.winBtn} onClick={() => navigate("/home")}><Home size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {/* أزرار التحكم السفلية */}
      {!isFinished && (
        <div style={styles.bottomButtons}>
          <button style={styles.circleBtn} onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
          <button style={styles.circleBtn} onClick={() => window.location.reload()}><RotateCcw size={20} /></button>
          <button style={styles.circleBtn} onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
          <button style={styles.circleBtn} onClick={() => navigate("/home")}><Home size={20} /></button>
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
    padding: "clamp(8px, 2vw, 15px)", 
    boxSizing: "border-box",
    overflowX: "hidden",
    position: "relative"
  },
  topBar: { 
    width: "100%", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    maxWidth: "700px",
    gap: "5px"
  },
  headerGroup: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "3px",
    flex: 1
  },
  statBox: { 
    background: "rgba(255,255,255,0.9)", 
    padding: "clamp(6px, 1.2vw, 10px) clamp(10px, 1.8vw, 14px)", 
    borderRadius: "10px", 
    fontWeight: "bold", 
    color: "#7b1fa2", 
    border: "2px solid #7b1fa2", 
    fontSize: "clamp(14px, 2vw, 17px)",
    whiteSpace: "nowrap"
  },
  titleBg: { 
    background: "rgba(255,255,255,0.85)", 
    padding: "4px 14px", 
    borderRadius: "12px", 
    marginBottom: "2px" 
  },
  subHeaderBg: { 
    background: "rgba(255,255,255,0.75)", 
    fontWeight: "bold", 
    padding: "4px 10px", 
    borderRadius: "10px" 
  },
  header: { 
    color: "#7b1fa2", 
    fontSize: "clamp(19px, 4.5vw, 26px)", /* تم تكبير حجم الخط ليكون واضحاً ومناسباً للموبايل */
    margin: "0",
    fontWeight: "bold"
  },
  subHeader: { 
    color: "#c46767", 
    fontSize: "clamp(13px, 2.5vw, 16px)", /* تم تكبير النص الفرعي أيضاً قليلاً */
    margin: "0",
    fontWeight: "bold"
  },
  gridContainer: { 
    display: "grid", 
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "clamp(8px, 2vw, 15px)", 
    width: "100%", 
    maxWidth: "480px", 
    marginTop: "clamp(15px, 3vw, 25px)",
    padding: "0 10px",
    boxSizing: "border-box",
    justifyItems: "center"
  },
  wordCard: { 
    background: "white", 
    width: "fit-content", 
    minWidth: "55px", 
    padding: "clamp(6px, 1.5vw, 10px) clamp(12px, 2vw, 18px)", 
    borderRadius: "8px", 
    cursor: "grab", 
    fontSize: "clamp(15px, 2.2vw, 18px)", 
    fontWeight: "bold", 
    textAlign: "center", 
    border: "2px solid #7b1fa2", 
    touchAction: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
  },
  fixedBoxesContainer: { 
    position: "relative", 
    marginTop: "auto",
    marginBottom: "clamp(55px, 8vh, 70px)",
    display: "flex", 
    justifyContent: "center",
    gap: "clamp(10px, 3vw, 25px)", 
    zIndex: 5,
    width: "100%"
  },
  box: { 
    width: "clamp(85px, 18vw, 120px)", 
    height: "clamp(85px, 18vw, 120px)", 
    backgroundSize: "contain", 
    backgroundRepeat: "no-repeat", 
    backgroundPosition: "center" 
  },
  bottomButtons: { 
    position: "absolute", 
    bottom: "8px", 
    display: "flex", 
    gap: "10px", 
    zIndex: 10,
    left: "50%",
    transform: "translateX(-50%)"
  },
  circleBtn: { 
    width: "38px", 
    height: "38px", 
    borderRadius: "50%", 
    border: "none", 
    background: "#7b1fa2", 
    color: "white", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    boxShadow: "0 3px 6px rgba(0,0,0,0.2)"
  },
  winOverlay: { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    background: "rgba(0,0,0,0.7)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 100 
  },
  winBox: { 
    background: "white", 
    padding: "10px", 
    borderRadius: "12px", 
    textAlign: "center", 
    color: "#7b1fa2", 
    width: "75%", 
    maxWidth: "175px" 
  },
  winTitle: { fontSize: "20px", margin: "0 0 5px 0" },
  winText: { fontSize: "14px", fontWeight: "bold", marginBottom: "8px" },
  winButtonsHorizontal: { display: "flex", flexDirection: "row", gap: "8px", justifyContent: "center", marginTop: "5px" },
  winBtn: { width: "35px", height: "35px", borderRadius: "50%", border: "none", background: "#7b1fa2", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
};