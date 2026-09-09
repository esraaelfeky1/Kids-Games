// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";

export default function Cuts() {
  const navigate = useNavigate();

  const games = [
    { id: 1, title: "لعبة خلية النحل", desc: "ساعد النحلة في جمع الأزهار", color: "#cfe8ff", numberColor: "#4da6ff", path: "/Cutsbee" },
    { id: 2, title: "لعبة صيد الحروف", desc: "إصطد حروف القطع فقط", color: "#d9f7d9", numberColor: "#4cd964", path: "/Cutsfish" },
    { id: 3, title: "لعبة ذوّب الجليد", desc: "اضغط على حروف القطع", color: "#fff2cc", numberColor: "#ffb84d", path: "/Cutsfrog" },
    { id: 4, title: "لعبة الكواكب", desc: " إجمع الكواكب التي تحمل  حروف القطع", color: "#eee0ff", numberColor: "#b366ff", path: "/Cutsspace" },
  
  ];

  const playSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(900, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const styles = {
    page: { width: "100%", minHeight: "100vh", fontFamily: "Cairo, sans-serif", direction: "rtl", padding: "15px 20px", boxSizing: "border-box", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", position: "relative" },
    container: { maxWidth: "800px", margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" },
    header: { textAlign: "center", background: "#fff4d6", padding: "20px 30px", margin: "20px auto", borderRadius: "20px", width: "70%", maxWidth: "400px" },
    title: { margin: "0 0 10px 0", fontSize: "24px", fontWeight: "bold" },
    highlight: { color: "#ff6b6b" },
    subtitle: { margin: 0, color: "#444444", fontSize: "16px" },
    cardsContainer: { width: "100%", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginTop: "30px" },
    card: { display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "15px", boxShadow: "0 3px 8px rgba(0,0,0,0.1)", transition: "0.3s", cursor: "pointer" },
    number: { width: "30px", height: "30px", borderRadius: "8px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", flexShrink: 0 },
    titleText: { margin: 0, fontSize: "15px", fontWeight: "bold" },
    desc: { margin: "2px 0 0", fontSize: "12px", color: "#555" },
    // رفع الأزرار للأعلى قليلاً
    bottomButtons: { display: "flex", gap: "15px", position: "absolute", bottom: "50px", zIndex: 10 },
    circleBtn: { width: "50px", height: "50px", borderRadius: "50%", border: "none", background: "#7f57e7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" },
  };

  return (
    <>
      <style>{`
        /* رفع الشخصيات المذكورة */
        .robot, .girl {
          bottom: 120px !important; /* رفعتها من 95px إلى 120px */
          z-index: 9999 !important;
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>مغامرات <span style={styles.highlight}>الحروف القطع</span></h1>
            <p style={styles.subtitle}>تعلم الحروف القطع بطريقة ممتعة ✨</p>
          </div>

          <div style={styles.cardsContainer}>
            {games.map((game) => (
              <div
                key={game.id}
                style={{ ...styles.card, background: game.color }}
                onClick={() => { playSound(); navigate(game.path); }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <div style={{ ...styles.number, background: game.numberColor }}>{game.id}</div>
                <div>
                  <h3 style={styles.titleText}>{game.title}</h3>
                  <p style={styles.desc}>{game.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.bottomButtons}>
            <button style={styles.circleBtn} onClick={() => navigate("/home")}><Home color="white" /></button>
            <button style={styles.circleBtn} onClick={() => navigate("/AlHorof")}><ArrowRight color="white" /></button>
          </div>
        </div>
      </div>
    </>
  );
}