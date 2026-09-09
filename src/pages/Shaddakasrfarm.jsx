// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw, Home, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

// === 1. استيراد عناصر الصور ===
import farmBgImg from "../assets/farmbg1.jpeg";       
import headerWoodImg from "../assets/headerwood.png"; 
import mainBoardImg from "../assets/mainboard.png";   
import farmerBoyImg from "../assets/farmerboy1.png";   
import cowImg from "../assets/cow.png";               

// ==========================================
// 🎛️ لوحة التحكم الخاصة بكِ (تحكمي في الأماكن والأحجام براحتك من هنا!)
// ==========================================
const CUSTOM_CONTROL = {
  // 1. الكلمة الرئيسية
  mainWord: {
    marginTop: "25px",      
    marginLeft: "0px",     
    fontSize: "3.5rem",    
  },

  // 2. حاوية الحروف الثلاثة بالكامل
  optionsGroup: {
    marginTop: "-5px",    
    marginLeft: "0px",    
  },

  // 3. التحكم بالحروف فردياً
  letter1: { transform: "translate(-15px, 0px)" }, 
  letter2: { transform: "translate(0px, 0px)" }, 
  letter3: { transform: "translate(18px, 0px)" }, 
};

// === بنك الأسئلة ===
const questionsBank = [
  { word: "يُحِبُّ", correct: "بُّ", wrong1: "بَّ", wrong2: "بِّ" },
  { word: "يُقَصُّ", correct: "صُّ", wrong1: "صَّ", wrong2: "صِّ" },
  { word: "يَرُدُّ", correct: "دُّ", wrong1: "دَّ", wrong2: "دِّ" },
  { word: "يَشُدُّ", correct: "دُّ", wrong1: "دَّ", wrong2: "دِّ" },
  { word: "يُعِزُّ", correct: "زُّ", wrong1: "زَّ", wrong2: "زِّ" },
  { word: "يُمَرُّ", correct: "رُّ", wrong1: "رَّ", wrong2: "رِّ" },
  { word: "يُشِمُّ", correct: "مُّ", wrong1: "مَّ", wrong2: "مِّ" },
  { word: "يَظُنُّ", correct: "نُّ", wrong1: "نَّ", wrong2: "نِّ" }
];

