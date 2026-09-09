// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

import mainBg from '../assets/sukoobg5.jpeg';
import imgTitle from '../assets/suktitle6.png';
import imgRabbit from '../assets/rabbit.png';
import imgSquirrel from '../assets/squirrel.png';

import imgStar from '../assets/strgame5.png';
import imgListen from '../assets/listengame5.png';
import imgDino from '../assets/dinogame5.png';
import imgBalloons from '../assets/fh5.png';

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
    { id: 'imgStar', img: imgStar, path: '/Softmagn' },
    { id: 'imgListen', img: imgListen, path: '/Softfada' },
    { id: 'imgDino', img: imgDino, path: '/SoftRainbow' },
    { id: 'imgBalloons', img: imgBalloons, path: '/Softfwk' }
  ];

  return (
    <div className="sukoon-container" style={{ 
      backgroundImage: `url(${mainBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden' 
    }}>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        .title-img { width: 220px; margin-top: -10px; z-index: 5; }
        .games-grid { 
          display: grid; grid-template-columns: repeat(2, 1fr); 
          gap: 60px; margin-top: 30px; position: relative; z-index: 2;
        }
        .game-btn { width: 160px; transition: transform 0.2s; cursor: pointer; }
.side-animal { width: 130px !important; position: absolute; }
  
}
        /* تابلت */
        @media (max-width: 992px) {
          .title-img { width: 200px; }
          .game-btn { width: 140px; }
          .side-animal { width: 120px !important; }
        }

        /* موبايل - التعديلات المطلوبة هنا */
        @media (max-width: 600px) {
          .title-img { width: 199px; margin-top: -10px; }
          /* المربعات أكبر قليلاً والمنطقة نازلة للأسفل أكثر */
          .games-grid { gap: 60px; margin-top: 10px; }
          .game-btn { width: 115px; }
          .side-animal { width: 100px !important; }
        }
      `}</style>

      <div style={{ position: 'absolute', top: '15px', left: '30px', display: 'flex', gap: '10px', zIndex: 10 }}>
        <button onClick={() => window.location.href = '/home'} style={btnStyle}><IoHome /></button>
        <button onClick={() => setIsMuted(!isMuted)} style={btnStyle}>{isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}</button>
      </div>

      <img className="title-img" src={imgTitle} alt="عالم السكون" />

      <div style={{ position: 'relative', marginTop: '20px' }}>
        <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#ce6d4c" strokeWidth="4" strokeDasharray="10 10" />
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#cf5e29" strokeWidth="4" strokeDasharray="10 10" />
        </svg>

        <div className="games-grid">
          {games.map((game) => (
            <img key={game.id} className="game-btn" src={game.img} alt="لعبة"
              onClick={() => { playSound(); window.location.href = game.path; }}
              onMouseEnter={() => { setHoveredGame(game.id); playSound(); }}
              onMouseLeave={() => setHoveredGame(null)}
              style={{ 
                transform: hoveredGame === game.id ? 'scale(1.1)' : 'scale(1)',
                filter: hoveredGame === game.id ? 'drop-shadow(0 0 10px rgba(255,255,255,0.7))' : 'none'
              }} 
            />
          ))}
        </div>
      </div>

      <img className="side-animal animate-float" src={imgRabbit} alt="أرنب" style={{ position: 'absolute', bottom: '0', left: '10px', width: '190px', pointerEvents: 'none' }} />
      <img className="side-animal animate-float" src={imgSquirrel} alt="سنجاب" style={{ position: 'absolute', bottom: '0', right: '10px', width: '190px', pointerEvents: 'none' }} />
    </div>
  );
};

const btnStyle = { 
  width: '43px', height: '43px', borderRadius: '50%', border: 'none', 
  backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '25px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', color: '#4a2c2a'
};

export default Sukoon;