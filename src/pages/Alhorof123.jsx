// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import mainBg from '../assets/elhrofbg.jpeg';
import boardFatha from '../assets/lohdama.png';
import boardDamma from '../assets/lohfatha.png';
import boardKasra from '../assets/lohksraa.png';

import imgBubbles from '../assets/bbbb.png';
import imgLion from '../assets/lion.png';
import imgComplete from '../assets/cooopp.png';
import imgBeeHive from '../assets/sbee.png';
import imgIce from '../assets/icce.png';
import imgSpace from '../assets/spcee.png';
import imgBasket from '../assets/eeee.png';
import imgEgg from '../assets/eggee.png';
import imgBee from '../assets/qwebee.png';
import imgButterflies from '../assets/btar.png';

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
    imgBubbles: { top: '95px', left: '108px', width: '134px', height: '95px' },
    imgLion: { top: '94px', left: '210px', width: '125px', height: '99px' },
    imgComplete: { top: '187px', left: '90px', width: '160px', height: '99px' },
    imgBeeHive: { top: '188px', left: '218px', width: '110px', height: '99px' },
    imgIce: { top: '96px', left: '111px', width: '130px', height: '93px' },
    imgSpace: { top: '95px', left: '210px', width: '125px', height: '93px' },
    imgBasket: { top: '184px', left: '88px', width: '147px', height: '110px' },
    imgEgg: { top: '183px', left: '222px', width: '135px', height: '110px' },
    imgBee: { top: '99px', left: '115px', width: '128px', height: '87px' },
    imgIce2: { top: '96px', left: '219px', width: '110px', height: '95px' },
    imgButterflies: { top: '136px', left: '113px', width: '120px', height: '199px' },
    imgComplete2: { top: '184px', left: '145px', width: '250px', height: '100px' },
  };

  const sections = [
    { title: "حركة الفتح", board: boardFatha, games: [
      { id: 'imgBubbles', img: imgBubbles, path: '/Fathaice' }, { id: 'imgLion', img: imgLion, path: '/Fathalion' },
      { id: 'imgComplete', img: imgComplete, path: '/Fathacomplete' }, { id: 'imgBeeHive', img: imgBeeHive, path: '/Fathabee' }
    ]},
    { title: "حركة الضم", board: boardDamma, games: [
      { id: 'imgIce', img: imgIce, path: '/Damasnow' }, { id: 'imgSpace', img: imgSpace, path: '/Damaspace' },
      { id: 'imgBasket', img: imgBasket, path: '/Damamaze' }, { id: 'imgEgg', img: imgEgg, path: '/Damaeggs' }
    ]},
    { title: "حركة الكسر", board: boardKasra, games: [
      { id: 'imgBee', img: imgBee, path: '/Kasrabee' }, { id: 'imgIce2', img: imgIce, path: '/Kasrasnow' },
      { id: 'imgButterflies', img: imgButterflies, path: '/Kasratreas' }, { id: 'imgComplete2', img: imgComplete, path: '/Kasracomplete' }
    ]}
  ];

  return (
    <div style={{ backgroundImage: `url(${mainBg})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '30px', position: 'relative' }}>
      
      <style>{`
        /* إخفاء شريط السكرول تماماً مع السماح بالتمرير والحركة بالأصبع أو الماوس */
        html, body {
          margin: 0;
          padding: 0;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          width: 100vw !important;
          -webkit-overflow-scrolling: touch;
        }

        /* إخفاء شريط التمرير لجميع المتصفحات */
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          background: transparent !important;
        }
        
        html {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        /* 💻 اللاب توب والشاشات الكبيرة: الثلاثة جنب بعض بالتصميم الأصلي تماماً */
        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 70px;
          flex-direction: row;
          width: 100%;
        }

        .board-item {
          width: 448px;
          height: 340px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-size: 100% 100%;
          margin-left: -95px;
          margin-right: -70px;
          flex-shrink: 0;
        }

        /* 📱 شاشات التابلت */
        @media (min-width: 769px) and (max-width: 1150px) {
          .main-wrapper {
            display: grid !important;
            grid-template-columns: repeat(2, 448px) !important;
            justify-content: center !important;
            justify-items: center !important;
            gap: 15px 20px !important;
            margin-top: 30px !important;
            width: 100% !important;
            max-width: 950px !important;
            padding: 0 15px;
          }
          .board-item {
            margin: 0 !important;
          }
          .board-item:nth-child(3) {
            grid-column: span 2;
            justify-self: center;
          }
        }

        /* 📱 شاشات الموبايل */
        @media (max-width: 768px) {
          .main-wrapper {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 15px !important;
            margin-top: 15px !important;
            width: 100% !important;
          }
          .board-item {
            margin: 0 !important;
          }
          .title-area {
            margin-top: 15px !important;
            padding: 0 10px;
          }
          .title-area h1 {
            font-size: 24px !important;
          }
          .title-area h3 {
            font-size: 15px !important;
            font-weight: 800 !important;
          }
          .nav-btns {
            top: 10px !important;
            left: 10px !important;
          }
          .nav-btn {
            width: 40px !important;
            height: 40px !important;
            font-size: 22px !important;
          }
        }
      `}</style>

      {/* أزرار التنقل (رجعت مكانها الأصلي فوق على الشمال بس جوه الـ div الرئيسي عشان تتحرك مع الصفحة وتختفي لفوق مع العنوان) */}
      <div className="nav-btns" style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '15px', zIndex: 100 }}>
        <button className="nav-btn" onClick={() => window.location.href = '/home'} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}><IoHome /></button>
        <button className="nav-btn" onClick={() => setIsMuted(!isMuted)} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}>
          {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
        </button>
      </div>

      {/* العنوان والترحيب */}
      <div className="title-area" style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '5px 25px', borderRadius: '30px', marginBottom: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#111111' }}>مرحبا بك في عالم الحركات</h1>
        </div>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '5px 20px', borderRadius: '40px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#333', fontWeight: 'bold' }}>اختر الحركة التي تريد اللعب بها</h3>
        </div>
      </div>

      {/* حاوية اللوحات */}
      <main className="main-wrapper">
        {sections.map((sec, idx) => (
          <div key={idx} className="board-item" style={{ backgroundImage: `url(${sec.board})` }}>
            <h2 style={{ color: '#ffffff', marginTop: '38px', fontSize: '25px', textShadow: '1px 1px 2px #000' }}>{sec.title}</h2>
            
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