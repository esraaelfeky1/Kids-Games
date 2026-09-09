// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RefreshCw, Volume2, VolumeX, ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import bgImage from '../assets/space_bg.jpeg';
import rocketImage from '../assets/rocket.png';
import astronautImage from '../assets/astronaut.png';
import questionBoardImage from '../assets/question_board.png';
import bubbleImage from '../assets/bubble1.png';

const QUESTIONS = [
  { id: 1, sentence: 'ما أجمل النجوم في السماء', options: ['!', '؟', '.'], answer: '!' },
  { id: 2, sentence: 'هل تحب السفر إلى الفضاء', options: ['.', '!', '؟'], answer: '؟' },
  { id: 3, sentence: 'الشمس كوكب مضيء وساطع', options: ['!', '.', '؟'], answer: '.' },
  { id: 4, sentence: 'ما أروع انطلاق الصاروخ', options: ['.', '؟', '!'], answer: '!' },
  { id: 5, sentence: 'كم عدداً للكواكـب في المجموعة الشمسية', options: ['؟', '.', '!'], answer: '؟' },
  { id: 6, sentence: 'يدور القمر حول الأرض ', options: [':', '.', '؟'], answer: '.' },
  { id: 7, sentence: 'ما هو سبب انطلاق الصاروخ', options: ['!', '.', '؟'], answer: '؟' },
];

