/* eslint-disable react-hooks/set-state-in-effect */

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Home, 
  ArrowRight, 
  Trophy,
  BookOpen,
  Pencil,
  Home as HomeIcon,
  User,
  Trees,
  Car,
  Flower2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// استيراد الصور الخاصة بك
import bgImg from "../assets/22bg.jpeg";          // صورة الخلفية
import girlImg from "../assets/nest11.png";        // صورة البنت

// استيراد 3 صور مختلفة للبازل لكل نوع قطعة
import puzzleLeftImg from "../assets/23z1.png";    // 1. صورة القطعة الأولى (بداية الكلمة)
import puzzleMiddleImg from "../assets/pz22.png";  // 2. صورة القطعة الوسطانية (في النص)
import puzzleRightImg from "../assets/ppz1.png";   // 3. صورة القطعة الأخيرة (نهاية الكلمة)

// الأصوات
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

// دالة لتحديد صورة القطعة المناسبة
const getPieceImage = (type) => {
  if (type === "left") return puzzleLeftImg;
  if (type === "middle") return puzzleMiddleImg;
  return puzzleRightImg;
};

// قائمة الكلمات الـ 7 مع الأيقونات
const puzzleWords = [
  {
    id: 1,
    word: "كِتَابًا",
    icon: <BookOpen size={85} color="#4A148C" />,
    pieces: [
      { id: "p1", char: "كِ", type: "left" },   
      { id: "p2", char: "تَا", type: "middle" }, 
      { id: "p3", char: "بًـا", type: "right" }, 
    ],
  },
  {
    id: 2,
    word: "قَلَمًا",
    icon: <Pencil size={85} color="#E91E63" />,
    pieces: [
      { id: "p1", char: "قَ", type: "left" },
      { id: "p2", char: "لَ", type: "middle" },
      { id: "p3", char: "مًـا", type: "right" },
    ],
  },
  {
    id: 3,
    word: "بَيْتًا",
    icon: <HomeIcon size={85} color="#1E88E5" />,
    pieces: [
      { id: "p1", char: "بَ", type: "left" },
      { id: "p2", char: "يْ", type: "middle" },
      { id: "p3", char: "تًـا", type: "right" },
    ],
  },
  {
    id: 4,
    word: "وَلَدًا",
    icon: <User size={85} color="#FB8C00" />,
    pieces: [
      { id: "p1", char: "وَ", type: "left" },
      { id: "p2", char: "لَ", type: "middle" },
      { id: "p3", char: "دًاع", type: "right" },
    ],
  },
  {
    id: 5,
    word: "شَجَرَةً",
    icon: <Trees size={85} color="#43A047" />,
    pieces: [
      { id: "p1", char: "شَ", type: "left" },
      { id: "p2", char: "جَ", type: "middle" },
      { id: "p3", char: "رَةً", type: "right" },
    ],
  },
  {
    id: 6,
    word: "سَيَّارَةً",
    icon: <Car size={85} color="#E53935" />,
    pieces: [
      { id: "p1", char: "سَيَّـ", type: "left" },
      { id: "p2", char: "ـارَةً", type: "right" },
    ],
  },
  {
    id: 7,
    word: "زَهْرَةً",
    icon: <Flower2 size={85} color="#D81B60" />,
    pieces: [
      { id: "p1", char: "زَهْـ", type: "left" },
      { id: "p2", char: "ـرَةً", type: "right" },
    ],
  }
];

