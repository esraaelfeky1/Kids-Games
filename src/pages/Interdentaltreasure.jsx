// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. استيراد الخلفية الخاصة بالصف الدراسي
import classBg from "../assets/treasur.jpeg"; 

// 2. ربط الملفات الصوتية للنجاح والخطأ
import correctSoundFile from "/sounds/hay1.mp3"; 
import errorSoundFile from "/sounds/pop.mp3";   

export default function LathawyaUnifiedGame() {
  const navigate = useNavigate();

  // الحالات الأساسية للعبة
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0); 
  const [win, setWin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardsState, setCardsState] = useState([]);

  const correctSound = useRef(null);
  const errorSound = useRef(null);
  const timerRef = useRef(null);

  // مصفوفة الكلمات التسعة المخلوطة
  const distributedCards = [
    { id: 1, text: "ثوم", isCorrect: true, img: "🧄" },    // لثوي
    { id: 2, text: "بيت", isCorrect: false, img: "🏠" },   // عادي
    { id: 3, text: "ذئب", isCorrect: true, img: "🐺" },    // لثوي
    
    { id: 4, text: "ورد", isCorrect: false, img: "🌹" },   // عادي
    { id: 5, text: "ظرف", isCorrect: true, img: "✉️" },    // لثوي
    { id: 6, text: "شمس", isCorrect: false, img: "☀️" },   // عادي
    
    { id: 7, text: "ذرة", isCorrect: true, img: "🌽" },    // لثوي
    { id: 8, text: "بطيخ", isCorrect: false, img: "🍉" },   // عادي
    { id: 9, text: "ظفر", isCorrect: true, img: "💅" },    // لثوي
  ];

  const initialCards = distributedCards.map((card) => ({ ...card, isFlipped: false }));

  // دالة بدء وإعادة تهيئة اللعبة
  const resetGame = () => {
    setScore(0);
    setTime(0);
    setWin(false);
    setIsProcessing(false);
    
    setCardsState(initialCards.map(card => ({
      ...card,
      isFlipped: false
    })));

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((p) => p + 1);
    }, 1000);
  };

  // التحميل المبدئي للأصوات وإعدادات منع السكرول
  useEffect(() => {
    correctSound.current = new Audio(correctSoundFile);
    errorSound.current = new Audio(errorSoundFile);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetGame();

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // مراقبة حالة الفوز
  useEffect(() => {
    const allCorrectFlipped = cardsState.filter((c) => c.isCorrect && !c.isFlipped).length === 0;
    
    if (allCorrectFlipped && cardsState.length > 0 && !win && !isProcessing) {
      const timer = setTimeout(() => {
        setWin(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [cardsState, win, isProcessing]);

  const handleCardClick = (index) => {
    const currentState = cardsState[index];

    if (win || isProcessing || currentState.isFlipped) return;

    // اقلب الكارت المختار
    setCardsState(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));

    setTimeout(() => {
      if (currentState.isCorrect) {
        if (soundEnabled) correctSound.current?.play().catch(() => {});
        setScore(prev => prev + 10); 
      } else {
        if (soundEnabled) errorSound.current?.play().catch(() => {});
        setIsProcessing(true);

        // انتظر قليلاً ثم أعد لفه للخلف بهدوء
        setTimeout(() => {
          setCardsState(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: false } : c));
          setTimeout(() => {
            setIsProcessing(false);
          }, 300);
        }, 800);
      }
    }, 350);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden", 
        userSelect: "none",
        backgroundColor: "#020215",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        padding: "max(12px, env(safe-area-inset-top)) 10px max(15px, env(safe-area-inset-bottom)) 10px"
      }}
    >
      {/* خلفية اللعبة */}
      <img
        src={classBg}
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* شريط المعلومات العلوي المرن */}
      <div style={topBarStyle}>
        <div style={boxStyle}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        {/* خلفية العنوان أصبحت على قد المحتوى بالضبط وتسمح بالالتفاف في سطرين إذا لزم الأمر */}
        <div style={titleStyle}>
          اكتشف الكلمات التي تبدأ بالحروف اللثوية (ث، ذ، ظ)
        </div>

        <div style={boxStyle}>🚀 {score}</div>
      </div>

      {/* شبكة الكروت المتجاوبة تماماً مع كل شاشات الموبايل */}
      <div
        style={{
          background: "rgba(114, 9, 183, 0.85)", 
          padding: "clamp(8px, 2.5vw, 16px)",
          borderRadius: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(6px, 2vw, 12px)",
          width: "min(90vw, 380px)", 
          height: "min(90vw, 380px)",
          maxHeight: "50vh",
          maxWidth: "50vh",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          zIndex: 10,
          boxSizing: "border-box",
          backdropFilter: "blur(4px)",
          margin: "auto"
        }}
      >
        {cardsState.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            style={{ width: "100%", height: "100%", perspective: "1000px" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: card.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
              }}
            >
              {/* ظهر الكارت الوردي */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundColor: "#f72585", 
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #ffffff",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 2,
                  transform: "rotateY(0deg)"
                }}
              >
                <span style={{ fontSize: "clamp(20px, 6vw, 32px)", color: "white", fontWeight: "bold" }}>❓</span>
              </div>

              {/* وجه الكارت الأبيض */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "clamp(4px, 1.5vw, 8px)",
                  boxSizing: "border-box",
                  border: card.isCorrect ? "2.5px solid #4ade80" : "2px solid #cbd5e1",
                  transform: "rotateY(180deg)",
                  zIndex: 1
                }}
              >
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                  <span style={{ fontSize: "clamp(26px, 8vw, 42px)" }}>{card.img}</span>
                </div>
                <div
                  style={{
                    fontSize: "clamp(11px, 3.2vw, 16px)",
                    fontWeight: "bold",
                    color: "#334155",
                    background: card.isCorrect ? "#f0fdf4" : "#f8fafc",
                    width: "100%",
                    padding: "2px 0",
                    borderRadius: "6px",
                    border: card.isCorrect ? "1.5px solid #4ade80" : "1.5px solid #cbd5e1",
                    textAlign: "center"
                  }}
                >
                  {card.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🏆 رسالة الفوز */}
      {win && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: "#22c55e", margin: "0 0 6px 0", fontSize: "18px", fontWeight: "bold" }}>🎉 ممتاز يا بطل! 🎉</h2>
            <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1e1b4b" }}>النقاط: ⭐ {score}</div>
          </div>
        </div>
      )}

      {/* 📱 شريط التحكم السفلي المرن والمتناسق */}
      <div style={bottomButtonsStyle}>
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((p) => !p); }} style={circleBtnStyle}>
          {soundEnabled ? <Volume2 size={22} color="white" /> : <VolumeX size={22} color="white" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); resetGame(); }} style={circleBtnStyle}>
          <RotateCcw size={22} color="white" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); navigate("/AlHorof1"); }} style={circleBtnStyle}>
          <ArrowRight size={22} color="white" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); navigate("/home"); }} style={circleBtnStyle}>
          <Home size={22} color="white" />
        </button>
      </div>
    </div>
  );
}

