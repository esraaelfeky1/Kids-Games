// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { RotateCcw, Home, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bgImg from "../assets/gg.jpeg";
import chefImg from "../assets/mann.png";
import coneImg from "../assets/cone.png";
import scoop1 from "../assets/ee1.png";
import scoop2 from "../assets/scoop2.png";
import scoop3 from "../assets/scoop3.png";
import scoop4 from "../assets/scoop4.png";
import scoop5 from "../assets/scoop5.png";

import correctSound from "/sounds/hay1.mp3";
import wrongSound from "/sounds/pop.mp3";

const iceCreams = [
  { id: 1, text: "كتابًا", isTanween: true, img: scoop1, pos: { top: "-275px", left: "80px" } },
  { id: 2, text: "قلمٌ", isTanween: false, img: scoop2, pos: { top: "-275px", left: "70px" } },
  { id: 3, text: "شارعًا", isTanween: true, img: scoop3, pos: { top: "-275px", left: "50px" } },
  { id: 4, text: "بابًا", isTanween: true, img: scoop4, pos: { top: "-275px", left: "40px" } },
  { id: 5, text: "تفاحًا", isTanween: true, img: scoop5, pos: { top: "-275px", left: "30px" } },
];

export default function IceCreamGame() {
  const navigate = useNavigate();
  const [scoops, setScoops] = useState(iceCreams);
  const [placed, setPlaced] = useState({});
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [score, setScore] = useState(0);

  const [activeDrag, setActiveDrag] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const conesRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const playSound = (correct) => {
    if (isMuted) return;
    const audio = new Audio(correct ? correctSound : wrongSound);
    audio.play();
  };

  const handleMouseDown = (e, item) => {
    if (e.type === "mousedown") e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setActiveDrag(item);
    setDragPos({ x: clientX - 45, y: clientY - 45 });
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!activeDrag) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setDragPos({ x: clientX - 45, y: clientY - 45 });
    };

    const handleEnd = (e) => {
      if (!activeDrag) return;

      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

      let targetIndex = -1;
      conesRef.current.forEach((coneEl, index) => {
        if (!coneEl) return;
        const rect = coneEl.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          targetIndex = index;
        }
      });

      if (targetIndex !== -1 && !placed[targetIndex]) {
        if (activeDrag.isTanween) {
          playSound(true);
          const newPlaced = { ...placed, [targetIndex]: activeDrag };
          setPlaced(newPlaced);
          const newScore = score + 10;
          setScore(newScore);
          
          setScoops((prev) =>
            prev.map((s) => (s.id === activeDrag.id ? { ...s, isUsed: true } : s))
          );
          
          if (Object.keys(newPlaced).length === 4) {
            setShowWin(true);
            setTimeout(() => {
              setShowWin(false);
            }, 4000);
          }
        } else {
          playSound(false);
        }
      }

      setActiveDrag(null);
    };

    if (activeDrag) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDrag, scoops, placed, score]);

  return (
    <div style={styles.container} className="ice-cream-container">
      <style>{`
        /* --- تخصيص التابلت (شاشات بين 601px و 1024px) --- */
        @media (min-width: 601px) and (max-width: 1024px) {
          .ice-cream-container .top-bar { padding: 8px 30px !important; }
          .ice-cream-container h1 { font-size: 20px !important; }
          .ice-cream-container .cones-container { margin-top: 100px !important; transform: scale(0.85) !important; transform-origin: top center !important; }
          .ice-cream-container .menu { transform: scale(0.85) !important; transform-origin: top center !important; }
          .ice-cream-container .chef { width: 200px !important; left: 20px !important; bottom: 20px !important; }
        }

        /* --- تخصيص الموبايل (شاشات أقل من 600px) --- */
        @media (max-width: 600px) {
          .ice-cream-container .top-bar { padding: 4px 22px !important; }
          .ice-cream-container h1 { font-size: 19px !important; padding: 5px 12px !important; border-width: 2px !important; }
          .ice-cream-container .stat-box { font-size: 15px !important; padding: 5px 10px !important; border-width: 2px !important; }
          
          .ice-cream-container .cones-container { margin-top: 150px !important; gap: 2px !important; transform: scale(0.72) !important; transform-origin: top center !important; }
          
          .ice-cream-container .scoop-base img { width: 108px !important; }
          
          .ice-cream-container .text-on-scoop { font-size: 19px !important; margin-top: -34px !important; }

          .ice-cream-container .menu { position: absolute !important; top: 335px !important; left: 0 !important; width: 100% !important; margin-top: 0 !important; display: flex !important; justify-content: center !important; gap: 0 !important; }
          .ice-cream-container .menu-item-custom { position: absolute !important; }
          .ice-cream-container .menu-item-custom:nth-child(1) { top: -85px !important; left: calc(50% - 132px) !important; }
          .ice-cream-container .menu-item-custom:nth-child(2) { top: -85px !important; left: calc(50% - 66px) !important; }
          .ice-cream-container .menu-item-custom:nth-child(3) { top: -85px !important; left: 85% !important; transform: translateX(-50%) !important; }
          .ice-cream-container .menu-item-custom:nth-child(4) { top: -85px !important; left: calc(50% + 15px) !important; }
          .ice-cream-container .menu-item-custom:nth-child(5) { top: -85px !important; left: calc(50% + 80px) !important; }

          .ice-cream-container .scoop-img { width: 75px !important; }
          .ice-cream-container .chef { width: 150px !important; left: 5px !important; bottom: 15px !important; }

          .ice-cream-container .bottom-buttons { bottom: 12px !important; gap: 10px !important; }
          .ice-cream-container .circle-btn { width: 43px !important; height: 43px !important; }
          .ice-cream-container .circle-btn svg { width: 19px !important; height: 19px !important; }
        }
      `}</style>

      <div style={styles.topBar} className="top-bar">
        <div style={styles.statBox} className="stat-box">⭐ {Object.keys(placed).length}/3</div>
        <h1 style={styles.title}>لعبة محل الآيس كريم</h1>
        <div style={styles.statBox} className="stat-box">⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
      </div>

      <div style={styles.conesContainer} className="cones-container">
        {[0, 1, 2, 3, 4].map((index) => (
          <div 
            key={index} 
            ref={(el) => (conesRef.current[index] = el)}
            style={styles.slot}
            className="slot"
          >
            {placed[index] && (
              <div style={styles.scoopBase} className="scoop-base">
                <img src={placed[index].img} alt="" style={styles.scoopImg} className="scoop-img" draggable="false" />
                <span style={styles.textOnScoop} className="text-on-scoop">{placed[index].text}</span>
              </div>
            )}
            <img src={coneImg} alt="Cone" style={styles.coneImg} className="cone-img" draggable="false" />
          </div>
        ))}
      </div>

      {/* قائمة الخيارات */}
      <div style={styles.menu} className="menu">
        {iceCreams.map((item) => {
          const currentScoop = scoops.find((s) => s.id === item.id);
          const isUsed = currentScoop ? currentScoop.isUsed : false;

          return (
            <div 
              key={item.id} 
              onMouseDown={(e) => !isUsed && handleMouseDown(e, item)} 
              onTouchStart={(e) => !isUsed && handleMouseDown(e, item)}
              className="menu-item-custom"
              style={{ 
                ...styles.menuItem, 
                ...item.pos,
                visibility: isUsed ? "hidden" : "visible"
              }}
            >
              <img src={item.img} alt="" style={styles.scoopImg} className="scoop-img" draggable="false" />
              <span style={styles.textOnScoop} className="text-on-scoop">{item.text}</span>
            </div>
          );
        })}
      </div>

      {/* المجسم أثناء السحب */}
      {activeDrag && (
        <div style={{ ...styles.dragFollower, left: `${dragPos.x}px`, top: `${dragPos.y}px` }}>
          <img src={activeDrag.img} alt="" style={styles.scoopImg} className="scoop-img" draggable="false" />
          <span style={styles.textOnScoop} className="text-on-scoop">{activeDrag.text}</span>
        </div>
      )}

      <img src={chefImg} alt="" style={styles.chef} className="chef" draggable="false" />
      
      {/* رسالة الفوز مرتبة تحت بعضها البعض */}
      {showWin && (
        <div style={styles.winBox}>
          🎉 أحسنت يا بطل <br />
          مجموع نقاطك: {score}
        </div>
      )}

      <div style={styles.bottomButtons} className="bottom-buttons">
        <button style={styles.circleBtn} className="circle-btn" onClick={() => navigate(-1)}><ArrowLeft /></button>
        <button style={styles.circleBtn} className="circle-btn" onClick={() => window.location.reload()}><RotateCcw /></button>
        <button style={styles.circleBtn} className="circle-btn" onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX /> : <Volume2 />}</button>
        <button style={styles.circleBtn} className="circle-btn" onClick={() => navigate("/home")}><Home /></button>
      </div>
    </div>
  );
}

