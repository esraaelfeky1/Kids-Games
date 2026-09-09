/* eslint-disable react-hooks/refs */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/parrotbg.jpeg";       
import parrotImg from "../assets/parrot2.png";     

export default function ParrotMatchGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [win, setWin] = useState(false);

  // نظام الـ 10 جولات (3 حروف و3 كلمات لكل جولة)
  const [currentLevel, setCurrentLevel] = useState(0); 
  const [letters, setLetters] = useState([]);
  const [items, setItems] = useState([]);

  // حالات التوصيل والسحب
  const [activeStart, setActiveStart] = useState(null); 
  const [connections, setConnections] = useState([]);  
  const [currentLine, setCurrentLine] = useState(null);  

  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const letterRefs = useRef({});
  const itemRefs = useRef({});

  // مراجع الصوتيات مع تحميل مسبق لمنع التأخير الفوري
  const correctAudio = useRef(null);
  const wrongAudio = useRef(null);

  const isMobile = window.innerWidth < 768;

  // قاعدة بيانات الـ 10 مراحل كاملة ومثبتة
  const gameLevels = [
    {
      letters: [{ id: "L1", char: "ث" }, { id: "L2", char: "ذ" }, { id: "L3", char: "ظ" }],
      items: [
        { id: "I1", name: "ثعلب", emoji: "🦊", matchId: "L1" },
        { id: "I2", name: "ذئب", emoji: "🐺", matchId: "L2" },
        { id: "I3", name: "ظرف", emoji: "✉️", matchId: "L3" }
      ]
    },
    {
      letters: [{ id: "L1", char: "ث" }, { id: "L2", char: "ذ" }, { id: "L3", char: "ظ" }],
      items: [
        { id: "I1", name: "ثوب", emoji: "👕", matchId: "L1" },
        { id: "I2", name: "ذرة", emoji: "🌽", matchId: "L2" },
        { id: "I3", name: "نظارة", emoji: "👓", matchId: "L3" }
      ]
    },
    {
      letters: [{ id: "L1", char: "ث" }, { id: "L2", char: "ظ" }, { id: "L3", char: "ث" }],
      items: [
        { id: "I1", name: "ثوم", emoji: "🧄", matchId: "L1" },
        { id: "I2", name: "ظل", emoji: "👤", matchId: "L2" },
        { id: "I3", name: "ثلج", emoji: "❄️", matchId: "L3" },
      ]
    },
    {
      letters: [{ id: "L1", char: "ذ" }, { id: "L2", char: "ث" }, { id: "L3", char: "ظ" }],
      items: [
        { id: "I1", name: "جذر", emoji: "🥕", matchId: "L1" },
        { id: "I3", name: "محفظة", emoji: "👛", matchId: "L3" },
        { id: "I2", name: "ثعبان", emoji: "🐍", matchId: "L2" },
      ]
    },
    {
      letters: [{ id: "L1", char: "ث" }, { id: "L2", char: "ذ" }, { id: "L3", char: "ظ" }],
      items: [
        { id: "I1", name: "مثلث", emoji: "🔺", matchId: "L1"},
        { id: "I2", name: "ذهب", emoji: "💰", matchId: "L2" },
        { id: "I3", name: "عظم", emoji: "🦴", matchId: "L3" }
      ]
    },
    {
      letters: [{ id: "L1", char: "ث" }, { id: "L2", char: "ذ" }, { id: "L3", char: "ظ" }],
      items: [
        { id: "I1", name: "ثلاجة", emoji: "🧊", matchId: "L1" },
        { id: "I2", name: "ذراع", emoji: "💪", matchId: "L2" },
        { id: "I3", name: "ظبي", emoji: "🦌", matchId: "L3" }
      ]
    },
    {
      letters: [{ id: "L1", char: "ث" }, { id: "L2", char: "ذ" }, { id: "L3", char: "ظ" }],
      items: [
        { id: "I1", name: "ثور", emoji: "🐂", matchId: "L1" },
        { id: "I2", name: "قنفذ", emoji: "🦔", matchId: "L2" },
        { id: "I3", name: "منظار", emoji: "🔭", matchId: "L3" }
      ]
    },
    {
      letters: [{ id: "L1", char: "ث" }, { id: "L2", char: "ذ" }, { id: "L3", char: "ظ" }],
      items: [
        { id: "I1", name: "أثاث", emoji: "🪑", matchId: "L1" },
        { id: "I2", name: "حذاء", emoji: "👟", matchId: "L2" },
        { id: "I3", name: "مظلة", emoji: "🌂", matchId: "L3" }
      ]
    }
  ];

  // تهيئة الصوتيات مسبقاً وتخزينها لحل مشكلة تأخر الاستجابة الصوتية
  useEffect(() => {
    correctAudio.current = new Audio("/sounds/hay1.mp3");
    correctAudio.current.preload = "auto";
    wrongAudio.current = new Audio("/sounds/pop.mp3");
    wrongAudio.current.preload = "auto";
  }, []);

  const shuffleItemsOnly = (itemsArray) => {
    let shuffled = [...itemsArray];
    let attempts = 0;
    while (attempts < 20 && (shuffled[0].id === "I1" || shuffled[1].id === "I2" || shuffled[2].id === "I3")) {
      shuffled.sort(() => Math.random() - 0.5);
      attempts++;
    }
    return shuffled;
  };

  const loadLevel = (levelIndex) => {
    if (levelIndex >= gameLevels.length) {
      setWin(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const levelData = gameLevels[levelIndex];
    
    setLetters(levelData.letters);
    setItems(shuffleItemsOnly(levelData.items));
    
    setConnections([]);
    setCurrentLine(null);
    setActiveStart(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLevel(currentLevel);
    
    const preventScrollStyles = () => {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.width = "100vw";
      document.documentElement.style.height = "100vh";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    };
    preventScrollStyles();

    if (!timerRef.current) {
      timerRef.current = setInterval(() => setTime((p) => p + 1), 1000);
    }

    return () => {
      if (currentLevel >= gameLevels.length && timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  useEffect(() => {
    if (connections.length === 3 && connections.length > 0) {
      // eslint-disable-next-line react-hooks/immutability
      playSound(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScore((s) => s + 30);
      
      const nextTimeout = setTimeout(() => {
        if (currentLevel < gameLevels.length - 1) {
          setCurrentLevel((prev) => prev + 1);
        } else {
          setWin(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 1000);

      return () => clearTimeout(nextTimeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections]);

  const playSound = (isCorrect) => {
    if (!soundEnabled) return;
    try {
      const audio = isCorrect ? correctAudio.current : wrongAudio.current;
      if (audio) {
        audio.currentTime = 0; 
        audio.play().catch(err => console.log("Audio play deferred:", err));
      }
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  const getCoords = (type, id) => {
    const el = type === "letter" ? letterRefs.current[id] : itemRefs.current[id];
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };

    const rect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    if (type === "letter") {
      return {
        x: rect.right - cRect.left,
        y: rect.top + rect.height / 2 - cRect.top
      };
    } else {
      return {
        x: rect.left - cRect.left,
        y: rect.top + rect.height / 2 - cRect.top
      };
    }
  };

  const handleStart = (type, id, index, e) => {
    if (win) return;
    if (e.cancelable) e.preventDefault();

    const isConnected = connections.some(c => c.letterId === id || c.itemId === id);
    if (isConnected) return;

    setActiveStart({ type, id, index });
    const startCoords = getCoords(type, id);
    setCurrentLine({ start: startCoords, end: startCoords });
  };

  const handleMove = (e) => {
    if (!activeStart || !currentLine) return;

    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setCurrentLine({
      ...currentLine,
      end: {
        x: clientX - cRect.left,
        y: clientY - cRect.top
      }
    });
  };

  const handleEnd = (targetType, targetId) => {
    if (!activeStart) return;

    if (targetType && activeStart.type !== targetType) {
      const letterId = activeStart.type === "letter" ? activeStart.id : targetId;
      const itemId = activeStart.type === "item" ? activeStart.id : targetId;

      const targetItem = items.find(item => item.id === itemId);

      if (targetItem && targetItem.matchId === letterId) {
        setConnections(p => [...p, { letterId, itemId }]);
      } else {
        playSound(false);
      }
    }

    setActiveStart(null);
    setCurrentLine(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseUp={() => handleEnd(null, null)}
      onTouchEnd={() => handleEnd(null, null)}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        boxSizing: "border-box",
        margin: 0,
        padding: 0
      }}
    >
      <img
        src={bgImg}
        alt="Jungle"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />

      {/* اليافطة العلوية على قد المحتوى بالضبط */}
      <div style={styles.topInstructionBar}>
        <div style={styles.instructionWood}>
          ⭐ صل الحروف بالصور والكلمات الصحيحة
        </div>
      </div>

      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.box}>🚀 {score}</div>
      </div>

      <div style={styles.parrotWrapper}>
        <img src={parrotImg} alt="Parrot" style={styles.parrotImage} />
      </div>

      {/* خطوط الـ SVG للتوصيل */}
      {!win && (
        <svg style={styles.svgOverlay}>
          {connections.map((conn, idx) => {
            const start = getCoords("letter", conn.letterId);
            const end = getCoords("item", conn.itemId);
            return (
              <line
                key={idx}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#22c55e"
                strokeWidth={isMobile ? "6" : "10"}
                strokeLinecap="round"
              />
            );
          })}

          {currentLine && (
            <line
              x1={currentLine.start.x}
              y1={currentLine.start.y}
              x2={currentLine.end.x}
              y2={currentLine.end.y}
              stroke="#f59e0b"
              strokeWidth={isMobile ? "5" : "8"}
              strokeLinecap="round"
            />
          )}
        </svg>
      )}

      {!win && (
        <div style={styles.matchAreaContainer}>
          
          {/* عمود الحروف */}
          <div style={styles.column}>
            {letters.map((letter, idx) => {
              const isDone = connections.some(c => c.letterId === letter.id);
              return (
                <div
                  key={letter.id}
                  ref={(el) => (letterRefs.current[letter.id] = el)}
                  onMouseDown={(e) => handleStart("letter", letter.id, idx, e)}
                  onTouchStart={(e) => handleStart("letter", letter.id, idx, e)}
                  onMouseUp={() => handleEnd("letter", letter.id)}
                  onTouchEnd={() => handleEnd("letter", letter.id)}
                  style={{
                    ...styles.matchNode,
                    background: isDone ? "#dcfce7" : "#ffffff",
                    borderColor: isDone ? "#22c55e" : "#ca8a04",
                    cursor: isDone ? "default" : "grab"
                  }}
                >
                  <span style={styles.letterText}>{letter.char}</span>
                </div>
              );
            })}
          </div>

          {/* عمود الكلمات والصور (الكاردز أصبحت على قد المحتوى من جوه تماماً) */}
          <div style={styles.column}>
            {items.map((item, idx) => {
              const isDone = connections.some(c => c.itemId === item.id);
              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  onMouseDown={(e) => handleStart("item", item.id, idx, e)}
                  onTouchStart={(e) => handleStart("item", item.id, idx, e)}
                  onMouseUp={() => handleEnd("item", item.id)}
                  onTouchEnd={() => handleEnd("item", item.id)}
                  style={{
                    ...styles.matchNode,
                    background: isDone ? "#dcfce7" : "#ffffff",
                    borderColor: isDone ? "#22c55e" : "#ca8a04",
                    cursor: isDone ? "default" : "grab",
                    flexDirection: "column"
                  }}
                >
                  <span style={styles.itemEmoji}>{item.emoji}</span>
                  <span style={styles.itemLabel}>{item.name}</span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 🏆 شاشة الفوز الأصلية */}
      {win && (
        <div style={styles.winModalOverlay}>
          <div style={styles.winModalContent}>
            <h2 style={styles.winTitle}>🎉 أحسنت يابطل 🎉</h2>
            <p style={styles.winScoreText}>لقد جمعت كل النقاط</p>
            <div style={styles.winScoreBox}>⭐ {score} نقطة</div>
          </div>
        </div>
      )}

      {/* أزرار التحكم السفلية الأصلية */}
      <div style={styles.bottomButtons}>
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((p) => !p); }} style={styles.circleBtn}>
          {soundEnabled ? <Volume2 size={isMobile ? 22 : 24} color="white" /> : <VolumeX size={isMobile ? 22 : 24} color="white" />}
        </button>

        <button onClick={(e) => { e.stopPropagation(); setCurrentLevel(0); setScore(0); setTime(0); setWin(false); }} style={styles.circleBtn}>
          <RotateCcw size={isMobile ? 22 : 24} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/AlHorof1"); }} style={styles.circleBtn}>
          <ArrowRight size={isMobile ? 22 : 24} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/home"); }} style={styles.circleBtn}>
          <Home size={isMobile ? 22 : 24} color="white" />
        </button>
      </div>
    </div>
  );
}

/* ===== التنسيقات والستايلات المعدلة لتكون على قد المحتوى تماماً ===== */
const styles = {
  topInstructionBar: {
    position: "absolute",
    top: "2vh",
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    zIndex: 90,
    padding: "0 10px",
    boxSizing: "border-box"
  },
  instructionWood: {
    background: "linear-gradient(135deg, #eab308, #ca8a04)", 
    border: "3px solid #78350f",
    color: "white",
    padding: "6px 18px",
    borderRadius: "16px",
    fontWeight: "bold",
    fontSize: "clamp(14px, 2.8vw, 17px)",
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
    width: "fit-content", // العنوان على قد الكلام بالضبط
  },
  topBar: {
    position: "absolute",
    top: "3vh", 
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 80,
    padding: "0 4vw",
    boxSizing: "border-box",
    pointerEvents: "none" 
  },
  box: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(4px)",
    color: "#14532d", 
    padding: "6px 14px",
    borderRadius: 12,
    fontWeight: "bold",
    fontSize: "clamp(12px, 2.5vw, 16px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    pointerEvents: "auto",
    width: "fit-content" // صندوق الوقت والنقاط على قد محتواه
  },
  parrotWrapper: {
    position: "absolute",
    top: "9vh",
    right: "clamp(300px, 30vw, 100px)",
    width: "clamp(250px, 26vw, 240px)", 
    height: "auto",
    zIndex: 5,
    opacity: 0.85, 
    pointerEvents: "none"
  },
  parrotImage: {
    width: "90%",
    height: "auto",
    objectFit: "contain"
  },
  svgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 40,
    pointerEvents: "none" 
  },
  matchAreaContainer: {
    position: "absolute",
    top: "16vh",
    bottom: "13vh",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
    gap: "clamp(40px, 11vw, 110px)", 
    width: "50%",
    maxWidth: "350px",
    boxSizing: "border-box"
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "90%",
    width: "clamp(70px, 23vw, 150px)",
    gap: "2vh"
  },
  matchNode: {
    width: "100%",
    height: "auto", // الارتفاع أصبح مرن ليناسب المحتوى الداخلي فقط
    minHeight: "60px",
    padding: "10px 8px", // الحشو الداخلي مضبوط تماماً على قد الحرف أو الكلمة والإيموجي
    borderRadius: "22px",
    border: "4px solid #ca8a04",
    boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    userSelect: "none",
    transition: "background-color 0.2s, border-color 0.2s"
  },
  letterText: {
    fontSize: "clamp(32px, 7vh, 50px)",
    fontWeight: "bold",
    color: "#b45309",
    lineHeight: 1
  },
  itemEmoji: {
    fontSize: "clamp(28px, 6vh, 42px)",
    lineHeight: 1
  },
  itemLabel: {
    fontSize: "clamp(16px, 1.6vh, 19px)",
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: "4px"
  },
  
  winModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  winModalContent: {
    background: "linear-gradient(135deg, #ffffff, #f0fdf4)", 
    padding: "20px 15px",
    borderRadius: "24px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    textAlign: "center",
    maxWidth: "50%",
    width: "200px",
    border: "4px solid #4ade80", 
  },
  winTitle: {
    color: "#16a34a",
    margin: "0 0 10px 0",
    fontSize: "clamp(18px, 3.5vh, 24px)",
    fontWeight: "bold"
  },
  winScoreText: {
    color: "#202122",
    margin: "0 0 15px 0",
    fontSize: "16px"
  },
  winScoreBox: {
    background: "#fef08a",
    color: "#854d0e",
    padding: "5px 15px",
    borderRadius: "15px",
    display: "inline-block",
    fontWeight: "bold",
    fontSize: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  bottomButtons: {
    position: "absolute",
    bottom: "2.5vh", 
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: window.innerWidth < 768 ? 14 : 20,
    zIndex: 3000,
  },
  circleBtn: {
    width: window.innerWidth < 768 ? 44 : 52, 
    height: window.innerWidth < 768 ? 44 : 52,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)",
    background: "linear-gradient(135deg, #15803d, #166534)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(0,0,0,0.3)",
    touchAction: "manipulation"
  }
};