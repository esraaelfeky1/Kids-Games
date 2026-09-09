// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/pom.jpeg";

export default function BubblePopGame() {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  // تخزين روابط الأصوات في الذاكرة
  const [correctSoundUrl, setCorrectSoundUrl] = useState(null);
  const [wrongSoundUrl, setWrongSoundUrl] = useState(null);

  // 1. تحميل الأصوات في الذاكرة فوراً (Blob)
  useEffect(() => {
    const loadAudio = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      // eslint-disable-next-line no-unused-vars
      } catch (e) { return null; }
    };
    Promise.all([loadAudio("/sounds/hay1.mp3"), loadAudio("/sounds/pop.mp3")]).then(([s, w]) => {
      setCorrectSoundUrl(s);
      setWrongSoundUrl(w);
    });
  }, []);

  // 2. تفعيل الصوت (فك القفل) عند أول نقرة
  const unlockAudio = useCallback(() => {
    if (isAudioUnlocked) return;
    setIsAudioUnlocked(true);
  }, [isAudioUnlocked]);

  // 3. دالة تشغيل الصوت
  const playSound = useCallback((url) => {
    if (!soundEnabled || !url) return;
    const audio = new Audio(url);
    audio.play().catch(() => {});
  }, [soundEnabled]);

  const letterPool = [
    { char: "أَ", fatha: true }, { char: "بَ", fatha: true }, { char: "تَ", fatha: true },
    { char: "ثَ", fatha: true }, { char: "جَ", fatha: true }, { char: "دَ", fatha: true },
    { char: "بِ", fatha: false }, { char: "تُ", fatha: false }, { char: "جِ", fatha: false }
  ];
  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#1A535C", "#FF9F1C", "#9575CD"];

  // إعدادات البداية ومنع التمرير
  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      document.body.style.overflow = "auto";
    };
  }, [unlockAudio]);

  // التوقيت
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // توليد الفقاعات بمساحة آمنة للشاشات المختلفة
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const randomItem = letterPool[Math.floor(Math.random() * letterPool.length)];
      setBubbles(prev => [...prev, {
        id: Date.now() + Math.random(),
        ...randomItem,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 75 + 10, y: -15, popping: false
      }]);
    }, 1200);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  // حركة الفقاعات
  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setBubbles(prev => prev.map(b => ({ ...b, y: b.y + 0.6 })).filter(b => b.y < 100));
    }, 50);
    return () => clearInterval(move);
  }, [gameOver]);

  const popBubble = (b) => {
    if (b.popping) return;
    if (b.fatha) {
      playSound(correctSoundUrl);
      setBubbles(prev => prev.map(item => item.id === b.id ? { ...item, popping: true } : item));
      setTimeout(() => {
        setScore(s => s + 10);
        setBubbles(prev => prev.filter(item => item.id !== b.id));
      }, 200);
    } else {
      playSound(wrongSoundUrl);
    }
  };

  return (
    <div style={styles.container}>
      <img src={bgImg} alt="BG" style={styles.bg} />
      
      {/* الشريط العلوي (الوقت، العنوان، والنقاط في نفس المستوى) */}
      <div style={styles.topBar}>
        <div style={styles.box}>⏱️ {timeLeft}</div>
        <div style={styles.titleBar}>فرقع الفقاعات التي بها حركة فتح</div>
        <div style={styles.box}>⭐ {score}</div>
      </div>

      {/* الفقاعات المتحركة */}
      {!gameOver && bubbles.map((b) => (
        <div key={b.id} onClick={() => popBubble(b)} style={{
          ...styles.bubble,
          left: `${b.x}%`, top: `${b.y}%`,
          backgroundColor: b.popping ? "#fff" : b.color,
          transform: b.popping ? "scale(1.3)" : "scale(1)",
          opacity: b.popping ? 0 : 1,
        }}>
          {!b.popping && b.char}
        </div>
      ))}

      {/* أزرار التحكم السفلى تظهر أثناء اللعب فقط */}
      {!gameOver && (
        <div style={styles.bottomButtons}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
            {soundEnabled ? <Volume2 size={22} color="white" /> : <VolumeX size={22} color="white" />}
          </button>
          <button onClick={() => window.location.reload()} style={styles.circleBtn}>
            <RotateCcw size={22} color="white" />
          </button>
          <button onClick={() => navigate("/Alhorof123")} style={styles.circleBtn}>
            <ArrowRight size={22} color="white" />
          </button>
          <button onClick={() => navigate("/home")} style={styles.circleBtn}>
            <Home size={22} color="white" />
          </button>
        </div>
      )}

      {/* شاشة النهاية (رسالة الفوز) مع الأزرار غير المكررة ومرفوعة للأعلى */}
      {gameOver && (
        <div style={styles.overlay}>
          <div style={styles.gameOverContent}>
            <h1 style={{ fontSize: "clamp(28px, 6.5vw, 44px)", color: "white", marginBottom: "8px" }}>أحسنت يابطل!</h1>
            <p style={{ fontSize: "clamp(20px, 4.8vw, 28px)", color: "#FFE66D", marginBottom: "20px" }}>نقاطك النهائية: {score}</p>
            
            <div style={styles.gameOverButtons}>
              <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn}>
                {soundEnabled ? <Volume2 size={22} color="white" /> : <VolumeX size={22} color="white" />}
              </button>
              <button onClick={() => window.location.reload()} style={styles.circleBtn}>
                <RotateCcw size={22} color="white" />
              </button>
              <button onClick={() => navigate("/Alhorof123")} style={styles.circleBtn}>
                <ArrowRight size={22} color="white" />
              </button>
              <button onClick={() => navigate("/home")} style={styles.circleBtn}>
                <Home size={22} color="white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    width: "100vw", 
    height: "100vh", 
    position: "relative", 
    overflow: "hidden", 
    touchAction: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  bg: { 
    position: "absolute", 
    width: "100%", 
    height: "100%", 
    objectFit: "cover",
    zIndex: 1
  },
  topBar: {
    position: "absolute",
    top: "1.5vh",
    width: "96%",
    maxWidth: "850px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    gap: "8px"
  },
  titleBar: { 
    padding: "0.7vh 2.2vw", 
    background: "white", 
    borderRadius: "30px", 
    fontSize: "clamp(14px, 3.4vw, 23px)", 
    fontWeight: "bold", 
    border: "3px solid #00aaff", 
    color: "#00aaff", 
    whiteSpace: "nowrap",
    boxShadow: "0 3px 5px rgba(0,0,0,0.15)",
    textAlign: "center"
  },
  box: { 
    background: "rgba(255, 255, 255, 0.95)", 
    padding: "0.6vh 2vw", 
    borderRadius: "12px", 
    fontWeight: "bold", 
    fontSize: "clamp(14px, 3.2vw, 20px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    whiteSpace: "nowrap"
  },
  bubble: { 
    position: "absolute", 
    width: "clamp(58px, 12vw, 80px)", 
    height: "clamp(58px, 12vw, 80px)", 
    borderRadius: "50%", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    fontSize: "clamp(25px, 5.5vw, 35px)", 
    fontWeight: "bold", 
    color: "white", 
    cursor: "pointer", 
    boxShadow: "inset -6px -6px 12px rgba(0,0,0,0.2), 0 0 8px rgba(255,255,255,0.6)", 
    border: "3px solid white", 
    zIndex: 50, 
    transition: "all 0.2s ease-out" 
  },
  bottomButtons: { 
    position: "absolute", 
    bottom: "2vh", 
    left: "50%", 
    transform: "translateX(-50%)", 
    display: "flex", 
    gap: "2.5vw", 
    zIndex: 1000 
  },
  circleBtn: { 
    width: "clamp(38px, 8vw, 48px)", 
    height: "clamp(38px, 8vw, 48px)", 
    borderRadius: "50%", 
    border: "none", 
    background: "#16a34a", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    cursor: "pointer", 
    boxShadow: "0 3px 6px rgba(0,0,0,0.3)" 
  },
  overlay: { 
    position: "absolute", 
    inset: 0, 
    background: "rgba(0,0,0,0.85)", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 999,
    padding: "20px",
    textAlign: "center"
  },
  gameOverContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transform: "translateY(-3vh)"
  },
  gameOverButtons: {
    display: "flex",
    gap: "3vw",
    marginTop: "15px"
  }
};