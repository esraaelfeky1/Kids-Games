// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. استيراد الخلفية والشخصيات
import spaceBg from "../assets/spacebg.jpeg";       
import astronaut from "../assets/manspace.png"; 

// 2. استيراد صور الكواكب الخمسة المتنوعة
import planet1 from "../assets/planet1.png";    
import planet2 from "../assets/planet2.png"; 
import planet3 from "../assets/planet3.png";    
import planet4 from "../assets/planet4.png"; 
import planet5 from "../assets/planet5.png";   

// 3. استيراد وسام بطل الفضاء ليظهر بكامل الشاشة عند الفوز
import heroMedal from "../assets/hero.png";         

// 4. ربط الملفات الصوتية المتاحة لديكِ
import successSoundFile from "/sounds/hay1.mp3"; 
import errorSoundFile from "/sounds/pop.mp3";     

export default function SpaceLettersGame() {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [win, setWin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const isMobile = window.innerWidth < 768;
  const initialAstronautPos = { 
    x: window.innerWidth * 0.15, 
    y: window.innerHeight - (isMobile ? 80 : 90) 
  };
  const [astroPos, setAstroPos] = useState(initialAstronautPos);
  
  const [targetPos, setTargetPos] = useState(null); 
  const [activePlanet, setActivePlanet] = useState(null);

  const successSound = useRef(null);
  const errorSound = useRef(null);
  const requestRef = useRef(null); 

  useEffect(() => {
    successSound.current = new Audio(successSoundFile);
    errorSound.current = new Audio(errorSoundFile);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, []);

  // حروف الضمة المطلوبة (الصحيحة)
  const lathwiahLetters = ["دُ","ُر", "وُ", "زُ","قُ", "أُ"];
  
  // بقية الحروف مشكولة بالكامل (بالفتحة وغيرها) لتبدو احترافية وتعليمية صحيحة
  const otherLetters = [
    "أَ", "بَ", "تَ", "جَ", "حَ", "خَ", "دَ", "رَ", "زَ", "سَ", "شَ", 
    "صَ", "وَ", "طَ", "َع", "غَ", "فَ", "َق", "إِ", "لَ", "مَ", "نَ", "هَـ", "يَ"
  ];

  const planetImages = [planet1, planet2, planet3, planet4, planet5];

  const [planets, setPlanets] = useState(() => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;

    const isMobileOrTablet = sw < 1024;

    const positions = isMobileOrTablet 
      ? [
          { x: sw * 0.18, y: sh * 0.22 }, { x: sw * 0.39, y: sh * 0.20 }, { x: sw * 0.61, y: sh * 0.20 }, { x: sw * 0.82, y: sh * 0.22 },
          { x: sw * 0.25, y: sh * 0.37 }, { x: sw * 0.50, y: sh * 0.35 }, { x: sw * 0.75, y: sh * 0.37 },
          { x: sw * 0.18, y: sh * 0.52 }, { x: sw * 0.39, y: sh * 0.50 }, { x: sw * 0.61, y: sh * 0.50 }, { x: sw * 0.82, y: sh * 0.52 },
          { x: sw * 0.28, y: sh * 0.66 }, { x: sw * 0.50, y: sh * 0.64 }, { x: sw * 0.72, y: sh * 0.66 },
          { x: sw * 0.50, y: sh * 0.78 }
        ]
      : [
          { x: sw * 0.12, y: sh * 0.22 }, { x: sw * 0.31, y: sh * 0.20 }, { x: sw * 0.50, y: sh * 0.20 }, { x: sw * 0.69, y: sh * 0.20 }, { x: sw * 0.88, y: sh * 0.22 },
          { x: sw * 0.20, y: sh * 0.38 }, { x: sw * 0.40, y: sh * 0.36 }, { x: sw * 0.60, y: sh * 0.34 }, { x: sw * 0.80, y: sh * 0.40 },
          { x: sw * 0.12, y: sh * 0.54 }, { x: sw * 0.31, y: sh * 0.52 }, { x: sw * 0.50, y: sh * 0.52 }, { x: sw * 0.69, y: sh * 0.52 }, { x: sw * 0.88, y: sh * 0.54 },
          { x: sw * 0.50, y: sh * 0.70 }
        ];

    const pattern = [
      true, false, true, true, false, 
      true, true, false, true, true, 
      false, true, true, false, true
    ];

    const shuffledLathwiah = [...lathwiahLetters].sort(() => Math.random() - 0.5);
    const shuffledOthers = [...otherLetters].sort(() => Math.random() - 0.5);

    let lathwiahIndex = 0;
    let othersIndex = 0;

    return pattern.map((isLathwiah, i) => {
      const text = isLathwiah 
        ? shuffledLathwiah[lathwiahIndex++ % shuffledLathwiah.length] 
        : shuffledOthers[othersIndex++ % shuffledOthers.length];
      const randomPlanetImg = planetImages[Math.floor(Math.random() * planetImages.length)];

      return {
        id: i + 1,
        text,
        isCorrect: isLathwiah,
        image: randomPlanetImg,
        x: positions[i].x,
        y: positions[i].y,
      };
    });
  });

  useEffect(() => {
    const updatePhysics = () => {
      if (targetPos) {
        setAstroPos((current) => {
          const dx = targetPos.x - current.x;
          const dy = targetPos.y - current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = window.innerWidth < 768 ? 6 : 8; 

          if (distance < speed) {
            // eslint-disable-next-line react-hooks/immutability
            handleArrival();
            return targetPos;
          } else {
            return {
              x: current.x + (dx / distance) * speed,
              y: current.y + (dy / distance) * speed,
            };
          }
        });
      } else {
        setAstroPos((current) => ({
          x: current.x,
          y: current.y + Math.sin(Date.now() / 300) * 0.2,
        }));
      }
      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPos]);

  const handleArrival = () => {
    if (!activePlanet) return;

    if (activePlanet.id === "returning") {
      setTargetPos(null);
      setActivePlanet(null);
      return;
    }

    if (activePlanet.isCorrect) {
      if (soundEnabled) successSound.current?.play().catch(() => {});
      setScore((s) => s + 20);
      setPlanets((prev) => prev.filter((p) => p.id !== activePlanet.id));
    } else {
      if (soundEnabled) errorSound.current?.play().catch(() => {});
    }

    setActivePlanet({ id: "returning" });
    setTargetPos({ 
      x: window.innerWidth * 0.15, 
      y: window.innerHeight - (isMobile ? 80 : 90) 
    });
  };

  const handlePlanetSelect = (planet) => {
    if (win || targetPos) return; 
    setActivePlanet(planet);
    setTargetPos({ x: planet.x, y: planet.y });
  };

  useEffect(() => {
    if (win) return;
    const t = setInterval(() => {
      setTime((p) => p + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [win]);

  useEffect(() => {
    const remainingCorrect = planets.filter((p) => p.isCorrect);
    if (remainingCorrect.length === 0 && planets.length > 0 && !win) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWin(true);
      setTargetPos(null);
    }
  }, [planets, win]);

  return (
    <div style={styles.gameContainer}>
      <img
        src={spaceBg}
        alt="Space Background"
        style={styles.spaceBg}
      />

      <div style={topBar}>
        <div style={box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={title}>👨‍🚀 اجمع الكواكب التي تحمل حروف الضمة</div>
        <div style={box}>🚀 {score}</div>
      </div>

      {win ? (
        <div style={medalContainerStyle}>
          <img 
            src={heroMedal} 
            alt="Space Hero Medal" 
            style={styles.medalImg}
          />
          <style>{`
            @keyframes bounceAndPulse {
              0%, 100% { transform: translate(-50%, -50%) translateY(0) scale(1); }
              50% { transform: translate(-50%, -50%) translateY(-15px) scale(1.04); }
            }
          `}</style>
        </div>
      ) : (
        <>
          {planets.map((p) => (
            <div
              key={p.id}
              onClick={() => handlePlanetSelect(p)}
              onTouchEnd={() => handlePlanetSelect(p)}
              className="space-planet"
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img 
                src={p.image} 
                alt="Planet" 
                style={{ width: "100%", height: "100%", position: "absolute", zIndex: 11 }}
              />
              <div className="planet-letter-text" style={styles.planetLetter}>
                {p.text}
              </div>
            </div>
          ))}

          <img
            src={astronaut}
            alt="Astronaut"
            className="space-astronaut"
            style={{
              position: "absolute",
              left: astroPos.x,
              top: astroPos.y,
              zIndex: 50,
              pointerEvents: "none",
              transform: targetPos && targetPos.x < astroPos.x 
                ? "translate(-50%, -50%) scaleX(-1)" 
                : "translate(-50%, -50%) scaleX(1)",
              transition: "transform 0.1s ease"
            }}
          />
        </>
      )}

      {/* أزرار التحكم السفلية (تم جعلها قابلة للنقر فوق الوسام عن طريق تعيين zIndex أعلى وبدون حجب للنقرات) */}
      <div style={styles.bottomButtons}>
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((p) => !p); }} style={styles.circleBtn}>
          {soundEnabled ? <Volume2 size={19} color="white" /> : <VolumeX size={19} color="white" />}
        </button>

        <button onClick={(e) => { e.stopPropagation(); window.location.reload(); }} style={styles.circleBtn}>
          <RotateCcw size={19} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/Alhorof123"); }} style={styles.circleBtn}>
          <ArrowRight size={19} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/home"); }} style={styles.circleBtn}>
          <Home size={19} color="white" />
        </button>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; overflow: hidden; height: 100%; }

        .space-planet {
          width: clamp(54px, 11.5vw, 85px);
          height: clamp(54px, 11.5vw, 85px);
        }
        .space-astronaut {
          width: clamp(100px, 18vw, 140px);
          height: clamp(85px, 15vw, 120px);
        }

        @media (max-width: 767px) {
          .space-planet {
            width: clamp(52px, 13vw, 68px) !important;
            height: clamp(52px, 13vw, 68px) !important;
          }
          .planet-letter-text {
            font-size: clamp(25px, 6vw, 32px) !important;
          }
          .space-astronaut {
            width: 110px !important;
            height: 95px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  gameContainer: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    userSelect: "none",
    backgroundColor: "#020215"
  },
  spaceBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  planetLetter: {
    fontSize: "clamp(24px, 4.8vw, 32px)",
    fontWeight: "bold",
    color: "white", 
    zIndex: 12,
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.9)"
  },
  bottomButtons: {
    position: "absolute",
    bottom: "15px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "clamp(10px, 3vw, 18px)",
    // ✨ تم رفع الـ zIndex لتكون الأزرار أعلى وسام الفوز وتعمل بشكل طبيعي دائماً
    zIndex: 20000,
    pointerEvents: "auto",
  },
  circleBtn: {
    width: "clamp(38px, 8.5vw, 46px)",
    height: "clamp(38px, 8.5vw, 46px)",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "linear-gradient(135deg, #1e1b4b, #312e81)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
    touchAction: "manipulation",
  },
};

const box = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  color: "white",
  padding: "5px 12px",
  borderRadius: 10,
  fontWeight: "bold",
  fontSize: "clamp(12px, 2.5vw, 16px)",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
};

const topBar = {
  position: "fixed",
  top: "15px",
  left: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  zIndex: 9999,
  padding: "0 10px",
  boxSizing: "border-box",
};

const title = {
  background: "linear-gradient(135deg, #4f46e5, #06b6d4)", 
  color: "white",
  padding: "6px 14px",
  borderRadius: 20,
  fontWeight: "bold",
  fontSize: "clamp(11px, 2.8vw, 16px)",
  boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)",
  textAlign: "center",
  maxWidth: "60%",
};

const medalContainerStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  zIndex: 10000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // ✨ تم إضافة هذه الخاصية لكي لا يقوم حاوي الوسام بمنع الضغط عن الأزرار الموجودة أسفله
  pointerEvents: "none", 
};

const stylesMedalImg = {
  width: "clamp(240px, 60vw, 400px)",
  height: "auto",
  filter: "drop-shadow(0px 10px 25px rgba(255, 159, 67, 0.6))",
  animation: "bounceAndPulse 2.5s ease-in-out infinite",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  pointerEvents: "auto",
};

styles.medalImg = stylesMedalImg;