// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import forestBgImg from "../assets/forestBg1.jpeg";   // صورة الخلفية (الغابة)
import spiderWebImg from "../assets/spiderWeb.png"; // صورة شبكة العنكبوت
import spiderImg from "../assets/spider.png";       // صورة العنكبوت

// 📍 نقطة بداية العنكبوت (تم رفعه لأعلى في اللاب والتابلت)
const SPIDER_START_POS = {
  desktop: { top: "18%", left: "16%" },
  mobile: { top: "27%", left: "14%" }
};

// 🏠 موقع بيت العنكبوت في الجانب
const SPIDER_HOUSE_POS = {
  desktop: { top: "78%", left: "82%" },
  mobile: { top: "82%", left: "85%" }
};

// 🎯 قائمة الكلمات مع تعديل إحداثيات (لُعَبِي، بَيْت) على اللاب وتعديل (قَلَمُك، حَقِيبَة) على الموبايل
const ALL_WORDS_NODES = [
  // ⭐ الكلمات الصحيحة (ياء الملكية)
  { 
    id: "step1", text: "كِتَابِي", isTarget: true, 
    desktopPos: { top: "35%", left: "35%" }, 
    mobilePos: { top: "36%", left: "28%" } 
  },
  { 
    id: "step2", text: "قَلَمِي", isTarget: true, 
    desktopPos: { top: "42%", left: "59%" }, 
    mobilePos: { top: "42%", left: "68%" } 
  },
  { 
    id: "step3", text: "لُعَبِي", isTarget: true, 
    desktopPos: { top: "60%", left: "38%" }, // 👈 إدخالها للداخل على اللاب والتابلت
    mobilePos: { top: "60%", left: "25%" } 
  },
  { 
    id: "step4", text: "بَيْتِي", isTarget: true, 
    desktopPos: { top: "60%", left: "68%" }, 
    mobilePos: { top: "62%", left: "75%" } 
  },
  { 
    id: "step5", text: "كُرْسِي", isTarget: true, 
    desktopPos: { top: "64%", left: "52%" }, 
    mobilePos: { top: "70%", left: "50%" } 
  },

  // ❌ الكلمات الخاطئة
  { 
    id: "wrong1", text: "قَلَم", isTarget: false, 
    desktopPos: { top: "27%", left: "50%" }, 
    mobilePos: { top: "29%", left: "50%" } 
  },
  { 
    id: "wrong2", text: "كِتَاب", isTarget: false, 
    desktopPos: { top: "30%", left: "65%" }, 
    mobilePos: { top: "33%", left: "74%" } 
  },
  { 
    id: "wrong3", text: "كُرَة", isTarget: false, 
    desktopPos: { top: "47%", left: "46%" }, 
    mobilePos: { top: "40%", left: "50%" } 
  },
  { 
    id: "wrong4", text: "بَيْت", isTarget: false, 
    desktopPos: { top: "61%", left: "60%" }, // 👈 إدخالها للداخل على اللاب والتابلت
    mobilePos: { top: "51%", left: "84%" } 
  },
  { 
    id: "wrong7", text: "قَلَمُك", isTarget: false, 
    desktopPos: { top: "77%", left: "58%" }, 
    mobilePos: { top: "55%", left: "60%" } // 👈 إدخالها للداخل على الموبايل
  },
  { 
    id: "wrong8", text: "حَقِيبَة", isTarget: false, 
    desktopPos: { top: "75%", left: "43%" }, 
    mobilePos: { top: "55%", left: "38%" } // 👈 إدخالها للداخل على الموبايل
  },
];

