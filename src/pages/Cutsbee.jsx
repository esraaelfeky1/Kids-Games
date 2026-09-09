// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bg from "../assets/Cutsbg.jpeg";
import honeyGrid from "../assets/hgh.ihvbee.png"; 
import beeImg from "../assets/bee.png";
import hiveImg from "../assets/ogdibee.png";
import successSound from "/sounds/hay1.mp3";
import errorSound from "/sounds/pop.mp3";

export default function HoneyBeeGame() {
  const navigate = useNavigate();
  const gridRef = useRef(null); 
  const successAudio = useRef(new Audio(successSound));
  const errorAudio = useRef(new Audio(errorSound));
  
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [collected, setCollected] = useState([]); // الحروف الصحيحة التي تم تخزينها
  const [tempHidden, setTempHidden] = useState(null); // الحرف الذي تحمله النحلة حالياً
  const [honeyCount, setHoneyCount] = useState(0);
  const [win, setWin] = useState(false);
  const [beePos, setBeePos] = useState({ x: 50, y: window.innerHeight - 150 });

  const cutLetters = ["أ", "د", "ذ", "ر", "ز", "و"];
  const lettersData = [
    { id: 1, letter: "ر", x: "21%", y: "10%" }, { id: 2, letter: "ت", x: "38%", y: "11%" },
    { id: 3, letter: "أ", x: "58%", y: "13%" }, { id: 4, letter: "و", x: "40%", y: "30%" },
    { id: 5, letter: "م", x: "22%", y: "29%" }, { id: 6, letter: "د", x: "72%", y: "40%" },
    { id: 7, letter: "ن", x: "21%", y: "49%" }, { id: 8, letter: "ذ", x: "39%", y: "52%" },
    { id: 9, letter: "ي", x: "56%", y: "30%" }, { id: 10, letter: "س", x: "70%", y: "19%" },
    { id: 11, letter: "ح", x: "57%", y: "49%" }, { id: 12, letter: "ز", x: "72%", y: "59%" },
    { id: 13, letter: "ق", x: "28%", y: "70%" }, { id: 14, letter: "و", x: "47%", y: "70%" },
    { id: 15, letter: "ك", x: "64%", y: "78%" }, 
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setInterval(() => !win && setTime((p) => p + 1), 1000);
    return () => { clearInterval(t); document.body.style.overflow = "auto"; };
  }, [win]);

  const handleLetterClick = async (item) => {
    if (win || !gridRef.current || collected.includes(item.id) || tempHidden) return;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const letterLeft = gridRect.left + (gridRect.width * parseFloat(item.x) / 100);
    const letterTop = gridRect.top + (gridRect.height * parseFloat(item.y) / 100);

    setBeePos({ x: letterLeft - 20, y: letterTop - 20 });
    await new Promise(r => setTimeout(r, 800));
    setTempHidden(item.id); 

    // الذهاب للخلية
    setBeePos({ x: window.innerWidth - 120, y: 100 });
    await new Promise(r => setTimeout(r, 800));

    // التحقق
    if (cutLetters.includes(item.letter)) {
      if (soundEnabled) successAudio.current.play();
      setCollected((prev) => [...prev, item.id]); 
      setHoneyCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 6) setWin(true); // إجمالي الحروف الصحيحة 6 حروف
        return newCount;
      });
    } else {
      if (soundEnabled) errorAudio.current.play();
      await new Promise(r => setTimeout(r, 500));
      // النحلة تعود لمكان الحرف لترجعه
      setBeePos({ x: letterLeft - 20, y: letterTop - 20 });
      await new Promise(r => setTimeout(r, 800));
    }
    
    setTempHidden(null); 
    setBeePos({ x: 50, y: window.innerHeight - 120 });
  };

  return (
    <>
      <style>{`
        .game-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: Arial, sans-serif;
          direction: rtl;
          box-sizing: border-box;
        }

        /* حاوية الألعاب المتجاوبة للشاشات الصغيرة */
        @media (max-width: 768px) {
          .top-bar-custom {
            top: 10px !important;
            padding: 0 10px !important;
          }
          .box-custom {
            padding: 4px 10px !important;
            font-size: 13px !important;
            border-radius: 8px !important;
          }
          .main-title-custom {
            padding: 4px 15px !important;
            font-size: clamp(15px, 4vw, 20px) !important;
            border-radius: 15px !important;
          }
          .subtitle-custom {
            top: 55px !important;
            padding: 6px 12px !important;
            font-size: 13px !important;
            max-width: 90% !important;
            text-align: center !important;
          }
          .grid-container-custom {
            width: clamp(310px, 88vw, 400px) !important;
            height: clamp(240px, 68vw, 310px) !important;
            top: 52% !important;
          }
          .hive-img-custom {
            right: 3% !important;
            top: 12% !important;
            width: clamp(90px, 22vw, 130px) !important;
          }
          .letter-font-custom {
            font-size: clamp(24px, 7vw, 34px) !important;
            text-shadow: 1px 1px 3px #000 !important;
          }
          .bee-container-custom img {
            width: clamp(65px, 16vw, 90px) !important;
          }
          .bottom-buttons-custom {
            bottom: 15px !important;
            gap: 12px !important;
          }
          .circle-btn-custom {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>

      <div className="game-container">
        <img src={bg} alt="" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />

        {/* الشريط العلوي */}
        <div style={topBar} className="top-bar-custom">
          <div style={box} className="box-custom">⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
          <div style={mainTitle} className="main-title-custom">خلية النحل</div>
          <div style={box} className="box-custom">🍯 {honeyCount}</div>
        </div>
        
        {/* عنوان فرعي */}
        <div style={subTitleContainer} className="subtitle-custom">اضغط على حروف القطع لتجمع العسل</div>

        {/* شبكة خلية النحل */}
        <div ref={gridRef} style={gridContainer} className="grid-container-custom">
          <img src={honeyGrid} alt="" style={{ width: "100%", height: "100%", objectFit: "fill" }} />
          {lettersData.map((item) => (tempHidden !== item.id && !collected.includes(item.id)) && (
            <div 
              key={item.id} 
              onClick={() => handleLetterClick(item)} 
              className="letter-font-custom"
              style={{ 
                position: "absolute", 
                left: item.x, 
                top: item.y, 
                fontSize: "clamp(30px, 4vw, 40px)", 
                fontWeight: "bold", 
                color: "#fff", 
                cursor: "pointer", 
                textShadow: "2px 2px 4px #000",
                userSelect: "none"
              }}
            >
              {item.letter}
            </div>
          ))}
        </div>

        {/* خلية العسل الكبيرة (الهدف) */}
        <img 
          src={hiveImg} 
          alt="hive" 
          style={{ position: "absolute", right: "5%", top: "15%", width: "clamp(120px, 15vw, 200px)" }} 
          className="hive-img-custom"
        />
        
        {/* النحلة المتحركة */}
        <div 
          className="bee-container-custom"
          style={{ position: "absolute", left: beePos.x, top: beePos.y, transition: "all 0.8s ease-in-out", zIndex: 100, pointerEvents: "none" }}
        >
          <img src={beeImg} alt="bee" style={{ width: "clamp(80px, 8vw, 120px)" }} />
          {tempHidden && (
            <div style={{ position: "absolute", top: -25, left: 25, fontSize: "clamp(20px, 3vw, 30px)", fontWeight: "bold", color: "white", textShadow: "1px 1px 2px #000" }}>
              {lettersData.find(l => l.id === tempHidden)?.letter}
            </div>
          )}
        </div>

        {/* الأزرار السفلية */}
        <div style={bottomButtons} className="bottom-buttons-custom">
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={circleBtn} className="circle-btn-custom">
            {soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}
          </button>
          <button onClick={() => window.location.reload()} style={circleBtn} className="circle-btn-custom">
            <RotateCcw size={22}/>
          </button>
          <button onClick={() => navigate("/AlHorof1")} style={circleBtn} className="circle-btn-custom">
            <ArrowRight size={22}/>
          </button>
          <button onClick={() => navigate("/home")} style={circleBtn} className="circle-btn-custom">
            <Home size={22}/>
          </button>
        </div>

        {/* شاشة الفوز */}
        {win && (
          <div style={winStyle}>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 40px)", marginBottom: "20px" }}>🎉 أحسنت يا بطل! 🎉</h1>
            <button style={{ padding: "12px 25px", fontSize: "18px", borderRadius: "15px", border: "none", background: "#ff9f43", color: "white", fontWeight: "bold", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }} onClick={() => window.location.reload()}>
              إعادة اللعب
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const topBar = { position: "absolute", top: 20, width: "100%", display: "flex", justifyContent: "space-around", zIndex: 10, boxSizing: "border-box" };
const box = { background: "white", padding: "6px 16px", borderRadius: 10, fontWeight: "bold", fontSize: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" };
const mainTitle = { background: "#ff9f43", color: "white", padding: "6px 25px", borderRadius: 20, fontSize: "clamp(18px, 2vw, 26px)", fontWeight: "bold", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" };
const subTitleContainer = { position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", background: "white", padding: "8px 18px", borderRadius: 10, fontWeight: "bold", color: "#7b4b00", fontSize: "15px", border: "2px solid #ff9f43", zIndex: 10, whiteSpace: "nowrap", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" };
const gridContainer = { position: "absolute", left: "50%", top: "55%", transform: "translate(-50%, -50%)", width: "clamp(380px, 48vw, 480px)", height: "clamp(300px, 45vw, 380px)" };
const bottomButtons = { position: "absolute", bottom: "25px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "15px", zIndex: 1000 };
const circleBtn = { width: 45, height: 45, borderRadius: "50%", border: "none", background: "#ff9f43", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" };
const winStyle = { position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px", textAlign: "center" };