export default function PuzzleGame() {
  const navigate = useNavigate();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [placedPieces, setPlacedPieces] = useState({}); 
  const [shuffledPieces, setShuffledPieces] = useState([]); 
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));
  const slotRefs = useRef([]);

  const currentWord = puzzleWords[currentWordIndex];
  const isWordCompleted = currentWord && Object.keys(placedPieces).length === currentWord.pieces.length;

  // العداد
  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  // خلط القطع عند بداية كل كلمة
  useEffect(() => {
    if (currentWord) {
      const shuffled = [...currentWord.pieces].sort(() => Math.random() - 0.5);
      setShuffledPieces(shuffled);
      setPlacedPieces({});
      slotRefs.current = slotRefs.current.slice(0, currentWord.pieces.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  // الفوز أو الانتقال
  useEffect(() => {
    if (isWordCompleted) {
      const timer = setTimeout(() => {
        if (currentWordIndex + 1 < puzzleWords.length) {
          setCurrentWordIndex((prev) => prev + 1);
        } else {
          setIsGameOver(true);
        }
      }, 1800); 

      return () => clearTimeout(timer);
    }
  }, [isWordCompleted, currentWordIndex]);

  // منطق السحب والإسقاط
  const handleDragEnd = (event, info, piece) => {
    let placedCorrectly = false;

    currentWord.pieces.forEach((targetPiece, index) => {
      const slotElem = slotRefs.current[index];
      if (slotElem) {
        const rect = slotElem.getBoundingClientRect();
        if (
          info.point.x >= rect.left &&
          info.point.x <= rect.right &&
          info.point.y >= rect.top &&
          info.point.y <= rect.bottom
        ) {
          if (targetPiece.id === piece.id && !placedPieces[index]) {
            if (soundEnabled) successAudio.current.play();
            setPlacedPieces((prev) => ({ ...prev, [index]: piece }));
            setShuffledPieces((prev) => prev.filter((p) => p.id !== piece.id));
            setScore((s) => s + 10);
            placedCorrectly = true;
          }
        }
      }
    });

    if (!placedCorrectly) {
      if (soundEnabled) errorAudio.current.play();
    }
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللعبة */}
      <img src={bgImg} alt="الخلفية" style={styles.bg} />

      {/* نافذة الفوز النهائي */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.overlay}>
            <div style={styles.winBox}>
              <div style={styles.winContent}>
                <Trophy size={50} color="#FFD700" />
                <h1 style={{ margin: "10px 0", fontSize: "22px", color: "#333" }}>أحسنت بطل البازل!</h1>
                <p style={{ fontSize: "16px", margin: "5px 0" }}>لقد كونت كل كلمات التنوين بالفتح الـ 7 بنجاح 🎉</p>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4CAF50" }}>النتيجة: {score}</p>
              </div>

              <div style={styles.resultButtons}>
                <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={24}/></button>
                <button onClick={() => navigate("/Tanween")} style={styles.circleBtn}><ArrowRight size={24}/></button>
                <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الشريط العلوي */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        {/* العنوان */}
        <div style={styles.headerWrapper}>
          <div style={styles.mainTitleBox} className="main-title-text">لعبة البازل</div>
          <div style={styles.subTitleBox} className="sub-title-text">اجمع القطع لتكوين الكلمة التي بها تنوين الفتح</div>
        </div>

        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* منطقة اللعب الرئيسية */}
      <div style={styles.gameArea} className="puzzle-game-area">
        
        {/* صورة البنت */}
        <div style={styles.girlContainer} className="puzzle-girl">
          <img src={girlImg} alt="شخصية البنت" style={styles.girlImg} />
        </div>

        {/* المربع الرئيسي */}
        <div style={styles.mainBoard} className="puzzle-board">
          {/* الأيقونة */}
          <div style={styles.imageBox} className="mobile-img-box">
            <motion.div 
              key={currentWord.id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentWord.icon}
            </motion.div>
          </div>

          {/* أماكن تركيب البازل */}
          <motion.div 
            style={styles.slotsRow}
            animate={isWordCompleted ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="puzzle-slots-row"
          >
            {currentWord.pieces.map((piece, index) => {
              const isPlaced = !!placedPieces[index];
              return (
                <motion.div
                  key={index}
                  ref={(el) => (slotRefs.current[index] = el)}
                  style={styles.puzzleSlot}
                  animate={{
                    marginLeft: isWordCompleted ? "-14px" : "6px",
                    marginRight: isWordCompleted ? "-14px" : "6px"
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 16 }}
                  className="mobile-puzzle-slot"
                >
                  <img 
                    src={getPieceImage(piece.type)} 
                    alt="بازل" 
                    style={{
                      ...styles.slotBgImage,
                      opacity: isPlaced ? 1 : 0.55,
                      filter: isPlaced ? "none" : "brightness(0.95)"
                    }} 
                  />

                  {isPlaced && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.placedPieceText}>
                      {placedPieces[index].char}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* اللوحة الجانبية (قطع البازل) */}
        <div style={styles.sidebar} className="puzzle-sidebar">
          <div style={styles.sidebarHeader} className="mobile-sidebar-header">قطع البازل</div>
          <div style={styles.piecesContainer} className="pieces-row">
            {shuffledPieces.map((piece) => (
              <motion.div
                key={piece.id}
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(e, info, piece)}
                whileDrag={{ zIndex: 999999, scale: 1.25 }}
                style={styles.puzzlePieceWrapper}
                className="mobile-piece-wrapper"
              >
                <img 
                  src={getPieceImage(piece.type)} 
                  alt="قطعة بازل" 
                  style={styles.pieceBgImage} 
                />
                <span style={styles.pieceText}>{piece.char}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* الأزرار السفلية */}
      <div style={styles.bottomSection} className="bottom-section-mobile">
        <div style={styles.buttonsContainer}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={24}/></button>
          <button onClick={() => navigate("/Nunation")} style={styles.circleBtn}><ArrowRight size={24}/></button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={24}/></button>
        </div>
      </div>

    </div>
  );
}

// تعديلات CSS الاستجابية
const responsiveCSS = `
  .main-title-text {
    font-size: clamp(20px, 2.5vw, 26px) !important;
  }
  .sub-title-text {
    font-size: clamp(14px, 1.5vw, 16px) !important;
  }

  .puzzle-sidebar, .puzzle-board, .pieces-row {
    overflow: visible !important;
  }

  @media (max-width: 850px) {
    .puzzle-game-area {
      flex-direction: column !important;
      top: 48% !important;
      gap: 6px !important;
    }

    .puzzle-girl {
      position: absolute !important;
      bottom: -130px !important;
      left: 10px !important;
      width: 170px !important;
      max-width: none !important;
      transform: none !important;
      align-self: auto !important;
      z-index: 20 !important;
    }
    .puzzle-girl img {
      max-height: 260px !important;
    }
    
    .puzzle-board {
      width: 85vw !important;
      max-width: 310px !important;
      height: 200px !important;
      padding: 6px 8px !important;
      border-width: 3px !important;
    }

    /* تنزيل الأيقونة لتحت وتصغيرها على الموبايل */
    .mobile-img-box {
      height: 65px !important;
      margin-top: 15px !important; /* نزول الأيقونة لتحت */
      display: flex !important;
      align-items: flex-end !important; /* محاذاة لأسفل الحاوية */
    }
    .mobile-img-box svg {
      width: 55px !important;
      height: 55px !important;
    }

    .mobile-puzzle-slot {
      width: 75px !important;
      height: 75px !important;
    }

    .mobile-piece-wrapper {
      width: 65px !important;
      height: 65px !important;
    }

    .puzzle-slots-row {
      margin-bottom: 10px !important;
    }

    .puzzle-sidebar {
      width: 90vw !important;
      max-width: 310px !important;
      height: auto !important;
      padding: 6px 8px !important;
      border-width: 3px !important;
    }

    .mobile-sidebar-header {
      font-size: 18px !important;
      padding: 2px 6px !important;
      margin-bottom: 4px !important;
      width: auto !important;
    }

    .pieces-row {
      flex-direction: row !important;
      justify-content: center !important;
      gap: 6px !important;
    }

    .bottom-section-mobile {
      bottom: 8px !important;
    }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif" },
  bg: { position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: -1 },
  
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999999 },
  winBox: { background: "white", padding: "20px", borderRadius: "20px", textAlign: "center", width: "90%", maxWidth: "320px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  winContent: { marginBottom: "15px" },
  resultButtons: { display: "flex", gap: "12px", justifyContent: "center" },

  topBar: { position: "absolute", top: "10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", boxSizing: "border-box", zIndex: 10, alignItems: "flex-start" },
  box: { background: "white", padding: "6px 14px", borderRadius: 12, fontWeight: "bold", fontSize: "clamp(15px, 2vw, 18px)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)", color: "#333" },
  
  headerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
  mainTitleBox: { background: "#ffffffee", padding: "4px 22px", borderRadius: "15px", border: "2px solid #6A1B9A", color: "#4A148C", fontWeight: "900", boxShadow: "0 3px 6px rgba(0,0,0,0.12)" },
  subTitleBox: { background: "#ffffffee", padding: "3px 16px", borderRadius: "12px", border: "2px solid #E91E63", color: "#D81B60", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },

  gameArea: { position: "absolute", top: "54%", left: "50%", transform: "translate(-50%, -45%)", display: "flex", alignItems: "center", gap: "clamp(15px, 2.5vw, 30px)", width: "95%", maxWidth: "850px", justifyContent: "center" },
  
  girlContainer: { width: "clamp(120px, 15vw, 170px)", display: "flex", justifyContent: "center", alignSelf: "flex-end", transform: "translateY(35px)" },
  girlImg: { width: "100%", maxHeight: "280px", objectFit: "contain" },

  mainBoard: { background: "#ffffffea", border: "4px solid #8E24AA", borderRadius: "25px", padding: "10px 12px 12px 12px", width: "340px", height: "270px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
  
  imageBox: { width: "100%", height: "90px", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px" },

  slotsRow: { display: "flex", width: "100%", height: "100px", justifyContent: "center", alignItems: "center", marginBottom: "5px" },
  puzzleSlot: { width: "88px", height: "88px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  slotBgImage: { width: "100%", height: "100%", objectFit: "contain", transition: "all 0.3s ease" },
  
  placedPieceText: { position: "absolute", fontSize: "38px", fontWeight: "900", color: "#311B92", fontFamily: "'Traditional Arabic', 'Cairo', sans-serif", textShadow: "0.5px 0.5px 0px #000, -0.5px -0.5px 0px #000" },

  sidebar: { background: "#ffffffea", border: "3px solid #7B1FA2", borderRadius: "20px", width: "130px", height: "270px", padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 6px 15px rgba(0,0,0,0.15)" },
  sidebarHeader: { background: "#7B1FA2", color: "white", padding: "4px 8px", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", marginBottom: "10px", width: "90%", textAlign: "center" },
  piecesContainer: { display: "flex", flexDirection: "column", gap: "8px", width: "100%", alignItems: "center" },

  puzzlePieceWrapper: { width: "70px", height: "70px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", touchAction: "none", zIndex: 5 },
  pieceBgImage: { width: "100%", height: "100%", objectFit: "contain", position: "absolute" },
  pieceText: { position: "absolute", fontSize: "30px", fontWeight: "900", fontFamily: "'Traditional Arabic', 'Cairo', sans-serif", color: "#070707", pointerEvents: "none", userSelect: "none" },

  bottomSection: { position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 10 },
  buttonsContainer: { display: "flex", gap: "12px" },
  circleBtn: { width: "clamp(36px, 4vw, 46px)", height: "clamp(36px, 4vw, 46px)", borderRadius: "50%", border: "none", background: "#7B1FA2", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }
};