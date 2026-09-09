// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";

import { Volume2, RotateCcw, Home, ArrowRight, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🌲 1. الصور والأصول
import bgImg from "../assets/forestB.jpeg"; 
import basketImg from "../assets/basket1.png";
import keyImg from "../assets/key.png";
import titleBoardImg from "../assets/rainbowTitleBoard1.png";

// 🦁 أقفاص الحيوانات الصحيحة (تبدأ بحرف الألف)
import lionClosed from "../assets/lionclosed.png";
import lionOpen from "../assets/lionopen.png";
import rabbitClosed from "../assets/rabbit_closed.png";
import rabbitOpen from "../assets/rabbit_open.png";
import gooseClosed from "../assets/goose_closed.png";
import gooseOpen from "../assets/goose_open.png";
import octopusClosed from "../assets/octopus_closed.png";
import octopusOpen from "../assets/octopus_open.png";
import snakeClosed from "../assets/snake_closed.png";
import snakeOpen from "../assets/snake_open.png";
import camelClosed from "../assets/camel_closed.png";
import camelOpen from "../assets/camel_open.png";
import deerClosed from "../assets/deer_closed.png";
import deerOpen from "../assets/deer_open.png";
import centipedeClosed from "../assets/centipede_closed.png";
import centipedeOpen from "../assets/centipede_open.png";
import lionessClosed from "../assets/lioness_closed.png";
import lionessOpen from "../assets/lioness_open.png";

// 🐘 أقفاص الحيوانات الخاطئة (لا تبدأ بحرف الألف)
import elephantClosed from "../assets/elephant_closed.png";
import elephantOpen from "../assets/elephant_open.png";
import monkeyClosed from "../assets/monkey_closed.png";
import monkeyOpen from "../assets/monkey_open.png";
import duckClosed from "../assets/duck_closed.png";
import duckOpen from "../assets/duck_open.png";

const CORRECT_ANIMALS = [
  { id: 1, name: "أَسَد", isCorrect: true, closedImg: lionClosed, openImg: lionOpen },
  { id: 2, name: "أَرْنَب", isCorrect: true, closedImg: rabbitClosed, openImg: rabbitOpen },
  { id: 3, name: "إِوَّزَة", isCorrect: true, closedImg: gooseClosed, openImg: gooseOpen },
  { id: 4, name: "أَخْطَبُوط", isCorrect: true, closedImg: octopusClosed, openImg: octopusOpen },
  { id: 5, name: "أَفْعَى", isCorrect: true, closedImg: snakeClosed, openImg: snakeOpen },
  { id: 6, name: "إِبِل", isCorrect: true, closedImg: camelClosed, openImg: camelOpen },
  { id: 7, name: "أُيَّل", isCorrect: true, closedImg: deerClosed, openImg: deerOpen },
  { id: 8, name: " أبو قردان ", isCorrect: true, closedImg: centipedeClosed, openImg: centipedeOpen },
 { id: 9, name: "إبل", isCorrect: true, closedImg:elephantClosed , openImg: elephantOpen },
];

const WRONG_ANIMALS = [
     
  { id: 10, name: "زرافة", isCorrect: false, closedImg: lionessClosed, openImg: lionessOpen },
  { id: 11, name: "فيل", isCorrect: false, closedImg: monkeyClosed, openImg: monkeyOpen },
  { id: 12, name: "بَطَّة", isCorrect: false, closedImg: duckClosed, openImg: duckOpen },
];

const CORRECT_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3";
const WRONG_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3";

export default function AnimalRescueGame() {
  const navigate = useNavigate();

  // مصفوفات لإدارة الحيوانات المتبقية
  const [remainingCorrect, setRemainingCorrect] = useState(() =>
    [...CORRECT_ANIMALS].sort(() => Math.random() - 0.5)
  );
  const [remainingWrong, setRemainingWrong] = useState(() =>
    [...WRONG_ANIMALS].sort(() => Math.random() - 0.5)
  );

  const [displayedCages, setDisplayedCages] = useState([]);
  const [openStates, setOpenStates] = useState({});

  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isBusy, setIsBusy] = useState(false);

  // حالة حركة المفتاح المحمول والسلس
  const [dragPos, setDragPos] = useState(null);
  const [activeKeyIdx, setActiveKeyIdx] = useState(null);

  // دالة لتوليد زوج قفصين جديدين (واحد صحيح وواحد خاطئ) بأماكن عشوائية
  const getNextPair = (cList, wList) => {
    let currentC = [...cList];
    let currentW = [...wList];

    if (currentC.length === 0) return { pair: [], nextC: [], nextW: [] };

    // إذا انتهت قائمة الحيوانات الخاطئة نعيد خلطها
    if (currentW.length === 0) {
      currentW = [...WRONG_ANIMALS].sort(() => Math.random() - 0.5);
    }

    const correctAnimal = currentC.shift();
    const wrongAnimal = currentW.shift();

    // تبديل الأماكن عشوائياً (يمين / شمال)
    const pair = Math.random() > 0.5 
      ? [correctAnimal, wrongAnimal] 
      : [wrongAnimal, correctAnimal];

    return { pair, nextC: currentC, nextW: currentW };
  };

  // بداية اللعبة: تحميل أول قفصين
  useEffect(() => {
    const { pair, nextC, nextW } = getNextPair(remainingCorrect, remainingWrong);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedCages(pair);
    setRemainingCorrect(nextC);
    setRemainingWrong(nextW);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAudio = (url) => {
    if (!soundEnabled) return;
    const audio = new Audio(url);
    audio.play().catch(() => {});
  };

  useEffect(() => {
    let interval = null;
    if (!isGameOver) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);

  // لبدء السحب السلس بلمسة واحدة أو بالماوس
  const handlePointerDown = (e, idx) => {
    e.preventDefault();
    setActiveKeyIdx(idx);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  // متابعة سحب المفتاح بسلاسة فائقة
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (activeKeyIdx === null) return;
      setDragPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = (e) => {
      if (activeKeyIdx === null || !dragPos) return;

      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      const cageCard = elementAtPoint?.closest(".cage-card");

      if (cageCard) {
        const animalId = cageCard.getAttribute("data-animal-id");
        const targetAnimal = displayedCages.find((a) => a.id === Number(animalId));
        if (targetAnimal) {
          // eslint-disable-next-line react-hooks/immutability
          processCageUnlock(targetAnimal);
        }
      }

      setActiveKeyIdx(null);
      setDragPos(null);
    };

    if (activeKeyIdx !== null) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKeyIdx, dragPos, displayedCages]);

  const processCageUnlock = (targetAnimal) => {
    if (isBusy || isGameOver || openStates[targetAnimal.id]) return;

    if (targetAnimal.isCorrect) {
      setIsBusy(true);
      playAudio(CORRECT_SOUND_URL);

      setOpenStates((prev) => ({ ...prev, [targetAnimal.id]: true }));
      setScore((s) => s + 10);
      setMessage({ text: " أحسنت 🔓", type: "success" });

      setTimeout(() => {
        // الاستعداد للزوج التالي وتغيير القفصين معاً
        const { pair, nextC, nextW } = getNextPair(remainingCorrect, remainingWrong);

        if (pair.length > 0) {
          setDisplayedCages(pair);
          setRemainingCorrect(nextC);
          setRemainingWrong(nextW);
          setOpenStates({});
        } else {
          setIsGameOver(true);
        }

        setMessage({ text: "", type: "" });
        setIsBusy(false);

        if (score + 10 >= 90) {
          setIsGameOver(true);
        }
      }, 1200);

    } else {
      playAudio(WRONG_SOUND_URL);
      setMessage({ text: "خطأ❌", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 1200);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* خلفية اللعبة */}
      <img src={bgImg} alt="خلفية اللعبة" style={styles.bgImg} />

      {/* النقاط والوقت */}
      <div className="game-badge badge-left">⭐ {score}</div>
      <div className="game-badge badge-right badge-timer">⏱️ {formatTime(timer)}</div>

      {/* الهيدر العلوي */}
      <div className="header-resp">
        <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
          <img src={titleBoardImg} alt="لوحة العنوان" className="title-board-img" />
          <h1 className="game-title">إنْقَاذُ الحَيَوَانَات</h1>
        </div>
        <p className="instruction-text">
          افْتَحِ القَفَصَ لِلْحَيَوَانِ الَّذِي يَبْدَأُ اسْمُهُ بِحَرْفِ الأَلِفِ
        </p>
      </div>

      {/* القفصان المنتقلان عشوائياً */}
      <div className="cages-grid">
        {displayedCages.map((animal) => {
          const isOpen = !!openStates[animal.id];
          return (
            <div
              key={animal.id}
              data-animal-id={animal.id}
              className="cage-card"
            >
              <img
                src={isOpen ? animal.openImg : animal.closedImg}
                alt={animal.name}
                className="cage-img-element"
              />
              <div className="animal-nametag">{animal.name}</div>
            </div>
          );
        })}
      </div>

      {/* المنطقة السفلية */}
      <div className="bottom-bar">
        <div className="bottom-content-wrapper">
          {/* أزرار التحكم */}
          <div style={styles.footerBtns}>
            <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="control-btn">
              <Volume2 className="btn-icon" color={soundEnabled ? "#000" : "gray"} />
            </button>
            <button onClick={() => window.location.reload()} style={styles.iconBtn} className="control-btn">
              <RotateCcw className="btn-icon" />
            </button>
            <button onClick={() => navigate("/home")} style={styles.iconBtn} className="control-btn">
              <Home className="btn-icon" />
            </button>
            <button onClick={() => navigate("/Hamza")} style={styles.iconBtn} className="control-btn">
              <ArrowRight className="btn-icon" />
            </button>
          </div>

          {/* السلة والمفاتيح */}
          <div className="basket-area">
            <img src={basketImg} alt="السلة الخشبية" className="basket-img" />
            <div className="keys-group">
              {[0, 1].map((idx) => {
                const isDragging = activeKeyIdx === idx;
                return (
                  <img
                    key={idx}
                    src={keyImg}
                    alt="مفتاح"
                    className="draggable-key"
                    onPointerDown={(e) => handlePointerDown(e, idx)}
                    style={{
                      opacity: isDragging ? 0 : 1,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* المفتاح الحقيقي المحمول عند السحب */}
      {activeKeyIdx !== null && dragPos && (
        <img
          src={keyImg}
          alt="مفتاح حقيقي محمول"
          style={{
            position: "fixed",
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            transform: "translate(-50%, -50%) scale(1.2) rotate(-20deg)",
            zIndex: 9999,
            pointerEvents: "none",
            width: "50px",
            height: "auto",
            filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.5))"
          }}
        />
      )}

      {/* التغذية الراجعة */}
      {message.text && (
        <div
          style={{
            ...styles.messageBox,
            backgroundColor: message.type === "success" ? "#15803d" : "#b91c1c",
          }}
        >
          {message.text}
        </div>
      )}

      {/* نافذة الفوز */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winCard}>
            <Award size={35} color="#f59e0b" />
            <h2 style={{ fontSize: "1.5rem", margin: "15px 0", color: "#1e3a8a" }}>أَحْسَنْتَ يَا بَطَلُ! 🥳</h2>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "5px 0" }}>
              عدد النقاط: <span style={{ color: "#d97706" }}>{score}</span>
            </p>
           
            
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={() => window.location.reload()} style={styles.winIconBtn} title="إعادة المحاولة">
                <RotateCcw size={26} color="#fff" />
              </button>
              <button onClick={() => navigate("/home")} style={styles.winIconBtn} title="الرئيسية">
                <Home size={26} color="#fff" />
              </button>
              <button onClick={() => navigate("/Hamza")} style={styles.winIconBtn} title="المرحلة التالية">
                <ArrowRight size={26} color="#fff" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const responsiveCSS = `
  .game-badge {
    position: absolute;
    top: 15px;
    background: rgba(0, 0, 0, 0.65);
    color: #fff;
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 1.1rem;
    font-weight: bold;
    z-index: 60;
  }
  .badge-left { left: 45px; }
  .badge-right { right: 45px; }
  .badge-timer { font-size: 1.25rem; }

  .header-resp {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .title-board-img {
    width: 280px;
    height: auto;
  }
  .game-title {
    position: absolute;
    font-size: 1.8rem !important;
    color: #fff;
    margin: 0;
    text-shadow: 2px 2px 4px #000;
    font-weight: 900;
    white-space: nowrap;
  }
  .instruction-text {
    background: rgba(255, 255, 255, 0.95);
    color: #78350f;
    font-weight: bold;
    font-size: 1.1rem;
    padding: 4px 20px;
    border-radius: 20px;
    margin-top: -14px;
    border: 2px solid #b45309;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    white-space: nowrap;
  }

  .cages-grid {
    position: absolute;
    bottom: 110px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 60px;
    width: 90%;
    max-width: 900px;
    z-index: 20;
  }

  .cage-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .cage-img-element {
    width: 250px;
    height: auto;
    user-select: none;
  }

  .animal-nametag {
    background: #fef3c7;
    color: #000;
    font-size: 1.6rem;
    font-weight: 900;
    padding: 4px 24px;
    border-radius: 15px;
    border: 3px solid #78350f;
    margin-top: -25px;
    min-width: 120px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }

  .bottom-bar {
    position: absolute;
    bottom: 15px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0 30px;
    box-sizing: border-box;
    z-index: 40;
  }

  .bottom-content-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 40px;
    position: relative;
  }

  .control-btn {
    padding: 12px !important;
  }
  .btn-icon {
    width: 24px;
    height: 24px;
  }

  .basket-area {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 45;
  }
  .basket-img {
    width: 135px; 
    height: auto;
  }
  .keys-group {
    position: absolute;
    top: 8px;
    display: flex;
    gap: 8px;
    z-index: 50;
  }

  .draggable-key {
    width: 44px;
    height: auto;
    cursor: grab;
    user-select: none;
    touch-action: none; /* يمنع التمرير الافتراضي لشاشة اللمس لتوفير سحب سلس جداً */
    filter: drop-shadow(2px 3px 3px rgba(0,0,0,0.4));
  }

  /* 📱 التابلت */
  @media (max-width: 1024px) {
    .badge-left { left: 30px; }
    .badge-right { right: 30px; }

    .cages-grid {
      gap: 40px;
      bottom: 120px;
    }
    .cage-img-element { width: 210px; }
    .animal-nametag { font-size: 1.50rem; padding: 3px 20px; }
    .bottom-content-wrapper { gap: 25px; }
    .control-btn { padding: 10px !important; }
    .btn-icon { width: 22px; height: 22px; }
  }

  /* 📲 الموبايل */
  @media (max-width: 640px) {
    .header-resp { top: 0px; }
    .title-board-img { width: 199px; }
    .game-title { font-size: 1.6rem !important; }
    .instruction-text { font-size: 0.86rem; padding: 3px 12px; white-space: normal; margin-top: -14px; }
    
    .game-badge {
      top: 15px;
      padding: 5px 12px;
      font-size: 0.85rem;
      border-radius: 12px;
    }
    .badge-left { left: 20px; }
    .badge-right { right: 20px; }
    .badge-timer { font-size: 0.95rem; }

    .cages-grid {
      gap: 20px;
      bottom: 135px;
    }
    .cage-img-element { width: 160px; }
    .animal-nametag { font-size: 1.2rem; padding: 2px 14px; min-width: 90px; }
    
    .bottom-content-wrapper { gap: 19px; bottom: 6px; }
    .control-btn { padding: 9px !important; }
    .btn-icon { width: 23px; height: 23px; }

    .basket-img { width: 115px; }
    .draggable-key { width: 36px; }
    .keys-group { top: 7px; gap: 6px; }
  }
`;

const styles = {
  container: { width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Cairo', sans-serif", direction: "rtl" },
  bgImg: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 },
  messageBox: { position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", padding: "10px 30px", borderRadius: "20px", color: "#fff", fontSize: "1.4rem", fontWeight: "bold", zIndex: 70, boxShadow: "0 4px 10px rgba(0,0,0,0.3)" },
  footerBtns: { display: "flex", gap: "10px" },
  iconBtn: { borderRadius: "50%", border: "none", background: "#ffffff", cursor: "pointer", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 },
  winCard: { background: "#fff", padding: "10px 20px", borderRadius: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  winIconBtn: { padding: "9px", width: "37px", height: "37px", borderRadius: "50%", border: "none", background: "#f59e0b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(245, 158, 11, 0.4)", transition: "transform 0.1s" }
};