export default function SpacePunctuationGame() {
  const navigate = useNavigate();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const playSound = (freq = 600, duration = 0.1) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const resetGame = () => {
    setCurrentQIndex(0);
    setScore(0);
    setTimerSeconds(0);
    setGameState('playing');
    setSelectedOption(null);
  };

  const handleAnswerSelect = (symbol) => {
    if (gameState !== 'playing' || selectedOption !== null) return;

    setSelectedOption(symbol);
    const currentQ = QUESTIONS[currentQIndex];

    if (symbol === currentQ.answer) {
      playSound(800, 0.12);
      setScore((prev) => prev + 10);
    } else {
      playSound(300, 0.2);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQIndex + 1 < QUESTIONS.length) {
        setCurrentQIndex((prev) => prev + 1);
      } else {
        setGameState('launching');
        playSound(400, 0.8);
        
        setTimeout(() => {
          setGameState('won');
        }, 2200);
      }
    }, 600);
  };

  const currentQ = QUESTIONS[currentQIndex];

  return (
    <div className="game-container">
      <img src={bgImage} className="bg-img" alt="space background" />

      {/* الشريط العلوي */}
      <div className="main-header">
        <div className="stat-box">الوقت: {timerSeconds} </div>

        <div className="center-info">
          <div className="title-box">
            <h1>مهمة الفضاء 🚀</h1>
          </div>
          <div className="subtitle-box">
            <p>السؤال: {currentQIndex + 1} / {QUESTIONS.length}</p>
          </div>
        </div>

        <div className="stat-box">النقاط:  {score}</div>
      </div>

      {/* منطقة اللعب الرئيسية */}
      <div className="main-play-area">
        {/* رجل الفضاء */}
        <div className="astronaut-wrapper">
          <img src={astronautImage} className="astronaut-img" alt="Astronaut" />
        </div>

        {/* منطقة الأسئلة والاختيارات */}
        <div className="quiz-section">
          <div className="question-card">
            <img src={questionBoardImage} className="board-bg" alt="Question Board" />
            <div className="card-content">
              <span className="card-badge">الجملة</span>
              <h2 className="sentence-text">{currentQ?.sentence}</h2>
            </div>
          </div>

          {/* الفقاعات */}
          <div className="bubbles-wrapper">
            {currentQ?.options.map((optionSymbol, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`bubble-item ${
                  selectedOption === optionSymbol
                    ? optionSymbol === currentQ.answer
                      ? 'correct'
                      : 'wrong'
                    : ''
                }`}
                onClick={() => handleAnswerSelect(optionSymbol)}
              >
                <img src={bubbleImage} className="bubble-bg" alt="Bubble" />
                <span className="symbol-text">{optionSymbol}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* الصاروخ - تم إضافة key و initial لإعادة ضبط مكان الصاروخ دائما عند الـ reset */}
        <div className="rocket-wrapper">
          <motion.img
            key={`${gameState}-${currentQIndex}`}
            src={rocketImage}
            className="rocket-img"
            alt="Rocket"
            initial={{ y: 0, opacity: 1 }}
            animate={
              gameState === 'launching' || gameState === 'won'
                ? { y: '-120vh', opacity: [1, 1, 0] }
                : { y: [0, -8, 0], opacity: 1 }
            }
            transition={
              gameState === 'launching' || gameState === 'won'
                ? { duration: 2, ease: 'easeIn' }
                : { repeat: Infinity, duration: 2, ease: 'easeInOut' }
            }
          />
        </div>
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
              <Trophy size={48} color="#fbbf24" />
              <h2>انطلق الصاروخ بنجاح 🏆</h2>
              <p className="win-score">مجموع النقاط: {score}</p>
              
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
        /* ========================================== */
        /* الهيكل الأساسي للعبة (شاشات التابلت والدسك توب) */
        /* ========================================== */
        .game-container {
          --astro-width: 170px;
          --astro-x: 0px;
          --astro-y: 100px;
          --bubble-size: 85px;
          --bubbles-gap: 20px;
          --bubbles-x: 0px;
          --bubbles-y: -125px;

          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          user-select: none;
          padding: 8px 12px;
          box-sizing: border-box;
          font-family: 'Cairo', sans-serif;
        }

        /* ========================================== */
        /* لوحة التحكم الخاصة بشاشة الموبايل فقط (Mobile Only) */
        /* ========================================== */
        @media (max-width: 599px) {
          .game-container {
            /* التحكم بالسبورة والجملة */
            --mobile-board-scale: 1.25;          /* تكبير السبورة (1.2 يعني تكبير 120%، 1.3 يعني 130%) */
            --mobile-board-margin-top: 10px;      /* تحريك السبورة لأعلى (-) أو لأسفل (+) */
            --mobile-sentence-size: 1.20rem;      /* حجم خط الجملة */
            --mobile-sentence-margin-top: -40px;    /* إزاحة الجملة لضبط مكانها في المنتصف */
            --mobile-badge-top: 12%; 
                         

            /* التحكم بالفقاعات والرموز */
            --mobile-bubble-size: 80px;           /* حجم الفقاعات */
            --mobile-bubbles-gap: 12px;           /* المسافة بين الفقاعات */
            --mobile-bubbles-y: -90px;            /* تحريك الفقاعات فوق/تحت بالنسبة للسبورة */
            --mobile-symbol-size: 2.2rem;
                    /* حجم النقطة وعلامات الترقيم */

            /* العناصر الجانبية (رائد الفضاء والصاروخ) */
            --mobile-astro-width: 130px;          /* حجم رائد الفضاء */
            --mobile-astro-x: 0px;                /* تحريك رائد الفضاء يميناً/يساراً */
            --mobile-astro-y: 130px;               /* تحريك رائد الفضاء فوق/تحت */
            --mobile-rocket-width: 90px; 
                 /* حجم الصاروخ */

            /* أزرار التحكم والشريط العلوي */
            --mobile-title-size: 0.95rem;         /* حجم عنوان المهمة */
            --mobile-btn-size: 36px;              /* حجم أزرار التحكم السفلي */
            --mobile-icon-size: 18px;             /* حجم الأيقونات */
          }

          /* تطبيق المتغيرات على كارت السبورة لتكبيره وتنسيقه */
          .question-card { 
            max-width: none !important; 
            width: 100% !important; 
            transform: scale(var(--mobile-board-scale)) !important; 
            margin-top: var(--mobile-board-margin-top) !important; 
          }

          .card-content { padding: 10px; justify-content: center; }
          .card-badge { top: var(--mobile-badge-top) !important; font-size: 0.75rem; padding: 2px 12px; }
          .sentence-text { font-size: var(--mobile-sentence-size) !important; margin-top: var(--mobile-sentence-margin-top) !important; text-align: center; }
          
          .bubbles-wrapper { 
            gap: var(--mobile-bubbles-gap) !important; 
            transform: translateY(var(--mobile-bubbles-y)) !important; 
          }
          .bubble-item { width: var(--mobile-bubble-size) !important; height: var(--mobile-bubble-size) !important; }
          .symbol-text { font-size: var(--mobile-symbol-size) !important; }

          .astronaut-wrapper { 
            width: var(--mobile-astro-width) !important; 
            transform: translate(var(--mobile-astro-x), var(--mobile-astro-y)) !important; 
          }
          .rocket-wrapper { width: var(--mobile-rocket-width) !important; }

          .title-box { padding: 4px 14px; border-radius: 10px; }
          .title-box h1 { font-size: var(--mobile-title-size) !important; }
          .subtitle-box { padding: 2px 10px; border-radius: 8px; }
          .subtitle-box p { font-size: 0.75rem; }
          .stat-box { padding: 4px 8px; font-size: 0.75rem; border-radius: 8px; }
          .bottom-controls { bottom: 8px; gap: 8px; }
          .ctrl-btn { width: var(--mobile-btn-size) !important; height: var(--mobile-btn-size) !important; }
          :global(.icon-size) { width: var(--mobile-icon-size) !important; height: var(--mobile-icon-size) !important; }
        }

        /* ========================================== */
        /* الشاشات الكبيرة (Desktop / Laptop) */
        /* ========================================== */
        @media (min-width: 1024px) {
          .game-container {
            --astro-width: 250px;
            --astro-x: 0px;     
            --astro-y: 190px;   
            --bubble-size: 95px;
            --bubbles-gap: 25px;
            --bubbles-x: 0px;    
            --bubbles-y: -145px;  
          }
        }

        /* باقي تنسيقات الـ CSS العامة */
        .bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .main-header { position: relative; top: 4px; display: flex; justify-content: space-between; align-items: center; z-index: 10; width: 90%; max-width: 950px; }
        .stat-box { background: rgba(255, 255, 255, 0.95); padding: 6px 14px; border-radius: 12px; font-weight: 900; font-size: 0.95rem; color: #1e3a8a; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); }
        .center-info { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .title-box { background: #1d4ed8; padding: 6px 22px; border-radius: 14px; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .title-box h1 { margin: 0; font-size: 1.25rem; font-weight: 900; }
        .subtitle-box { background: rgba(255, 255, 255, 0.95); padding: 4px 16px; border-radius: 10px; color: #1e3a8a; font-weight: 800; }
        .subtitle-box p { margin: 0; font-size: 0.85rem; }
        .main-play-area { position: relative; z-index: 5; display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 1100px; height: 100%; padding: 0 10px; }
        .astronaut-wrapper { width: var(--astro-width); height: auto; flex-shrink: 0; transform: translate(var(--astro-x), var(--astro-y)); transition: transform 0.2s ease, width 0.2s ease; }
        .astronaut-img { width: 100%; height: auto; object-fit: contain; }
        .quiz-section { display: flex; flex-direction: column; align-items: center; justify-content: center; flex-grow: 1; gap: 10px; margin-bottom: 20px; }
        .question-card { position: relative; width: 100%; max-width: 520px; display: flex; align-items: center; justify-content: center; }
        .board-bg { width: 100%; height: auto; display: block; object-fit: contain; }
        .card-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px; }
        .card-badge { position: absolute; top: 10%; background: #0284c7; color: white; padding: 2px 16px; border-radius: 10px; font-weight: bold; font-size: 0.85rem; }
        .sentence-text { color: white; font-size: 1.35rem; font-weight: 900; text-align: center; margin: 0; margin-top: 15px; text-shadow: 0 2px 6px rgba(0,0,0,0.8); }
        .bubbles-wrapper { display: flex; gap: var(--bubbles-gap); justify-content: center; align-items: center; transform: translate(var(--bubbles-x), var(--bubbles-y)); transition: transform 0.2s ease, gap 0.2s ease; }
        .bubble-item { position: relative; width: var(--bubble-size); height: var(--bubble-size); display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; transition: transform 0.2s ease, width 0.2s ease, height 0.2s ease; }
        .bubble-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
        .bubble-item.correct { filter: drop-shadow(0 0 10px #22c55e); }
        .bubble-item.wrong { filter: drop-shadow(0 0 10px #ef4444); }
        
        .symbol-text {
          position: relative;
          z-index: 2;
          font-size: 2.2rem;
          font-weight: 900;
          color: #facc15;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .rocket-wrapper { width: 140px; height: 100%; display: flex; align-items: flex-end; justify-content: center; flex-shrink: 0; }
        .rocket-img { width: 100%; height: auto; object-fit: contain; }
        .bottom-controls { position: relative; bottom: 30px; display: flex; gap: 12px; z-index: 10; }
        .ctrl-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: white; color: #1d4ed8; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); }
        :global(.icon-size) { width: 22px; height: 22px; }

        .overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .win-modal { background: white; padding: 20px 28px; border-radius: 20px; text-align: center; max-width: 90vw; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); display: flex; flex-direction: column; align-items: center; }
        .win-modal h2 { margin: 10px 0 4px; font-size: 1.25rem; color: #0f172a; }
        .win-score { margin: 4px 0; font-size: 1rem; color: #475569; font-weight: bold; }
        .win-time { margin: 4px 0 14px; font-size: 0.9rem; color: #1d4ed8; font-weight: bold; }
        .win-actions { display: flex; justify-content: center; gap: 12px; }
        .win-btn { width: 40px; height: 42px; border-radius: 50%; border: 2px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .win-btn.highlight { background: #1d4ed8; color: white; border: none; }
        
        @media (min-width: 768px) {
          .rocket-wrapper { width: 180px; }
          .question-card { max-width: 580px; }
          .sentence-text { font-size: 1.6rem; }
          .symbol-text { font-size: 2.6rem; }
          .bottom-controls { bottom: 35px; }
        }
      `}</style>
    </div>
  );
}