export default function SpiderWebGame() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [visitedSteps, setVisitedSteps] = useState([]); 
  const [spiderPos, setSpiderPos] = useState(isMobile ? SPIDER_START_POS.mobile : SPIDER_START_POS.desktop); 
  const [isSpiderInsideHouse, setIsSpiderInsideHouse] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const audioCtxRef = useRef(null);
  const targetNodesCount = ALL_WORDS_NODES.filter((n) => n.isTarget).length;

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 900;
      setIsMobile(mobileView);
      if (visitedSteps.length === 0 && !isGameOver) {
        setSpiderPos(mobileView ? SPIDER_START_POS.mobile : SPIDER_START_POS.desktop);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visitedSteps, isGameOver]);

  useEffect(() => {
    let interval = null;
    if (!isGameOver) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }, []);

  const playSound = (type) => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      if (type === "success") {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0.2, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 0.2);
        });
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("Sound error:", e);
    }
  };

  const speakWord = (text) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanWord = text.replace(/[\u064B-\u0652]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.lang = "ar-SA";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  const handleNodeClick = (node) => {
    if (isGameOver) return;

    speakWord(node.text);
    const activePos = isMobile ? node.mobilePos : node.desktopPos;

    if (node.isTarget && !visitedSteps.includes(node.id)) {
      playSound("success");
      
      const newVisited = [...visitedSteps, node.id];
      setVisitedSteps(newVisited);
      setSpiderPos(activePos);
      setScore((prev) => prev + 20);
      setMessage({ text: `أحسنت! "${node.text}" كلمة صحيحة 👏`, type: "success" });

      if (newVisited.length === targetNodesCount) {
        setTimeout(() => {
          setSpiderPos(isMobile ? SPIDER_HOUSE_POS.mobile : SPIDER_HOUSE_POS.desktop);
          setMessage({ text: "رائع! جاري الذهاب إلى البيت... 🏠", type: "success" });
        }, 800);

        setTimeout(() => {
          setIsSpiderInsideHouse(true);
        }, 1600);

        setTimeout(() => {
          setIsGameOver(true);
          triggerConfetti();
        }, 2200);
      }
    } else if (node.isTarget && visitedSteps.includes(node.id)) {
      setSpiderPos(activePos);
    } else {
      playSound("error");
      setMessage({ text: "أوه! هذه الكلمة غير صحيحة، حاول مجدداً! ❌", type: "error" });
    }

    setTimeout(() => setMessage({ text: "", type: "" }), 2200);
  };

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  };

  const startNewGame = () => {
    setVisitedSteps([]);
    setSpiderPos(isMobile ? SPIDER_START_POS.mobile : SPIDER_START_POS.desktop);
    setIsSpiderInsideHouse(false);
    setScore(0);
    setTimer(0);
    setIsGameOver(false);
    setMessage({ text: "", type: "" });
  };

  const housePosition = isMobile ? SPIDER_HOUSE_POS.mobile : SPIDER_HOUSE_POS.desktop;

  return (
    <div id="game-container" style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🖼️ خلفية الغابة */}
      <img src={forestBgImg} alt="خلفية الغابة" style={styles.bgImg} />

      {/* 🕸️ صورة شبكة العنكبوت */}
      <img src={spiderWebImg} alt="شبكة العنكبوت" style={styles.webImg} className="web-img-responsive" />

      {/* 🏷️ العنوان والفقرة بدون تشكيل */}
      <div style={styles.headerContainer} className="header-container-responsive">
        <h1 style={styles.gameTitle} className="game-title-responsive">
          شبكة العنكبوت 🕸️
        </h1>
        <p style={styles.gameSubtitle} className="game-subtitle-responsive">
          اختر الكلمات التي تحتوي على ياء الملكية للوصول للبيت.
        </p>
      </div>

      {/* 🏠 بيت العنكبوت */}
      <div
        style={{
          ...styles.spiderHouse,
          top: housePosition.top,
          left: housePosition.left,
        }}
        className="spider-house-responsive"
      >
        🏠
        <span style={styles.houseLabel} className="house-label-responsive">البَيْتُ</span>
      </div>

      {/* 🧵 خطوط الربط */}
      <svg style={styles.svgOverlay}>
        {visitedSteps.map((stepId, index) => {
          const currNode = ALL_WORDS_NODES.find((n) => n.id === stepId);
          if (!currNode) return null;

          const currPos = isMobile ? currNode.mobilePos : currNode.desktopPos;

          let prevPos;
          if (index === 0) {
            prevPos = isMobile ? SPIDER_START_POS.mobile : SPIDER_START_POS.desktop;
          } else {
            const prevNode = ALL_WORDS_NODES.find((n) => n.id === visitedSteps[index - 1]);
            prevPos = prevNode ? (isMobile ? prevNode.mobilePos : prevNode.desktopPos) : null;
          }

          if (!prevPos) return null;

          return (
            <line
              key={`line-${index}`}
              x1={prevPos.left}
              y1={prevPos.top}
              x2={currPos.left}
              y2={currPos.top}
              stroke="#A855F7"
              strokeWidth="4"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          );
        })}

        {visitedSteps.length === targetNodesCount && (() => {
          const lastNode = ALL_WORDS_NODES.find((n) => n.id === visitedSteps[visitedSteps.length - 1]);
          const lastNodePos = lastNode ? (isMobile ? lastNode.mobilePos : lastNode.desktopPos) : null;
          if (!lastNodePos) return null;

          return (
            <line
              x1={lastNodePos.left}
              y1={lastNodePos.top}
              x2={housePosition.left}
              y2={housePosition.top}
              stroke="#10B981"
              strokeWidth="5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          );
        })()}
      </svg>

      {/* 🕷️ العنكبوت المتحرك */}
      <div
        style={{
          ...styles.spiderWrapper,
          top: spiderPos.top,
          left: spiderPos.left,
          opacity: isSpiderInsideHouse ? 0 : 1,
          transform: isSpiderInsideHouse 
            ? "translate(-50%, -50%) scale(0.2)"
            : "translate(-50%, -50%) scale(1)",
        }}
        className="spider-responsive"
      >
        <img src={spiderImg} alt="العنكبوت" style={styles.fullImg} />
      </div>

      {/* 🟡 أزرار الكلمات (الدوائر) */}
      {ALL_WORDS_NODES.map((node) => {
        const isVisited = visitedSteps.includes(node.id);
        const nodePos = isMobile ? node.mobilePos : node.desktopPos;

        return (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node)}
            style={{
              ...styles.wordNode,
              top: nodePos.top,
              left: nodePos.left,
              backgroundColor: isVisited ? "#A855F7" : "#FDE68A",
              color: isVisited ? "#FFFFFF" : "#451A03",
              borderColor: isVisited ? "#6B21A8" : "#D97706",
            }}
            className={`word-node-responsive ${isVisited ? "node-visited-anim" : ""}`}
          >
            {node.text}
          </button>
        );
      })}

      {/* 🌟 النقاط والعداد */}
      <div style={styles.scoreBadge} className="stat-badge-responsive score-position">
        ⭐ {score}
      </div>

      <div style={styles.timerBadge} className="stat-badge-responsive timer-position">
        <Clock size={24} color="#0284c7" /> {timer}
      </div>

      {/* 💬 الرسائل التفاعلية */}
      {message.text && (
        <div style={{ ...styles.feedbackMessage, ...styles[message.type] }}>
          {message.text}
        </div>
      )}

      {/* 🏆 شاشة الفوز */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winCard} className="win-card-responsive">
            <div style={styles.trophyWrapper}>
              <Trophy className="trophy-icon-responsive" color="#FFD700" />
            </div>
            <h2 style={styles.winTitle} className="win-title-responsive">
              أحسنت يا بطل🕸️🏠🎉
            </h2>

            <div style={styles.winStatsBox} className="win-stats-responsive">
              <span style={styles.winStatLabel} className="win-stat-label-responsive">
                <Star color="#f57c00" className="star-icon-responsive" /> النقاط: {score}
              </span>
            </div>

            <div style={styles.winActionButtons}>
              <button onClick={startNewGame} style={styles.winIconBtn} className="win-btn-responsive" title="إعادة اللعب">
                <RotateCcw className="btn-icon-responsive" />
              </button>
              <button onClick={() => navigate("/home")} style={styles.winIconBtn} className="win-btn-responsive" title="الصفحة الرئيسية">
                <Home className="btn-icon-responsive" />
              </button>
              <button onClick={() => navigate(-1)} style={styles.winIconBtn} className="win-btn-responsive" title="رجوع">
                <ArrowRight className="btn-icon-responsive" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔘 أزرار التحكم السفلية */}
      <div style={styles.controlsBarBottom} className="controls-bottom-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="control-btn-responsive" title="الصوت">
          {soundEnabled ? <Volume2 className="ctrl-icon-responsive" /> : <VolumeX className="ctrl-icon-responsive" />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} className="control-btn-responsive" title="إعادة اللعب">
          <RotateCcw className="ctrl-icon-responsive" />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="control-btn-responsive" title="الصفحة الرئيسية">
          <Home className="ctrl-icon-responsive" />
        </button>
        <button onClick={() => navigate(-1)} style={styles.iconBtn} className="control-btn-responsive" title="رجوع">
          <ArrowRight className="ctrl-icon-responsive" />
        </button>
      </div>
    </div>
  );
}

