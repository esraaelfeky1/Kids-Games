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

  const isMobile = window.innerWidth < 768;
  const flowerSize = isMobile ? 60 : 95;

  // موضع النحلة الابتدائي بالحجم الأصلي
  const initialBeePos = { 
    x: isMobile ? 120 : 290, 
    y: window.innerHeight - (isMobile ? 100 : 100) 
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

  // الحروف المفخمة والمرققة
  const heavyLetters = ["خ", "ص", "ض", "غ", "ط", "ق", "ظ"];
  const baseLetters = [
    "أ", "ب", "ت", "ث", "ج", "ح", "د", "ذ", "ر", "ز", "س", "ش", 
    "ع", "ف", "ك", "ل", "م", "ن", "هـ", "و", "ي"
  ];

  const flowerImages = [flower1, flower2, flower3, flower4, flower5];

  // توليد 15 زهرة ثابتة مع التجاوب التلقائي للشاشات
  const [flowers, setFlowers] = useState(() => {
    const sw = window.innerWidth;
    const sh = window.innerHeight;

    const positions = isMobile 
      ? [
          { x: sw * 0.15, y: sh * 0.22 }, { x: sw * 0.38, y: sh * 0.20 }, { x: sw * 0.62, y: sh * 0.20 }, { x: sw * 0.85, y: sh * 0.22 },
          { x: sw * 0.23, y: sh * 0.36 }, { x: sw * 0.50, y: sh * 0.34 }, { x: sw * 0.77, y: sh * 0.36 },
          { x: sw * 0.15, y: sh * 0.51 }, { x: sw * 0.38, y: sh * 0.49 }, { x: sw * 0.62, y: sh * 0.49 }, { x: sw * 0.85, y: sh * 0.51 },
          { x: sw * 0.23, y: sh * 0.66 }, { x: sw * 0.50, y: sh * 0.65 }, { x: sw * 0.77, y: sh * 0.66 },
          { x: sw * 0.50, y: sh * 0.78 }
        ]
      : [
          { x: sw * 0.12, y: sh * 0.24 }, { x: sw * 0.31, y: sh * 0.22 }, { x: sw * 0.50, y: sh * 0.22 }, { x: sw * 0.69, y: sh * 0.22 }, { x: sw * 0.88, y: sh * 0.24 },
          { x: sw * 0.20, y: sh * 0.40 }, { x: sw * 0.40, y: sh * 0.38 }, { x: sw * 0.60, y: sh * 0.36 }, { x: sw * 0.80, y: sh * 0.40 },
          { x: sw * 0.12, y: sh * 0.58 }, { x: sw * 0.31, y: sh * 0.56 }, { x: sw * 0.50, y: sh * 0.56 }, { x: sw * 0.69, y: sh * 0.56 }, { x: sw * 0.88, y: sh * 0.58 },
          { x: sw * 0.50, y: sh * 0.74 }
        ];

    const pattern = [
      false, true,  false, false, true, 
      false, false, true,  false, false, 
      true,  false, false, true,  false
    ];

    const shuffledHeavy = [...heavyLetters].sort(() => Math.random() - 0.5);
    const shuffledLight = [...baseLetters].sort(() => Math.random() - 0.5);

    let heavyIndex = 0;
    let lightIndex = 0;

    return pattern.map((isHeavy, i) => {
      const text = isHeavy ? shuffledHeavy[heavyIndex++ % shuffledHeavy.length] : shuffledLight[lightIndex++ % shuffledLight.length];
      const randomFlowerImg = flowerImages[Math.floor(Math.random() * flowerImages.length)];

      return {
        id: i + 1,
        text,
        heavy: isHeavy,
        image: randomFlowerImg,
        x: positions[i].x,
        y: positions[i].y,
      };
    });
  });

  // محرك طيران النحلة
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
  }, [targetPos]);

  const handleArrival = () => {
    if (!activeFlower) return;

    if (activeFlower.id === "returning") {
      setTargetPos(null);
      setActiveFlower(null);
      return;
    }

    beeSound.current?.pause();

    if (!activeFlower.heavy) {
      if (soundEnabled) successSound.current?.play().catch(() => {});
      setScore((s) => s + 10);
      setFlowers((prev) => prev.filter((f) => f.id !== activeFlower.id));
    } else {
      if (soundEnabled) errorSound.current?.play().catch(() => {});
    }

    // عودة النحلة لمكانها الأصلي
    setActiveFlower({ id: "returning" });
    setTargetPos({ 
      x: isMobile ? 45 : 90, 
      y: window.innerHeight - (isMobile ? 120 : 160) 
    });
  };

  const handleFlowerSelect = (flower) => {
    if (win || targetPos) return; 
    setActiveFlower(flower);
    setTargetPos({ x: flower.x, y: flower.y });
  };

  useEffect(() => {
    if (win) return;
    const t = setInterval(() => {
      setTime((p) => p + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [win]);

  useEffect(() => {
    const remainingLight = flowers.filter((f) => !f.heavy);
    if (remainingLight.length === 0 && flowers.length > 0 && !win) {
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

      {/* الشريط العلوي (العنوان، الوقت، النقاط) */}
      <div style={topBar}>
        <div style={box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={title}>اضغط على الزهرة ذات الحروف المرققة</div>
        <div style={box}>🏆 {score}</div>
      </div>

      {/* نافذة الفوز */}
      {win && (
        <div style={winStyle}>
          <div style={{ fontSize: isMobile ? "1.4rem" : "2.5rem", marginBottom: 10 }}>🎉 أداء أسطوري يا بطل!</div>
          <div style={{ fontSize: isMobile ? "0.9rem" : "1.4rem", color: "#4a5568", marginBottom: 15 }}>
            لقد تمكنت من فرز جميع الحروف المرققة بنجاح واقتدار!
          </div>
          <div style={{ fontSize: isMobile ? "1.1rem" : "1.6rem", color: "#ff9f43" }}>
            🏆 مجموع نقاطك النهائي: <strong>{score}</strong>
          </div>
        </div>
      )}

      {/* الزهور بالحجم الأصلي */}
      {flowers.map((f) => (
        <div
          key={f.id}
          onClick={() => handleFlowerSelect(f)}
          onTouchEnd={() => handleFlowerSelect(f)}
          style={{
            position: "absolute",
            left: f.x,
            top: f.y,
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
          
          <div
            style={{
              fontSize: isMobile ? 22 : 28, // تم تكبير الحروف قليلاً على الموبايل لتكون أوضح
              fontWeight: "bold",
              color: "black",
              zIndex: 12,
              paddingBottom: isMobile ? "2px" : "6px"
            }}
          >
            {f.text}
          </div>
        </div>
      ))}

      {/* النحلة بالحجم الأصلي */}
      <img
        src={bee}
        alt="bee"
        style={{
          position: "absolute",
          left: beePos.x,
          top: beePos.y,
          width: isMobile ? 50 : 80, 
          height: isMobile ? 50 : 80,
          zIndex: 50,
          pointerEvents: "none",
          transform: targetPos && targetPos.x < beePos.x 
            ? "translate(-50%, -50%) scaleX(-1)" 
            : "translate(-50%, -50%) scaleX(1)",
        }}
      />

      {/* أزرار التحكم السفلى */}
      <div style={styles.bottomButtons}>
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((p) => !p); }} style={styles.circleBtn}>
          {soundEnabled ? <Volume2 size={isMobile ? 22 : 24} color="white" /> : <VolumeX size={isMobile ? 22 : 24} color="white" />}
        </button>

        <button onClick={(e) => { e.stopPropagation(); window.location.reload(); }} style={styles.circleBtn}>
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

/* ===== التنسيقات ===== */
const box = {
  background: "white",
  padding: "5px 10px",
  borderRadius: 9,
  fontWeight: "bold",
  fontSize: "clamp(12px, 2.8vw, 15px)", 
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  minWidth: "50px",
};

const topBar = {
  position: "fixed",
  top: window.innerWidth < 768 ? 15 : 35, 
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
  padding: "5px 12px",
  borderRadius: 18,
  fontWeight: "bold",
  fontSize: "clamp(12px, 3.1vw, 16px)", 
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  textAlign: "center",
  maxWidth: "60%",
};

const winStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  background: "white",
  padding: "25px 30px",
  borderRadius: 20,
  fontWeight: "bold",
  zIndex: 10000,
  textAlign: "center",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
  border: "4px solid #ff9f43",
  width: "85%",
  maxWidth: "420px",
  boxSizing: "border-box",
};

const styles = {
  bottomButtons: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: window.innerWidth < 768 ? 12 : 18,
    zIndex: 1000,
  },
  circleBtn: {
    width: window.innerWidth < 768 ? 44 : 52,
    height: window.innerWidth < 768 ? 44 : 52,
    borderRadius: "50%",
    border: "none",
    background: "#ff9f43",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    touchAction: "manipulation",
  },
};