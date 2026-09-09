// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  ArrowRight,
} from "lucide-react";

export default function Marqqa() {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      title: "لعبة الأكل السريع",
      desc: "أطعم البطل الحروف المرققة فقط",
      color: "#cfe8ff",
      numberColor: "#4da6ff",
    },
    {
      id: 2,
      title: "لعبة صيد الحروف",
      desc: "إصطد الحروف المرققة فقط",
      color: "#d9f7d9",
      numberColor: "#4cd964",
    },
    {
      id: 3,
      title: "لعبة سلة التفاح",
      desc: "اجمع الحروف المرققة فقط",
      color: "#fff2cc",
      numberColor: "#ffb84d",
    },
    {
      id: 4,
      title: "لعبة المدفع",
      desc: " إضرب الحروف المرققة فقط",
      color: "#eee0ff",
      numberColor: "#b366ff",
    },
    {
      id: 5,
      title: "لعبة  النحلة",
      desc: "اضغط على الزهرة ذات الحروف المرققة",
      color: "#ffd6e0",
      numberColor: "#ff4d88",
    },
  ];

  const playSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(900, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + 0.1
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const styles = {
    page: {
      width: "100%",
      minHeight: "100vh",
      fontFamily: "Cairo, sans-serif",
      direction: "rtl",
      padding: "15px 20px",
      boxSizing: "border-box",
      position: "relative",
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
    },

    container: {
      maxWidth: "1050px",
      margin: "0 auto",
      width: "100%",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    },

    header: {
      textAlign: "center",
      background: "#fff4d6",
      padding: "24px 30px",
      margin: "30px auto 0 auto",
      borderRadius: "25px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      width: "80%",
      maxWidth: "480px",
      zIndex: 20,
    },

    title: {
      margin: "0 0 12px 0",
      fontSize: "clamp(22px, 5vw, 28px)",
      fontWeight: "bold",
    },

    highlight: {
      color: "#ff6b6b",
    },

    subtitle: {
      marginTop: "0px",
      color: "#444444",
      fontSize: "clamp(15px, 3vw, 18px)",
    },

    cardsContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "60px",
      marginBottom: "35px",
    },

    cards: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      columnGap: "50px",
      rowGap: "60px",
      justifyItems: "center",
      width: "100%",
    },

    card: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "250px",
      gap: "15px",
      minHeight: "115px",
      padding: "15px 20px",
      borderRadius: "100px",
      boxShadow: "0 5px 12px rgba(0,0,0,0.12)",
      transition: "0.25s",
      cursor: "pointer",
      overflow: "visible",
    },

    cloud1: {
      position: "absolute",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      top: "-12px",
      right: "30px",
      zIndex: 0,
    },

    cloud2: {
      position: "absolute",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      top: "-25px",
      right: "70px",
      zIndex: 0,
    },

    cloud3: {
      position: "absolute",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      top: "-10px",
      left: "30px",
      zIndex: 0,
    },

    leftSide: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
      zIndex: 2,
    },

    number: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      fontWeight: "bold",
      flexShrink: 0,
      zIndex: 2,
    },

    text: {
      flex: 1,
      zIndex: 2,
    },

    titleText: {
      margin: 0,
      fontSize: "17px",
      fontWeight: "bold",
      zIndex: 2,
    },

    desc: {
      margin: "3px 0 0",
      fontSize: "14px",
      color: "#2d2c2c",
      zIndex: 2,
    },

    bottomButtons: {
      display: "flex",
      gap: "15px",
      zIndex: 100,
      paddingBottom: "20px",
    },

    circleBtn: {
      width: "55px",
      height: "55px",
      borderRadius: "50%",
      border: "none",
      background: "#7f57e7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    },
  };

  return (
    <>
      <style>{`
        /* رفع مستوى الشخصيات */
        .robot,
        .girl {
          bottom: 98px !important; 
          z-index: 999999 !important;
        }

        @media (max-width: 950px) {
          .cards-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
            row-gap: 55px !important; 
            column-gap: 30px !important;
          }
        }

        @media (max-width: 600px) {
          .robot,
          .girl {
            bottom: 95px !important; 
          }

          .cards-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
            justify-items: center !important;
            row-gap: 45px !important; 
            column-gap: 16px !important;
          }

          .cards-responsive > div {
            width: 155px !important; 
            padding: 10px 12px !important;
            min-height: 95px !important;
          }

          .mobile-cards-area {
            margin-top: 65px !important;   
            margin-bottom: 40px !important; 
          }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              مغامرات <span style={styles.highlight}>الحروف المرققة</span>
            </h1>
            <p style={styles.subtitle}>
              تعلم الحروف المرققة بطريقة ممتعة ✨
            </p>
          </div>

          <div style={styles.cardsContainer} className="mobile-cards-area">
            <div style={styles.cards} className="cards-responsive">
              {games.map((game) => (
                <div
                  key={game.id}
                  style={{
                    ...styles.card,
                    background: game.color,
                  }}
                  onClick={() => {
                    playSound();
                    if (game.id === 1) navigate("/Marqqaeats");
                    if (game.id === 2) navigate("/Marqqafish");
                    if (game.id === 3) navigate("/Marqqaapple");
            
                    if (game.id === 4) navigate("/Marqqabee");
                  }}
                  onMouseEnter={(e) => {
                    playSound();
                    e.currentTarget.style.transform = "scale(1.03) translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onTouchStart={playSound}
                >
                  <div style={{ ...styles.cloud1, background: game.color }} />
                  <div style={{ ...styles.cloud2, background: game.color }} />
                  <div style={{ ...styles.cloud3, background: game.color }} />

                  <div style={styles.leftSide}>
                    <div style={{ ...styles.number, background: game.numberColor }}>
                      {game.id}
                    </div>
                    <div style={styles.text}>
                      <h3 style={styles.titleText}>{game.title}</h3>
                      <p style={styles.desc}>{game.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
<div style={styles.bottomButtons}>
  <button
    style={styles.circleBtn}
    onClick={() => navigate("/home")}
  >
    <Home color="white" />
  </button>

  <button
    style={styles.circleBtn}
    onClick={() => navigate("/AlHorof")}
  >
    <ArrowRight color="white" />
  </button>
</div>
        </div>
      </div>
    </>
  );
}