// === 🎨 التنسيقات والاستجابة (CSS) ===
const responsiveCSS = `
  :root {
    --node-size-desktop: 75px;      
    --node-font-desktop: 1.90rem;    
    --node-border-desktop: 3px;     

    --node-size-mobile: 55px;       
    --node-font-mobile: 1.45rem;     
    --node-border-mobile: 2px;      
  }

  .node-visited-anim {
    transform: translate(-50%, -50%) scale(1.08) !important;
    box-shadow: 0 0 16px rgba(168, 85, 247, 0.8) !important;
  }

  .spider-responsive {
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
  }

  .word-node-responsive {
    position: absolute;
    transform: translate(-50%, -50%);
    width: var(--node-size-desktop);
    height: var(--node-size-desktop);
    border-radius: 50%;
    border: var(--node-border-desktop) solid;
    font-size: var(--node-font-desktop);
    font-weight: 900;
    cursor: pointer;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 12px rgba(0,0,0,0.3);
    transition: all 0.25s ease;
  }

  .word-node-responsive:hover {
    transform: translate(-50%, -50%) scale(1.08);
  }

  .stat-badge-responsive {
    font-size: 1.25rem !important;
    padding: 8px 20px !important;
    position: absolute;
    z-index: 40;
  }

  .score-position { top: 16px; left: 20px; }
  .timer-position { top: 16px; right: 20px; }

  /* 📦 حاوية الرأس للعناوين */
  .header-container-responsive {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 35;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: auto;
    max-width: 90%;
  }

  /* 🏷️ إطار العنوان المستقل */
  .game-title-responsive {
    margin: 0;
    padding: 6px 22px;
    font-size: 1.3rem;
    font-weight: 900;
    color: #FEF3C7;
    background: #854D0E;
    border: 3px solid #FEF3C7;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: inline-block;
  }

  /* 📝 إطار الفقرة المستقل (تم تكبير الخط والوسادة هنا) */
  .game-subtitle-responsive {
    margin: 0;
    padding: 8px 24px;       /* 👈 تكبير الإطار قليلاً */
    font-size: 1.24rem;      /* 👈 تكبير حجم الخط للشاشات الكبيرة */
    font-weight: 600;
    color: #451A03;
    background: #FDE68A;
    border: 2.5px solid #D97706;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    display: inline-block;
  }

  .spider-house-responsive {
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 6.5rem;
    z-index: 22;
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
  }

  .house-label-responsive {
    font-size: 1.25rem !important;
    padding: 4px 14px !important;
    margin-top: -12px !important;
  }

  .controls-bottom-responsive {
    position: absolute;
    bottom: 2.5%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
    z-index: 40;
  }

  .control-btn-responsive {
    padding: 12px !important;
    border-width: 3px !important;
  }

  .ctrl-icon-responsive {
    width: 28px !important;
    height: 28px !important;
  }

  .win-card-responsive { 
    width: 250px !important; 
    padding: 14px 18px !important; 
  }
  .trophy-icon-responsive { 
    width: 40px !important; 
    height: 40px !important; 
  }
  .win-title-responsive { 
    font-size: 1rem !important; 
    margin: 4px 0 8px 0 !important; 
  }
  .win-stats-responsive { 
    padding: 6px 12px !important; 
    margin-bottom: 10px !important; 
  }
  .win-stat-label-responsive { 
    font-size: 0.9rem !important; 
  }
  .star-icon-responsive { 
    width: 18px !important; 
    height: 18px !important; 
  }
  .btn-icon-responsive { 
    width: 20px !important; 
    height: 20px !important; 
  }
  .win-btn-responsive { 
    padding: 8px !important; 
  }

  @media (max-width: 900px) {
    .word-node-responsive {
      width: var(--node-size-mobile) !important;
      height: var(--node-size-mobile) !important;
      font-size: var(--node-font-mobile) !important;
      border-width: var(--node-border-mobile) !important;
    }

    .header-container-responsive {
      top: 10px !important;
      gap: 5px !important;
    }

    .game-title-responsive { 
      font-size: 1.10rem !important; 
      padding: 4px 14px !important;
      border-width: 2px !important;
    }

    .game-subtitle-responsive { 
      font-size: 0.92rem !important; /* 👈 تكبير خط الفقرة للموبايل */
      padding: 5px 12px !important;
      border-width: 2px !important;
    }

    .web-img-responsive {
      width: 92% !important;
      height: 92% !important;
    }

    .spider-responsive {
      width: 50px !important;
      height: 50px !important;
    }

    .spider-house-responsive {
      font-size: 5.2rem !important;
    }

    .house-label-responsive {
      font-size: 0.9rem !important;
      padding: 2px 8px !important;
      margin-top: -8px !important;
    }

    .controls-bottom-responsive {
      bottom: 2% !important;
      gap: 14px !important;
    }

    .control-btn-responsive {
      padding: 8px !important;
    }

    .ctrl-icon-responsive {
      width: 22px !important;
      height: 22px !important;
    }

    .stat-badge-responsive {
      font-size: 0.9rem !important;
      padding: 4px 10px !important;
    }

    .win-card-responsive { 
      width: 210px !important; 
      padding: 12px 14px !important; 
    }
    .trophy-icon-responsive { 
      width: 34px !important; 
      height: 34px !important; 
    }
    .win-title-responsive { 
      font-size: 0.85rem !important; 
    }
    .win-stat-label-responsive { 
      font-size: 0.9rem !important; 
    }
    .star-icon-responsive { 
      width: 16px !important; 
      height: 16px !important; 
    }
    .btn-icon-responsive { 
      width: 18px !important; 
      height: 18px !important; 
    }
    .win-btn-responsive { 
      padding: 6px !important; 
    }
  }
`;

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    backgroundColor: "#1e3a1e",
    userSelect: "none",
    touchAction: "none",
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
  webImg: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    height: "75%",
    objectFit: "contain",
    zIndex: 5,
    pointerEvents: "none",
  },
  svgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 15,
    pointerEvents: "none",
  },
  fullImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    pointerEvents: "none",
  },
  spiderWrapper: {
    position: "absolute",
    width: "70px",
    height: "70px",
    zIndex: 30,
    filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.5))",
  },
  spiderHouse: {
    cursor: "default",
  },
  houseLabel: {
    fontWeight: "bold",
    color: "#FEF3C7",
    backgroundColor: "#854D0E",
    borderRadius: "12px",
    border: "2px solid #FEF3C7",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
  headerContainer: {},
  gameTitle: {},
  gameSubtitle: {},
  wordNode: {},
  scoreBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    color: "#f57c00",
    border: "3px solid #f57c00",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  timerBadge: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    color: "#0284c7",
    border: "3px solid #0284c7",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  feedbackMessage: {
    position: "absolute",
    top: "22%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 60,
    borderRadius: "20px",
    fontWeight: "bold",
    color: "#fff",
    padding: "8px 22px",
    fontSize: "1.2rem",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },
  success: { backgroundColor: "#2e7d32" },
  error: { backgroundColor: "#c62828" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winCard: {
    background: "#ffffff",
    border: "3px solid #854D0E",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trophyWrapper: {
    marginBottom: "2px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
  },
  winTitle: {
    color: "#78350F",
    fontWeight: "800",
  },
  winStatsBox: {
    background: "#FEF3C7",
    borderRadius: "10px",
    border: "1.5px solid #FDE68A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
  },
  winStatLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "bold",
    color: "#92400E",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  winIconBtn: {
    background: "#ffffff",
    border: "2px solid #854D0E",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#854D0E",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsBarBottom: {},
  iconBtn: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "50%",
    border: "3px solid #854D0E",
    cursor: "pointer",
    color: "#854D0E",
    boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};