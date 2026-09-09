
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

  // حالة لتتبع أبعاد الشاشة الحظية لضمان الاستجابة الفورية بدون ريفرش
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenSize.width < 768;
  const planetSize = isMobile ? 65 : 100; 

  // 🎯 مكان رائد الفضاء الأصلي تماماً (مع تحديث لحظي لو حجم الشاشة اتغير)
  const initialAstronautPos = { 
    x: screenSize.width * 0.5 - (isMobile ? 195 : 290), 
    y: screenSize.height - (isMobile ? 98 : 90) 
  };

  const [astroPos, setAstroPos] = useState(initialAstronautPos);
  const [targetPos, setTargetPos] = useState(null); 
  const [activePlanet, setActivePlanet] = useState(null);

  const successSound = useRef(null);
  const errorSound = useRef(null);
  const requestRef = useRef(null); 

  // تحديث مكان رائد الفضاء فوراً لو الشاشة اتغيرت مقاساتها
  useEffect(() => {
    if (!targetPos && !activePlanet) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAstroPos(initialAstronautPos);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  // ⚡ إعادة تحميل سريعة وفورية للصفحة
  const handleFastReload = () => {
    window.location.replace(window.location.pathname);
  };

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

  // ✂️ حروف القطع (الرافصة)
  const qatLetters = ["أ", "د", "ذ", "ر", "ز", "و"];
  const otherLetters = [
    "ب", "ت", "ث", "ج", "ح", "خ", "س", "ش", 
    "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "ي"
  ];

  const planetImages = [planet1, planet2, planet3, planet4, planet5];

  const [planets, setPlanets] = useState(() => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;

    const positions = isMobile 
      ? [
          { x: sw * 0.15, y: sh * 0.20 }, { x: sw * 0.38, y: sh * 0.18 }, { x: sw * 0.62, y: sh * 0.18 }, { x: sw * 0.85, y: sh * 0.20 },
          { x: sw * 0.23, y: sh * 0.34 }, { x: sw * 0.50, y: sh * 0.32 }, { x: sw * 0.77, y: sh * 0.34 },
          { x: sw * 0.15, y: sh * 0.48 }, { x: sw * 0.38, y: sh * 0.46 }, { x: sw * 0.62, y: sh * 0.46 }, { x: sw * 0.85, y: sh * 0.48 },
          { x: sw * 0.23, y: sh * 0.62 }, { x: sw * 0.50, y: sh * 0.60 }, { x: sw * 0.77, y: sh * 0.62 },
          { x: sw * 0.50, y: sh * 0.74 }
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

    const shuffledQat = [...qatLetters].sort(() => Math.random() - 0.5);
    const shuffledOthers = [...otherLetters].sort(() => Math.random() - 0.5);

    let qatIndex = 0;
    let othersIndex = 0;

    return pattern.map((isQat, i) => {
      const text = isQat 
        ? shuffledQat[qatIndex++ % shuffledQat.length] 
        : shuffledOthers[othersIndex++ % shuffledOthers.length];
      const randomPlanetImg = planetImages[Math.floor(Math.random() * planetImages.length)];

      return {
        id: i + 1,
        text,
        isCorrect: isQat,
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
          const speed = isMobile ? 6 : 8; 

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
    setTargetPos(initialAstronautPos);
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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        userSelect: "none",
        backgroundColor: "#020215",
        direction: "rtl"
      }}
    >
      {/* خلفية الفضاء الثابتة */}
      <img
        src={spaceBg}
        alt="Space Background"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* شريط المعلومات العلوي */}
      <div style={topBar}>
        <div style={box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={title}>👨‍🚀 اجمع الكواكب التي تحمل حروف القطع </div>
        <div style={box}>🚀 {score}</div>
      </div>

      {/* شاشة الفوز */}
      {win ? (
        <div style={medalContainerStyle}>
          <img 
            src={heroMedal} 
            alt="Space Hero Medal" 
            style={{
              width: isMobile ? "290px" : "450px",
              height: "auto",
              marginBottom: isMobile ? "550px" : "500px",
              filter: "drop-shadow(0px 10px 25px rgba(255, 159, 67, 0.6))",
              animation: "bounceAndPulse 2.5s ease-in-out infinite"
            }}
          />
          <style>{`
            @keyframes bounceAndPulse {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-15px) scale(1.04); }
            }
          `}</style>
        </div>
      ) : (
        <>
          {/* رسم الكواكب */}
          {planets.map((p) => (
            <div
              key={p.id}
              onClick={() => handlePlanetSelect(p)}
              onTouchEnd={() => handlePlanetSelect(p)}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                width: planetSize,
                height: planetSize,
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
              <div
                style={{
                  fontSize: isMobile ? 22 : 32, 
                  fontWeight: "bold",
                  color: "white", 
                  zIndex: 12,
                  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.8)"
                }}
              >
                {p.text}
              </div>
            </div>
          ))}

          {/* 🚀 رائد الفضاء بمكانه الأصلي مع ريسبونسيف فوري */}
          <img
            src={astronaut}
            alt="Astronaut"
            style={{
              position: "absolute",
              left: astroPos.x,
              top: astroPos.y,
              width: isMobile ? 120 : 150, 
              height: isMobile ? 120 : 150,
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

      {/* أزرار التحكم السفلية */}
      <div style={styles.bottomButtons}>
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((p) => !p); }} style={styles.circleBtn}>
          {soundEnabled ? <Volume2 size={isMobile ? 22 : 24} color="white" /> : <VolumeX size={isMobile ? 22 : 24} color="white" />}
        </button>

        <button onClick={(e) => { e.stopPropagation(); handleFastReload(); }} style={styles.circleBtn}>
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

/* ===== التنسيقات والستايلات ===== */
const box = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  color: "white",
  padding: "6px 14px",
  borderRadius: 12,
  fontWeight: "bold",
  fontSize: "clamp(11px, 2.5vw, 16px)",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  minWidth: "55px",
};

const topBar = {
  position: "fixed",
  top: window.innerWidth < 768 ? 25 : 30, 
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
  padding: "8px 16px",
  borderRadius: 20,
  fontWeight: "bold",
  fontSize: "clamp(10px, 2.8vw, 17px)",
  boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)",
  textAlign: "center",
  maxWidth: "65%",
};

const medalContainerStyle = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 10000,
  pointerEvents: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "auto",
};

const styles = {
  bottomButtons: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: window.innerWidth < 768 ? 16 : 20,
    zIndex: 10001,
  },
  circleBtn: {
    width: window.innerWidth < 768 ? 46 : 54,
    height: window.innerWidth < 768 ? 46 : 54,
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