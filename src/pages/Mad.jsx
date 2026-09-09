// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import mainBg from '../assets/madbbg.jpeg';
import boardFatha from '../assets/essmad.png';
import boardDamma from '../assets/madh.png';
import boardKasra from '../assets/mad456.png';
import imgBubbles from '../assets/567.png';
import imgLion from '../assets/88.png';
import imgComplete from '../assets/icce.png';
import imgBeeHive from '../assets/ffw.png';
import imgIce from '../assets/magic2.png';
import imgSpace from '../assets/ee.png';
import imgBasket from '../assets/bowling.png';
import imgEgg from '../assets/lisen.png';
import imgBee from '../assets/sss.png';
import imgButterflies from '../assets/lll.png';
import imgIce2 from '../assets/ball.png';
import imgComplete2 from '../assets/fff.png';

const Mad = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const playSound = () => {
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.play().catch(() => {});
    }
  };

  const sections = [
    { title: "مد بالألف", board: boardFatha, games: [
      { id: 'imgBubbles', img: imgBubbles, path: '/Madmadfa' }, { id: 'imgLion', img: imgLion, path: '/Madfarm' },
      { id: 'imgComplete', img: imgComplete, path: '/Madsnow' }, { id: 'imgBeeHive', img: imgBeeHive, path: '/Emphaticgame' }
    ]},
    { title: "مد بالياء", board: boardDamma, games: [
      { id: 'imgIce', img: imgIce, path: '/Madyaamagic' }, { id: 'imgSpace', img: imgSpace, path: '/Madyaatreasure' },
      { id: 'imgBasket', img: imgBasket, path: '/Madyaabowling' }, { id: 'imgEgg', img: imgEgg, path: '/Madyaalisen' }
    ]},
    { title: "مد بالواو", board: boardKasra, games: [
      { id: 'imgBee', img: imgBee, path: '/Madwawwheel' }, { id: 'imgIce2', img: imgIce2, path: '/Madwawballon' },
      { id: 'imgButterflies', img: imgButterflies, path: '/Madwawlicen' }, { id: 'imgComplete2', img: imgComplete2, path: '/Madwawdrag' }
    ]}
  ];

  return (
    <div style={{ backgroundImage: `url(${mainBg})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '30px', position: 'relative' }}>
      
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          width: 100vw !important;
          -webkit-overflow-scrolling: touch;
        }

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

        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 50px;
          flex-direction: row;
          gap: 20px;
          width: 100%;
          flex-wrap: nowrap;
        }

        .board-item {
          width: 405px;
          height: 340px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-size: 100% 100%;
          flex-shrink: 0;
          overflow: hidden;
        }

        /* 💻 [1] مقاسات الشاشات الكبيرة (الافتراضية للاب توب) */
        .game-img-imgBubbles { top: 86px; left: 48px; width: 195px; height: 101px; }
        .game-img-imgLion { top: 84px; left: 173px; width: 179px; height: 110px; }
        .game-img-imgComplete { top: 192px; left: 57px; width: 180px; height: 109px; }
        .game-img-imgBeeHive { top: 195px; left: 203px; width: 120px; height: 103px; }
        .game-img-imgIce { top: 84px; left: 69px; width: 150px; height: 105px; }
        .game-img-imgSpace { top: 83px; left: 165px; width: 199px; height: 106px; }
        .game-img-imgBasket { top: 194px; left: 81px; width: 125px; height: 110px; }
        .game-img-imgEgg { top: 192px; left: 207px; width: 115px; height: 109px; }
        .game-img-imgBee { top: 78px; left: 15px; width: 250px; height: 113px; }
        .game-img-imgIce2 { top: 82px; left: 180px; width: 170px; height: 110px; }
        .game-img-imgButterflies { top: 154px; left: 84px; width: 119px; height: 200px; }
        .game-img-imgComplete2 { top: 195px; left: 130px; width: 270px; height: 111px; }

        /* 📱 [2] مقاسات شاشات التابلت */
        @media (min-width: 769px) and (max-width: 1250px) {
          .main-wrapper {
            display: grid !important;
            grid-template-columns: repeat(2, 405px) !important;
            justify-content: center !important;
            justify-items: center !important;
            gap: 20px !important;
            margin-top: 30px !important;
            width: 100% !important;
            max-width: 900px !important;
            padding: 0 15px;
          }
          .board-item:nth-child(3) {
            grid-column: span 2;
            justify-self: center;
          }

          .board-item img.game-img-imgBubbles { top: 86px !important; left: 48px !important; width: 195px !important; height: 101px !important; }
          .board-item img.game-img-imgLion { top: 84px !important; left: 173px !important; width: 179px !important; height: 110px !important; }
          .board-item img.game-img-imgComplete { top: 192px !important; left: 57px !important; width: 180px !important; height: 109px !important; }
          .board-item img.game-img-imgBeeHive { top: 195px !important; left: 173px !important; width: 180px !important; height: 100px !important; }
          .board-item img.game-img-imgIce { top: 84px !important; left: 68px !important; width: 150px !important; height: 105px !important; }
          .board-item img.game-img-imgSpace { top: 83px !important; left: 165px !important; width: 199px !important; height: 106px !important; }
          .board-item img.game-img-imgBasket { top: 194px !important; left: 80px !important; width: 125px !important; height: 110px !important; }
          .board-item img.game-img-imgEgg { top: 192px !important; left: 206px !important; width: 115px !important; height: 109px !important; }
          .board-item img.game-img-imgBee { top: 78px !important; left: 15px !important; width: 250px !important; height: 113px !important; }
          .board-item img.game-img-imgIce2 { top: 82px !important; left: 181px !important; width: 170px !important; height: 110px !important; }
          .board-item img.game-img-imgButterflies { top: 154px !important; left: 83px !important; width: 119px !important; height: 200px !important; }
          .board-item img.game-img-imgComplete2 { top: 195px !important; left: 130px !important; width: 270px !important; height: 111px !important; }
        }

        /* 📱 [3] مقاسات شاشات الموبايل */
        @media (max-width: 768px) {
          .main-wrapper {
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
          .board-item {
            margin: 10px !important;
            width: 380px !important;
            height: 335px !important;
          }
          .title-area {
            margin-top: 10px !important;
          }
          .title-area h1 {
            font-size: 24px !important;
          }
          .title-area p {
            font-size: 15px !important;
            font-weight: 600 !important;
          }
          .nav-btns {
            gap: 10px !important;
          }
          .nav-btn {
            width: 40px !important;
            height: 40px !important;
            font-size: 35px !important;
          }

          .board-item img.game-img-imgBubbles { top: 86px !important; left: 38px !important; width: 195px !important; height: 101px !important; }
          .board-item img.game-img-imgLion { top: 84px !important; left: 159px !important; width: 179px !important; height: 110px !important; }
          .board-item img.game-img-imgComplete { top: 192px !important; left: 49px !important; width: 180px !important; height: 109px !important; }
          .board-item img.game-img-imgBeeHive { top: 195px !important; left: 150px !important; width: 190px !important; height: 100px !important; }
          .board-item img.game-img-imgIce { top: 84px !important; left: 60px !important; width: 150px !important; height: 105px !important; }
          .board-item img.game-img-imgSpace { top: 83px !important; left: 149px !important; width: 199px !important; height: 106px !important; }
          .board-item img.game-img-imgBasket { top: 194px !important; left: 75px !important; width: 125px !important; height: 110px !important; }
          .board-item img.game-img-imgEgg { top: 192px !important; left: 190px !important; width: 115px !important; height: 109px !important; }
          .board-item img.game-img-imgBee { top: 78px !important; left: 10px !important; width: 250px !important; height: 113px !important; }
          .board-item img.game-img-imgIce2 { top: 82px !important; left: 165px !important; width: 170px !important; height: 110px !important; }
          .board-item img.game-img-imgButterflies { top: 154px !important; left: 70px !important; width: 119px !important; height: 200px !important; }
          .board-item img.game-img-imgComplete2 { top: 195px !important; left: 115px !important; width: 270px !important; height: 111px !important; }
        }
      `}</style>

      {/* أزرار التنقل */}
      <div className="nav-btns" style={{ position: 'absolute', top: '17px', left: '20px', display: 'flex', gap: '15px', zIndex: 100 }}>
        <button className="nav-btn" onClick={() => window.location.href = '/home'} style={{ width: '55px', height: '55px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}><IoHome /></button>
        <button className="nav-btn" onClick={() => setIsMuted(!isMuted)} style={{ width: '55px', height: '55px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}>
          {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
        </button>
      </div>

      {/* العنوان والترحيب */}
      <div className="title-area" style={{ marginTop: '17px', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '5px 20px', borderRadius: '30px', marginBottom: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '27px', color: '#111111' }}>مرحبا بك في عالم المدود</h1>
        </div>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '5px 15px', borderRadius: '40px' }}>
            <p style={{ margin: 0, fontSize: '19px', color: '#333', fontWeight: 'bold' }}>اختر المد الذي تريد اللعب به</p>
        </div>
      </div>

      {/* حاوية اللوحات */}
      <main className="main-wrapper">
        {sections.map((sec, idx) => (
          <div key={idx} className="board-item" style={{ backgroundImage: `url(${sec.board})` }}>
            <h2 style={{ color: '#b48484', marginTop: '29px', fontSize: '30px', textShadow: '1px 1px 2px #000' }}>{sec.title}</h2>
            
            {sec.games.map((game, i) => {
              const isHovered = hoveredGame === game.id;
              return (
                <img key={i} src={game.img} 
                  className={`game-img-${game.id}`}
                  onClick={() => { playSound(); window.location.href = game.path; }}
                  onMouseEnter={() => { setHoveredGame(game.id); playSound(); }}
                  onMouseLeave={() => setHoveredGame(null)}
                  style={{ 
                    position: 'absolute', cursor: 'pointer', objectFit: 'contain', 
                    transition: 'all 0.3s ease',
                    pointerEvents: 'auto',
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0px 0px 10px rgba(255,255,255,0.8))' : 'none',
                    zIndex: isHovered ? 999 : 1
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

export default Mad;