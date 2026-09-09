// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import mainBg from '../assets/hh12.jpeg';
import boardFatha from '../assets/cat1.png';
import boardDamma from '../assets/cat2.png';
import boardKasra from '../assets/cat33.png';
import board from '../assets/cat44.png';

import imgBubbles from '../assets/match.png';
import imgLion from '../assets/drop.png';
import imgComplete from '../assets/12333.png';
import imgBeeHive from '../assets/ffff.png';
import imgIce from '../assets/1111111111112.png';
import imgSpace from '../assets/dddd.png';
import imgBasket from '../assets/12lf.png';
import imgEgg from '../assets/dddqq.png';
import imgBee from '../assets/sbac.png';
import imgIce2 from '../assets/complet.png';
import imgButterflies from '../assets/wee.png';
import imgComplete2  from '../assets/licn.png';
import imgBee2 from '../assets/1111111111.png';
import imgIce3 from '../assets/jjjj.png';
import imgButterflies2 from '../assets/fash.png';
import imgComplete3 from '../assets/fffp.png';

const TashkeelLetters = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const playSound = () => {
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.play().catch(() => {});
    }
  };

  const gamePositions = {
    imgBubbles: { top: '15%', left: '15%', width: '33%', height: '55%' },
    imgLion: { top: '25%', left: '50%', width: '33%', height: '35%' },
    imgComplete: { top: '55%', left: '15%', width: '33%', height: '36%' },
    imgBeeHive: { top: '55%', left: '50%', width: '32%', height: '38%' },
    imgIce: { top: '28%', left: '10%', width: '45%', height: '30%' },
    imgSpace: { top: '27%', left: '48%', width: '38%', height: '30%' },
    imgBasket: { top: '55%', left: '15%', width: '33%', height: '40%' },
    imgEgg: { top: '60%', left: '44%', width: '44%', height: '30%' },
    imgBee: { top: '26%', left: '11%', width: '40%', height: '30%' },
    imgIce2: { top: '25%', left: '50%', width: '34%', height: '33%' },
    imgButterflies: { top: '59%', left: '15%', width: '33%', height: '32%' },
    imgComplete2: { top: '58%', left: '24%', width: '84%', height: '32%' },
    imgBee2: { top: '28%', left: '10%', width: '47%', height: '29%' },
    imgIce3: { top: '27%', left: '52%', width: '31%', height: '32%' },
    imgButterflies2: { top: '42%', left: '17%', width: '31%', height: '63%' },
    imgComplete3: { top: '60%', left: '43%', width: '48%', height: '28%' },
  };

  const sections = [
    { title: "حروف اللثوية", board: boardFatha, games: [
      { id: 'imgBubbles', img: imgBubbles, path: '/Interdentalparrot' }, { id: 'imgLion', img: imgLion, path: '/Interdentaldrop' },
      { id: 'imgComplete', img: imgComplete, path: '/Interdentaltreasure' }, { id: 'imgBeeHive', img: imgBeeHive, path: '/Interdentalspace' }
    ]},
    { title: "حروف القطع", board: boardDamma, games: [
      { id: 'imgIce', img: imgIce, path: '/Cutsbee' }, { id: 'imgSpace', img: imgSpace, path: '/Cutsfish' },
      { id: 'imgBasket', img: imgBasket, path: '/Cutsspace' }, { id: 'imgEgg', img: imgEgg, path: '/Cutsfrog' }
    ]},
    { title: "حروف المفخمة", board: boardKasra, games: [
      { id: 'imgBee', img: imgBee, path: '/EmphaticRace' }, { id: 'imgIce2', img: imgIce2, path: '/CompleteWord' },
      { id: 'imgButterflies', img: imgButterflies, path: '/Emphaticolorl' }, { id: 'imgComplete2', img: imgComplete2, path: '/ListenChoose' }
    ]},
   { title: "حروف المرققة", board: board, games: [
      { id: 'imgBee2', img: imgBee2, path: '/Marqqaeats' }, { id: 'imgIce3', img: imgIce3, path: '/Marqqaapple' },
      { id: 'imgButterflies2', img: imgButterflies2, path: '/Marqqafish' }, { id: 'imgComplete3', img: imgComplete3, path: '/Marqqabee' }
    ]} 
  ];

  return (
    <div style={{ 
      backgroundImage: `url(${mainBg})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      paddingBottom: '40px',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        * { box-sizing: border-box; }

        .main-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 25px;
          max-width: 1200px;
          width: 100%;
          padding: 20px;
          margin-top: 20px;
        }

        .board-item {
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 260px;  /* تم التصغير قليلاً */
          height: 290px; /* تم التصغير قليلاً */
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .board-item {
            width: 240px;
            height: 270px;
          }
        }

        @media (max-width: 600px) {
          .main-wrapper {
            gap: 15px;
            padding: 10px;
          }
          .board-item {
            width: 270px;
            height: 300px;
            margin: 0 !important;
          }
          .title-area h1 {
            font-size: 22px !important;
          }
          .title-area p {
            font-size: 14px !important;
          }
        }
      `}</style>

      {/* أزرار التنقل والصوت */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '15px', zIndex: 100 }}>
        <button onClick={() => window.location.href = '/home'} style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '23px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}><IoHome /></button>
        <button onClick={() => setIsMuted(!isMuted)} style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '23px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}>
          {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
        </button>
      </div>

      {/* عنوان الصفحة */}
      <div className="title-area" style={{ marginTop: '25px', textAlign: 'center', padding: '0 15px' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '8px 23px', borderRadius: '35px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#111111' }}>مرحبا بك في عالم الحروف</h1>
        </div>
        <div style={{ backgroundColor: 'rgba(255, 240, 240, 0.5)', padding: '6px 20px', borderRadius: '40px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#202020', fontWeight: 'bold' }}>اختر الحرف الذي تريد اللعب به</h3>
        </div>
      </div>

      {/* الألواح والألعاب */}
      <main className="main-wrapper">
        {sections.map((sec, idx) => (
          <div key={idx} className="board-item" style={{ backgroundImage: `url(${sec.board})` }}>
            <h2 style={{ color: '#384491', marginTop: '20px', fontSize: '22px', textShadow: '1px 1px 2px #000', textAlign: 'center' }}>{sec.title}</h2>
            
            {sec.games.map((game, i) => {
              const isHovered = hoveredGame === game.id;
              return (
                <img key={i} src={game.img} 
                  onClick={() => { playSound(); window.location.href = game.path; }}
                  onMouseEnter={() => { setHoveredGame(game.id); playSound(); }}
                  onMouseLeave={() => setHoveredGame(null)}
                  style={{ 
                    position: 'absolute', cursor: 'pointer', objectFit: 'contain', transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0px 0px 10px rgba(255,255,255,0.8))' : 'none',
                    zIndex: isHovered ? 10 : 1, ...gamePositions[game.id]
                  }} alt="لعبة"
                />
              );
            })}
          </div>
        ))}
      </main>
    </div>
  );
};

export default TashkeelLetters;