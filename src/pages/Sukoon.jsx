// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

import mainBg from '../assets/sukoonbg.jpeg';
import imgTitle from '../assets/sukoontitle.png';
import imgRabbit from '../assets/rabbit.png';
import imgSquirrel from '../assets/squirrel.png';

import imgStar from '../assets/stargame.png';
import imgListen from '../assets/listengame.png';
import imgDino from '../assets/dinogame.png';
import imgBalloons from '../assets/balloonsgame.png';

const Sukoon = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const playSound = () => {
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.play().catch(() => {});
    }
  };

  const games = [
    { id: 'imgStar', img: imgStar, path: '/SukoonStar' },
    { id: 'imgListen', img: imgListen, path: '/Sukoonlicen' },
    { id: 'imgDino', img: imgDino, path: '/SukoonDino' },
    { id: 'imgBalloons', img: imgBalloons, path: '/Sukoonballon' }
  ];

  return (
    <div className="sukoon-container" style={{ 
      backgroundImage: `url(${mainBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
      height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between', position: 'relative', overflow: 'hidden', boxSizing: 'border-box', padding: '8px 10px' 
    }}>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        .sukoon-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          max-width: 550px;
          position: relative;
          margin-top: 0px;
        }

        /* تكبير العنوان ورفعه لأعلى نقطة */
        .title-img { 
          width: clamp(180px, 30vw, 250px); 
          height: auto;
          z-index: 5; 
          margin-top: -19px;
          margin-bottom: 35px;
        }

        .games-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: clamp(15px, 3.5vw, 25px); 
          position: relative; 
          z-index: 2;
          justify-items: center;
          align-items: center;
        }

        /* تكبير مربعات الألعاب لتكون واضحة وملء العين */
        .game-btn { 
          width: clamp(135px, 30vw, 190px); 
          height: auto;
          transition: transform 0.2s; 
          cursor: pointer; 
        }

        .side-animal {
          width: clamp(100px, 20vw, 160px) !important;
          height: auto;
          pointer-events: none;
          z-index: 3;
        }
      `}</style>

      {/* أزرار التحكم العلوية */}
      <div style={{ position: 'absolute', top: '8px', left: '25px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button onClick={() => window.location.href = '/home'} style={btnStyle}><IoHome /></button>
        <button onClick={() => setIsMuted(!isMuted)} style={btnStyle}>{isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}</button>
      </div>

      {/* العنوان والعاب الشبكة مرفوعة للأعلى تماماً */}
      <div className="sukoon-wrapper">
        <img className="title-img" src={imgTitle} alt="عالم السكون" />

        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', width: '85%', height: '100%', zIndex: 1, pointerEvents: 'none', top: 0, left: '7.5%' }}>
            <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#fff" strokeWidth="3" strokeDasharray="6 6" />
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#fff" strokeWidth="3" strokeDasharray="6 6" />
          </svg>

          <div className="games-grid">
            {games.map((game) => (
              <img key={game.id} className="game-btn" src={game.img} alt="لعبة"
                onClick={() => { playSound(); window.location.href = game.path; }}
                onMouseEnter={() => { setHoveredGame(game.id); playSound(); }}
                onMouseLeave={() => setHoveredGame(null)}
                style={{ 
                  transform: hoveredGame === game.id ? 'scale(1.08)' : 'scale(1)',
                  filter: hoveredGame === game.id ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none'
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* العناصر الجانبية (الأرنب والسنجاب) في الأسفل بدون سكرول */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', pointerEvents: 'none', padding: '0 5px' }}>
        <img className="side-animal animate-float" src={imgRabbit} alt="أرنب" style={{ marginBottom: '-8px' }} />
        <img className="side-animal animate-float" src={imgSquirrel} alt="سنجاب" style={{ marginBottom: '-8px' }} />
      </div>

    </div>
  );
};

const btnStyle = { 
  width: '40px', height: '40px', borderRadius: '50%', border: 'none', 
  backgroundColor: 'rgba(255, 255, 255, 0.95)', fontSize: '20px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 5px rgba(0,0,0,0.3)', color: '#4a2c2a'
};

export default Sukoon;