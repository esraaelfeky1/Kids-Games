// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد الصور ===
import bgImg from "../assets/ffbg.jpeg";
import dolphinImg from "../assets/dolphin.png";

import fish1 from "../assets/bubblefish1.png";
import fish2 from "../assets/bubblefish2.png";
import fish3 from "../assets/bubblefish3.png";
import fish4 from "../assets/bubblefish4.png";
import fish5 from "../assets/bubblefish5.png";
import fish6 from "../assets/bubblefish6.png";
import fish7 from "../assets/bubblefish7.png";

const bubbleFishImages = [fish1, fish2, fish3, fish4, fish5, fish6, fish7];

// === 2. مسارات الأصوات ===
const successSoundUrl = "/sounds/hay1.mp3";
const errorSoundUrl = "/sounds/pop.mp3";

// === 3. بنك الأسئلة ===
const gameQuestions = [
  { id: 1, correct: "مُعَلِّمٌ", wrong: ["مَدْرَسَةٌ", "طَالِبٌ"] },
  { id: 2, correct: "مُفَكِّرٌ", wrong: ["قَلَمٌ", "كِتَابٌ"] },
  { id: 3, correct: "مُدَرِّسٌ", wrong: ["صَفٌّ", "وَلَدٌ"] },
  { id: 4, correct: "مُصَمِّمٌ", wrong: ["لَوْحَةٌ", "أَلْوَانٌ"] },
  { id: 5, correct: "مُرَبِّي", wrong: ["أُمٌّ", "أَبٌ"] },
  { id: 6, correct: "مُغَنِّي", wrong: ["صَوْتٌ", "لَحْنٌ"] },
  { id: 7, correct: "مُدَرِّبٌ", wrong: ["كُرَةٌ", "لَاعِبٌ"] },
];

