// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. استيراد الخلفية وصور قطرات المطر الستة
import rainBg from "../assets/dropbg.jpeg";       
import drop1 from "../assets/drop1.png";    
import drop2 from "../assets/drop2.png"; 
import drop3 from "../assets/drop3.png";    
import drop4 from "../assets/drop4.png"; 
import drop5 from "../assets/drop5.png";   
import drop6 from "../assets/drop6.png";

// 2. ربط الملفات الصوتية للفرقعة والخطأ
import popSoundFile from "/sounds/hay1.mp3"; 
import errorSoundFile from "/sounds/pop.mp3";     

export default function RainLettersGame() {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [win, setWin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [drops, setDrops] = useState([]);

  // حالة لتتبع أبعاد الشاشة لتفعيل التجاوب اللحظي دون الحاجة لأي ريفرش
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
  const dropSize = isMobile ? Math.min(screenSize.width * 0.16, 75) : 105; 

  const popSound = useRef(null);
  const errorSound = useRef(null);
  const requestRef = useRef(null);

  const lathwiahLetters = ["ث", "ذ", "ظ"];
  const otherLetters = [
    "أ", "ب", "ت", "ج", "ح", "خ", "د", "ر", "ز", "س", "ش", 
    "ص", "ض", "ط", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"
  ];
  const dropImages = [drop1, drop2, drop3, drop4, drop5, drop6];

  // ⚡ إعادة تحميل سريعة وفورية للصفحة
  const handleFastReload = () => {
    window.location.replace(window.location.pathname);
  };

  // دالة توليد قطرة منفردة تناسب العرض الحالي
  const generateDrop = () => {
    const isLathwiah = Math.random() < 0.4; 
    const text = isLathwiah 
      ? lathwiahLetters[Math.floor(Math.random() * lathwiahLetters.length)]
      : otherLetters[Math.floor(Math.random() * otherLetters.length)];
      
    const randomImg = dropImages[Math.floor(Math.random() * dropImages.length)];
    const randomX = Math.random() * (window.innerWidth - dropSize) + dropSize / 2;
    const speed = isMobile ? 1.5 : 2.2; 

    return {
      id: Date.now() + Math.random(),
      text,
      isCorrect: isLathwiah,
      image: randomImg,
      x: randomX,
      y: -dropSize, 
      speed,
      isPopping: false 
    };
  };

  // تحميل الأصوات وتوليد أول دفعة قطرات فوراً عند فتح اللعبة
  useEffect(() => {
    popSound.current = new Audio(popSoundFile);
    errorSound.current = new Audio(errorSoundFile);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrops([generateDrop(), generateDrop(), generateDrop()]);

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // تحديث وقت اللعبة
  useEffect(() => {
    if (win) return;
    const t = setInterval(() => {
      setTime((p) => p + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [win]);

  // استمرار توليد المطر تلقائياً بعد البداية الفورية
  useEffect(() => {
    if (win) return;
    const spawnInterval = setInterval(() => {
      setDrops((prev) => {
        if (prev.length < 8) {
          return [...prev, generateDrop()];
        }
        return prev;
      });
    }, 1600); 

    return () => clearInterval(spawnInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win, screenSize]);

  // حركة المطر لأسفل
  useEffect(() => {
    const updateMovement = () => {
      if (win) return;

      setDrops((prevDrops) => {
        return prevDrops
          .map((drop) => {
            if (drop.isPopping) return drop;
            return { ...drop, y: drop.y + drop.speed };
          })
          .filter((drop) => drop.y < window.innerHeight - 80);
      });

      requestRef.current = requestAnimationFrame(updateMovement);
    };

    requestRef.current = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(requestRef.current);
  }, [win]);

  // مراقبة الفوز
  useEffect(() => {
    if (score >= 100 && !win) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWin(true);
      setDrops([]); 
    }
  }, [score, win]);

  const handleDropClick = (clickedDrop) => {
    if (win || clickedDrop.isPopping) return;

    if (clickedDrop.isCorrect) {
      if (soundEnabled) popSound.current?.play().catch(() => {});
      setScore((s) => s + 10);

      setDrops((prev) =>
        prev.map((d) => (d.id === clickedDrop.id ? { ...d, isPopping: true } : d))
      );
      setTimeout(() => {
        setDrops((prev) => prev.filter((d) => d.id !== clickedDrop.id));
      }, 200);

    } else {
      if (soundEnabled) errorSound.current?.play().catch(() => {});
    }
  };

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
        backgroundColor: "#a3e635",
        direction: "rtl"
      }}
    >
      {/* خلفية اللعبة */}
      <img
        src={rainBg}
        alt="Rain Background"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* شريط المعلومات العلوي المتجاوب */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={styles.title}>🌧️ اضغطي بسرعة على الحروف اللثوية قبل ما تقع</div>
        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* عرض قطرات المطر أثناء اللعب فقط */}
      {!win && (
        <>
          {drops.map((d) => (
            <div
              key={d.id}
              onClick={() => handleDropClick(d)}
              onTouchStart={() => handleDropClick(d)}
              style={{
                position: "absolute",
                left: d.x,
                top: d.y,
                width: dropSize,
                height: dropSize,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: d.isPopping ? "transform 0.2s ease-out, opacity 0.2s ease-out" : "none",
                transformOrigin: "center",
                opacity: d.isPopping ? 0 : 1,
                scale: d.isPopping ? "1.4" : "1",
              }}
            >
              <img 
                src={d.image} 
                alt="Rain Drop" 
                style={{ width: "100%", height: "100%", position: "absolute", zIndex: 11 }}
              />
              <div
                style={{
                  fontSize: isMobile ? "clamp(20px, 5.5vw, 28px)" : 36, 
                  fontWeight: "bold",
                  color: "#ffffff", 
                  zIndex: 12,
                }}
              >
                {d.text}
              </div>
            </div>
          ))}
        </>
      )}

      {/* نافذة الفوز المتجاوبة */}
      {win && (
        <div style={styles.winModalOverlay}>
          <div style={styles.winModalContent}>
            <h2 style={styles.winTitle}>🎉 أَحْسَنْتِ يا بَطَلْ! 🎉</h2>
            <p style={styles.winScoreText}>لَقَدْ جَمَعْتَ كُلَّ النِّقَاطِ</p>
            <div style={styles.winScoreBox}>⭐ {score} نُقْطَة</div>
          </div>
        </div>
      )}

      {/* أزرار التحكم السفلية المتجاوبة */}
      <div style={styles.bottomButtons}>
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((p) => !p); }} style={styles.circleBtn}>
          {soundEnabled ? <Volume2 size={isMobile ? 20 : 24} color="white" /> : <VolumeX size={isMobile ? 20 : 24} color="white" />}
        </button>

        <button onClick={(e) => { e.stopPropagation(); handleFastReload(); }} style={styles.circleBtn}>
          <RotateCcw size={isMobile ? 20 : 24} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/AlHorof1"); }} style={styles.circleBtn}>
          <ArrowRight size={isMobile ? 20 : 24} color="white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); navigate("/home"); }} style={styles.circleBtn}>
          <Home size={isMobile ? 20 : 24} color="white" />
        </button>
      </div>
    </div>
  );
}

/* ===== كائن الستايلات المتجاوبة ===== */
const styles = {
  topBar: {
    position: "fixed",
    top: window.innerWidth < 768 ? 15 : 25, 
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 9999,
    padding: "0 8px",
    boxSizing: "border-box",
  },
  box: {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(6px)",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    color: "#1e3a8a",
    padding: "5px 10px",
    borderRadius: 12,
    fontWeight: "bold",
    fontSize: "clamp(11px, 2.8vw, 15px)",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    minWidth: "50px",
  },
  title: {
    background: "linear-gradient(135deg, #2563eb, #38bdf8)", 
    color: "white",
    padding: "8px 12px",
    borderRadius: 18,
    fontWeight: "bold",
    fontSize: "clamp(11px, 3.2vw, 16px)",
    boxShadow: "0 5px 15px rgba(37, 99, 235, 0.3)",
    textAlign: "center",
    maxWidth: "60%",
  },
  winModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winModalContent: {
    background: "linear-gradient(135deg, #ffffff, #f0fdf4)", 
    padding: "20px",
    borderRadius: "24px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    textAlign: "center",
    maxWidth: "85%",
    width: "280px",
    border: "4px solid #4ade80", 
  },
  winTitle: {
    color: "#16a34a",
    margin: "0 0 10px 0",
    fontSize: "22px",
    fontWeight: "bold"
  },
  winScoreText: {
    color: "#202122",
    margin: "0 0 15px 0",
    fontSize: "15px"
  },
  winScoreBox: {
    background: "#fef08a",
    color: "#854d0e",
    padding: "6px 15px",
    borderRadius: "15px",
    display: "inline-block",
    fontWeight: "bold",
    fontSize: "18px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  bottomButtons: {
    position: "absolute",
    bottom: 15,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: window.innerWidth < 768 ? 12 : 20,
    zIndex: 1000, 
  },
  circleBtn: {
    width: window.innerWidth < 768 ? 42 : 54, 
    height: window.innerWidth < 768 ? 42 : 54,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(0,0,0,0.25)",
    touchAction: "manipulation",
  },
};