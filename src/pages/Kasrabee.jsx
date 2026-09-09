// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

// استيراد الأصول الخاصة باللعبة
import bg from "../assets/beebg.jpeg";       
import bee from "../assets/bee.png";             

// استيراد تشكيلة الزهور الخمسة لجمالية الحديقة
import flower1 from "../assets/flower1.png";    
import flower2 from "../assets/flower2.png"; 
import flower3 from "../assets/flower3.png";    
import flower4 from "../assets/flower4.png"; 
import flower5 from "../assets/flower5.png";   

// ربط الأصوات الثلاثة
import successSoundFile from "/sounds/hay1.mp3";   
import errorSoundFile from "/sounds/pop.mp3";      
import beeSoundFile from "/sounds/bee.mp3";        

export default function BeeStaticFlowersGame() {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [win, setWin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // دالة ذكية لتحديد نوع الشاشة وحجم الزهور بدقة لجميع الموبايلات والتابلت
  const [windowDimension, setWindowDimension] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sw = windowDimension.winWidth;
  const sh = windowDimension.winHeight;

  // تحديد قياسات متجاوبة تماماً حسب عرض الشاشة (موبايل صغرى، تابلت، ديسكتوب)
  const isMobile = sw < 768;
  const isTablet = sw >= 768 && sw < 1024;

  const flowerSize = isMobile ? Math.min(sw * 0.17, 68) : isTablet ? 90 : 105;

  // موضع النحلة الابتدائي متجاوب مع أي شاشة
  const initialBeePos = { 
    x: isMobile ? sw * 0.25 : isTablet ? sw * 0.20 : 290, 
    y: sh - (isMobile ? 90 : isTablet ? 110 : 100) 
  };
  const [beePos, setBeePos] = useState(initialBeePos);
  
  const [targetPos, setTargetPos] = useState(null); 
  const [activeFlower, setActiveFlower] = useState(null);

  // مرجع الأصوات وحلقة الحركة
  const successSound = useRef(null);
  const errorSound = useRef(null);
  const beeSound = useRef(null);
  const requestRef = useRef(null); 

  useEffect(() => {
    successSound.current = new Audio(successSoundFile);
    errorSound.current = new Audio(errorSoundFile);
    
    beeSound.current = new Audio(beeSoundFile);
    beeSound.current.loop = true;
  }, []);

  // التحكم في صوت طيران النحلة
  useEffect(() => {
    if (targetPos && soundEnabled) {
      beeSound.current?.play().catch(() => {});
    } else {
      beeSound.current?.pause();
      if (beeSound.current) beeSound.current.currentTime = 0;
    }
  }, [targetPos, soundEnabled]);

  // منع السكرول تماماً للحفاظ على أبعاد اللعبة ثابتة
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, []);

  // الحروف مع الحركات (التركيز الأساسي على حركة الكسر ِ والهدف الثانوي حركة الضم ُ)
  const kasrahLetters = ["بِ", "تِ", "ثِ", "جِ", "حِ", "خِ", "دِ", "ذِ", "رِ", "زِ", "سِ", "شِ", "صِ", "ضِ", "طِ", "ظِ", "عِ", "غِ", "فِ", "قِ", "كِ", "لِ", "مِ", "نِ", "هـِ", "وِ", "يِ"];
  const dammahLetters = ["بُ", "تُ", "ثُ", "جُ", "حُ", "خُ", "دُ", "ذُ", "رُ", "زُ", "سُ", "شُ", "صُ", "ضُ", "طُ", "ظُ", "عُ", "غُ", "فُ", "قُ", "كُ", "لُ", "مُ", "نُ", "هـُ", "وُ", "يُ"];

  const flowerImages = [flower1, flower2, flower3, flower4, flower5];

  // توليد 15 زهرة متجاوبة بالكامل لجميع الشاشات
  const [flowers, setFlowers] = useState(() => {
    const positions = [
      { x: 0.15, y: 0.22 }, { x: 0.38, y: 0.20 }, { x: 0.62, y: 0.20 }, { x: 0.85, y: 0.22 },
      { x: 0.20, y: 0.36 }, { x: 0.50, y: 0.34 }, { x: 0.80, y: 0.36 },
      { x: 0.15, y: 0.51 }, { x: 0.38, y: 0.49 }, { x: 0.62, y: 0.49 }, { x: 0.85, y: 0.51 },
      { x: 0.23, y: 0.66 }, { x: 0.50, y: 0.65 }, { x: 0.77, y: 0.66 },
      { x: 0.50, y: 0.78 }
    ];

    const pattern = [
      true,  false, true,  true,  false, 
      true,  false, true,  true,  false, 
      true,  false, true,  false, true 
    ];

    const shuffledKasrah = [...kasrahLetters].sort(() => Math.random() - 0.5);
    const shuffledDammah = [...dammahLetters].sort(() => Math.random() - 0.5);

    let kasrahIdx = 0;
    let dammahIdx = 0;

    return pattern.map((isKasrah, i) => {
      const text = isKasrah 
        ? shuffledKasrah[kasrahIdx++ % shuffledKasrah.length] 
        : shuffledDammah[dammahIdx++ % shuffledDammah.length];
      
      const randomFlowerImg = flowerImages[Math.floor(Math.random() * flowerImages.length)];

      return {
        id: i + 1,
        text,
        isTarget: isKasrah,
        image: randomFlowerImg,
        xRatio: positions[i].x,
        yRatio: positions[i].y,
      };
    });
  });

  // محرك طيران النحلة المتجاوب
  useEffect(() => {
    const updatePhysics = () => {
      if (targetPos) {
        setBeePos((current) => {
          const dx = targetPos.x - current.x;
          const dy = targetPos.y - current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = isMobile ? 9 : 14; 

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
        setBeePos((current) => ({
          x: current.x,
          y: current.y + Math.sin(Date.now() / 180) * 0.3,
        }));
      }
      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPos, isMobile]);

  const handleArrival = () => {
    if (!activeFlower) return;

    if (activeFlower.id === "returning") {
      setTargetPos(null);
      setActiveFlower(null);
      return;
    }

    beeSound.current?.pause();

    if (activeFlower.isTarget) {
      if (soundEnabled) successSound.current?.play().catch(() => {});
      setScore((s) => s + 10);
      setFlowers((prev) => prev.filter((f) => f.id !== activeFlower.id));
    } else {
      if (soundEnabled) errorSound.current?.play().catch(() => {});
    }

    setActiveFlower({ id: "returning" });
    setTargetPos({ 
      x: isMobile ? sw * 0.25 : isTablet ? sw * 0.20 : 90, 
      y: sh - (isMobile ? 110 : isTablet ? 130 : 160) 
    });
  };

  const handleFlowerSelect = (flower) => {
    if (win || targetPos) return; 
    setActiveFlower(flower);
    setTargetPos({ 
      x: flower.xRatio * sw, 
      y: flower.yRatio * sh 
    });
  };

  useEffect(() => {
    if (win) return;
    const t = setInterval(() => {
      setTime((p) => p + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [win]);

  useEffect(() => {
    const remainingTargets = flowers.filter((f) => f.isTarget);
    if (remainingTargets.length === 0 && flowers.length > 0 && !win) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWin(true);
      setTargetPos(null);
    }
  }, [flowers, win]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* خلفية الحديقة */}
      <img
        src={bg}
        alt="background"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* الشريط العلوي المتجاوب */}
      <div style={topBar}>
        <div style={box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={title}>🐝 اضغط على الزهرة ذات الحرف المكسور (حركة الكسر)</div>
        <div style={box}>🏆 {score}</div>
      </div>

      {/* نافذة الفوز المتجاوبة */}
      {win && (
        <div style={winStyle}>
          <div style={{ fontSize: isMobile ? "1.3rem" : isTablet ? "1.8rem" : "2.5rem", marginBottom: 10 }}>🎉 أداء أسطوري يا بطل!</div>

          
          <div style={{ fontSize: isMobile ? "1rem" : isTablet ? "1.3rem" : "1.6rem", color: "#ff9f43" }}>
            🏆 مجموع نقاطك النهائي: <strong>{score}</strong>
          </div>
        </div>
      )}

      {/* الزهور المتجاوبة مع خط وحركات ضخمة وبارزة جداً (Bold 900) */}
      {flowers.map((f) => {
        const posX = f.xRatio * sw;
        const posY = f.yRatio * sh;

        return (
          <div
            key={f.id}
            onClick={() => handleFlowerSelect(f)}
            onTouchEnd={() => handleFlowerSelect(f)}
            style={{
              position: "absolute",
              left: posX,
              top: posY,
              width: flowerSize,
              height: flowerSize,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img 
              src={f.image} 
              alt="flower" 
              style={{ width: "100%", height: "100%", position: "absolute", zIndex: 11 }}
            />
            
            {/* تم زيادة حجم الخط وجعله عريضاً جداً (900) مع ظل نصي لتبدو الحركة والحرف واضحة وضخمة */}
            <div
              style={{
                fontSize: isMobile ? 25 : isTablet ? 36 : 42, 
                fontWeight: "900",
                color: "#1a202c",
                zIndex: 12,
                paddingBottom: isMobile ? "6px" : "8px",
                textShadow: "0px 0px 4px rgba(255, 255, 255, 0.95), 0px 1px 2px rgba(0,0,0,0.3)",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "1px",
              }}
            >
              {f.text}
            </div>
          </div>
        );
      })}

      {/* النحلة المتجاوبة */}
      <img
        src={bee}
        alt="bee"
        style={{
          position: "absolute",
          left: beePos.x,
          top: beePos.y,
          width: isMobile ? 45 : isTablet ? 65 : 80, 
          height: isMobile ? 45 : isTablet ? 65 : 80,
          zIndex: 50,
          pointerEvents: "none",
          transform: targetPos && targetPos.x < beePos.x 
            ? "translate(-50%, -50%) scaleX(-1)" 
            : "translate(-50%, -50%) scaleX(1)",
        }}
      />

      {/* أزرار التحكم السفلى المتجاوبة */}
      <div style={styles.bottomButtons}>
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((p) => !p); }} style={styles.circleBtn(isMobile, isTablet)}>
          {soundEnabled ? <Volume2 size={isMobile ? 18 : isTablet ? 22 : 24} color="white" /> : <VolumeX size={isMobile ? 18 : isTablet ? 22 : 24} color="white" />}
        </button>

        <button onClick={(e) => { e.stopPropagation(); window.location.reload(); }} style={styles.circleBtn(isMobile, isTablet)}>
          <RotateCcw size={isMobile ? 18 : isTablet ? 22 : 24} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/AlHorof123"); }} style={styles.circleBtn(isMobile, isTablet)}>
          <ArrowRight size={isMobile ? 18 : isTablet ? 22 : 24} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/home"); }} style={styles.circleBtn(isMobile, isTablet)}>
          <Home size={isMobile ? 18 : isTablet ? 22 : 24} color="white" />
        </button>
      </div>
    </div>
  );
}

/* ===== التنسيقات المتجاوبة لجميع الشاشات والأجهزة ===== */
const box = {
  background: "white",
  padding: "4px 8px",
  borderRadius: 8,
  fontWeight: "bold",
  fontSize: "clamp(10px, 2.5vw, 15px)", 
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  minWidth: "45px",
};

const topBar = {
  position: "fixed",
  top: window.innerWidth < 768 ? 12 : 25, 
  left: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  zIndex: 9999,
  padding: "0 6px",
  boxSizing: "border-box",
};

const title = {
  background: "#ff9f43", 
  color: "white",
  padding: "4px 10px",
  borderRadius: 16,
  fontWeight: "bold",
  fontSize: "clamp(10px, 2.7vw, 16px)", 
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  textAlign: "center",
  maxWidth: "58%",
};

const winStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  background: "white",
  padding: "20px 25px",
  borderRadius: 20,
  fontWeight: "bold",
  zIndex: 10000,
  textAlign: "center",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
  border: "4px solid #ff9f43",
  width: "35%",
  maxWidth: "420px",
  boxSizing: "border-box",
};

const styles = {
  bottomButtons: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: window.innerWidth < 768 ? 10 : 16,
    zIndex: 1000,
  },
  circleBtn: (isMobile, isTablet) => ({
    width: isMobile ? 38 : isTablet ? 46 : 52,
    height: isMobile ? 38 : isTablet ? 46 : 52,
    borderRadius: "50%",
    border: "none",
    background: "#ff9f43",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    touchAction: "manipulation",
  }),
};