const styles = {
  container: { width: "100%", minHeight: "100vh", background: `url(${bgImg}) center/cover no-repeat`, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" },
  topBar: { width: "100%", maxWidth: "900px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 35px" },
  title: { color: "#ec4899", fontSize: "25px", fontWeight: "bold", background: "white", padding: "10px 20px", borderRadius: "15px", border: "3px solid #ec4899" },
  statBox: { background: "#fff", padding: "10px 18px", borderRadius: "15px", border: "3px solid #ec4899", fontWeight: "bold" },
  
  conesContainer: { display: "flex", justifyContent: "center", gap: "2px", marginTop: "80px", zIndex: 2 },
  slot: { width: "95px", height: "260px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" },
  coneImg: { width: "105px", zIndex: 1 },
  
  scoopBase: { position: "absolute", bottom: "60px", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 },
  scoopImg: { width: "90px" },
  
  textOnScoop: { 
    fontWeight: "900", 
    fontSize: "22px", 
    background: "#fff", 
    padding: "3px 10px", 
    borderRadius: "10px", 
    marginTop: "-42px", 
    zIndex: 6,
    letterSpacing: "1px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
  },
  
  menu: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "50px" },
  menuItem: { position: "relative", cursor: "grab", display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" },
  
  dragFollower: { position: "fixed", pointerEvents: "none", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "center" },
  
  chef: { width: "280px", position: "absolute", bottom: "30px", left: "70px" },
  
  winBox: { 
    position: "absolute", 
    top: "150px", 
    background: "#ffffff", 
    color: "#ec4899", 
    padding: "18px 30px", 
    borderRadius: "20px", 
    fontSize: "22px", 
    fontWeight: "bold", 
    border: "4px solid #ec4899", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)", 
    zIndex: 10,
    textAlign: "center",
    lineHeight: "1.6"
  },

  bottomButtons: { position: "absolute", bottom: "15px", display: "flex", gap: "15px" },
  circleBtn: { width: "50px", height: "50px", borderRadius: "50%", border: "none", background: "#ec4899", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
};