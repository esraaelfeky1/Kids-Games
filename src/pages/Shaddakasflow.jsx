// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور ===
import bgImg from "../assets/gardenbg.jpeg";
import boyImg from "../assets/farmerboy.png";
import wateringCanImg from "../assets/wateringcan.png";

// 🌸 صور الزهور (4 مقفولة و 4 مفتوحة)
import flowerClosed1 from "../assets/flowerpinkclosed.png";
import flowerOpen1 from "../assets/flowerpinkopen.png";

import flowerClosed2 from "../assets/flowerorangeclosed.png";
import flowerOpen2 from "../assets/flowerorangeopen.png";

import flowerClosed3 from "../assets/flowerpurpleclosed.png";
import flowerOpen3 from "../assets/flowerpurpleopen.png";

import flowerClosed4 from "../assets/flowerblueclosed.png";
import flowerOpen4 from "../assets/flowerblueopen.png";

const flowerPairs = [
  { closed: flowerClosed1, open: flowerOpen1 },
  { closed: flowerClosed2, open: flowerOpen2 },
  { closed: flowerClosed3, open: flowerOpen3 },
  { closed: flowerClosed4, open: flowerOpen4 },
];

// === 2. مسارات الأصوات ===
const successSoundUrl = "/sounds/hay1.mp3";
const errorSoundUrl = "/sounds/pop.mp3";
const waterSoundUrl = "/sounds/water_pour.mp3";

// === 3. بنك الكلمات ===
const wordsWithShadda = [
  "مُعَلِّمٌ",
  "مُدَرِّسٌ",
  "مُفَكِّرٌ",
  "مُصَمِّمٌ",
  "مُرَتَّبٌ",
  "مُهَذَّبٌ",
  "مُعَطَّرٌ"
];

const wordsWithoutShadda = [
  "مَدْرَسَةٌ", "كِتَابٌ", "قَلَمٌ", "بَابٌ", 
  "شَمْسٌ", "وَلَدٌ", "زَهْرَةٌ", "بُسْتَانٌ", 
  "حَدِيقَةٌ", "طَالِبٌ", "فَصْلٌ", "مَلْعَبٌ"
];

