// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from "react";

import bg from "../assets/bgfish.jpeg";
import fish1 from "../assets/fish1.png";
import fish2 from "../assets/fish2.png";
import fish3 from "../assets/fish3.png";
import fish4 from "../assets/fish4.png";

import boatBoy from "../assets/boy.png";

import { GiFishingHook } from "react-icons/gi";

import {
  Volume2,
  VolumeX,
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

export default function FishingGame() {

  // =========================================================================
  // 🎯 موضع انطلاق الخيط (نفس إحداثيات الكود الأصلي تماماً مع التجاوب)
  // =========================================================================
  const hookPositionConfig = {
    mobile: {
      left: "78%", 
      top: "12%",  
    },
    tablet: {
      left: "80%",
      top: "10%",
    },
    desktop: {
      left: "81%", 
      top: "8%",   
    },
  };

  const gameRef = useRef(null);
  const boatRef = useRef(null);

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("اصطد الحروف المرققة فقط");
  
  const [hookTarget, setHookTarget] = useState(null);
  const [hookActive, setHookActive] = useState(false);
  const [splash, setSplash] = useState(null);
  const [hookStart, setHookStart] = useState({ x: 0, y: 0 });
  const [hookT, setHookT] = useState(0);

  const [showCorrect, setShowCorrect] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [finalText, setFinalText] = useState("");
  
  const [isMuted, setIsMuted] = useState(false);

  const fishImages = [fish1, fish2, fish3, fish4];

  // 🎯 الحروف المرققة (soft) والمفخخة (hard) بدقة
  const letters = [
    { letter: "س", type: "soft" },
    { letter: "ل", type: "soft" },
    { letter: "ت", type: "soft" },
    { letter: "ن", type: "soft" },
    { letter: "م", type: "soft" },
    { letter: "ب", type: "soft" },
    { letter: "ف", type: "soft" },
    { letter: "ك", type: "soft" },
    
    { letter: "ص", type: "hard" },
    { letter: "ض", type: "hard" },
    { letter: "ط", type: "hard" },
    { letter: "ظ", type: "hard" },
    { letter: "ق", type: "hard" },
    { letter: "غ", type: "hard" },
    { letter: "خ", type: "hard" },
  ];

  const createFishes = () => {
    return letters.map((item, index) => ({
      id: index + 1,
      letter: item.letter,
      type: item.type,
      x: Math.random() * (window.innerWidth - 100),
      y: 340 + Math.random() * 220,
      speed: 0.5 + Math.random() * 0.8,
      dir: Math.random() > 0.5 ? 1 : -1,
      image: fishImages[Math.floor(Math.random() * fishImages.length)],
    }));
  };

  const [fishes, setFishes] = useState(createFishes());

  const getHookStartPoint = () => {
    if (!boatRef.current) return { x: 0, y: 0 };

    const rect = boatRef.current.getBoundingClientRect();
    const width = window.innerWidth;
    
    let config = hookPositionConfig.desktop;
    if (width <= 768) {
      config = hookPositionConfig.mobile;
    } else if (width > 768 && width <= 1024) {
      config = hookPositionConfig.tablet;
    }

    const parsePercent = (val) => parseFloat(val) / 100;

    const xOffset = rect.width * parsePercent(config.left);
    const yOffset = rect.height * parsePercent(config.top);

    return {
      x: rect.left + xOffset,
      y: rect.top + yOffset,
    };
  };

  useEffect(() => {
    const updateHookPosition = () => {
      setHookStart(getHookStartPoint());
    };

    updateHookPosition();
    window.addEventListener("resize", updateHookPosition);

    return () => {
      window.removeEventListener("resize", updateHookPosition);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restartGame = (auto = false) => {
    setScore(0);
    setTime(60);
    setGameOver(false);
    setFishes(createFishes());
    setHookTarget(null);
    setHookActive(false);
    setSplash(null);
    setHookT(0);
    setShowFinal(false);
    setFinalText("");
    setMessage("اصطد الحروف المرققة فقط");

    if (auto) {
      setShowCorrect(false);
    }
  };

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setFinalText(`⏰ انتهى الوقت\n⭐ مجموع نقاطك ${score}`);
          setShowFinal(true);

          setTimeout(() => {
            setShowFinal(false);
            restartGame(true);
          }, 3000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, score]);

  useEffect(() => {
    const move = setInterval(() => {
      setFishes((prev) =>
        prev.map((fish) => {
          let newX = fish.x + fish.speed * fish.dir;
          let newDir = fish.dir;

          if (newX > window.innerWidth - 80) {
            newDir = -1;
          }

          if (newX < 0) {
            newDir = 1;
          }

          return {
            ...fish,
            x: newX,
            dir: newDir,
          };
        })
      );
    }, 25);

    return () => clearInterval(move);
  }, []);

  useEffect(() => {
    if (!splash) return;

    const t = setTimeout(() => {
      setSplash(null);
    }, 600);

    return () => clearTimeout(t);
  }, [splash]);

  const playSound = (type) => {
    if (isMuted) return;

    const correctAudio = new Audio("/sounds/hay1.mp3");
    const wrongAudio = new Audio("/sounds/pop.mp3");

    correctAudio.volume = 0.6;
    wrongAudio.volume = 0.6;

    if (type === "correct") {
      correctAudio.currentTime = 0;
      correctAudio.play().catch(() => {});
    } else {
      wrongAudio.currentTime = 0;
      wrongAudio.play().catch(() => {});
    }
  };

  const catchFish = (fish) => {
    if (hookActive || gameOver) return;

    const startPt = getHookStartPoint();
    setHookStart(startPt);

    const target = {
      x: fish.x + 50,
      y: fish.y + 40,
    };

    setHookTarget(target);
    setSplash(target);
    setHookActive(true);
    setHookT(0);

    requestAnimationFrame(() => {
      setHookT(1);
    });

    setTimeout(() => {
      if (fish.type === "soft") {
        const newScore = score + 10;
        setScore(newScore);
        setMessage("✅ أحسنت! حرف مرقق");
        setShowCorrect(true);
        playSound("correct");

        setTimeout(() => {
          setShowCorrect(false);
        }, 1000);

        setFishes((prev) => {
          const updated = prev.filter((f) => f.id !== fish.id);
          const remainingSoft = updated.filter((f) => f.type === "soft");

          if (remainingSoft.length === 0) {
            setGameOver(true);
            setFinalText(`🎉 أحسنت!\n⭐ حصلت على ${newScore} نقطة`);
            setShowFinal(true);

            setTimeout(() => {
              setShowFinal(false);
              restartGame(true);
            }, 3000);
          }

          return updated;
        });
      } else {
        setScore((p) => (p > 0 ? p - 5 : 0));
        setMessage("❌ هذا حرف مفخم");
        playSound("wrong");
      }

      setHookT(0);
      setTimeout(() => {
        setHookTarget(null);
        setHookActive(false);

        if (!gameOver) {
          setMessage("اصطد الحروف المرققة فقط");
        }
      }, 300);
    }, 400);
  };

  return (
    <>
      <style>{`
        @keyframes splashAnim {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .fishing-game-container {
          width: 100%;
          height: 100vh;
          overflow: hidden;
          position: relative;
          background-image: url(${bg});
          background-size: cover;
          background-position: center;
          font-family: "Cairo";
          padding-bottom: 90px;
          direction: rtl;
          box-sizing: border-box;
        }

        /* 🎛️ أزرار التحكم المتجاوبة */
        .control-btn {
          width: clamp(38px, 4.5vw, 48px);
          height: clamp(38px, 4.5vw, 48px);
          border-radius: 50%;
          border: none;
          background: #7f57e7;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .control-btn:hover {
          transform: scale(1.05);
        }

        /* 🏆 نافذة النهاية (على قد المحتوى تماماً وبدون فراغات واسعة) */
        .final-popup {
          background: white;
          padding: 22px 30px;
          border-radius: 22px;
          font-size: 22px;
          fontWeight: bold;
          text-align: center;
          line-height: 1.6;
          white-space: pre-line;
          width: max-content;
          max-width: 90%;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }

        /* 📱 إعدادات الموبايل */
        @media (max-width: 768px) {
          .game-title {
            font-size: 18px !important;
            padding: 6px 14px !important;
          }

          .game-message {
            top: 62px !important;
            font-size: 14px !important;
            padding: 4px 12px !important;
          }

          .score-box,
          .time-box {
            font-size: 14px !important;
            padding: 5px 10px !important;
            top: 12px !important;
          }

          .boat-image {
            width: 240px !important;
            left: 30% !important;
            top: 180px !important;
            transform: translateX(-50%) !important;
          }

          .fish-box {
            width: 70px !important;
          }

          .fish-letter {
            font-size: 20px !important;
          }

          .control-buttons {
            gap: 12px !important;
            bottom: 15px !important;
          }

          .final-popup {
            font-size: 17px !important;
            padding: 16px 22px !important;
          }

          .correct-popup {
            font-size: 18px !important;
            padding: 12px 18px !important;
          }
        }

        /* 📲 تابلت */
        @media (min-width: 769px) and (max-width: 1024px) {
          .game-title {
            font-size: 20px !important;
            padding: 8px 18px !important;
          }

          .game-message {
            top: 68px !important;
            font-size: 15px !important;
            padding: 5px 14px !important;
          }

          .boat-image {
            width: 280px !important;
            left: 80px !important;
          }

          .fish-box {
            width: 85px !important;
          }

          .fish-letter {
            font-size: 24px !important;
          }
        }
      `}</style>

      <div ref={gameRef} className="fishing-game-container">
        {/* 🏷️ العنوان */}
        <div
          className="game-title"
          style={{
            position: "absolute",
            top: 15,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff2cc",
            padding: "8px 22px",
            borderRadius: 30,
            fontSize: 22,
            fontWeight: "bold",
            zIndex: 100,
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          لعبة صيد الحروف
        </div>

        {/* 📝 الرسالة والفقرة */}
        <div
          className="game-message"
          style={{
            position: "absolute",
            top: 75,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "6px 18px",
            borderRadius: 25,
            fontSize: 16,
            fontWeight: "bold",
            zIndex: 100,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {message}
        </div>

        <div
          className="score-box"
          style={{
            position: "absolute",
            top: 20,
            right: 15,
            background: "white",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 16,
            fontWeight: "bold",
            zIndex: 100,
          }}
        >
          ⭐ {score}
        </div>

        <div
          className="time-box"
          style={{
            position: "absolute",
            top: 20,
            left: 15,
            background: "white",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 16,
            fontWeight: "bold",
            zIndex: 100,
          }}
        >
          ⏰ {time}
        </div>

        {/* المركب */}
        <img
          ref={boatRef}
          className="boat-image"
          src={boatBoy}
          alt=""
          style={{
            position: "absolute",
            top: 103,
            left: 180,
            width: 390,
            zIndex: 120,
          }}
        />

        {hookTarget &&
          (() => {
            const startX = hookStart.x;
            const startY = hookStart.y;
            const targetX = hookTarget.x;
            const targetY = hookTarget.y;

            const currentX = startX + (targetX - startX) * hookT;
            const currentY = startY + (targetY - startY) * hookT;

            const length = Math.sqrt(
              Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
            );

            const angle =
              (Math.atan2(currentY - startY, currentX - startX) * 180) / Math.PI;

            return (
              <div
                style={{
                  position: "absolute",
                  left: startX,
                  top: startY,
                  width: length,
                  height: 3,
                  background: "#ffffff",
                  boxShadow: "0 0 2px rgba(0,0,0,0.3)",
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "left center",
                  transition: "width 0.3s ease-out, transform 0.3s ease-out",
                  zIndex: 120,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translate(50%, -50%) rotate(-90deg)",
                    fontSize: 26,
                    color: "#374151",
                    pointerEvents: "none",
                  }}
                >
                  <GiFishingHook />
                </div>
              </div>
            );
          })()}

        {splash && (
          <div
            style={{
              position: "absolute",
              left: splash.x,
              top: splash.y,
              width: 80,
              height: 80,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9), rgba(173,216,230,0.6), transparent)",
              borderRadius: "50%",
              animation: "splashAnim 0.6s ease-out",
              pointerEvents: "none",
              zIndex: 200,
            }}
          />
        )}

        {fishes.map((fish) => (
          <div
            key={fish.id}
            className="fish-box"
            onClick={() => catchFish(fish)}
            style={{
              position: "absolute",
              left: fish.x,
              top: fish.y,
              width: 100,
              cursor: "pointer",
            }}
          >
            <img
              src={fish.image}
              alt=""
              style={{
                width: "100%",
                transform: fish.dir === -1 ? "scaleX(-1)" : "scaleX(1)",
              }}
            />

            <div
              className="fish-letter"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
                textShadow: "2px 2px 6px black",
              }}
            >
              {fish.letter}
            </div>
          </div>
        ))}

        {/* الأزرار الأربعة */}
        <div
          className="control-buttons"
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 15,
            zIndex: 200,
          }}
        >
          <button
            className="control-btn"
            onClick={() => restartGame()}
          >
            <RotateCcw color="white" size={20} />
          </button>

          <button
            className="control-btn"
            onClick={() => (window.location.href = "/home")}
          >
            <Home color="white" size={20} />
          </button>

          <button
            className="control-btn"
            onClick={() => (window.location.href = "AlHorof1")}
          >
            <ArrowRight color="white" size={20} />
          </button>

          <button
            className="control-btn"
            onClick={() => setIsMuted((prev) => !prev)}
            style={{
              background: isMuted ? "#ef4444" : "#7f57e7",
            }}
          >
            {isMuted ? <VolumeX color="white" size={20} /> : <Volume2 color="white" size={20} />}
          </button>
        </div>

        {showFinal && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 300,
            }}
          >
            <div className="final-popup">
              {finalText}
            </div>
          </div>
        )}

        {showCorrect && (
          <div
            className="correct-popup"
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: "#22c55e",
              color: "white",
              padding: "15px 25px",
              borderRadius: 20,
              fontSize: 22,
              zIndex: 400,
            }}
          >
            ممتاز 👏
          </div>
        )}
      </div>
    </>
  );
}