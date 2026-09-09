// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, RefreshCw, Volume2, ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import bgImage from '../assets/background.jpeg';
import octopusImage from '../assets/octopus.png';
import bubbleImage from '../assets/bubble.png';
import successSound from '/sounds/hay1.mp3'; 

// كلمات مرتبة بالتناوب: (قطع - وصل - قطع - وصل...)
const ORDERED_WORDS = [
  { id: 1, text: "أَسَد", type: "qat" },
  { id: 6, text: "اجْلِس", type: "wasl" },
  { id: 2, text: "أَحْمَد", type: "qat" },
  { id: 7, text: "اسْتَخْرِج", type: "wasl" },
  { id: 3, text: "إِبْرَة", type: "qat" },
  { id: 8, text: "اكْتُب", type: "wasl" },
  { id: 4, text: "إِحْسَان", type: "qat" },
  { id: 9, text: "الْبَيْت", type: "wasl" },
  { id: 5, text: "إِيمَان", type: "qat" },
  { id: 10, text: "اتَّحَد", type: "wasl" },
];

export default function OctopusGame() {
  const navigate = useNavigate();
  
  const [items, setItems] = useState(ORDERED_WORDS);
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0); // العداد يبدأ من 0
  const [gameState, setGameState] = useState('playing');
  const [isMuted, setIsMuted] = useState(false);

  const waslBasketRef = useRef(null);
  const qatBasketRef = useRef(null);

  const playSuccessSound = () => {
    if (isMuted) return;
    try {
      const audio = new Audio(successSound);
      audio.currentTime = 0;
      audio.play().catch(err => console.log("Audio play error:", err));
    } catch (e) {
      console.log("Audio error:", e);
    }
  };

  // عداد تصاعدي بسيط: 0، 1، 2، 3...
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleDragEnd = (event, info, item) => {
    if (!waslBasketRef.current || !qatBasketRef.current) return;
    const waslRect = waslBasketRef.current.getBoundingClientRect();
    const qatRect = qatBasketRef.current.getBoundingClientRect();
    const { point } = info;

    if (point.x > waslRect.left && point.x < waslRect.right && point.y > waslRect.top && point.y < waslRect.bottom) {
      if (item.type === 'wasl') processSuccess(item.id);
    } else if (point.x > qatRect.left && point.x < qatRect.right && point.y > qatRect.top && point.y < qatRect.bottom) {
      if (item.type === 'qat') processSuccess(item.id);
    }
  };

  const processSuccess = (id) => {
    playSuccessSound();
    setScore(s => s + 10);
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    if (newItems.length === 0) setGameState('won');
  };

  const resetGame = () => {
    setItems(ORDERED_WORDS);
    setScore(0);
    setTimerSeconds(0);
    setGameState('playing');
  };

  return (
    <div className="game-container">
      <img src={bgImage} className="bg-img" alt="bg" />

      {/* الشريط العلوي - تم إبعاد الوقت والنقاط عن العنوان */}
      <div className="main-header">
        <div className="stat-box">الوقت: {timerSeconds}</div>

        <div className="center-info">
          <div className="title-box"><h1>الأخطبوط الذكي</h1></div>
          <div className="subtitle-box"><p>ضع كل كلمة في الذراع المناسبة</p></div>
        </div>

        <div className="stat-box">النقاط: {score}</div>
      </div>

      {/* الأخطبوط */}
      <div className="octopus-wrapper">
        <img src={octopusImage} className="octopus-img" alt="octopus" />
        <div className="drop-zones">
          <div ref={waslBasketRef} className="basket-zone" />
          <div ref={qatBasketRef} className="basket-zone" />
        </div>
      </div>

      {/* الفقاعات الموزعة بالتناوب وفي مواضع ثابتة */}
      <div className="bubbles-wrapper">
        {ORDERED_WORDS.map((wordObj, index) => {
          const item = items.find(i => i.id === wordObj.id);
          if (!item) return null;

          return (
            <motion.div
              key={item.id}
              drag
              dragSnapToOrigin={true}
              dragElastic={0.1}
              dragMomentum={false}
              className={`bubble-item pos-${index}`}
              onDragEnd={(e, i) => handleDragEnd(e, i, item)}
            >
              <img src={bubbleImage} className="bubble-img" alt="bubble" />
              <span className="bubble-text">{item.text}</span>
            </motion.div>
          );
        })}
      </div>

      {/* الأزرار السفليّة */}
      <div className="bottom-controls">
        <button className="ctrl-btn" onClick={() => navigate('/home')} title="الرئيسية"><Home size={24} /></button>
        <button className="ctrl-btn" onClick={resetGame} title="إعادة"><RefreshCw size={24} /></button>
        <button className="ctrl-btn" onClick={() => setIsMuted(!isMuted)} title="الصوت"><Volume2 size={24} style={{ opacity: isMuted ? 0.4 : 1 }} /></button>
        <button className="ctrl-btn" onClick={() => navigate(-1)} title="رجوع"><ArrowLeft size={24} /></button>
      </div>

      {/* شاشة الفوز */}
      {gameState === 'won' && (
        <div className="overlay">
          <div className="win-modal">
            <Trophy size={42} color="#fbbf24" />
            <h2>أحسنت يا بطل </h2>
            <p className="win-score">النقاط: {score}</p>
          
            <div className="win-actions">
              <button className="win-btn" onClick={() => navigate('/home')}><Home size={20} /></button>
              <button className="win-btn highlight" onClick={resetGame} title="إعادة اللعب"><RefreshCw size={20} /></button>
              <button className="win-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-container { width: 100vw; height: 100vh; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; touch-action: none; }
        .bg-img { position: absolute; width: 100%; height: 100%; object-fit: cover; z-index: 0; }

        /* الشريط العلوي - زيادة المسافة لتبتعد العناصر عن العنوان */
        .main-header { position: absolute; top: 12px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 18px; z-index: 10; }
        
        .stat-box { 
          background: rgba(255,255,255,0.95); 
          padding: 6px 14px; 
          border-radius: 14px; 
          font-weight: 800; 
          font-size: 0.95rem; 
          color: #0369a1; 
          box-shadow: 0 3px 8px rgba(0,0,0,0.18); 
          width: max-content; 
          white-space: nowrap; 
          display: inline-block;
        }

        .center-info { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .title-box { background: #0ea5e9; padding: 5px 20px; border-radius: 14px; color: white; width: max-content; }
        .title-box h1 { margin: 0; font-size: 1.25rem; font-weight: bold; }
        .subtitle-box { background: rgba(255,255,255,0.95); padding: 3px 12px; border-radius: 10px; color: #0369a1; font-weight: bold; width: max-content; }
        .subtitle-box p { margin: 0; font-size: 0.85rem; }

        /* الأخطبوط */
        .octopus-wrapper { position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); width: 320px; height: 320px; z-index: 2; }
        .octopus-img { width: 100%; height: 100%; object-fit: contain; filter: none; mix-blend-mode: normal; }
        .drop-zones { position: absolute; top: 15%; width: 100%; height: 40%; display: flex; justify-content: space-between; pointer-events: none; }
        .basket-zone { width: 44%; height: 100%; pointer-events: auto; }

        /* الفقاعات */
        .bubbles-wrapper { position: absolute; bottom: 85px; width: 100%; max-width: 380px; height: 140px; z-index: 30; }
        .bubble-item { position: absolute; width: 68px; height: 68px; cursor: grab; display: flex; align-items: center; justify-content: center; user-select: none; touch-action: none; }
        .bubble-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .bubble-text { position: absolute; font-weight: 800; font-size: 1.15rem; color: #0f172a; pointer-events: none; text-shadow: 0 0 3px rgba(255,255,255,0.9); }

        .pos-0 { top: 0; left: 2%; }
        .pos-1 { top: 0; left: 21%; }
        .pos-2 { top: 0; left: 40%; }
        .pos-3 { top: 0; left: 59%; }
        .pos-4 { top: 0; left: 78%; }

        .pos-5 { top: 70px; left: 2%; }
        .pos-6 { top: 70px; left: 21%; }
        .pos-7 { top: 70px; left: 40%; }
        .pos-8 { top: 70px; left: 59%; }
        .pos-9 { top: 70px; left: 78%; }

        /* الشاشات الكبيرة */
        @media (min-width: 768px) {
           .main-header { top: 16px; gap: 32px; }
           .title-box h1 { font-size: 1.6rem; }
           .subtitle-box p { font-size: 1.05rem; }
           .stat-box { font-size: 1.15rem; padding: 7px 18px; }
           
           .octopus-wrapper { width: 410px; height: 410px; top: 45%; }
           
           .bubbles-wrapper { max-width: 850px; height: 90px; bottom: 95px; }
           .bubble-item { width: 82px; height: 82px; }
           .bubble-text { font-size: 1.35rem; }

           .pos-0 { top: 0; left: 0%; }
           .pos-1 { top: 0; left: 10%; }
           .pos-2 { top: 0; left: 20%; }
           .pos-3 { top: 0; left: 30%; }
           .pos-4 { top: 0; left: 40%; }
           .pos-5 { top: 0; left: 50%; }
           .pos-6 { top: 0; left: 60%; }
           .pos-7 { top: 0; left: 70%; }
           .pos-8 { top: 0; left: 80%; }
           .pos-9 { top: 0; left: 90%; }
        }

        /* الأزرار السفليّة */
        .bottom-controls { position: absolute; bottom: 18px; display: flex; gap: 14px; z-index: 30; }
        .ctrl-btn { width: 46px; height: 46px; border-radius: 50%; border: none; background: white; color: #0284c7; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.22); }
        
        /* شاشة الفوز */
        .overlay { position: fixed; inset: 0; background: rgba(201, 118, 88, 0.65); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .win-modal { background: white; padding: 10px; border-radius: 30px; text-align: center; width: 199px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); }
        .win-modal h2 { margin: 8px 0 4px; font-size: 1.15rem; color: #0f172a; }
        .win-score { margin: 0; font-size: 0.95rem; color: #24579e; font-weight: bold; }
        .win-time { margin: 4px 0 14px; font-size: 0.85rem; color: #0284c7; font-weight: bold; }
        .win-actions { display: flex; justify-content: center; gap: 10px; }
        .win-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #0563de; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .win-btn.highlight { background: #fbfcfd; color: black; border: 1px solid #0563de; }
      `}</style>
    </div>
  );
}