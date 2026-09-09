// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

import mainBg from '../assets/sukoonbg1.jpeg';
import imgTitle from '../assets/sukoontitle1.png';
import imgRabbit from '../assets/rabbit.png';
import imgSquirrel from '../assets/squirrel.png';

import imgStar from '../assets/stargame1.png';
import imgListen from '../assets/listengame1.png';
import imgDino from '../assets/dinogame1.png';
import imgBalloons from '../assets/fh.png';

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
    { id: 'imgStar', img: imgStar, path: '/Tamarbutatreas' },
    { id: 'imgListen', img: imgListen, path: '/Tamarbutamonky' },
    { id: 'imgDino', img: imgDino, path: '/Tamarbutamountain' },
    { id: 'imgBalloons', img: imgBalloons, path: '/Tamarbutafish' }
  ];

  return (
    <div className="sukoon-container" style={{ 
      backgroundImage: `url(${mainBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
      height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed', top: 0, left: 0, overflow: 'hidden', boxSizing: 'border-box', padding: '2px 0'
    }}>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        /* الشاشات الكبيرة / اللابتوب */
        .title-img { width: 195px; margin-top: -2px; z-index: 5; }
        .games-grid { 
          display: grid; grid-template-columns: repeat(2, 1fr); 
          gap: 28px; margin-top: 2px; position: relative; z-index: 2;
        }
        .game-btn { width: 150px; transition: transform 0.2s; cursor: pointer; }
        .side-animal { width: 140px !important; }

        /* تابلت */
        @media (max-width: 992px) {
          .title-img { width: 180px; }
          .games-grid { gap: 24px; }
          .game-btn { width: 135px; }
          .side-animal { width: 125px !important; }
        }

        /* موبايل - تم تكبير المربعات قليلاً لتكون أوضح */
        @media (max-width: 600px) {
          .title-img { width: 175px; margin-top: -14px; }
          .games-grid { 
            gap: 20px; 
            margin-top: -10px; 
            padding: 0 12px;
            
          }
          .game-btn { width: 125px; } /* تم تكبيرها قليلاً هنا */
          .side-animal { width: 105px !important; }
          
          .top-btn {
            width: 43px !important;
            height: 43px !important;
            font-size: 21px !important;
      
            
          }
        }
      `}</style>

      {/* أزرار الهوم والصوت */}
      <div style={{ position: 'absolute', top: '18px', left: '38px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button className="top-btn" onClick={() => window.location.href = '/home'} style={btnStyle}><IoHome /></button>
        <button className="top-btn" onClick={() => setIsMuted(!isMuted)} style={btnStyle}>{isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}</button>
      </div>

      {/* العنوان */}
      <img className="title-img" src={imgTitle} alt="عالم السكون" />

      {/* منطقة الألعاب مع خطوط المنتصف */}
      <div style={{ position: 'relative', marginTop: '2px', padding: '5px' }}>
        <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none', top: 0, left: 0 }}>
          <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#fff" strokeWidth="3" strokeDasharray="8 8" />
          <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#fff" strokeWidth="3" strokeDasharray="8 8" />
        </svg>

        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} style={{ padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img className="game-btn" src={game.img} alt="لعبة"
                onClick={() => { playSound(); window.location.href = game.path; }}
                onMouseEnter={() => { setHoveredGame(game.id); playSound(); }}
                onMouseLeave={() => setHoveredGame(null)}
                style={{ 
                  transform: hoveredGame === game.id ? 'scale(1.08)' : 'scale(1)',
                  filter: hoveredGame === game.id ? 'drop-shadow(0 0 10px rgba(255,255,255,0.7))' : 'none'
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* الحيوانات في الأسفل */}
      <div style={{ width: '100%', position: 'relative', height: '115px', pointerEvents: 'none', zIndex: 3 }}>
        <img className="side-animal animate-float" src={imgRabbit} alt="أرنب" style={{ position: 'absolute', bottom: '0', left: '5px' }} />
        <img className="side-animal animate-float" src={imgSquirrel} alt="سنجاب" style={{ position: 'absolute', bottom: '0', right: '5px' }} />
      </div>
    </div>
  );
};

const btnStyle = { 
  width: '46px', height: '46px', borderRadius: '50%', border: 'none', 
  backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '23px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', color: '#4a2c2a',
  transition: 'all 0.2s ease'
};

export default Sukoon;