export default function FlowerGardenGame() {
  const navigate = useNavigate();

  const [waterCounts, setWaterCounts] = useState([0, 0, 0, 0]);
  const [permanentlyOpenedFlowers, setPermanentlyOpenedFlowers] = useState([null, null, null, null]);
  const [temporaryOpenIndex, setTemporaryOpenIndex] = useState(null);
  const [temporaryWord, setTemporaryWord] = useState("");

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const [canPosition, setCanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [wateringFlowerIndex, setWateringFlowerIndex] = useState(null);

  const flowerRefs = useRef([]);
  const canRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const audioCtxRef = useRef(null);
  const soundBuffersRef = useRef({ success: null, error: null, water: null });

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtxRef.current = new AudioContext();

    const loadSound = async (url, key) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        if (audioCtxRef.current) {
          const decodedData = await audioCtxRef.current.decodeAudioData(arrayBuffer);
          soundBuffersRef.current[key] = decodedData;
        }
      } catch (e) {
        console.error("Error loading sound:", e);
      }
    };

    loadSound(successSoundUrl, "success");
    loadSound(errorSoundUrl, "error");
    loadSound(waterSoundUrl, "water");
  }, []);

  const playInstantSound = (type) => {
    if (!soundEnabled) return;
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    const buffer = soundBuffersRef.current[type];
    if (buffer && audioCtxRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start(0);
    }
  };

  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  const handlePointerDown = (e) => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - canPosition.x,
      y: e.clientY - canPosition.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setCanPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!canRef.current) {
      setCanPosition({ x: 0, y: 0 });
      return;
    }

    const canRect = canRef.current.getBoundingClientRect();
    const spoutX = canRect.left + canRect.width * 0.2;
    const spoutY = canRect.top + canRect.height * 0.4;

    let pouredOnFlowerIndex = null;

    flowerRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (
          spoutX >= rect.left - 30 &&
          spoutX <= rect.right + 30 &&
          spoutY >= rect.top - 50 &&
          spoutY <= rect.bottom + 50
        ) {
          pouredOnFlowerIndex = index;
        }
      }
    });

    if (pouredOnFlowerIndex !== null) {
      waterFlower(pouredOnFlowerIndex);
    } else {
      setCanPosition({ x: 0, y: 0 });
    }
  };

  const waterFlower = (index) => {
    if (permanentlyOpenedFlowers[index] !== null) {
      setCanPosition({ x: 0, y: 0 });
      return;
    }

    setWateringFlowerIndex(index);
    playInstantSound("water");

    const currentTimes = waterCounts[index] + 1;
    const isSecondTime = currentTimes >= 2;

    let selectedWord = "";
    if (isSecondTime) {
      selectedWord = wordsWithShadda[index % wordsWithShadda.length];
    } else {
      selectedWord = wordsWithoutShadda[index % wordsWithoutShadda.length];
    }

    setTemporaryOpenIndex(index);
    setTemporaryWord(selectedWord);

    setTimeout(() => {
      setWateringFlowerIndex(null);
      setCanPosition({ x: 0, y: 0 });

      const newCounts = [...waterCounts];
      newCounts[index] = currentTimes;
      setWaterCounts(newCounts);

      if (isSecondTime) {
        playInstantSound("success");
        setScore((prev) => prev + 10);

        const nextOpened = [...permanentlyOpenedFlowers];
        nextOpened[index] = selectedWord;
        setPermanentlyOpenedFlowers(nextOpened);
        setTemporaryOpenIndex(null);

        const openedCount = nextOpened.filter((item) => item !== null).length;
        if (openedCount === 4) {
          setTimeout(() => setIsGameOver(true), 1000);
        }
      } else {
        playInstantSound("error");
        setTimeout(() => {
          setTemporaryOpenIndex(null);
        }, 1000);
      }
    }, 900);
  };

  const restartGame = () => {
    setWaterCounts([0, 0, 0, 0]);
    setPermanentlyOpenedFlowers([null, null, null, null]);
    setTemporaryOpenIndex(null);
    setScore(0);
    setTime(0);
    setCanPosition({ x: 0, y: 0 });
    setIsGameOver(false);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللعبة */}
      <img src={bgImg} alt="خلفية الحديقة" style={styles.bgImg} />

      {/* ⏱️ العداد والنتيجة */}
      <div style={styles.topLeftBox}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
      <div style={styles.topRightBox}>⭐ {score}</div>

      {/* العنوان والتوجيهات */}
      <div style={styles.headerContainer}>
        <div style={styles.titleBadge}>
          <h2 style={styles.instructionTitle}>🌸 لعبة حديقة الزهور</h2>
        </div>
        <div style={styles.textBadge}>
          <p style={styles.instructionText}>
            اسقِ الوردة لتكتشف الكلمة التي بها شدة
          </p>
        </div>
      </div>

      {/* حاوية اللعبة العامة */}
      <div className="game-stage">
        
        {/* 👦 صبي الحديقة */}
        <div className="boy-wrapper-fluid">
          <img src={boyImg} alt="صبي الحديقة" style={styles.boyImg} draggable="false" />
        </div>

        {/* 🌸 منطقة الزهور الأربعة (تم ترحيلها للخلف وتقليل المسافات وتكبير الحجم للموبايل) */}
        <div className="flowers-area-fluid">
          {flowerPairs.map((pair, index) => {
            const isPermanentlyOpen = permanentlyOpenedFlowers[index] !== null;
            const isTemporarilyOpen = temporaryOpenIndex === index;
            const isOpen = isPermanentlyOpen || isTemporarilyOpen;

            const wordToDisplay = isPermanentlyOpen 
              ? permanentlyOpenedFlowers[index] 
              : (isTemporarilyOpen ? temporaryWord : "");

            const isBeingWatered = wateringFlowerIndex === index;

            return (
              <div
                key={index}
                ref={(el) => (flowerRefs.current[index] = el)}
                className="flower-wrapper-fluid"
              >
                {isBeingWatered && (
                  <div style={styles.waterStream}>
                    <span className="water-drop d1" />
                    <span className="water-drop d2" />
                    <span className="water-drop d3" />
                  </div>
                )}

                <img
                  src={isOpen ? pair.open : pair.closed}
                  alt="وردة"
                  style={styles.flowerImg}
                  draggable="false"
                />

                {isOpen && (
                  <div className="flower-word-container">
                    <span className="flower-word-text">{wordToDisplay}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 💧 إبريق الري */}
        <div
          ref={canRef}
          className="can-wrapper-fluid"
          style={{
            transform: `translate(${canPosition.x}px, ${canPosition.y}px) ${
              wateringFlowerIndex !== null ? "rotate(-35deg)" : "rotate(0deg)"
            }`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <img
            src={wateringCanImg}
            alt="إبريق الري"
            style={styles.wateringCanImg}
            draggable="false"
          />
        </div>

      </div>

      {/* 🔘 أزرار التحكم السفلية */}
      <div style={styles.controlsBarCenter}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} title="الصوت">
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
        <button onClick={restartGame} style={styles.iconBtn} title="إعادة اللعب">
          <RotateCcw size={24} />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} title="الصفحة الرئيسية">
          <Home size={24} />
        </button>
        <button onClick={() => navigate(-1)} style={styles.iconBtn} title="رجوع للخلف">
          <ArrowRight size={24} />
        </button>
      </div>

      {/* 🏆 شاشة الفوز (خلفية على قد المحتوى تماماً) */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winBox}>
            <Trophy size={32} color="#FFD700" style={{ marginBottom: 4 }} />
            <h2 style={{ color: "#2e7d32", marginBottom: 4, fontSize: "1.2rem", marginTop: 0 }}>أحسنت يا بطل 🏆</h2>

            <div style={styles.finalStats}>
              <p style={{ fontSize: "0.9rem", margin: "2px 0" }}>النتيجة: <strong>{score}</strong></p>
            </div>

            <div style={styles.winActionButtons}>
              <button onClick={restartGame} style={styles.iconBtnSmall} title="المحاولة">
                <RotateCcw size={18} />
              </button>
              <button onClick={() => navigate(-1)} style={styles.iconBtnSmall} title="رجوع للخلف">
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/home")} style={styles.iconBtnSmall} title="الصفحة الرئيسية">
                <Home size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === CSS التجاوب المعدل ===
const responsiveCSS = `
  .game-stage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .game-stage * {
    pointer-events: auto;
  }

  /* 👦 الولد */
  .boy-wrapper-fluid {
    position: absolute;
    bottom: 12%;
    left: 2%;
    width: clamp(110px, 19vw, 200px);
    z-index: 2;
  }

  /* 🌸 منطقة الزهور (تم ترحيلها للخلف قليلاً، وتقليل المسافات، وتكبيرها للموبايل) */
  .flowers-area-fluid {
    position: absolute;
    bottom: 19%;
    right: 1.5%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: clamp(4px, 1.2vw, 18px);
    z-index: 4;
    width: clamp(390px, 88vw, 950px);
  }

  .flower-wrapper-fluid {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: clamp(115px, 23.5vw, 210px);
  }

  /* 💧 إبريق الري */
  .can-wrapper-fluid {
    position: absolute;
    bottom: 10%;
    left: 24%;
    width: clamp(80px, 11vw, 125px);
    z-index: 10;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  /* 🔤 الكلمات داخل الزهور */
  .flower-word-container {
    position: absolute;
    top: 28%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    text-align: center;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flower-word-text {
    font-size: clamp(1.4rem, 4.2vw, 2.7rem);
    font-weight: 700;
    color: #1b4332;
    font-family: 'Traditional Arabic', 'Cairo', sans-serif;
    line-height: 1;
    text-shadow: 0px 2px 4px rgba(255,255,255,0.9);
  }

  .water-drop {
    position: absolute;
    width: 12px;
    height: 16px;
    background: #0080af;
    border-radius: 50%;
    animation: pourWater 0.5s infinite linear;
  }
  .d1 { left: 35%; animation-delay: 0s; }
  .d2 { left: 50%; animation-delay: 0.15s; }
  .d3 { left: 65%; animation-delay: 0.3s; }

  @keyframes pourWater {
    0% { top: -30px; opacity: 1; transform: scaleY(1); }
    100% { top: 25px; opacity: 0; transform: scaleY(1.4); }
  }

  @media (max-height: 500px) {
    .flowers-area-fluid { bottom: 5%; }
    .boy-wrapper-fluid { bottom: 5%; width: 95px; }
    .can-wrapper-fluid { bottom: 5%; width: 75px; }
  }
`;

// === التنسيقات العامة ===
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    backgroundColor: "#2a9d8f",
  },
  bgImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  headerContainer: {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    zIndex: 5,
    maxWidth: "80%",
  },
  titleBadge: {
    background: "linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)",
    padding: "4px 20px",
    borderRadius: "20px",
    border: "2px solid #2e7d32",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  },
  instructionTitle: {
    margin: 0,
    color: "#2e7d32",
    fontSize: "clamp(1rem, 2.2vw, 1.4rem)",
    fontWeight: "bold",
  },
  textBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "4px 14px",
    borderRadius: "12px",
    border: "1px solid #a5d6a7",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  instructionText: {
    margin: 0,
    color: "#1b5e20",
    fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)",
    fontWeight: "700",
  },
  topLeftBox: {
    position: "absolute",
    top: "12px",
    left: "15px",
    zIndex: 5,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "6px 14px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
    color: "#1b5e20",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    pointerEvents: "none",
  },
  topRightBox: {
    position: "absolute",
    top: "12px",
    right: "15px",
    zIndex: 5,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "6px 14px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
    color: "#1b5e20",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    pointerEvents: "none",
  },
  boyImg: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
  flowerImg: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    userSelect: "none",
    pointerEvents: "none",
  },
  waterStream: {
    position: "absolute",
    top: "-15px",
    left: "40%",
    transform: "translateX(-50%)",
    width: "30px",
    height: "50px",
    pointerEvents: "none",
    zIndex: 6,
  },
  wateringCanImg: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    pointerEvents: "none",
  },
  controlsBarCenter: {
    position: "absolute",
    bottom: "15px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px",
    zIndex: 10,
  },
  iconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2px solid #2e7d32",
    padding: "6px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#2e7d32",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnSmall: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2px solid #2e7d32",
    padding: "5px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#2e7d32",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winBox: {
    background: "white",
    padding: "12px 18px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    maxWidth: "220px",
    width: "75%",
  },
  finalStats: {
    background: "#e8f5e9",
    padding: "4px 8px",
    borderRadius: "8px",
    marginBottom: "10px",
    color: "#1b5e20",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "2px",
  },
};