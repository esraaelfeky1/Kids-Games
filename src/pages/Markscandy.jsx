// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RefreshCw, Volume2, VolumeX, ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import bgImage from '../assets/background2.jpeg';
import boyImage from '../assets/boy8.png';

// 🍬 العناصر: علامات الترقيم مع أشكال حلوى وجواهر
const BASE_TYPES = [
  { id: 'candy', icon: '🍬', color: '#ec4899', symbol: '!' },  // تعجب
  { id: 'lollipop', icon: '🍭', color: '#06b6d4', symbol: '?' }, // استفهام
  { id: 'gem', icon: '💎', color: '#8b5cf6', symbol: '.' },      // نقطة
  { id: 'donut', icon: '🍩', color: '#f59e0b', symbol: ':' },    // نقطتان
];

const GRID_SIZE = 6;
const MAX_MATCHES = 20;

export default function CandyPunctuationGame() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [isMuted, setIsMuted] = useState(false);

  // 🔊 توليد صوت فرقعة كاندي لطيف ومباشر من المتصفح بدون ملفات ولا روابط خارجية
  const playCandySound = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // القفز في التردد يعطي صوت فرقعة الحلوى المميز (Pop)
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.log("Audio Web API error:", e);
    }
  };

  const getRandomItem = () => {
    const base = BASE_TYPES[Math.floor(Math.random() * BASE_TYPES.length)];
    return {
      ...base,
      uniqueId: Math.random().toString(36).substr(2, 9)
    };
  };

  const createCandyGrid = () => {
    let newGrid = Array(GRID_SIZE * GRID_SIZE).fill(null);

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        let idx = r * GRID_SIZE + c;
        let item;
        let attempts = 0;

        do {
          item = getRandomItem();
          attempts++;

          const left1 = c > 0 ? newGrid[r * GRID_SIZE + (c - 1)] : null;
          const left2 = c > 1 ? newGrid[r * GRID_SIZE + (c - 2)] : null;
          const matchHoriz = left1 && left2 && left1.id === item.id;

          const top1 = r > 0 ? newGrid[(r - 1) * GRID_SIZE + c] : null;
          const top2 = r > 1 ? newGrid[(r - 2) * GRID_SIZE + c] : null;
          const matchVert = top1 && top2 && top1.id === item.id;

          if (!matchHoriz && !matchVert) break;
        } while (attempts < 50);

        newGrid[idx] = item;
      }
    }

    for (let i = 0; i < 4; i++) {
      const r = Math.floor(Math.random() * (GRID_SIZE - 1));
      const c = Math.floor(Math.random() * (GRID_SIZE - 2));
      const targetItem = getRandomItem();

      newGrid[r * GRID_SIZE + c] = { ...targetItem, uniqueId: Math.random().toString() };
      newGrid[r * GRID_SIZE + (c + 1)] = { ...targetItem, uniqueId: Math.random().toString() };
      
      let nextRowIdx = (r + 1) * GRID_SIZE + (c + 2);
      if (nextRowIdx < GRID_SIZE * GRID_SIZE) {
        newGrid[nextRowIdx] = { ...targetItem, uniqueId: Math.random().toString() };
      }
    }

    return newGrid;
  };

  const resetGame = () => {
    setGrid(createCandyGrid());
    setScore(0);
    setMatchesCount(0);
    setTimerSeconds(0);
    setGameState('playing');
    setSelectedIdx(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const checkForMatches = (currentGrid) => {
    let matchedIndices = new Set();

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        let idx1 = r * GRID_SIZE + c;
        let idx2 = r * GRID_SIZE + (c + 1);
        let idx3 = r * GRID_SIZE + (c + 2);

        if (
          currentGrid[idx1] && currentGrid[idx2] && currentGrid[idx3] &&
          currentGrid[idx1].id === currentGrid[idx2].id &&
          currentGrid[idx2].id === currentGrid[idx3].id
        ) {
          matchedIndices.add(idx1);
          matchedIndices.add(idx2);
          matchedIndices.add(idx3);
        }
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        let idx1 = r * GRID_SIZE + c;
        let idx2 = (r + 1) * GRID_SIZE + c;
        let idx3 = (r + 2) * GRID_SIZE + c;

        if (
          currentGrid[idx1] && currentGrid[idx2] && currentGrid[idx3] &&
          currentGrid[idx1].id === currentGrid[idx2].id &&
          currentGrid[idx2].id === currentGrid[idx3].id
        ) {
          matchedIndices.add(idx1);
          matchedIndices.add(idx2);
          matchedIndices.add(idx3);
        }
      }
    }

    return Array.from(matchedIndices);
  };

  const handleMatchesAndGravity = (currentGrid) => {
    const matches = checkForMatches(currentGrid);
    if (matches.length === 0) return;

    // تشغيل صوت الفرقعة المباشر
    playCandySound();
    
    setScore(prev => prev + 1);
    setMatchesCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= MAX_MATCHES) {
        setGameState('won');
      }
      return nextCount;
    });

    let newGrid = [...currentGrid];
    matches.forEach(idx => {
      newGrid[idx] = null;
    });

    for (let c = 0; c < GRID_SIZE; c++) {
      let emptySlots = 0;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        let idx = r * GRID_SIZE + c;
        if (newGrid[idx] === null) {
          emptySlots++;
        } else if (emptySlots > 0) {
          newGrid[(r + emptySlots) * GRID_SIZE + c] = newGrid[idx];
          newGrid[idx] = null;
        }
      }

      for (let r = 0; r < emptySlots; r++) {
        newGrid[r * GRID_SIZE + c] = getRandomItem();
      }
    }

    setGrid(newGrid);

    setTimeout(() => {
      handleMatchesAndGravity(newGrid);
    }, 300);
  };

  const handleTileClick = (index) => {
    if (gameState !== 'playing') return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      const isAdjacent =
        (Math.abs(selectedIdx - index) === 1 && Math.floor(selectedIdx / GRID_SIZE) === Math.floor(index / GRID_SIZE)) ||
        Math.abs(selectedIdx - index) === GRID_SIZE;

      if (isAdjacent) {
        let newGrid = [...grid];
        [newGrid[selectedIdx], newGrid[index]] = [newGrid[index], newGrid[selectedIdx]];

        const matches = checkForMatches(newGrid);
        if (matches.length > 0) {
          setGrid(newGrid);
          setTimeout(() => handleMatchesAndGravity(newGrid), 150);
        } else {
          setGrid(newGrid);
          setTimeout(() => {
            // eslint-disable-next-line react-hooks/immutability
            [newGrid[selectedIdx], newGrid[index]] = [newGrid[index], newGrid[selectedIdx]];
            setGrid([...newGrid]);
          }, 250);
        }
      }
      setSelectedIdx(null);
    }
  };

  return (
    <div className="game-container">
      <img src={bgImage} className="bg-img" alt="bg" />

      {/* الشريط العلوي */}
      <div className="main-header">
        <div className="stat-box">الوقت: {timerSeconds}</div>

        <div className="center-info">
          <div className="title-box"><h1>كاندي علامات الترقيم 🎯</h1></div>
          <div className="subtitle-box"><p>المرحلة: {matchesCount} / {MAX_MATCHES}</p></div>
        </div>

        <div className="stat-box">النقاط: {score}</div>
      </div>

      {/* منطقة اللعب */}
      <div className="main-play-area">
        <div className="character-wrapper">
          <img src={boyImage} className="boy-img" alt="boy" />
        </div>

        <div className="board-wrapper">
          <div className="candy-board">
            <div className="grid-container">
              {grid.map((item, index) => (
                <motion.div
                  key={item ? item.uniqueId : index}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`grid-tile ${selectedIdx === index ? 'selected' : ''}`}
                  style={{ backgroundColor: item ? item.color : 'transparent' }}
                  onClick={() => handleTileClick(index)}
                >
                  {item && (
                    <>
                      <span className="tile-icon">{item.icon}</span>
                      <span className="tile-symbol">{item.symbol}</span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="spacer-right"></div>
      </div>

      {/* التحكم السفلي */}
      <div className="bottom-controls">
        <button className="ctrl-btn" onClick={() => navigate('/home')} title="الرئيسية"><Home className="icon-size" /></button>
        <button className="ctrl-btn" onClick={resetGame} title="إعادة"><RefreshCw className="icon-size" /></button>
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
              <h2>مذهل! أحسنت يا بطل 🏆</h2>
              <p className="win-score">مجموع النقاط: {score}</p>
              <p className="win-time">الوقت المستغرق: {timerSeconds} ثانية</p>
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
          padding: 6px 8px;
          box-sizing: border-box;
          font-family: 'Cairo', sans-serif;
        }
        .bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }

        .main-header { 
          position: relative; 
          top: 2px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          z-index: 10; 
          width: 90%; 
          max-width: 950px; 
        }

        .stat-box { 
          background: rgba(255,255,255,0.95); 
          padding: 6px 12px; 
          border-radius: 12px; 
          font-weight: 900; 
          font-size: 0.9rem; 
          color: #1e3a8a; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.18); 
          text-align: center;
          white-space: nowrap;
          width: fit-content;
        }

        .center-info { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .title-box { background: #2563eb; padding: 5px 18px; border-radius: 12px; color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.22); }
        .title-box h1 { margin: 0; font-size: 1.15rem; font-weight: 900; }
        .subtitle-box { background: rgba(255,255,255,0.95); padding: 4px 14px; border-radius: 10px; color: #1e3a8a; font-weight: 800; }
        .subtitle-box p { margin: 0; font-size: 0.8rem; }

        .main-play-area { 
          position: relative; 
          z-index: 5; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          width: 100%;
          max-width: 1000px;
          height: 100%;
        }

        .character-wrapper { 
          width: 110px; 
          height: 100%; 
          display: flex; 
          align-items: flex-end; 
          flex-shrink: 0; 
        }
        .boy-img { width: 100%; height: auto; object-fit: contain; }

        .board-wrapper { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          flex-grow: 1; 
          margin-top: 0px; 
          margin-bottom: 110px; 
        }
        .spacer-right { width: 110px; flex-shrink: 0; }

        .candy-board { background: #1e3a8a; padding: 8px; border-radius: 16px; border: 3px solid #3b82f6; box-shadow: 0 6px 20px rgba(0,0,0,0.35); }
        .grid-container { display: grid; grid-template-columns: repeat(6, 44px); grid-template-rows: repeat(6, 44px); gap: 4px; }
        
        .grid-tile { 
          width: 44px; height: 44px; border-radius: 8px; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; cursor: pointer; color: white; 
          box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.1s ease;
        }
        .grid-tile.selected { outline: 3px solid #facc15; transform: scale(1.08); z-index: 2; }
        
        .tile-icon { font-size: 0.95rem; line-height: 1; }
        .tile-symbol { font-size: 1.25rem; font-weight: 900; line-height: 1; margin-top: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }

        .bottom-controls { 
          position: relative; 
          bottom: 22px; 
          display: flex; 
          gap: 12px; 
          z-index: 10; 
        }
        .ctrl-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: white; color: #2563eb; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); }
        :global(.icon-size) { width: 22px; height: 22px; }

        /* شاشة الفوز */
        .overlay { 
          position: fixed; 
          inset: 0; 
          background: rgba(0,0,0,0.65); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 100; 
        }
        .win-modal { 
          background: white; 
          padding: 16px 20px; 
          border-radius: 18px; 
          text-align: center; 
          width: fit-content; 
          min-width: 210px;
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

        /* التابلت */
        @media (min-width: 600px) and (max-width: 1023px) {
          .stat-box { font-size: 1rem; padding: 7px 16px; }
          .title-box h1 { font-size: 1.25rem; }
          .subtitle-box p { font-size: 0.85rem; }

          .character-wrapper { width: 150px; }
          .spacer-right { width: 150px; }

          .board-wrapper { margin-top: 0px; margin-bottom: 20px; }
          .candy-board { padding: 10px; border-width: 4px; }
          .grid-container { grid-template-columns: repeat(6, 52px); grid-template-rows: repeat(6, 52px); gap: 5px; }
          .grid-tile { width: 52px; height: 52px; border-radius: 10px; }
          .tile-icon { font-size: 1.1rem; }
          .tile-symbol { font-size: 1.4rem; }

          .bottom-controls { bottom: 30px; gap: 14px; }
          .ctrl-btn { width: 48px; height: 48px; }
          :global(.icon-size) { width: 24px; height: 24px; }
        }

        /* اللاب توب والشاشات الكبيرة */
        @media (min-width: 1024px) {
          .stat-box { font-size: 1.05rem; padding: 8px 20px; }
          .title-box h1 { font-size: 1.65rem; }
          .subtitle-box p { font-size: 0.88rem; }

          .character-wrapper { width: 200px; }
          .spacer-right { width: 200px; }

          .board-wrapper { margin-top: 0px; margin-bottom: 15px; }

          .candy-board { padding: 10px; border-width: 4px; border-radius: 20px; }
          .grid-container { grid-template-columns: repeat(6, 56px); grid-template-rows: repeat(6, 56px); gap: 5px; }
          .grid-tile { width: 56px; height: 56px; border-radius: 10px; }
          .tile-icon { font-size: 1.2rem; }
          .tile-symbol { font-size: 1.5rem; }
          
          .bottom-controls { bottom: 20px; }
          .ctrl-btn { width: 46px; height: 46px; }
          :global(.icon-size) { width: 23px; height: 23px; }
        }
      `}</style>
    </div>
  );
}