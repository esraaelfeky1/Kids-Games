// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

import background from '../assets/mazebg.jpeg';
import basketGreen from '../assets/sall2.png';
import basketRed from '../assets/sall1.png';
import correctSound from '/sounds/hay1.mp3'; 
import wrongSound from '/sounds/pop.mp3';

import ballPurple from '../assets/bolle1.png';
import ballBlue from '../assets/bolle2.png';
import ballYellow from '../assets/bolle3.png';
import ballGreen from '../assets/bolle1.png';
import ballRed from '../assets/bolle2.png';
import ballOrange from '../assets/bolle3.png';
import ballPink from '../assets/bolle1.png';
import ballCyan from '../assets/bolle2.png';

const Game = () => {
  const navigate = useNavigate();
  const greenBasketRef = useRef(null);
  const redBasketRef = useRef(null);

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [win, setWin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const noSelect = { userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' };

  const [balls, setBalls] = useState([
    { id: 1, text: 'فُعِلَ', hasDamma: true, visible: true, img: ballPurple },
    { id: 2, text: 'شَرَحَ', hasDamma: false, visible: true, img: ballBlue },
    { id: 3, text: 'فُتِحَ', hasDamma: true, visible: true, img: ballYellow },
    { id: 4, text: 'بَيْت', hasDamma: false, visible: true, img: ballGreen },
    { id: 5, text: 'دُرُس', hasDamma: true, visible: true, img: ballRed },
    { id: 6, text: 'كِتَاب', hasDamma: false, visible: true, img: ballOrange },
    { id: 7, text: 'قَلَم', hasDamma: false, visible: true, img: ballPink },
    { id: 8, text: 'لَعِب', hasDamma: false, visible: true, img: ballCyan },
  ]);

  const [draggingBall, setDraggingBall] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => !win && setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [win]);

  const handleMouseDown = (ball, e) => {
    setDraggingBall(ball);
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsDragging(false);
    setBalls(prev => prev.map(b => b.id === ball.id ? { ...b, visible: false } : b));
  };

  const handleTouchStart = (ball, e) => {
    const touch = e.touches[0];
    setDraggingBall(ball);
    setMousePos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(false);
    setBalls(prev => prev.map(b => b.id === ball.id ? { ...b, visible: false } : b));
  };

  const handleMouseMove = (e) => {
    if (draggingBall) {
      if (!isDragging) setIsDragging(true);
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (draggingBall) {
      const touch = e.touches[0];
      if (!isDragging) setIsDragging(true);
      setMousePos({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleDropCheck = (clientX, clientY) => {
    const greenRect = greenBasketRef.current?.getBoundingClientRect();
    const redRect = redBasketRef.current?.getBoundingClientRect();

    const isInside = (rect, x, y) => {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const inGreen = greenRect && isInside(greenRect, clientX, clientY);
    const inRed = redRect && isInside(redRect, clientX, clientY);

    if (inGreen) {
      if (draggingBall.hasDamma) {
        setScore(prev => { const n = prev + 1; if (n === 8) setWin(true); return n; });
        if (soundEnabled) new Audio(correctSound).play();
      } else {
        if (soundEnabled) new Audio(wrongSound).play();
        setBalls(prev => prev.map(b => b.id === draggingBall.id ? { ...b, visible: true } : b));
      }
    } else if (inRed) {
      if (!draggingBall.hasDamma) {
        setScore(prev => { const n = prev + 1; if (n === 8) setWin(true); return n; });
        if (soundEnabled) new Audio(correctSound).play();
      } else {
        if (soundEnabled) new Audio(wrongSound).play();
        setBalls(prev => prev.map(b => b.id === draggingBall.id ? { ...b, visible: true } : b));
      }
    } else {
      setBalls(prev => prev.map(b => b.id === draggingBall.id ? { ...b, visible: true } : b));
    }
  };

  const handleMouseUp = (e) => {
    if (!draggingBall) return;
    if (isDragging) {
      handleDropCheck(e.clientX, e.clientY);
    } else {
      setBalls(prev => prev.map(b => b.id === draggingBall.id ? { ...b, visible: true } : b));
    }
    setDraggingBall(null); 
    setIsDragging(false);
  };

  const handleTouchEnd = (e) => {
    if (!draggingBall) return;
    const touch = e.changedTouches[0];
    if (isDragging) {
      handleDropCheck(touch.clientX, touch.clientY);
    } else {
      setBalls(prev => prev.map(b => b.id === draggingBall.id ? { ...b, visible: true } : b));
    }
    setDraggingBall(null); 
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => { 
      window.removeEventListener('mousemove', handleMouseMove); 
      window.removeEventListener('mouseup', handleMouseUp); 
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingBall, isDragging]);

  const btnStyle = { 
    width: "clamp(38px, 9vw, 48px)", 
    height: "clamp(38px, 9vw, 48px)", 
    borderRadius: "50%", 
    border: "none", 
    background: "#501903", 
    color: "white", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', ...noSelect }}>
      
      {/* الشريط العلوي مع العناوين بخلفيات */}
      <div style={{ position: 'absolute', top: '2vh', width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 10, padding: '0 2vw' }}>
        <div style={{ background: "white", padding: "0.6vh 1.5vw", borderRadius: 10, fontWeight: "bold", fontSize: "clamp(14px, 3.5vw, 18px)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</div>
        
        {/* العنوان والفقرة مع الخلفيات */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ background: '#0b77f3', padding: 'clamp(4px, 1vh, 8px) clamp(15px, 3vw, 25px)', borderRadius: 20, boxShadow: '0 4px 10px rgba(0,0,0,0.25)' }}>
            <h1 style={{ fontSize: 'clamp(18px, 4.5vw, 28px)', fontWeight: 'bold', color: 'white', margin: 0, textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>لعبة السلة</h1>
          </div>
          <div style={{ background: 'white', padding: 'clamp(3px, 0.8vh, 6px) clamp(12px, 2.5vw, 20px)', borderRadius: 25, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            <p style={{ fontSize: 'clamp(11px, 2.5vw, 15px)', fontWeight: 'bold', color: '#333', margin: 0 }}>صنف الكلمات حسب الضمة بشكل صحيح</p>
          </div>
        </div>

        <div style={{ background: "white", padding: "0.6vh 1.5vw", borderRadius: 10, fontWeight: "bold", fontSize: "clamp(14px, 3.5vw, 18px)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>⚽ النقاط: {score}</div>
      </div>

      {/* السلتان (تم تكبيرهما قليلاً ونزولهما للأسفل ليستقرا بوضوح في الخلفية على أطراف الملعب) */}
      <div ref={greenBasketRef} style={{ position: 'absolute', bottom: '33vh', left: '2vw', width: 'clamp(280px, 26vw, 220px)', height: 'clamp(290px, 22vw, 190px)', backgroundImage: `url(${basketGreen})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', zIndex: 1 }} />
      <div ref={redBasketRef} style={{ position: 'absolute', bottom: '33vh', right: '2vw', width: 'clamp(240px, 26vw, 220px)', height: 'clamp(190px, 22vw, 190px)', backgroundImage: `url(${basketRed})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', zIndex: 1 }} />

      {/* العنصر أثناء السحب */}
      {isDragging && draggingBall && (
        <div style={{ position: 'fixed', top: mousePos.y - 30, left: mousePos.x - 30, width: 'clamp(50px, 12vw, 75px)', height: 'clamp(50px, 12vw, 75px)', backgroundImage: `url(${draggingBall.img})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', pointerEvents: 'none', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: '800', fontSize: 'clamp(20px, 5vw, 28px)', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {draggingBall.text}
        </div>
      )}

      {/* شريط الكرات في الأسفل */}
      <div style={{ position: 'absolute', bottom: '9vh', width: '80%', left: '10%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px, 2vw, 15px)', zIndex: 2, justifyContent: 'items-center' }}>
        {balls.map(ball => ball.visible && (
          <div 
            key={ball.id} 
            onMouseDown={(e) => handleMouseDown(ball, e)}
            onTouchStart={(e) => handleTouchStart(ball, e)}
            style={{ 
              width: 'clamp(45px, 12vw, 70px)', 
              height: 'clamp(45px, 12vw, 70px)', 
              backgroundImage: `url(${ball.img})`, 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'center', 
              cursor: 'grab', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              color: '#fff', 
              fontWeight: '900', 
              fontSize: 'clamp(20px, 4.8vw, 28px)', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)', 
              margin: '0 auto',
              ...noSelect 
            }}>
            {ball.text}
          </div>
        ))}
      </div>

      {/* أزرار التحكم السفلية */}
      <div style={{ position: 'absolute', bottom: '1.5vh', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 'clamp(10px, 3vw, 20px)', zIndex: 100 }}>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={btnStyle}>{soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
        <button onClick={() => window.location.reload()} style={btnStyle}><RotateCcw size={22}/></button>
        <button onClick={() => navigate("/Alhorof123")} style={btnStyle}><ArrowRight size={22}/></button>
        <button onClick={() => navigate("/home")} style={btnStyle}><Home size={22}/></button>
      </div>

      {/* نافذة الفوز */}
      {win && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 9999, padding: '20px' }}>
          <h1 style={{fontSize: 'clamp(28px, 7vw, 50px)', marginBottom: '30px', textAlign: 'center'}}>🎉 أحسنت يا بطل! 🎉</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
             <button onClick={() => setSoundEnabled(!soundEnabled)} style={btnStyle}>{soundEnabled ? <Volume2 size={22}/> : <VolumeX size={22}/>}</button>
             <button onClick={() => window.location.reload()} style={btnStyle}><RotateCcw size={22}/></button>
             <button onClick={() => navigate("/Alhorof123")} style={btnStyle}><ArrowRight size={22}/></button>
             <button onClick={() => navigate("/home")} style={btnStyle}><Home size={22}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;