/* ===== التنسيقات المتجاوبة (Responsive Styles) ===== */
const topBarStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 999,
  padding: "0 4px",
  boxSizing: "border-box",
  gap: "6px"
};

const boxStyle = {
  background: "rgba(13, 13, 13, 0.35)",
  backdropFilter: "blur(6px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  color: "white",
  padding: "5px 10px",
  borderRadius: 10,
  fontWeight: "bold",
  fontSize: "clamp(11px, 2.8vw, 15px)",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
  minWidth: "48px",
  flexShrink: 0,
};

const titleStyle = {
  background: "linear-gradient(135deg, #4f46e5, #096c7e)", 
  color: "white",
  padding: "6px 12px",
  borderRadius: 16,
  fontWeight: "bold",
  fontSize: "clamp(14px, 2.5vw, 18px)",
  boxShadow: "0 4px 15px rgba(4, 24, 28, 0.4)",
  textAlign: "center",
  width: "fit-content",       /* جعل خلفية العنوان على قد المحتوى تماماً */
  maxWidth: "54%",            /* لكي تضمن عدم تجاوز المساحة الوسطى المتاحة */
  lineHeight: "1.3",
  wordBreak: "break-word",
};

const bottomButtonsStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "clamp(12px, 4vw, 22px)", 
  zIndex: 2005, 
};

const circleBtnStyle = {
  width: "clamp(42px, 11vw, 50px)",
  height: "clamp(42px, 11vw, 50px)",
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  background: "linear-gradient(135deg, #1e1b4b, #312e81)", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  touchAction: "manipulation",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1500, 
};

const modalContentStyle = {
  background: "#ffffff",
  padding: "16px 24px", 
  borderRadius: "20px",
  boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
  textAlign: "center",
  width: "220px", 
  border: "3px solid #cbd5e1",
};