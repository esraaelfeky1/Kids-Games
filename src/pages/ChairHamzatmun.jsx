// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RefreshCw, Volume2, VolumeX, ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import bgImage from '../assets/background4.jpeg';
import dragonImage from '../assets/boy10.png';
import fishImage from '../assets/boy11.png';
import meatImage from '../assets/boy13.png';
     
import successSound from '/sounds/hay1.mp3';

const QUESTIONS_BANK = [
  {
    targetChair: 'على الألف (أ / إ)',
    options: [
      { id: 1, word: 'يَأْكُلُ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 2, word: 'كِتَابٌ', isCorrect: false, type: 'fish', img: fishImage },
      { id: 3, word: 'سُؤَالٌ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 4, word: 'قَلَمٌ', isCorrect: false, type: 'fish', img: fishImage },
    ]
  },
  {
    targetChair: 'على الواو (ؤ)',
    options: [
      { id: 1, word: 'مَدْرَسَةٌ', isCorrect: false, type: 'meat', img: meatImage },
      { id: 2, word: 'سُؤَالٌ', isCorrect: true, type: 'fish', img: fishImage },
      { id: 3, word: 'قَرَأَ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 4, word: 'شَمْسٌ', isCorrect: false, type: 'fish', img: fishImage },
    ]
  },
  {
    targetChair: 'على الياء / النبرة (ئـ / ئ)',
    options: [
      { id: 1, word: 'بِئْرٌ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 2, word: 'بَابٌ', isCorrect: false, type: 'fish', img: fishImage },
      { id: 3, word: 'أَكَلَ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 4, word: 'زَهْرَةٌ', isCorrect: false, type: 'fish', img: fishImage },
    ]
  },
  {
    targetChair: 'على السطر (ء)',
    options: [
      { id: 1, word: 'بَيْتٌ', isCorrect: false, type: 'meat', img: meatImage },
      { id: 2, word: 'فُؤَادٌ', isCorrect: true, type: 'fish', img: fishImage },
      { id: 3, word: 'إِمْلَاءٌ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 4, word: 'شَجَرَةٌ', isCorrect: false, type: 'fish', img: fishImage },
    ]
  },
  {
    targetChair: 'على الواو (ؤ)',
    options: [
      { id: 1, word: 'مُؤْمِنٌ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 2, word: 'كُرَةٌ', isCorrect: false, type: 'fish', img: fishImage },
      { id: 3, word: 'رَأْسٌ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 4, word: 'نَهْرٌ', isCorrect: false, type: 'fish', img: fishImage },
    ]
  },
  {
    targetChair: 'على الياء / النبرة (ئـ / ئ)',
    options: [
      { id: 1, word: 'سَأَلَ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 2, word: 'شَاطِئٌ', isCorrect: true, type: 'fish', img: fishImage },
      { id: 3, word: 'طَالِبٌ', isCorrect: false, type: 'meat', img: meatImage },
      { id: 4, word: 'قَمَرٌ', isCorrect: false, type: 'fish', img: fishImage },
    ]
  },
  {
    targetChair: 'على الألف (أ / إ)',
    options: [
      { id: 1, word: 'لُؤْلُؤٌ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 2, word: 'سَمَكٌ', isCorrect: false, type: 'fish', img: fishImage },
      { id: 3, word: 'رَأْسٌ', isCorrect: true, type: 'meat', img: meatImage },
      { id: 4, word: 'حَدِيقَةٌ', isCorrect: false, type: 'fish', img: fishImage },
    ]
  }
];

const TOTAL_ROUNDS = 7;

export default function FeedDragonGame() {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [isMuted, setIsMuted] = useState(false);

  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [dragonMouthOpen, setDragonMouthOpen] = useState(false);

  const dragonRef = useRef(null);

  const currentQ = QUESTIONS_BANK[currentRound % QUESTIONS_BANK.length];

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

  const resetGame = () => {
    setCurrentRound(0);
    setScore(0);
    setTimerSeconds(0);
    setGameState('playing');
    setHiddenOptions([]);
    setDragonMouthOpen(false);
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleDragEnd = (event, info, optionIndex, isCorrect) => {
    if (!dragonRef.current) return;

    const dragonRect = dragonRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

    const buffer = 70; 
    const isInsideDragon =
      dropX >= (dragonRect.left - buffer) &&
      dropX <= (dragonRect.right + buffer) &&
      dropY >= (dragonRect.top - buffer) &&
      dropY <= (dragonRect.bottom + buffer);

    if (isInsideDragon && isCorrect) {
      setHiddenOptions(prev => [...prev, optionIndex]);
      setDragonMouthOpen(true);
      playSuccessSound();

      const newScore = score + 1;
      setScore(newScore);

      setTimeout(() => {
        setDragonMouthOpen(false);
        const nextRound = currentRound + 1;
        if (nextRound >= TOTAL_ROUNDS) {
          setGameState('won');
        } else {
          setCurrentRound(nextRound);
          setHiddenOptions([]);
        }
      }, 500);
    }
  };

  return (
    <div className="game-container">
      <img src={bgImage} className="bg-img" alt="bg" />

      {/* الشريط العلوي */}
      <div className="main-header">
        <div className="stat-box">الوقت: {timerSeconds}</div>

        <div className="center-info">
          <div className="title-box"><h1>أطعم التنين بالكلمة الصحيحة</h1></div>
          <div className="subtitle-box">
            <p>اختر الكلمة التي تحتوي على همزة: {currentQ.targetChair}</p>
          </div>
        </div>

        <div className="stat-box">النقاط: {score}</div>
      </div>

      {/* منطقة اللعب */}
      <div className="main-play-area">
        {/* منطقة التنين */}
        <div className="dragon-section" ref={dragonRef}>
          <div className="speech-bubble">
            أنا جائع! أطعمني الكلمة الصحيحة ❤️
          </div>
          <motion.img
            src={dragonImage}
            className="dragon-img"
            alt="dragon"
            animate={dragonMouthOpen ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
            draggable={false}
          />
        </div>

        {/* صف الأطعمة على الأرض */}
        <div className="ground-foods-row">
          {currentQ.options.map((option, idx) => {
            const isHidden = hiddenOptions.includes(idx);
            if (isHidden) return <div key={idx} className="food-placeholder" />;

            return (
              <motion.div
                key={`${currentRound}-${idx}`}
                className="food-card"
                drag
                dragSnapToOrigin={true}
                dragElastic={0.2}
                dragMomentum={false}
                onDragEnd={(e, info) => handleDragEnd(e, info, idx, option.isCorrect)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src={option.img} 
                  className="food-img" 
                  alt={option.type} 
                  draggable={false}
                />
                <span className="food-label">{option.word}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* شريط التحكم السفلي */}
      <div className="bottom-controls">
        <button className="ctrl-btn" onClick={() => navigate('/home')} title="الرئيسية"><Home className="icon-size" /></button>
        <button className="ctrl-btn" onClick={resetGame} title="إعادة المحاولة"><RefreshCw className="icon-size" /></button>
        <button className="ctrl-btn" onClick={() => setIsMuted(!isMuted)} title="الصوت">
          {isMuted ? <VolumeX className="icon-size" style={{ color: '#ef4444' }} /> : <Volume2 className="icon-size" />}
        </button>
        <button className="ctrl-btn" onClick={() => navigate(-1)} title="رجوع"><ArrowLeft className="icon-size" /></button>
      </div>

      {/* شاشة الفوز */}
      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div 
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="win-modal">
              <Trophy size={42} color="#fbbf24" />
              <h2>مذهل! لقد أطعمت التنين</h2>
              <p className="win-score">مجموع النقاط: {score} / {TOTAL_ROUNDS}</p>
          
              <div className="win-actions">
                <button className="win-btn" onClick={() => navigate('/home')} title="الرئيسية"><Home size={20} /></button>
                <button className="win-btn highlight" onClick={resetGame} title="إعادة اللعب"><RefreshCw size={22} /></button>
                <button className="win-btn" onClick={() => navigate(-1)} title="رجوع"><ArrowLeft size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .game-container { 
          width: 100vw; 
          height: 100vh; 
          position: relative; 
          overflow: hidden; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: space-between; 
          user-select: none; 
          -webkit-user-select: none;
          padding: 6px 12px;
          box-sizing: border-box;
        }

        .bg-img { 
          position: absolute; 
          inset: 0; 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          z-index: 0; 
          pointer-events: none; 
        }

        .main-header { 
          position: relative; 
          top: 4px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          z-index: 10; 
          width: 100%; 
          max-width: 1000px; 
          pointer-events: none;
        }

        .stat-box { 
          background: rgba(255, 255, 255, 0.95); 
          padding: 6px 12px; 
          border-radius: 12px; 
          font-weight: 900; 
          font-size: 0.9rem; 
          color: #1e3a8a; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.18); 
          text-align: center;
          white-space: nowrap;
          pointer-events: auto;
        }

        .center-info { display: flex; flex-direction: column; align-items: center; gap: 3px; pointer-events: auto; }
        .title-box { background: #854d0e; padding: 4px 14px; border-radius: 12px; color: #fef08a; border: 2px solid #facc15; box-shadow: 0 4px 8px rgba(0,0,0,0.22); }
        .title-box h1 { margin: 0; font-size: 1rem; font-weight: 900; }
        .subtitle-box { background: rgba(255,255,255,0.95); padding: 3px 12px; border-radius: 10px; color: #1e3a8a; font-weight: 800; }
        .subtitle-box p { margin: 0; font-size: 0.85rem; }

        .main-play-area { 
          position: relative; 
          z-index: 5; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: flex-end; 
          width: 100%;
          max-width: 1100px;
          height: 100%;
          padding-bottom: 10px;
        }

        .dragon-section {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 180px;
          height: 200px;
          z-index: 5;
          pointer-events: none;
        }

        .speech-bubble {
          background: white;
          color: #1e3a8a;
          padding: 6px 10px;
          border-radius: 14px;
          font-size: 0.8rem;
          font-weight: 900;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          text-align: center;
          margin-bottom: 6px;
          position: relative;
          white-space: nowrap;
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 7px 7px 0;
          border-style: solid;
          border-color: white transparent;
        }

        .dragon-img {
          width: 100%;
          height: auto;
          max-height: 150px;
          object-fit: contain;
          pointer-events: none;
        }

        /* ترتيب الأطعمة على الموبايل: 2 فوق و2 تحت */
        .ground-foods-row {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px 16px;
          width: 100%;
          max-width: 240px; /* لضمان نزول عنصرين في الصف الثاني */
          margin-top: 10px;
          margin-bottom: 5px;
          z-index: 50;
        }

        .food-placeholder {
          width: 100px;
          height: 100px;
        }

        .food-card {
          position: relative;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          z-index: 100;
          touch-action: none;
        }
        .food-card:active {
          cursor: grabbing;
        }

        .food-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        /* توسيط النص في منتصف اللحم والسمك تماماً */
        .food-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 1.55rem;
          font-weight: 900;
          color: #0f172a;
          pointer-events: none;
          user-select: none;
          line-height: 1;
          direction: rtl;
        }

        .bottom-controls { 
          position: relative; 
          bottom: 10px; 
          display: flex; 
          gap: 12px; 
          z-index: 10; 
        }
        .ctrl-btn { width: 42px; height: 42px; border-radius: 50%; border: none; background: white; color: #2563eb; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); }
        :global(.icon-size) { width: 20px; height: 20px; }

        .overlay { 
          position: fixed; 
          inset: 0; 
          background: rgba(0,0,0,0.65); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 1000; 
        }
        .win-modal { 
          background: white; 
          padding: 16px 5px; 
          border-radius: 18px; 
          text-align: center; 
          width: fit-content; 
          min-width: 200px;
          max-width: 90vw;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3); 
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .win-modal h2 { margin: 6px 0 2px; font-size: 1.1rem; color: #0f172a; white-space: nowrap; }
        .win-score { margin: 2px 0; font-size: 0.95rem; color: #475569; font-weight: bold; }
        .win-time { margin: 2px 0 10px; font-size: 0.85rem; color: #2563eb; font-weight: bold; }
        .win-actions { display: flex; justify-content: center; gap: 10px; }
        
        .win-btn { 
          width: 38px; 
          height: 38px; 
          border-radius: 50%; 
          border: 2px solid #bfdbfe; 
          background: #eff6ff; 
          color: #1d4ed8; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .win-btn.highlight { background: #2563eb; color: white; border: none; box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4); }

        /* التعديل للتابلت والشاشات الكبيرة: التنين والأطعمة بجانب بعض وفي صف واحد */
        @media (min-width: 600px) {
          .main-play-area {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            padding-bottom: 15px;
          }

          .dragon-section { width: 230px; height: 270px; }
          .dragon-img { max-height: 220px; }

          .ground-foods-row {
            flex-wrap: nowrap;
            max-width: none;
            width: auto;
            gap: 10px;
            margin-top: 0;
          }

          .food-card, .food-placeholder { width: 110px; height: 110px; }
          .food-label { font-size: 1.75rem; }

          .stat-box { font-size: 1.05rem; padding: 7px 16px; }
          .title-box h1 { font-size: 1.25rem; }
          .subtitle-box p { font-size: 0.95rem; }

          .bottom-controls { bottom: 14px; gap: 14px; }
          .ctrl-btn { width: 48px; height: 48px; }
          :global(.icon-size) { width: 24px; height: 24px; }
        }

        @media (min-width: 1024px) {
          .stat-box { font-size: 1.1rem; padding: 8px 20px; }
          .title-box h1 { font-size: 1.45rem; }
          .subtitle-box p { font-size: 1rem; }

          .dragon-section { width: 270px; height: 310px; }
          .dragon-img { max-height: 250px; }
          .food-card, .food-placeholder { width: 125px; height: 125px; }
          .food-label { font-size: 2rem; }
          
          .bottom-controls { bottom: 16px; }
          .ctrl-btn { width: 48px; height: 48px; }
          :global(.icon-size) { width: 24px; height: 24px; }
        }

        @media (max-height: 500px) {
          .main-header { top: 0; }
          .title-box h1 { font-size: 0.85rem; }
          .subtitle-box p { font-size: 0.75rem; }
          .dragon-section { width: 140px; height: 170px; }
          .dragon-img { max-height: 140px; }
          .food-card, .food-placeholder { width: 70px; height: 70px; }
          .food-label { font-size: 1.2rem; }
          .bottom-controls { bottom: 4px; }
          .ctrl-btn { width: 36px; height: 36px; }
        }
      `}</style>
    </div>
  );
}