export default function HappyFarmGameAssets() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const audioCtxRef = useRef(null);

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtxRef.current = new AudioContext();
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
    // eslint-disable-next-line react-hooks/immutability
    startNewGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewGame = () => {
    const shuffled = [...questionsBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedOption(null);
    setIsCorrect(null);
    if (shuffled[0]) setupQuestion(shuffled[0]);
  };

  const setupQuestion = (qData) => {
    if (!qData) return;
    const opts = [
      { text: qData.correct, isCorrect: true },
      { text: qData.wrong1, isCorrect: false },
      { text: qData.wrong2, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    setOptions(opts);
    setSelectedOption(null);
    setIsCorrect(null);

    setTimeout(() => {
      speakWord(qData.word);
    }, 400);
  };

  const triggerConfetti = () => {
    try {
      if (typeof window !== "undefined" && window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (e) {}
  };

  const playSound = (type) => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      if (type === "success") {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.2, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.2);
        });
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(140, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("Sound error:", e);
    }
  };

  const speakWord = (text) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (e) {}
  };

  const handleOptionClick = (opt) => {
    if (selectedOption !== null) return;

    setSelectedOption(opt.text);

    if (opt.isCorrect) {
      setIsCorrect(true);
      playSound("success");
      setScore((prev) => prev + 10);
      triggerConfetti();

      setTimeout(() => {
        if (currentIdx + 1 < questions.length) {
          const nextIndex = currentIdx + 1;
          setCurrentIdx(nextIndex);
          setupQuestion(questions[nextIndex]);
        } else {
          setIsGameOver(true);
          triggerConfetti();
        }
      }, 1200);
    } else {
      setIsCorrect(false);
      playSound("error");

      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const currentQ = questions[currentIdx] || questionsBank[0];

  const letterCustomStyles = [CUSTOM_CONTROL.letter1, CUSTOM_CONTROL.letter2, CUSTOM_CONTROL.letter3];

  return (
    <div style={styles.container}>
      <style>{responsiveCSS}</style>

      {/* 🖼️ 1. صُورة خَلْفِيّة اللُّعْبَة */}
      <img src={farmBgImg} alt="خلفية المزرعة" style={styles.bgImg} />

      {/* 🖼️ 2. صُورة خَشَبَة العُنْوَانِ والتعليمات تحتها (تم تصغيرها) */}
      <div style={styles.headerAreaWrapper}>
        <div style={styles.headerWoodWrapper} className="header-wood-responsive">
          <img src={headerWoodImg} alt="خشبة العنوان" style={styles.fullImg} />
          <h2 style={styles.headerWoodText} className="header-wood-text-responsive">
            لُعْبَةُ المَزْرَعَةِ السَّعِيدَةِ
          </h2>
        </div>
        
        {/* ✨ النص المطلوب تحته مباشرة */}
        <p style={styles.instructionText} className="instruction-responsive">
          اخْتَرِ الحَرْفَ الصَّحِيحَ الَّذِي عَلَيْهِ الشَّدَّةُ مَعَ الضَّمَّةِ
        </p>
      </div>

      {/* أرقام النتيجة والسؤال */}
      <div style={styles.topRightBox} className="score-box-responsive">⭐ {score}</div>
      <div style={styles.topLeftBox} className="score-box-responsive">🎯 {currentIdx + 1} / {questions.length || 8}</div>

      {/* 🖼️ 3. صُورة الوَلَدِ */}
      <div style={styles.boyWrapper} className="boy-responsive">
        <img src={farmerBoyImg} alt="المزارع الصغير" style={styles.fullImg} />
      </div>

      {/* 🖼️ 4. صُورة البَقَرَةِ */}
      <div style={styles.cowWrapper} className="cow-responsive">
        <img src={cowImg} alt="البقرة السعيدة" style={styles.fullImg} />
      </div>

      {/* 🖼️ 5. اللوحة الرئيسية (المربع الكبير المصغر والمتجاوب) */}
      <div style={styles.mainBoardWrapper} className="main-board-responsive">
        <img src={mainBoardImg} alt="المربع الكبير" style={styles.mainBoardBgImg} />

        <div style={styles.boardContent}>
          {/* الكلمة الرئيسية */}
          <div style={styles.wordDisplayArea}>
            <span
              style={{
                ...styles.wordText,
                marginTop: CUSTOM_CONTROL.mainWord.marginTop,
                marginLeft: CUSTOM_CONTROL.mainWord.marginLeft,
                fontSize: CUSTOM_CONTROL.mainWord.fontSize,
              }}
              className="word-text-responsive"
            >
              {currentQ.word}
            </span>
          </div>

          {/* الحروف الثلاثة */}
          <div
            style={{
              ...styles.optionsContainer,
              marginTop: CUSTOM_CONTROL.optionsGroup.marginTop,
              marginLeft: CUSTOM_CONTROL.optionsGroup.marginLeft,
            }}
          >
            {options.map((opt, idx) => {
              let buttonStyle = {
                ...styles.rawOptionBtn,
                ...(letterCustomStyles[idx] || {}),
              };

              if (selectedOption === opt.text) {
                if (isCorrect) {
                  buttonStyle.color = "#1b5e20";
                  buttonStyle.textShadow = "0 0 12px #4caf50, 0 0 25px #81c784";
                  buttonStyle.filter = "drop-shadow(0px 0px 10px #4caf50)";
                } else {
                  buttonStyle.color = "#b71c1c";
                  buttonStyle.textShadow = "0 0 12px #f44336, 0 0 25px #e57373";
                  buttonStyle.filter = "drop-shadow(0px 0px 10px #f44336)";
                }
              }

              return (
                <button
                  key={idx}
                  style={buttonStyle}
                  className="option-btn-responsive"
                  onClick={() => handleOptionClick(opt)}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🔘 أزرار التحكم السفلية */}
      <div style={styles.controlsBarCenter} className="controls-responsive">
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn} className="control-icon-responsive" title="الصوت">
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={22} />}
        </button>
        <button onClick={startNewGame} style={styles.iconBtn} className="control-icon-responsive" title="إعادة اللعب">
          <RotateCcw size={22} />
        </button>
        <button onClick={() => navigate("/home")} style={styles.iconBtn} className="control-icon-responsive" title="الصفحة الرئيسية">
          <Home size={22} />
        </button>
        <button onClick={() => navigate(-1)} style={styles.iconBtn} className="control-icon-responsive" title="رجوع للخلف">
          <ArrowRight size={22} />
        </button>
      </div>

      {/* 🏆 شاشة الفوز */}
      {isGameOver && (
        <div style={styles.overlay}>
          <div style={styles.winBox}>
            <Trophy size={48} color="#FFD700" style={{ marginBottom: 8 }} />
            <h2 style={{ color: "#2e7d32", marginBottom: 6, fontSize: "1.5rem", marginTop: 0 }}>
              أحسنت يا بطل 🏆
            </h2>
            <div style={styles.finalStats}>
              <p style={{ fontSize: "1rem", margin: "4px 0" }}>النتيجة النهائية: <strong>{score}</strong></p>
            </div>
            <div style={styles.winActionButtons}>
              <button onClick={startNewGame} style={styles.iconBtn} className="control-icon-responsive" title="إعادة المحاولة">
                <RotateCcw size={22} />
              </button>
              <button onClick={() => navigate(-1)} style={styles.iconBtn} className="control-icon-responsive" title="رجوع للخلف">
                <ArrowRight size={22} />
              </button>
              <button onClick={() => navigate("/home")} style={styles.iconBtn} className="control-icon-responsive" title="الصفحة الرئيسية">
                <Home size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Smart Responsive CSS (متجاوب بذكاء مع كل شاشات الموبايل والتابلت) ===
const responsiveCSS = `
  /* الشاشات الكبيرة والتابلت (Tablets & iPads) */
  @media (max-width: 1024px) {
    .header-wood-responsive { width: 260px !important; }
    .header-wood-text-responsive { font-size: 1.35rem !important; }
    .instruction-responsive { font-size: 1.1rem !important; padding: 3px 12px !important; }
    
    .main-board-responsive { width: 45vw !important; max-width: 380px !important; bottom: 22% !important; }
    .boy-responsive { width: 18vw !important; max-width: 180px !important; }
    .cow-responsive { width: 18vw !important; max-width: 180px !important; }
    
    .word-text-responsive { font-size: 3rem !important; }
    .option-btn-responsive { font-size: 2.7rem !important; }
  }

  /* هواتف المحمول الذكية (Smartphones - iPhone & Android) */
  @media (max-width: 640px) {
    /* تصغير خشبة العنوان في الموبايل */
    .header-wood-responsive { width: 210px !important; }
    .header-wood-text-responsive { font-size: 1.15rem !important; }
    
    /* تصغير سطر التعليمات */
    .instruction-responsive { 
      font-size: 0.85rem !important; 
      margin-top: 3px !important; 
      padding: 2px 10px !important;
    }
    
    /* تصغير ورفع المربع الكبير للمنتصف بدقة شديدة بدون سكرول */
    .main-board-responsive { 
      width: 70vw !important; 
      max-width: 300px !important;
      bottom: 40% !important; 
    }
    
    /* تصغير شخصية الولد والبقرة بالموبايل */
    .boy-responsive { width: 22vw !important; left: 2% !important; bottom: 8% !important; max-width: 130px !important; }
    .cow-responsive { width: 22vw !important; right: 2% !important; bottom: 8% !important; max-width: 130px !important; }
    
    /* تصغير خط الكلمة الرئيسية داخل المربع */
    .word-text-responsive { font-size: 2.2rem !important; }
    
    /* تصغير أزرار الحروف الثلاثة */
    .option-btn-responsive { font-size: 1.9rem !important; }
    
    /* تصغير أزرار التحكم السفلية وتناسبها */
    .controls-responsive { bottom: 35px !important; gap: 10px !important; }
    .control-icon-responsive { padding: 7px !important; border-width: 2px !important; }
    
    /* صناديق النقاط والسؤال بالموبايل */
    .score-box-responsive { font-size: 0.9rem !important; padding: 4px 10px !important; border-radius: 8px !important; }
  }

  /* الشاشات الصغيرة جداً (Ultra Small Phones) */
  @media (max-width: 380px) {
    .header-wood-responsive { width: 185px !important; }
    .header-wood-text-responsive { font-size: 1rem !important; }
    .instruction-responsive { font-size: 0.75rem !important; }
    .main-board-responsive { width: 75vw !important; bottom: 27% !important; }
    .word-text-responsive { font-size: 1.9rem !important; }
    .option-btn-responsive { font-size: 1.8rem !important; }
  
  }
`;

// === التنسيقات العامة ===
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    backgroundColor: "#7cb342",
  },
  bgImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  fullImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  headerAreaWrapper: {
    position: "absolute",
    top: "6px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  headerWoodWrapper: {
    position: "relative",
    width: "290px",
    maxWidth: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerWoodText: {
    position: "absolute",
    margin: 0,
    color: "#ffffff",
    fontSize: "1.45rem",
    fontWeight: "900",
    textShadow: "2px 2px 4px #2b1704, -1px -1px 2px #2b1704",
    whiteSpace: "nowrap",
  },
  instructionText: {
    margin: "4px 0 0 0",
    color: "#2b1704",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "3px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "1rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    border: "1.5px solid #8b5a2b",
    textAlign: "center",
  },
  boyWrapper: {
    position: "absolute",
    left: "3%",
    bottom: "6%",
    width: "16vw",
    maxWidth: "190px",
    zIndex: 3,
    pointerEvents: "none",
  },
  cowWrapper: {
    position: "absolute",
    right: "6%",
    bottom: "6%",
    width: "16vw",
    maxWidth: "190px",
    zIndex: 3,
    pointerEvents: "none",
  },
  mainBoardWrapper: {
    position: "absolute",
    bottom: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "36vw",
    maxWidth: "420px",
    aspectRatio: "1.25 / 1",
    zIndex: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainBoardBgImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "fill",
    zIndex: 0,
  },
  boardContent: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    padding: "4% 6%",
  },
  wordDisplayArea: {
    height: "52%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    textAlign: "center",
  },
  wordText: {
    fontWeight: "bold",
    color: "#2b2d42",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
    lineHeight: 1,
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "36%",
    width: "100%",
    marginBottom: "6%",
    boxSizing: "border-box",
  },
  rawOptionBtn: {
    flex: "1 1 0px",
    width: "0",
    background: "none",
    border: "none",
    outline: "none",
    fontSize: "3.2rem",
    fontWeight: "bold",
    color: "#2b2d42",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    transition: "color 0.2s ease, text-shadow 0.2s ease",
    fontFamily: "'Traditional Arabic', 'Cairo', sans-serif",
    height: "100%",
    padding: 0,
    margin: 0,
  },
  topLeftBox: {
    position: "absolute",
    top: "12px",
    left: "15px",
    zIndex: 5,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#4a2c11",
    border: "2px solid #8b5a2b",
    boxShadow: "0 3px 5px rgba(0,0,0,0.15)",
  },
  topRightBox: {
    position: "absolute",
    top: "12px",
    right: "15px",
    zIndex: 5,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#4a2c11",
    border: "2px solid #8b5a2b",
    boxShadow: "0 3px 5px rgba(0,0,0,0.15)",
  },
  controlsBarCenter: {
    position: "absolute",
    bottom: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "14px",
    zIndex: 10,
  },
  iconBtn: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "2.5px solid #8b5a2b",
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#4a2c11",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s ease",
    
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  winBox: {
    background: "#fffde7",
    border: "4px solid #8b5a2b",
    padding: "20px 24px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    maxWidth: "200px",
    width: "80%",
  },
  finalStats: {
    background: "#e8f5e9",
    padding: "8px 12px",
    borderRadius: "10px",
    marginBottom: "14px",
    color: "#1b5e20",
  },
  winActionButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
  },
};