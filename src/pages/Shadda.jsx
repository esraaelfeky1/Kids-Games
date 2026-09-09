// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

// خلفية اللاب توب والتابلت
import mainBg from '../assets/Shadda.jpeg';

// خلفية الموبايل
import mobileBg from '../assets/shmb.jpeg'; 

import boardFatha from '../assets/sr.png';
import boardDamma from '../assets/sg.png';
import boardKasra from '../assets/su.png';
import imgBubbles from '../assets/sq.png';
import imgLion from '../assets/rat.png';
import imgComplete from '../assets/222.png';
import imgBeeHive from '../assets/22q.png';
import imgIce from '../assets/e3.png';
import imgSpace from '../assets/do1.png';
import imgBasket from '../assets/flow.png';
import imgEgg from '../assets/lir.png';
import imgBee from '../assets/fr1.png';
import imgButterflies from '../assets/12li.png';
import imgIce2 from '../assets/fff.png';
import imgComplete2 from '../assets/567.png';

const Mad = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setScreenSize('mobile');
      } else if (width <= 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const playSound = () => {
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.play().catch(() => {});
    }
  };

  // 🎮 الإحداثيات الأصلية تماماً بدون أي تغيير
  const getGamePosition = (gameId) => {
    const positions = {
      desktop: {
        imgBubbles: { top: '139px', left: '24px', width: '185px', height: '110px' },
        imgLion: { top: '139px', left: '146px', width: '170px', height: '105px' },
        imgComplete: { top: '250px', left: '45px', width: '140px', height: '96px' },
        imgBeeHive: { top: '248px', left: '132px', width: '200px', height: '98px' },
        imgIce: { top: '140px', left: '34px', width: '150px', height: '103px' },
        imgSpace: { top: '140px', left: '137px', width: '190px', height: '110px' },
        imgBasket: { top: '246px', left: '49px', width: '120px', height: '103px' },
        imgEgg: { top: '245px', left: '173px', width: '120px', height: '109px' },
        imgBee: { top: '141px', left: '-40px', width: '300px', height: '98px' },
        imgIce2: { top: '135px', left: '148px', width: '170px', height: '110px' },
        imgButterflies: { top: '185px', left: '47px', width: '129px', height: '220px' },
        imgComplete2: { top: '243px', left: '90px', width: '280px', height: '111px' },
      },
      tablet: {
        imgBubbles: { top: '120px', left: '18px', width: '160px', height: '95px' },
        imgLion: { top: '120px', left: '125px', width: '145px', height: '90px' },
        imgComplete: { top: '215px', left: '38px', width: '120px', height: '80px' },
        imgBeeHive: { top: '212px', left: '112px', width: '170px', height: '85px' },
        imgIce: { top: '122px', left: '28px', width: '130px', height: '88px' },
        imgSpace: { top: '122px', left: '115px', width: '160px', height: '95px' },
        imgBasket: { top: '212px', left: '40px', width: '100px', height: '88px' },
        imgEgg: { top: '210px', left: '150px', width: '100px', height: '92px' },
        imgBee: { top: '122px', left: '-30px', width: '250px', height: '82px' },
        imgIce2: { top: '118px', left: '125px', width: '145px', height: '95px' },
        imgButterflies: { top: '158px', left: '40px', width: '110px', height: '185px' },
        imgComplete2: { top: '210px', left: '75px', width: '240px', height: '95px' },
      },
      mobile: {
        imgBubbles: { top: '108px', left: '15px', width: '140px', height: '85px' },
        imgLion: { top: '108px', left: '110px', width: '130px', height: '80px' },
        imgComplete: { top: '190px', left: '30px', width: '105px', height: '70px' },
        imgBeeHive: { top: '188px', left: '98px', width: '150px', height: '75px' },
        imgIce: { top: '108px', left: '25px', width: '115px', height: '78px' },
        imgSpace: { top: '108px', left: '102px', width: '140px', height: '82px' },
        imgBasket: { top: '185px', left: '35px', width: '90px', height: '78px' },
        imgEgg: { top: '185px', left: '130px', width: '90px', height: '82px' },
        imgBee: { top: '108px', left: '-25px', width: '220px', height: '72px' },
        imgIce2: { top: '105px', left: '110px', width: '130px', height: '82px' },
        imgButterflies: { top: '140px', left: '35px', width: '95px', height: '160px' },
        imgComplete2: { top: '185px', left: '65px', width: '210px', height: '82px' },
      }
    };
    return positions[screenSize][gameId] || positions.desktop[gameId];
  };

  const sections = [
    { title: "شدة مع فتحة", board: boardFatha, games: [
      { id: 'imgBubbles', img: imgBubbles, path: '/Shaddafattrific' }, { id: 'imgLion', img: imgLion, path: '/Shaddafatrat' },
      { id: 'imgComplete', img: imgComplete, path: '/Shaddafatlicn' }, { id: 'imgBeeHive', img: imgBeeHive, path: '/Shaddafatfire' }
    ]},
    { title: "شدة مع كسرة", board: boardDamma, games: [
      { id: 'imgIce', img: imgIce, path: '/Shaddaksrbridg' }, { id: 'imgSpace', img: imgSpace, path: '/Shaddakasfath' },
      { id: 'imgBasket', img: imgBasket, path: '/Shaddakasflow' }, { id: 'imgEgg', img: imgEgg, path: '/Shaddakasrlicen' }
    ]},
    { title: "شدة مع ضمة", board: boardKasra, games: [
      { id: 'imgBee', img: imgBee, path: '/Shaddakasrfarm' }, { id: 'imgIce2', img: imgIce2, path: '/Shaddadamfrz' },
      { id: 'imgButterflies', img: imgButterflies, path: '/Shaddadammrlicen' }, { id: 'imgComplete2', img: imgComplete2, path: '/Shaddadammdf' }
    ]}
  ];

  return (
    <div 
      className="page-container" 
      style={{ 
        backgroundImage: `url(${mainBg})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      <style>{`
        /* إخفاء شريط السكرول (ScrollBar) تماماً مع السماح بالتمرير والحركة بسلاسة تامة */
        html, body {
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch;
        }
        
        /* إخفاء الشريط في متصفحات كروم وسفاري */
        html::-webkit-scrollbar, 
        body::-webkit-scrollbar, 
        .page-container::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          background: transparent !important;
        }

        /* إخفاء الشريط في فايرفوكس */
        html, body {
          scrollbar-width: none !important;
        }

        @media (max-width: 768px) {
          .page-container {
            background-image: url(${mobileBg}) !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
          }
          .main-wrapper { 
            flex-direction: column !important; 
            align-items: center !important; 
            gap: 20px !important;
            margin-top: 15px !important;
            padding-bottom: 50px !important;
          }
          .board-item { 
            width: 300px !important; 
            height: 325px !important; 
            margin: 10px 0 !important;
            flex-shrink: 0;
          }
          .board-item h2 {
            font-size: 25px !important;
            margin-top: 75px !important;
            text-align: center !important;
            width: 100% !important;
          }
          .title-area { 
            margin-top: 15px !important; 
            padding: 0 15px;
          }
          .title-area h1 { 
            font-size: 20px !important; 
          }
          .title-area p { 
            font-size: 15px !important; 
            font-weight: 600 !important; 
          }
          .nav-btns { 
            top: 12px !important; 
            left: 25px !important; 
            gap: 10px !important;
          }
          .nav-btn { 
            width: 42px !important; 
            height: 42px !important; 
            font-size: 23px !important; 
          }
        }

        @media (max-width: 480px) {
          .board-item { 
            width: 275px !important; 
            height: 300px !important; 
          }
          .board-item h2 {
            font-size: 22px !important;
            margin-top: 52px !important;
          }
        }
      `}</style>

      {/* أزرار الهوم والصوت الأصلية */}
      <div className="nav-btns" style={{ position: 'absolute', top: '20px', left: '35px', display: 'flex', gap: '15px', zIndex: 1000 }}>
        <button className="nav-btn" onClick={() => window.location.href = '/home'} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}><IoHome /></button>
        <button className="nav-btn" onClick={() => setIsMuted(!isMuted)} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}>
          {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
        </button>
      </div>

      <div className="title-area" style={{ marginTop: '25px', textAlign: 'center', zIndex: 10 }}>
        <div style={{ backgroundColor: 'rgba(123, 177, 234, 0.75)', padding: '5px 25px', borderRadius: '30px', marginBottom: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#111111' }}>مرحبا بك في عالم الشدة</h1>
        </div>
        <div style={{ backgroundColor: 'rgba(172, 199, 237, 0.55)', padding: '4px 18px', borderRadius: '40px' }}>
            <p style={{ margin: 0, fontSize: '15px', color: '#333', fontWeight: 'bold' }}>اختر الشدة التي تريد اللعب بها</p>
        </div>
      </div>

      <main className="main-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '25px', marginBottom: '50px', gap: '25px', flexWrap: 'wrap', width: '100%', maxWidth: '1200px', zIndex: 10 }}>
        {sections.map((sec, idx) => (
          <div key={idx} className="board-item" style={{
            backgroundImage: `url(${sec.board})`, backgroundSize: '100% 100%',
            width: '350px', height: '380px', position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            overflow: 'hidden'
          }}>
            <h2 style={{ color: '#f3f8f7', marginTop: '85px', fontSize: '30px', textShadow: '1px 1px 2px #000' }}>{sec.title}</h2>
            
            {sec.games.map((game, i) => {
              const isHovered = hoveredGame === game.id;
              const currentPos = getGamePosition(game.id);
              return (
                <img key={i} src={game.img} 
                  onClick={() => { playSound(); window.location.href = game.path; }}
                  onMouseEnter={() => { setHoveredGame(game.id); playSound(); }}
                  onMouseLeave={() => setHoveredGame(null)}
                  style={{ 
                    position: 'absolute', cursor: 'pointer', objectFit: 'contain', 
                    transition: 'all 0.3s ease',
                    pointerEvents: 'auto',
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0px 0px 10px rgba(255,255,255,0.8))' : 'none',
                    zIndex: isHovered ? 999 : 1, 
                    ...currentPos
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