export default function DolphinFeederGame() {
  const navigate = useNavigate();

  const [currentRound, setCurrentRound] = useState(0);
  const [displayedChoices, setDisplayedChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const dolphinRef = useRef(null);

  // 🔊 إعداد Web Audio API لتشغيل فوري 100% بدون أي تأخير
  const audioCtxRef = useRef(null);
  const soundBuffersRef = useRef({ success: null, error: null });

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtxRef.current = new AudioContext();
    }

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
    if (currentRound < gameQuestions.length) {
      const question = gameQuestions[currentRound];
      const shuffledImages = [...bubbleFishImages].sort(() => Math.random() - 0.5);

      const rawChoices = [
        { id: "correct", word: question.correct, isCorrect: true },
        { id: "wrong-1", word: question.wrong[0], isCorrect: false },
        { id: "wrong-2", word: question.wrong[1], isCorrect: false },
      ];

      for (let i = rawChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rawChoices[i], rawChoices[j]] = [rawChoices[j], rawChoices[i]];
      }

      const choicesWithData = rawChoices.map((choice, index) => ({
        ...choice,
        visible: true,
        imgSrc: shuffledImages[index % shuffledImages.length],
        isMiddle: index === 1,
      }));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedChoices(choicesWithData);
    } else {
      setIsGameOver(true);
    }
  }, [currentRound]);

  useEffect(() => {
    if (isGameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isGameOver]);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [positions, setPositions] = useState({});

  const handlePointerDown = (e, index) => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    e.target.setPointerCapture(e.pointerId);
    setDraggedIndex(index);
  };

  const handlePointerMove = (e, index) => {
    if (draggedIndex !== index) return;
    setPositions((prev) => ({
      ...prev,
      [index]: {
        x: (prev[index]?.x || 0) + e.movementX,
        y: (prev[index]?.y || 0) + e.movementY,
      },
    }));
  };

  const handlePointerUp = (e, index, isCorrect) => {
    if (draggedIndex !== index) return;
    setDraggedIndex(null);

    if (!dolphinRef.current) {
      playInstantSound("error");
      resetPosition(index);
      return;
    }

    const dolphinRect = dolphinRef.current.getBoundingClientRect();
    const dropX = e.clientX;
    const dropY = e.clientY;

    const isOverDolphin =
      dropX >= dolphinRect.left &&
      dropX <= dolphinRect.right &&
      dropY >= dolphinRect.top &&
      dropY <= dolphinRect.bottom;

    if (isOverDolphin && isCorrect) {
      playInstantSound("success");

      setScore((prev) => prev + 10);
      setDisplayedChoices((prev) =>
        prev.map((choice, i) => (i === index ? { ...choice, visible: false } : choice))
      );

      setTimeout(() => {
        setPositions({});
        setCurrentRound((prev) => prev + 1);
      }, 300);
    } else {
      playInstantSound("error");
      resetPosition(index);
    }
  };

  const resetPosition = (index) => {
    setPositions((prev) => ({
      ...prev,
      [index]: { x: 0, y: 0 },
    }));
  };

  const restartGame = () => {
    setCurrentRound(0);
    setScore(0);
    setTime(0);
    setPositions({});
    setIsGameOver(false);
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللعبة */}
      <img src={bgImg} alt="خلفية اللعبة" style={styles.bgImg} />

      {/* الشريط العلوي */}
      <div style={styles.topBar} className="top-bar-responsive">
        <div style={styles.box} className="box-responsive">⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.box} className="box-responsive">⭐ {score}</div>
      </div>

      {/* العنوان والفقرة */}
      <div style={styles.headerContainer} className="header-container-responsive">
        <div style={styles.titleBadge} className="title-badge-responsive">
          <h2 style={styles.instructionTitle} className="instruction-title-responsive">🐬 لعبة إطعام الدولفين</h2>
        </div>
        <div style={styles.textBadge} className="text-badge-responsive">
          <p style={styles.instructionText} className="instruction-text-responsive">
            أطعم الدولفين السمكة التي بها <strong>(شَدَّة وَكَسْرَة ِّ)</strong>!
          </p>
        </div>
      </div>

      {/* 🐬 الدولفين */}
      <div ref={dolphinRef} style={styles.dolphinWrapper}>
        <img src={dolphinImg} alt="الدولفين" style={styles.dolphinImg} draggable="false" />
      </div>

      {/* 🫧 منطقة الأسماك */}
      <div style={styles.fishArea} className="fish-area-responsive">
        {displayedChoices.map((choice, index) =>
          choice.visible ? (
            <div
              key={currentRound + "-" + index}
              className={`fish-bubble-responsive ${choice.isMiddle ? "middle-fish-down" : ""}`}
              style={{
                ...styles.fishWrapper,
                transform: `translate(${positions[index]?.x || 0}px, ${positions[index]?.y || 0}px)`,
                transition: draggedIndex === index ? "none" : "transform 0.2s ease-out",
              }}
              onPointerDown={(e) => handlePointerDown(e, index)}
              onPointerMove={(e) => handlePointerMove(e, index)}
              onPointerUp={(e) => handlePointerUp(e, index, choice.isCorrect)}
            >
              <img
                src={choice.imgSrc}
                alt="فقاعة سمكة"
                style={styles.bubbleFishImg}
                draggable="false"
              />

              {/* حاوية الكلمة المضبوطة في المنتصف تماماً */}
              <div style={styles.wordContainer}>
                <span className="game-word-text">{choice.word}</span>
              </div>
            </div>
          ) : (
            <div key={currentRound + "-" + index} className="fish-bubble-responsive" style={{ visibility: "hidden" }} />
          )
        )}
      </div>

      {/* أزرار التحكم */}
      <div style={styles.controlsBar} className="controls-bar-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="icon-btn-responsive" title="الصوت">
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
        <button onClick={restartGame} style={styles.iconBtn} className="icon-btn-responsive" title="إعادة اللعب">
          <RotateCcw size={24} />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="icon-btn-responsive" title="القائمة الرئيسية">
          <Home size={24} />
        </button>
        <button onClick={() => navigate("/Shadda")} style={styles.iconBtn} className="icon-btn-responsive" title="اللعبة التالية">
          <ArrowRight size={24} />
        </button>
      </div>

      {/* شاشة الفوز */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winBox}>
            <Trophy size={60} color="#FFD700" style={{ marginBottom: 15 }} />
            <h1 style={{ color: "#0077b6", marginBottom: 10, fontSize: "2.2rem" }}>أحسنت يا بطل! 🎉</h1>
            <p style={{ fontSize: "1.3rem", color: "#333", marginBottom: 20 }}>لقد أطعمت الدولفين كل الأسماك الصحيحة.</p>

            <div style={styles.finalStats}>
              <p style={{ fontSize: "1.2rem" }}>النتيجة النهائية: <strong>{score}</strong></p>
              <p style={{ fontSize: "1.2rem" }}>الوقت المستغرق: <strong>{Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</strong></p>
            </div>

            <div style={styles.actionButtons}>
              <button onClick={restartGame} style={styles.primaryBtn}><RotateCcw size={20} /> العب مرة أخرى</button>
              <button onClick={() => navigate("/home")} style={styles.secondaryBtn}><Home size={20} /> القائمة الرئيسية</button>
              <button onClick={() => navigate("/next-game")} style={styles.nextBtn}>اللعبة التالية <ArrowRight size={20} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === CSS المعدل للموبايل فقط ===
const responsiveCSS = `
  .game-word-text {
    font-size: 3.1rem;
    font-weight: 900;
    color: #003049;
    font-family: 'Traditional Arabic', 'Cairo', sans-serif;
    line-height: 1;
    display: inline-block;
  }

  .fish-bubble-responsive {
    width: 155px;
    height: auto;
    touch-action: none;
    user-select: none;
  }

  .middle-fish-down {
    transform: translateY(28px);
  }

  @media (max-width: 1024px) {
    .fish-bubble-responsive {
      width: 135px;
    }
    .game-word-text {
      font-size: 2.5rem !important;
    }
  }

  @media (max-width: 640px) {
    /* تصغير مساحة العنوان والفقرة */
    .header-container-responsive {
      top: 6px !important;
      gap: 3px !important;
    }
    .title-badge-responsive {
      padding: 3px 12px !important;
      border-radius: 12px !important;
    }
    .instruction-title-responsive {
      font-size: 1rem !important;
    }
    .text-badge-responsive {
      padding: 3px 10px !important;
      border-radius: 8px !important;
    }
    .instruction-text-responsive {
      font-size: 0.85rem !important;
    }

    /* تصغير الوقت والنقاط */
    .top-bar-responsive {
      top: 8px !important;
      right: 12px !important;
      left: 12px !important;
    }
    .box-responsive {
      padding: 4px 10px !important;
      font-size: 0.9rem !important;
      border-radius: 10px !important;
    }

    /* رفع الفقاعات للأعلى قليلاً */
    .fish-area-responsive {
      bottom: 17% !important;
      right: 12% !important;
      gap: 6px !important;
      width: 75% !important;
    }
    .fish-bubble-responsive {
      width: 95px !important;
    }
    .game-word-text {
      font-size: 1.6rem !important;
    }
    .middle-fish-down {
      transform: translateY(15px) !important;
    }

    /* تصغير أزرار التحكم بمقدار 1 بكسل (11px بدلاً من 12px) */
    .controls-bar-responsive {
      bottom: 12px !important;
      left: 12px !important;
      gap: 10px !important;
    }
    .icon-btn-responsive {
      padding: 11px !important;
    }
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
    backgroundColor: "#0077b6",
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
    top: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    zIndex: 5,
    maxWidth: "90%",
  },
  titleBadge: {
    background: "linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)",
    padding: "6px 24px",
    borderRadius: "20px",
    border: "2px solid #0284c7",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  },
  instructionTitle: {
    margin: 0,
    color: "#0369a1",
    fontSize: "1.4rem",
    fontWeight: "bold",
  },
  textBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "6px 18px",
    borderRadius: "12px",
    border: "1px solid #bae6fd",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  instructionText: {
    margin: 0,
    color: "#0284c7",
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  dolphinWrapper: {
    position: "absolute",
    top: "35%",
    left: "5%",
    width: "25vw",
    maxWidth: "280px",
    minWidth: "170px",
    zIndex: 3,
    pointerEvents: "none",
  },
  dolphinImg: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    userSelect: "none",
  },
  topBar: {
    position: "absolute",
    top: "15px",
    right: "20px",
    left: "20px",
    display: "flex",
    justifyContent: "space-between",
    zIndex: 5,
    pointerEvents: "none",
  },
  box: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "8px 18px",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#023e8a",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    pointerEvents: "auto",
  },
  fishArea: {
    position: "absolute",
    bottom: "10%",
    right: "5%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: "18px",
    zIndex: 4,
    width: "58%",
  },
  fishWrapper: {
    position: "relative",
    cursor: "grab",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bubbleFishImg: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    userSelect: "none",
    pointerEvents: "none",
  },
  wordContainer: {
    position: "absolute",
    top: "78%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    textAlign: "center",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  controlsBar: {
    position: "absolute",
    bottom: "18px",
    left: "18px",
    display: "flex",
    gap: "10px",
    zIndex: 10,
  },
  iconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2px solid #0077b6",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#0077b6",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
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
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winBox: {
    background: "white",
    padding: "30px",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    maxWidth: "440px",
    width: "90%",
  },
  finalStats: {
    background: "#f0f9ff",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "18px",
    color: "#023e8a",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  primaryBtn: {
    background: "#0096c7",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "1.1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: "bold",
  },
  secondaryBtn: {
    background: "#caf0f8",
    color: "#023e8a",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  nextBtn: {
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "1.1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: "bold",
  },
};