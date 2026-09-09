// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { AlarmClock, Star, Volume2, VolumeX, Home, Eraser, Check, RotateCcw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// =========================
// استيراد الخلفية لمنع اختفائها عند الرفع
// =========================
import bgImage from "../assets/yyyy.jpeg";

export default function Emphaticolorl() {
  // قائمة الحروف المفخمة المسموح بتلوينها فقط
  const EMPHATIC_LETTERS = ["خ", "ص", "ض", "غ", "ط", "ق", "ظ"];

  const words = [
    { word: "صديق", emphatic: [0] },
    { word: "طعام", emphatic: [0] },
    { word: "ضفدع", emphatic: [0] },
    { word: "قفل", emphatic: [0] },
    { word: "غروب", emphatic: [0] },
    { word: "ظرف", emphatic: [0] },
    { word: "طاووس", emphatic: [0] },
    { word: "قصة", emphatic: [0] },
    { word: "قلم", emphatic: [0] },
    { word: "غزال", emphatic: [0] },
    { word: "ضرس", emphatic: [0] },
    { word: "طين", emphatic: [0] },
    { word: "خروف", emphatic: [0] },
  ];

  const [currentWord, setCurrentWord] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#ff4f93");
  const [paintedLetters, setPaintedLetters] = useState({});
  const [eraserMode, setEraserMode] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const clickAudio = useRef(
    new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3")
  );
  const successAudio = useRef(
    new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3")
  );

  useEffect(() => {
    clickAudio.current.preload = "auto";
    successAudio.current.preload = "auto";
    clickAudio.current.volume = 1;
    successAudio.current.volume = 1;
  }, []);

  useEffect(() => {
    if (gameFinished) return;
    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGameFinished(true);
      setShowWinner(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameFinished]);

  const playSound = (audioRef) => {
    if (!soundEnabled || !audioRef.current) return;
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const colors = [
    "#ff4f93",
    "#ff8800",
    "#ffd000",
    "#78c800",
    "#1da1ff",
    "#8e5cff",
  ];

  const handleLetterClick = (index) => {
    if (gameFinished) return;

    const letter = words[currentWord].word[index];

    // منع تلوين الحرف إذا لم يكن من الحروف المفخمة (خ، ص، ض، غ، ط، ق، ظ)
    if (!EMPHATIC_LETTERS.includes(letter)) {
      return; 
    }

    playSound(clickAudio);
    const key = `${currentWord}-${index}`;
    if (eraserMode) {
      const updated = { ...paintedLetters };
      delete updated[key];
      setPaintedLetters(updated);
      return;
    }
    const updated = {
      ...paintedLetters,
      [key]: selectedColor,
    };
    setPaintedLetters(updated);
    checkAnswer(updated);
  };

  const checkAnswer = (updated) => {
    const current = words[currentWord];
    const allCorrect = current.emphatic.every(
      (index) => updated[`${currentWord}-${index}`]
    );

    if (allCorrect) {
      playSound(successAudio);
      setScore((prev) => prev + 10);
      setMessage("👏 أحسنت");
      setTimeout(() => {
        if (currentWord < words.length - 1) {
          setCurrentWord((prev) => prev + 1);
          setMessage("");
        } else {
          setGameFinished(true);
          setShowWinner(true);
        }
      }, 1500);
    }
  };

  const restartGame = () => {
    playSound(clickAudio);
    setCurrentWord(0);
    setPaintedLetters({});
    setScore(0);
    setTimeLeft(60);
    setGameFinished(false);
    setShowWinner(false);
    setMessage("");
  };

  const goHome = () => {
    playSound(clickAudio);
    window.location.href = "/home";
  };

  const navigate = useNavigate();
  const AlHorof1 = () => {
    navigate("/AlHorof1");
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .game-page-container {
            padding: 2vw !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: center !important;
            min-height: 100vh !important;
            box-sizing: border-box !important;
          }
          
          .game-header {
            flex-wrap: nowrap !important;
            justify-content: space-between !important;
            gap: 1.5vw !important;
            margin-bottom: 6px !important;
            width: 100% !important;
          }
          
          .top-card-custom {
            width: auto !important;
            min-width: 65px !important;
            padding: 0.6vh 2vw !important;
            border-radius: 12px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1.2vw !important;
            white-space: nowrap !important;
          }

          .top-card-custom svg {
            width: clamp(14px, 3.8vw, 19px) !important;
            height: clamp(14px, 3.8vw, 19px) !important;
          }

          .top-number-custom {
            font-size: clamp(12px, 3.5vw, 16px) !important;
            margin: 0 !important;
          }

          .title-box-custom {
            padding: 0.8vh 3.5vw !important;
            border-radius: 20px !important;
            font-size: clamp(15px, 4.8vw, 22px) !important;
            white-space: nowrap !important;
            width: auto !important;
            display: inline-block !important;
          }

          .question-box-custom {
            padding: 0.5vh 3vw !important;
            border-radius: 14px !important;
            font-size: clamp(11px, 3.5vw, 15px) !important;
            margin: 4px auto 0 auto !important;
            white-space: nowrap !important;
          }

          .game-box-custom {
            width: clamp(270px, 86vw, 350px) !important;
            min-height: auto !important;
            padding: 2.5vh 3vw !important;
            margin: 6vh auto 0 auto !important;
            border-width: 4px !important;
            border-radius: 28px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 1vh !important;
          }

          .word-wrapper-custom {
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
          }

          .word-custom {
            font-size: clamp(48px, 15vw, 68px) !important;
            letter-spacing: -1px !important;
            line-height: 1 !important;
          }

          .letter-custom {
            -webkit-text-stroke: 1.8px black !important;
          }

          .palette-custom {
            width: 95% !important;
            max-width: 100% !important;
            min-height: auto !important;
            padding: 0.8vh 2vw !important;
            gap: 1.5vw !important;
            margin-top: 5vh !important;
            border-radius: 30px !important;
            flex-wrap: nowrap !important;
            justify-content: space-evenly !important;
          }

          .palette-btn-color {
            width: clamp(18px, 6vw, 25px) !important;
            height: clamp(18px, 6vw, 25px) !important;
            border-width: 2px !important;
            flex-shrink: 0 !important;
          }

          .palette-btn-check {
            width: clamp(20px, 6.5vw, 27px) !important;
            height: clamp(20px, 6.5vw, 27px) !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
          }

          .palette-btn-check svg {
            width: clamp(11px, 3.8vw, 15px) !important;
            height: clamp(11px, 3.8vw, 15px) !important;
          }

          .palette-btn-eraser {
            width: clamp(22px, 7vw, 29px) !important;
            height: clamp(22px, 7vw, 29px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
          }

          .palette-btn-eraser svg {
            width: clamp(12px, 4vw, 16px) !important;
            height: clamp(12px, 4vw, 16px) !important;
          }

          .bottom-buttons-custom {
            gap: 4vw !important;
            margin-top: auto !important;
            margin-bottom: 2vh !important;
          }

          .circle-btn-custom {
            width: clamp(34px, 10vw, 44px) !important;
            height: clamp(34px, 10vw, 44px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .circle-btn-custom svg {
            width: clamp(16px, 5vw, 22px) !important;
            height: clamp(16px, 5vw, 22px) !important;
          }

          .message-text-custom {
            font-size: clamp(16px, 4.5vw, 24px) !important;
            padding: 0.6vh 3.5vw !important;
          }
        }
      `}</style>

      <div
        style={{
          ...styles.page,
          backgroundImage: `url(${bgImage})`,
        }}
        className="game-page-container"
      >
        {/* نافذة الفوز المصغرة */}
        {showWinner && (
          <div style={styles.winnerPopup}>
            <div style={styles.winnerEmoji}>🏆</div>
            <div style={styles.winnerText}>لقد فزت!</div>
            <div style={styles.winnerScore}>النقاط: {score}</div>
          </div>
        )}

        {/* HEADER */}
        <div style={styles.header} className="game-header">
          {/* الوقت (منبه) */}
          <div style={styles.topCard} className="top-card-custom">
            <AlarmClock size={23} color="#ff9800" />
            <span style={styles.topNumber} className="top-number-custom">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
              {String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>

          {/* العنوان */}
          <div style={styles.titleBox} className="title-box-custom">
            لعبة لون الحرف
          </div>

          {/* النقاط */}
          <div style={styles.topCard} className="top-card-custom">
            <Star size={23} color="#FFD700" fill="#FFD700" />
            <span style={styles.topNumber} className="top-number-custom">
              {score}
            </span>
          </div>
        </div>

        {/* الفقرة تحت العنوان */}
        <div style={styles.questionBox} className="question-box-custom">
          لون الحروف
          <span
            style={{
              color: "#ff4f93",
              marginRight: "6px",
              marginLeft: "6px",
            }}
          >
            المفخمة
          </span>
          في الكلمة
        </div>

        {/* GAME BOX */}
        <div style={styles.gameBox} className="game-box-custom">
          {/* الكلمة */}
          <div style={styles.wordWrapper} className="word-wrapper-custom">
            <div style={styles.word} className="word-custom">
              {words[currentWord].word.split("").map((letter, index) => {
                const color = paintedLetters[`${currentWord}-${index}`];

                return (
                  <span
                    key={index}
                    onClick={() => handleLetterClick(index)}
                    className="letter-custom"
                    style={{
                      ...styles.letter,
                      color: color || "white",
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>

            {/* الرسالة */}
            {message && !gameFinished && (
              <div style={styles.messageText} className="message-text-custom">
                {message}
              </div>
            )}
          </div>

          {/* الألوان */}
          <div style={styles.palette} className="palette-custom">
            {/* صح */}
            <button
              style={styles.checkBtn}
              className="palette-btn-check"
              onClick={() => playSound(clickAudio)}
            >
              <Check color="white" size={23} />
            </button>

            {/* الألوان */}
            {colors.map((color, index) => (
              <button
                key={index}
                className="palette-btn-color"
                onClick={() => {
                  if (gameFinished) return;
                  playSound(clickAudio);
                  setSelectedColor(color);
                  setEraserMode(false);
                }}
                style={{
                  ...styles.colorBtn,
                  background: color,
                  border:
                    selectedColor === color && !eraserMode
                      ? "4px solid black"
                      : "3px solid white",
                }}
              />
            ))}

            {/* ممحاة */}
            <button
              className="palette-btn-eraser"
              onClick={() => {
                if (gameFinished) return;
                playSound(clickAudio);
                setEraserMode(true);
              }}
              style={{
                ...styles.eraserBtn,
                border: eraserMode ? "4px solid black" : "none",
              }}
            >
              <Eraser size={25} color="#555" />
            </button>
          </div>
        </div>

        {/* BUTTONS IN BOTTOM */}
        <div style={styles.bottomButtons} className="bottom-buttons-custom">
          {/* الصوت */}
          <button
            onClick={toggleSound}
            style={styles.circleBtn}
            className="circle-btn-custom"
          >
            {soundEnabled ? (
              <Volume2 color="white" size={28} />
            ) : (
              <VolumeX color="white" size={28} />
            )}
          </button>

          {/* إعادة اللعبة */}
          <button
            onClick={restartGame}
            style={styles.circleBtn}
            className="circle-btn-custom"
          >
            <RotateCcw color="white" size={28} />
          </button>

          {/* رجوع */}
          <button
            onClick={AlHorof1}
            style={styles.circleBtn}
            className="circle-btn-custom"
          >
            <ArrowRight color="white" size={28} />
          </button>

          {/* الهوم */}
          <button
            onClick={goHome}
            style={styles.circleBtn}
            className="circle-btn-custom"
          >
            <Home color="white" size={28} />
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "15px",
    fontFamily: "Arial",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflowX: "hidden",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "10px",
  },
  topCard: {
    background: "#fff8ef",
    borderRadius: "20px",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
    boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
  },
  topNumber: {
    color: "#6c46d9",
    fontSize: "clamp(16px, 2vw, 20px)",
    fontWeight: "bold",
    display: "block",
  },
  titleBox: {
    background: "#7f57e7",
    borderRadius: "35px",
    padding: "15px 30px",
    color: "white",
    fontSize: "clamp(20px, 4vw, 30px)",
    fontWeight: "900",
    textAlign: "center",
    lineHeight: "1.2",
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
  },
  questionBox: {
    background: "white",
    borderRadius: "35px",
    padding: "12px 20px",
    width: "fit-content",
    maxWidth: "90%",
    margin: "0 auto 15px",
    fontSize: "clamp(18px, 2vw, 20px)",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
  },
  gameBox: {
    background: "rgba(255, 255, 255, 0.7)",
    borderRadius: "40px",
    border: "5px solid #b184ff",
    padding: "20px",
    minHeight: "80px",
    width: "min(80%, 500px)",
    margin: "35px auto 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
  },
  wordWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "130px",
  },
  word: {
    textAlign: "center",
    fontSize: "clamp(55px, 15vw, 80px)",
    fontWeight: "900",
    direction: "rtl",
    unicodeBidi: "plaintext",
    letterSpacing: "-4px",
    flexWrap: "wrap",
  },
  letter: {
    WebkitTextStroke: "4px black",
    cursor: "pointer",
    userSelect: "none",
  },
  messageText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "clamp(24px, 5vw, 40px)",
    fontWeight: "900",
    color: "#ff4f93",
    background: "rgba(255,255,255,0.9)",
    padding: "8px 20px",
    borderRadius: "50px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
    zIndex: 5,
  },
  palette: {
    background: "#fff6eb",
    borderRadius: "100px",
    width: "90%",
    maxWidth: "350px",
    minHeight: "50px",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px auto 0",
    gap: "5px",
    flexWrap: "wrap",
  },
  checkBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "none",
    background: "#ff4f93",
    cursor: "pointer",
    padding: "4px",
  },
  colorBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  eraserBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#52d946c1",
    border: "none",
    cursor: "pointer",
  },
  bottomButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap",
  },
  circleBtn: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: "none",
    background: "#7f57e7",
    cursor: "pointer",
    boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
  },
  winnerPopup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    minWidth: "160px",
    maxWidth: "220px",
    background: "#ffffff",
    border: "3px solid #7f57e7",
    padding: "15px 25px",
    borderRadius: "20px",
    zIndex: 999,
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },
  winnerEmoji: {
    fontSize: "26px",
    marginBottom: "4px",
  },
  winnerText: {
    fontSize: "18px",
    color: "#7f57e7",
    fontWeight: "bold",
  },
  winnerScore: {
    fontSize: "15px",
    color: "#ff4f93",
    marginTop: "4px",
    fontWeight: "bold",
  },
};