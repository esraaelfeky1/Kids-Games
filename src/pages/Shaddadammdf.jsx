// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bg from "../assets/bgmad.jpeg";
import cannon from "../assets/cannon.png";
import greenCircle from "../assets/green.png";
import redCircle from "../assets/red1.png";

const successSoundFile = "/sounds/hay1.mp3";
const errorSoundFile = "/sounds/pop.mp3";

export default function ShaddahGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [win, setWin] = useState(false);
  const [projectile, setProjectile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const successSound = useRef(null);
  const errorSound = useRef(null);

  useEffect(() => {
    successSound.current = new Audio(successSoundFile);
    errorSound.current = new Audio(errorSoundFile);
  }, []);

  const [items, setItems] = useState([
    { id: 1, word: "يُحِبُّ", type: "shaddah", row: 1, left: "20%" },
    { id: 2, word: "يَكْتُبُ", type: "normal", row: 1, left: "40%" },
    { id: 3, word: "يَرُدُّ", type: "shaddah", row: 1, left: "60%" },
    { id: 4, word: "يَقْرَأُ", type: "normal", row: 1, left: "80%" },
    { id: 5, word: "يَلْعَبُ", type: "normal", row: 2, left: "20%" },
    { id: 6, word: "يَشُدُّ", type: "shaddah", row: 2, left: "40%" },
    { id: 7, word: "يَشْرَبُ", type: "normal", row: 2, left: "60%" },
    { id: 8, word: "يَعُدُّ", type: "shaddah", row: 2, left: "80%" },
    { id: 9, word: "يَمُدُّ", type: "shaddah", row: 3, left: "20%" },
    { id: 10, word: "يَجْلِسُ", type: "normal", row: 3, left: "40%" },
    { id: 11, word: "يَسُبُّ", type: "shaddah", row: 3, left: "60%" },
    { id: 12, word: "يَخْرُجُ", type: "normal", row: 3, left: "80%" },
  ]);

  useEffect(() => {
    if (win) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [win]);

  const handleShoot = (item) => {
    if (projectile || win) return;

    setProjectile({ targetLeft: item.left, targetTop: `calc(${item.row * 14}% + 9%)`, id: item.id });

    setTimeout(() => {
      const isShaddah = item.type === "shaddah";

      if (soundEnabled) {
        if (isShaddah) {
          successSound.current.currentTime = 0;
          successSound.current.play();
        } else {
          errorSound.current.currentTime = 0;
          errorSound.current.play();
        }
      }

      setFeedback({ id: item.id, type: item.type });

      if (isShaddah) {
        setScore((s) => s + 10);
        setItems((prev) => {
          const updatedItems = prev.filter((i) => i.id !== item.id);
          if (updatedItems.filter((i) => i.type === "shaddah").length === 0) {
            setWin(true);
          }
          return updatedItems;
        });
      }

      setTimeout(() => setFeedback(null), 1000);
      setProjectile(null);
    }, 500);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <style>
        {`
          @media (max-width: 1024px) {
            .word-circle { width: 75px !important; height: 75px !important; }
            .word-text { font-size: 21px !important; }
            .cannon-img { width: 95px !important; }
          }
          @media (max-width: 600px) {
            .word-circle { width: 68px !important; height: 68px !important; }
            .word-text { font-size: 20px !important; }
            .cannon-img { width: 85px !important; }
            .top-title { font-size: 13px !important; padding: 5px 8px !important; }
          }
        `}
      </style>

      <img src={bg} alt="خلفية" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />

      {/* الشريط العلمي العلوي */}
      <div style={topBar}>
        <div style={box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div className="top-title" style={title}>🎯 صوّب على الكلمات التي بها شدّة ومُضمومة</div>
        <div style={box}>🏆 {score}</div>
      </div>

      {/* شاشة الفوز */}
      {win && (
        <div style={winStyle}>
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>أحسنت يا بطل! 🌟</div>
          <div style={{ fontSize: "1.6rem", color: "#ff9f43", marginTop: 15 }}>مجموع نقاطك: {score}</div>
        </div>
      )}

      {/* عرض الكلمات (تم رفع الصفوف للأعلى لتكون قريبة من العنوان بمسافة صغيرة ومناسبة) */}
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleShoot(item)}
          style={{
            position: "absolute",
            left: item.left,
            top: `calc(${item.row * 14}% + 9%)`,
            cursor: "pointer",
            zIndex: 10,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img 
            src={item.type === "shaddah" ? greenCircle : redCircle} 
            alt="دائرة الكلمة" 
            className="word-circle"
            style={{ width: 82, height: 82, display: "block" }} 
          />
          <div
            className="word-text"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 23,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {item.word}
          </div>
          {feedback?.id === item.id && (
            <div style={{ position: "absolute", top: -8, right: -8, zIndex: 20 }}>
              {feedback.type === "shaddah" ? <CheckCircle color="green" size={30} /> : <XCircle color="red" size={30} />}
            </div>
          )}
        </div>
      ))}

      {/* قذيفة المدفع */}
      {projectile && (
        <motion.div
          style={{ position: "absolute", width: 26, height: 26, background: "#0f13f1", borderRadius: "50%", zIndex: 35 }}
          initial={{ bottom: 105, left: "9.5%" }}
          animate={{ left: projectile.targetLeft, top: projectile.targetTop }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      )}

      {/* المدفع */}
      <img src={cannon} alt="المدفع" className="cannon-img" style={{ position: "absolute", bottom: 35, left: "5%", width: 95, zIndex: 40 }} />

      {/* أزرار التحكم السفلية */}
      <div style={styles.bottomButtons}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
          {soundEnabled ? <Volume2 size={18} color="white" /> : <VolumeX size={18} color="white" />}
        </button>
        <button onClick={() => window.location.reload()} style={styles.circleBtn}><RotateCcw size={18} color="white" /></button>
        <button onClick={() => navigate("/Shadda")} style={styles.circleBtn}><ArrowRight size={18} color="white" /></button>
        <button onClick={() => navigate("/home")} style={styles.circleBtn}><Home size={18} color="white" /></button>
      </div>
    </div>
  );
}

const topBar = { position: "fixed", top: 12, width: "100%", display: "flex", justifyContent: "space-around", zIndex: 999, boxSizing: "border-box", padding: "0 10px" };
const box = { background: "white", padding: "5px 10px", borderRadius: 10, fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", fontSize: "14px" };
const title = { background: "#ff740a", color: "white", padding: "5px 12px", borderRadius: 20, fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", fontSize: "15px", textAlign: "center" };
const winStyle = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", padding: 30, borderRadius: 20, zIndex: 10000, textAlign: "center", border: "4px solid #ff9f43", boxShadow: "0 20px 25px rgba(0,0,0,0.2)" };
const styles = {
  bottomButtons: { position: "absolute", bottom: 15, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12, zIndex: 1000 },
  circleBtn: { width: 40, height: 40, borderRadius: "50%", border: "none", background: "#f5660e", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
};