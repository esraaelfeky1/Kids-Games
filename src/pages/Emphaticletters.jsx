// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Emphaticletters () {
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      title: "لعبة اصطياد الحرف المفخم",
      desc: "إضغط فقط على الحروف المفخمة",
      color: "#cfe8ff",
      numberColor: "#4da6ff",
      icon: "🎯",
    },
    {
      id: 2,
      title: "لعبة اسمع واختر",
      desc: "إستمع إلى الصوت ثم اختر الحرف الصحيح",
      color: "#d9f7d9",
      numberColor: "#4cd964",
      icon: "🔊",
    },
    {
      id: 3,
      title: "لعبة كمل الكلمة",
      desc: "إختر الحرف المناسب لإكمال الكلمة",
      color: "#fff2cc",
      numberColor: "#ffb84d",
      icon: "🧩",
    },
    {
      id: 4,
      title: "لعبة سباق الحروف",
      desc: "إختر حرفًا مفخمًا لتتقدم في السباق",
      color: "#eee0ff",
      numberColor: "#b366ff",
      icon: "🚗",
    },
    {
      id: 5,
      title: "لعبة لون الحرف",
      desc: "لون الحروف المفخمة في الكلمة",
      color: "#ffd6e0",
      numberColor: "#ff4d88",
      icon: "🖍️",
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
      minHeight: "100vh",
      fontFamily: "Cairo, sans-serif",
      direction: "rtl",
      padding: "clamp(6px, 2vw, 14px)",
      marginTop: "clamp(12px, 2vh, 70px)",
      position: "relative",
    },

    // ✅ تعديل زر الرئيسية
    homeBtn: {
      position: "absolute",
      top: "-10px",
      left: "40px",
      background: "linear-gradient(135deg, #5fd0ff, #2ec4ff)",
      color: "#fff",
      border: "none",
      padding: "10px 22px",
      borderRadius: "30px",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      transition: "0.3s",
    },

    container: {
      maxWidth: "clamp(200px, 70vw, 500px)",
      margin: "auto",
    },

    header: {
      textAlign: "center",
      background: "#fff4d6",
      padding: "clamp(12px, 2vw, 18px)",
      borderRadius: "14px",
      marginBottom: "15px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      marginTop: "60px",
    },

    title: {
      margin: 0,
      fontSize: "clamp(24px, 4vw, 30px)",
      fontWeight: "bold",
    },

    highlight: {
      color: "#ff6b6b",
    },

    subtitle: {
      marginTop: "8px",
      color: "#444444",
      fontSize: "clamp(17px, 2.5vw, 20px)",
    },

    cards: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },

    card: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "clamp(11px, 2vw, 12px)",
      borderRadius: "14px",
      boxShadow: "0 3px 8px rgba(31, 30, 30, 0.08)",
      transition: "0.2s",
      cursor: "pointer",
    },

    leftSide: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flex: 1,
    },

    number: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: "bold",
    },

    text: {
      flex: 1,
    },

    titleText: {
      margin: 0,
      fontSize: "clamp(18px, 2.5vw, 22px)",
      
    },

    desc: {
      margin: "4px 0 0",
      fontSize: "clamp(15px, 2.2vw, 19px)",
      color: "#2d2c2c",
    },

    iconBox: {
      fontSize: "22px",
      background: "#fff",
      padding: "8px",
      borderRadius: "50%",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      minWidth: "38px",
      textAlign: "center",
    },
  };

  return (
    <>
      <style>{`
        .robot,
        .girl {
          bottom: 100px !important;
          z-index: 999999 !important;
        }

        @media (max-width: 768px) {
          .robot,
          .girl {
            bottom: 75px !important;
          }
        }

        /* ✅ تعديل زر الرئيسية في اللاب فقط */
        @media (min-width: 1024px) {
          .home-btn-custom {
            top: -5px !important;
            left: 200px !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        <button
          className="home-btn-custom"
          style={styles.homeBtn}
          onClick={() => navigate("/home")}
          
          // ✅ الصوت مع الماوس
          onMouseEnter={(e) => {
            playSound();
            e.currentTarget.style.transform = "scale(1.07)";
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}

          // ✅ الصوت مع اللمس بالموبايل
          onTouchStart={playSound}
        >
          🏠 الرئيسية
        </button>

        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              مغامرات <span style={styles.highlight}>الحروف المفخمة</span>
            </h1>

            <p style={styles.subtitle}>
              تعلم الحروف المفخمة بطريقة ممتعة ✨
            </p>
          </div>

          <div style={styles.cards}>
            {games.map((game) => (
              <div
                key={game.id}
                style={{ ...styles.card, background: game.color }}
                onClick={() => {
                  playSound();

          
                  if (game.id === 1) navigate("/listen-choose");
                  if (game.id === 2) navigate("/complete-word");
                  if (game.id === 3) navigate("/EmphaticRace");
                  if (game.id === 4) navigate("/Emphaticolorl");
                }}

                // ✅ الصوت مع تمرير الماوس
                onMouseEnter={(e) => {
                  playSound();
                  e.currentTarget.style.transform = "scale(1.02)";
                }}

                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}

                // ✅ الصوت مع اللمس
                onTouchStart={playSound}
              >
                <div style={styles.leftSide}>
                  <div
                    style={{
                      ...styles.number,
                      background: game.numberColor,
                    }}
                  >
                    {game.id}
                  </div>

                  <div style={styles.text}>
                    <h3 style={styles.titleText}>{game.title}</h3>
                    <p style={styles.desc}>{game.desc}</p>
                  </div>
                </div>

                <div style={styles.iconBox}>{game.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}