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

export default function MadGame() {
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
    { id: 1, char: 'َب', type: 'normal', row: 1, left: '20%' }, { id: 2, char: 'بَا', type: 'mad', row: 1, left: '40%' },
    { id: 3, char: 'َت', type: 'normal', row: 1, left: '60%' }, { id: 4, char: 'تَا', type: 'mad', row: 1, left: '80%' },
    { id: 5, char: 'جَا', type: 'mad', row: 2, left: '20%' }, { id: 6, char: 'َج', type: 'normal', row: 2, left: '40%' },
    { id: 7, char: 'دَا', type: 'mad', row: 2, left: '60%' }, { id: 8, char: 'َد', type: 'normal', row: 2, left: '80%' },
    { id: 9, char: 'َر', type: 'normal', row: 3, left: '20%' }, { id: 10, char: 'رَا', type: 'mad', row: 3, left: '40%' },
    { id: 11, char: 'سَا', type: 'mad', row: 3, left: '60%' }, { id: 12, char: 'َس', type: 'normal', row: 3, left: '80%' },
  ]);

  useEffect(() => {
    if (win) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [win]);

  useEffect(() => {
    if (items.filter(i => i.type === 'mad').length === 0 && items.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWin(true);
    }
  }, [items]);

  const handleShoot = (item) => {
    if (projectile || win) return;

    setProjectile({ targetLeft: item.left, targetTop: `${item.row * 15 + 10}%`, id: item.id });

    setTimeout(() => {
      if (soundEnabled) {
        if (item.type === 'mad') {
            successSound.current.currentTime = 0;
            successSound.current.play();
        } else {
            errorSound.current.currentTime = 0;
            errorSound.current.play();
        }
      }
      setFeedback({ id: item.id, type: item.type });
      
      if (item.type === 'mad') {
        setScore((s) => s + 10);
        setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== item.id)), 500);
      }
      setTimeout(() => setFeedback(null), 1000);
      setProjectile(null);
    }, 500);
  };

  return (
    <div className="game-container">
      <style>{`
        /* شاشات اللاب توب والشاشات الكبيرة: ثابتة كما هي تماماً */
        .game-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .target-item {
          width: 75px;
          height: 75px;
        }
        .target-font {
          font-size: 30px;
        }
        .cannon-img {
          width: 110px;
          bottom: 40px;
          left: 5%;
        }
        .projectile-ball {
          width: 30px;
          height: 30px;
        }
        .control-btn {
          width: 45px;
          height: 45px;
        }

        /* شاشات التابلت: تكبير إضافي ومناسب لدوائر الحروف، الخط، والأزرار */
        @media (max-width: 1024px) {
          .target-item {
            width: 70px !important;
            height: 70px !important;
          }
          .target-font {
            font-size: 28px !important;
          }
          .cannon-img {
            width: 100px !important;
            bottom: 22px !important;
            left: 4% !important;
          }
          .projectile-ball {
            width: 24px !important;
            height: 24px !important;
          }
          .control-btn {
            width: 42px !important;
            height: 42px !important;
          }
        }

        /* شاشات الموبايل: تكبير دوائر الحروف، الحروف نفسها، الأزرار، وإبراز الحركة أكثر */
        @media (max-width: 600px) {
          .target-item {
            width: 64px !important; /* تكبير خلفية الحروف بشكل مثالي */
            height: 64px !important;
          }
          .target-font {
            font-size: 26px !important; /* تكبير خط الحروف بوضوح */
          }
          .cannon-img {
            width: 90px !important;
            bottom: 18px !important;
          }
          .projectile-ball {
            width: 20px !important;
            height: 20px !important;
          }
          .control-btn {
            width: 38px !important; /* تكبير الأزرار قليلاً لتكون مريحة وسهلة اللمس */
            height: 38px !important;
          }
        }
      `}</style>

      <img src={bg} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />

      <div style={topBar}>
        <div style={box}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        <div style={title}>🎯 صوّب على حروف المد</div>
        <div style={box}>🏆 {score}</div>
      </div>

      {win && (
        <div style={winStyle}>
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>أحسنت يا بطل</div>
          <div style={{ fontSize: "1.6rem", color: "#ff9f43", marginTop: 15 }}> مجموع نقاطك:- {score}</div>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} onClick={() => handleShoot(item)} style={{
          position: "absolute", left: item.left, top: `${item.row * 15 + 10}%`, cursor: "pointer", zIndex: 10, transform: "translate(-50%, -50%)"
        }}>
          <img src={item.type === 'mad' ? greenCircle : redCircle} className="target-item" />
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }} className="target-font">{item.char}</div>
          {feedback?.id === item.id && (
            <div style={{ position: "absolute", top: -10, right: -10 }}>
              {feedback.type === 'mad' ? <CheckCircle color="green" size={35} /> : <XCircle color="red" size={35} />}
            </div>
          )}
        </div>
      ))}

      {projectile && (
        <motion.div className="projectile-ball" style={{ position: "absolute", background: "#0f13f1", borderRadius: "50%", zIndex: 35 }}
          initial={{ bottom: 115, left: "9.5%" }} 
          animate={{ left: projectile.targetLeft, top: projectile.targetTop }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
      )}

      <img src={cannon} className="cannon-img" style={{ position: "absolute", zIndex: 40 }} />

      <div style={styles.bottomButtons}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn} className="control-btn">
          {soundEnabled ? <Volume2 size={20} color="white" /> : <VolumeX size={20} color="white" />}
        </button>
        <button onClick={() => window.location.reload()} style={styles.circleBtn} className="control-btn"><RotateCcw size={20} color="white" /></button>
        <button onClick={() => navigate("/Mad")} style={styles.circleBtn} className="control-btn"><ArrowRight size={20} color="white" /></button>
        <button onClick={() => navigate("/home")} style={styles.circleBtn} className="control-btn"><Home size={20} color="white" /></button>
      </div>
    </div>
  );
}

const topBar = { position: "fixed", top: 15, width: "100%", display: "flex", justifyContent: "space-around", zIndex: 999 };
const box = { background: "white", padding: "6px 12px", borderRadius: 10, fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };
const title = { background: "#ff740a", color: "white", padding: "6px 12px", borderRadius: 20, fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };
const winStyle = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", padding: 30, borderRadius: 20, zIndex: 10000, textAlign: "center", border: "4px solid #ff9f43", boxShadow: "0 20px 25px rgba(0,0,0,0.2)" };
const styles = {
  bottomButtons: { position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 15, zIndex: 1000 },
  circleBtn: { borderRadius: "50%", border: "none", background: "#f5660e", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
};