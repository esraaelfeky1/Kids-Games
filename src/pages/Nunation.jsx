// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { IoHome, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import mainBg from '../assets/Nunationbg.jpeg';
import boardFatha from '../assets/Nunation1.png';
import boardDamma from '../assets/nn.png';
import boardKasra from '../assets/ff.png';
import imgBubbles from '../assets/pizza1.png';
import imgLion from '../assets/oo.png';
import imgComplete from '../assets/11.png';
import imgBeeHive from '../assets/rr.png';
import imgIce from '../assets/es12.png';
import imgSpace from '../assets/balls.png';
import imgBasket from '../assets/rul.png';
import imgEgg from '../assets/lir.png';
import imgBee from '../assets/33.png';
import imgButterflies from '../assets/12li.png';
import imgIce2 from '../assets/tt.png';
import imgComplete2 from '../assets/t3.png';

const Mad = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  // تحديث نوع الجهاز تلقائياً عند تغيير حجم الشاشة أو الـ Refresh
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setDeviceType('mobile');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize(); // التحديد عند التحميل لأول مرة
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const playSound = () => {
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.play().catch(() => {});
    }
  };

  // 🎮 المقاسات الدقيقة والمضبوطة لكل جهاز
  const getGamePositions = (type) => {
    const positions = {
      desktop: {
        imgBubbles: { top: '125px', left: '19px', width: '195px', height: '121px' },
        imgLion: { top: '129px', left: '146px', width: '179px', height: '110px' },
        imgComplete: { top: '240px', left: '45px', width: '140px', height: '100px' },
        imgBeeHive: { top: '238px', left: '141px', width: '190px', height: '109px' },
        imgIce: { top: '130px', left: '42px', width: '150px', height: '105px' },
        imgSpace: { top: '127px', left: '141px', width: '199px', height: '106px' },
        imgBasket: { top: '232px', left: '55px', width: '120px', height: '110px' },
        imgEgg: { top: '232px', left: '183px', width: '120px', height: '109px' },
        imgBee: { top: '141px', left: '15px', width: '200px', height: '92px' },
        imgIce2: { top: '140px', left: '150px', width: '170px', height: '95px' },
        imgButterflies: { top: '174px', left: '50px', width: '129px', height: '230px' },
        imgComplete2: { top: '242px', left: '100px', width: '280px', height: '95px' },
      },
      tablet: {
        imgBubbles: { top: '115px', left: '16px', width: '170px', height: '105px' },
        imgLion: { top: '120px', left: '131px', width: '155px', height: '95px' },
        imgComplete: { top: '215px', left: '39px', width: '125px', height: '90px' },
        imgBeeHive: { top: '200px', left: '126px', width: '165px', height: '95px' },
        imgIce: { top: '117px', left: '36px', width: '135px', height: '95px' },
        imgSpace: { top: '115px', left: '126px', width: '175px', height: '95px' },
        imgBasket: { top: '207px', left: '49px', width: '108px', height: '98px' },
        imgEgg: { top: '209px', left: '160px', width: '105px', height: '96px' },
        imgBee: { top: '125px', left: '12px', width: '175px', height: '85px' },
        imgIce2: { top: '126px', left: '133px', width: '150px', height: '85px' },
        imgButterflies: { top: '158px', left: '40px', width: '113px', height: '203px' },
        imgComplete2: { top: '218px', left: '90px', width: '240px', height: '85px' },
      },
      mobile: {
        imgBubbles: { top: '99px', left: '14px', width: '150px', height: '95px' },
        imgLion: { top: '103px', left: '115px', width: '140px', height: '85px' },
        imgComplete: { top: '189px', left: '35px', width: '110px', height: '80px' },
        imgBeeHive: { top: '187px', left: '113px', width: '145px', height: '85px' },
        imgIce: { top: '103px', left: '32px', width: '120px', height: '85px' },
        imgSpace: { top: '103px', left: '114px', width: '150px', height: '85px' },
        imgBasket: { top: '182px', left: '46px', width: '95px', height: '89px' },
        imgEgg: { top: '184px', left: '144px', width: '93px', height: '85px' },
        imgBee: { top: '111px', left: '14px', width: '150px', height: '75px' },
        imgIce2: { top: '111px', left: '120px', width: '130px', height: '75px' },
        imgButterflies: { top: '138px', left: '39px', width: '100px', height: '180px' },
        imgComplete2: { top: '192px', left: '82px', width: '210px', height: '75px' },
      }
    };
    return positions[type] || positions.desktop;
  };

  const sections = [
    { title: "تنوين بالفتح", board: boardFatha, games: [
      { id: 'imgBubbles', img: imgBubbles, path: '/Nunationpiza' }, { id: 'imgLion', img: imgLion, path: '/Nunationice' },
      { id: 'imgComplete', img: imgComplete, path: '/Nunationlicen' }, { id: 'imgBeeHive', img: imgBeeHive, path: '/Nunationsalth' }
    ]},
    { title: "تنوين بالضم", board: boardDamma, games: [
      { id: 'imgIce', img: imgIce, path: '/Nunationdampuzzle' }, { id: 'imgSpace', img: imgSpace, path: '/Nunationdamballe' },
      { id: 'imgBasket', img: imgBasket, path: '/Nunationdamrul' }, { id: 'imgEgg', img: imgEgg, path: '/Nunationdamlice' }
    ]},
    { title: "تنوين بالكسر", board: boardKasra, games: [
      { id: 'imgBee', img: imgBee, path: '/Nunakasrsp' }, { id: 'imgIce2', img: imgIce2, path: '/Nunationkasrtree' },
      { id: 'imgButterflies', img: imgButterflies, path: '/Nunationkaslicon' }, { id: 'imgComplete2', img: imgComplete2, path: '/Nunationkslo' }
    ]}
  ];

  const currentPositions = getGamePositions(deviceType);

  return (
    <div style={{ 
      backgroundImage: `url(${mainBg})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: '40px',
      position: 'relative'
    }}>
      
      <style>{`
        /* إخفاء شريط السكرول نهائياً مع السماح بالتمرير بسلاسة */
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

        .board-item {
          width: 350px;
          height: 380px;
        }
        .board-item h2 {
          margin-top: 85px;
          font-size: 30px;
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .board-item {
            width: 310px;
            height: 340px;
          }
          .board-item h2 {
            margin-top: 75px;
            font-size: 26px;
          }
        }

        @media (max-width: 768px) {
          .main-wrapper { 
            flex-direction: column !important; 
            align-items: center !important;
            gap: 25px !important;
            margin-top: 20px !important;
          }
          .board-item { 
            width: 275px !important; 
            height: 300px !important;
            margin: 0 auto !important; 
          }
          .board-item h2 {
            margin-top: 65px !important;
            font-size: 23px !important;
          }
          .title-area { margin-top: 15px !important; padding: 0 15px; }
          .title-area h1 { font-size: 22px !important; }
          .title-area p { font-size: 16px !important; }
          .nav-btns { 
            top: 15px !important; 
            left: 15px !important; 
            gap: 10px !important; 
          }
          .nav-btn { width: 45px !important; height: 45px !important; font-size: 22px !important; }
        }
      `}</style>

      {/* أزرار التنقل والكتم (أصبحت متحركة مع الصفحة وتختفي مع العنوان عند التمرير) */}
      <div className="nav-btns" style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '15px', zIndex: 1000 }}>
        <button className="nav-btn" onClick={() => window.location.href = '/home'} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}><IoHome /></button>
        <button className="nav-btn" onClick={() => setIsMuted(!isMuted)} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', fontSize: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', color: '#4a2c2a' }}>
          {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
        </button>
      </div>

      {/* العنوان */}
      <div className="title-area" style={{ marginTop: '25px', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '5px 30px', borderRadius: '30px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#111111' }}>مرحبا بك في عالم التنوين</h1>
        </div>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '5px 20px', borderRadius: '40px' }}>
            <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: 'bold' }}>اختر التنوين الذي تريد اللعب به</p>
        </div>
      </div>

      {/* الألواح والألعاب */}
      <main className="main-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '30px', flexWrap: 'wrap', width: '100%', maxWidth: '1200px', padding: '0 15px' }}>
        {sections.map((sec, idx) => (
          <div key={idx} className="board-item" style={{
            backgroundImage: `url(${sec.board})`, 
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            <h2 style={{ color: '#e0961e', textShadow: '1px 1px 2px #000', textAlign: 'center' }}>{sec.title}</h2>
            
            {sec.games.map((game, i) => {
              const isHovered = hoveredGame === game.id;
              return (
                <img key={i} src={game.img} 
                  onClick={() => { playSound(); window.location.href = game.path; }}
                  onMouseEnter={() => { setHoveredGame(game.id); playSound(); }}
                  onMouseLeave={() => setHoveredGame(null)}
                  style={{ 
                    position: 'absolute', 
                    cursor: 'pointer', 
                    objectFit: 'contain', 
                    transition: 'all 0.3s ease',
                    pointerEvents: 'auto',
                    transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0px 0px 10px rgba(255,255,255,0.8))' : 'none',
                    zIndex: isHovered ? 999 : 1, 
                    ...(currentPositions[game.id] || {})
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