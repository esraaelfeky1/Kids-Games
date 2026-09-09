// eslint-disable-next-line no-unused-vars
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Clock3,
  Star,
  Volume2,
  VolumeX,
  Home,
  Eraser,
  Check,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ArabicLetterGame() {

  // =========================
  // الكلمات
  // =========================

  const words = [
    {
      word: "صديق",
      emphatic: [0, 3],
    },

    {
      word: "طعام",
      emphatic: [0],
    },

    {
      word: "ضفدع",
      emphatic: [0],
    },

    {
      word: "قفل",
      emphatic: [0],
    },

    {
      word: "غروب",
      emphatic: [0],
    },

    {
      word: "ظرف",
      emphatic: [0],
    },

{
      word: "طاووس",
      emphatic: [0],
    },


{
      word: "قصة",
      emphatic: [0],
    },

{
      word: "قلم",
      emphatic: [0],
    },


{
      word: "غزال",
      emphatic: [0],
    },

    {
      word: "ضرس",
      emphatic: [0],
    },

{
      word: "طين",
      emphatic: [0],
    },

    {
      word: "خروف",
      emphatic: [0],
    },



  ];

  // =========================
  // STATES
  // =========================

  const [currentWord, setCurrentWord] =
    useState(0);

  const [selectedColor, setSelectedColor] =
    useState("#ff4f93");

  const [paintedLetters, setPaintedLetters] =
    useState({});

  const [eraserMode, setEraserMode] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(60);

  const [message, setMessage] =
    useState("");

  const [gameFinished, setGameFinished] =
    useState(false);

  const [showWinner, setShowWinner] =
    useState(false);

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  // =========================
  // الأصوات
  // =========================

  const clickAudio = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
    )
  );

  const successAudio = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
    )
  );

  // =========================
  // تجهيز الأصوات
  // =========================

  useEffect(() => {

    clickAudio.current.preload =
      "auto";

    successAudio.current.preload =
      "auto";

    clickAudio.current.volume = 1;

    successAudio.current.volume = 1;

  }, []);

  // =========================
  // TIMER
  // =========================

  useEffect(() => {

    if (
      timeLeft <= 0 ||
      gameFinished
    ) {
      return;
    }

    const timer = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, gameFinished]);

  // =========================
  // تشغيل الصوت
  // =========================

  const playSound = (audioRef) => {

    if (!soundEnabled) return;

    if (!audioRef.current) return;

    try {

      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      const playPromise =
        audioRef.current.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {});
      }

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // الألوان
  // =========================

  const colors = [
    "#ff4f93",
    "#ff8800",
    "#ffd000",
    "#78c800",
    "#1da1ff",
    "#8e5cff",
  ];

  // =========================
  // تلوين الحرف
  // =========================

  const handleLetterClick = (index) => {

    playSound(clickAudio);

    const key =
      `${currentWord}-${index}`;

    // ممحاة

    if (eraserMode) {

      const updated = {
        ...paintedLetters,
      };

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

  // =========================
  // التحقق
  // =========================

  const checkAnswer = (updated) => {

    const current =
      words[currentWord];

    const allCorrect =
      current.emphatic.every(
        (index) =>
          updated[
            `${currentWord}-${index}`
          ]
      );

    if (allCorrect) {

      playSound(successAudio);

      setScore((prev) => prev + 10);

      // رسالة أحسنت
      setMessage("👏 أحسنت");

      setTimeout(() => {

        if (
          currentWord <
          words.length - 1
        ) {

          setCurrentWord(
            (prev) => prev + 1
          );

          setMessage("");

        } else {

          setGameFinished(true);

          setShowWinner(true);

          setTimeout(() => {

            setShowWinner(false);

          }, 4000);
        }

      }, 1500);
    }
  };

  // =========================
  // إعادة اللعبة
  // =========================

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

  // =========================
  // HOME
  // =========================

  const goHome = () => {

    playSound(clickAudio);

    window.location.href = "/home";
  };

  // =========================
  // BACK
  // =========================

  const navigate = useNavigate();

const AlHorof1 = () => {
  navigate("/AlHorof1");
};




  // =========================
  // كتم الصوت
  // =========================

  const toggleSound = () => {

    setSoundEnabled(
      (prev) => !prev
    );
  };

  // =========================
  // UI
  // =========================

  return (

    <div style={styles.page}>

      {/* رسالة الفوز */}

      {showWinner && (

        <div style={styles.winnerPopup}>

          <div style={styles.winnerEmoji}>
            🏆
          </div>

          <div style={styles.winnerText}>
            لقد فزت
          </div>

          <div style={styles.winnerScore}>
            النقاط : {score}
          </div>

        </div>
      )}

      {/* HEADER */}

      <div style={styles.header}>

        {/* الوقت */}

        <div style={styles.topCard}>

          <Clock3
            size={28}
            color="#ff9800"
          />

          <div style={styles.topText}>
            الوقت
          </div>

          <div style={styles.topNumber}>
            {String(
              Math.floor(timeLeft / 60)
            ).padStart(2, "0")}
            :
            {String(timeLeft % 60)
              .padStart(2, "0")}
          </div>

        </div>

        {/* العنوان */}

        <div style={styles.titleBox}>

          لعبة
          <br />
          لون الحرف

        </div>

        {/* النقاط */}

        <div style={styles.topCard}>

          <Star
            size={28}
            color="#FFD700"
            fill="#FFD700"
          />

          <div style={styles.topText}>
            النقاط
          </div>

          <div style={styles.topNumber}>
            {score}
          </div>

        </div>

      </div>

      {/* السؤال */}

      <div style={styles.questionBox}>

        لون الحروف

        <span
          style={{
            color: "#ff4f93",
            marginRight: "8px",
            marginLeft: "8px",
          }}
        >
          المفخمة
        </span>

        في الكلمة

      </div>

      {/* GAME */}

      <div style={styles.gameBox}>

        {!gameFinished ? (

          <>
            {/* الكلمة */}

            <div style={styles.wordWrapper}>

              <div style={styles.word}>

                {words[currentWord]
                  .word
                  .split("")
                  .map((letter, index) => {

                    const color =
                      paintedLetters[
                        `${currentWord}-${index}`
                      ];

                    return (

                      <span
                        key={index}

                        onClick={() =>
                          handleLetterClick(index)
                        }

                        style={{
                          ...styles.letter,

                          color:
                            color || "white",
                        }}
                      >
                        {letter}
                      </span>
                    );
                  })}
              </div>

              {/* الرسالة */}

              {message && (

                <div style={styles.messageText}>
                  {message}
                </div>

              )}

            </div>

            {/* لوحة الألوان */}

            <div style={styles.palette}>

              {/* صح */}

              <button
                style={styles.checkBtn}
                onClick={() =>
                  playSound(clickAudio)
                }
              >

                <Check
                  color="white"
                  size={23}
                />

              </button>

              {/* الألوان */}

              {colors.map(
                (color, index) => (

                  <button
                    key={index}

                    onClick={() => {

                      playSound(clickAudio);

                      setSelectedColor(
                        color
                      );

                      setEraserMode(false);
                    }}

                    style={{
                      ...styles.colorBtn,

                      background: color,

                      border:
                        selectedColor ===
                          color &&
                        !eraserMode
                          ? "4px solid black"
                          : "3px solid white",
                    }}
                  />
                )
              )}

              {/* ممحاة */}

              <button

                onClick={() => {

                  playSound(clickAudio);

                  setEraserMode(true);
                }}

                style={{
                  ...styles.eraserBtn,

                  border:
                    eraserMode
                      ? "4px solid black"
                      : "none",
                }}
              >

                <Eraser
                  size={25}
                  color="#555"
                />

              </button>

            </div>
          </>
        ) : (

          <div style={styles.finishBox}>

            <div style={styles.finishEmoji}>
              🎉
            </div>

            <div style={styles.finishText}>
              انتهت اللعبة
            </div>

          </div>
        )}
      </div>

      {/* BUTTONS */}

      <div style={styles.bottomButtons}>

        {/* الصوت */}

        <button
          onClick={toggleSound}
          style={styles.circleBtn}
        >

          {soundEnabled ? (

            <Volume2
              color="white"
              size={28}
            />

          ) : (

            <VolumeX
              color="white"
              size={28}
            />

          )}

        </button>

        {/* إعادة اللعبة */}

        <button
          onClick={restartGame}
          style={styles.circleBtn}
        >

          <RotateCcw
            color="white"
            size={28}
          />

        </button>

        {/* رجوع */}

        <button

          onClick={AlHorof1}
          style={styles.circleBtn}
        >

          <ArrowRight
            color="white"
            size={28}
          />

        </button>

        {/* الهوم */}

        <button
          onClick={goHome}
          style={styles.circleBtn}
        >

          <Home
            color="white"
            size={28}
          />

        </button>

      </div>
    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    padding: "15px",
    fontFamily: "Arial",
    direction: "rtl",

    backgroundImage:
      "url('src/assets/yyyy.jpeg')",

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    overflowX: "hidden",
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
    borderRadius: "25px",
    padding: "12px",
    width: "80px",
    textAlign: "center",

    boxShadow:
      "0 8px 15px rgba(0,0,0,0.1)",
  },

  topText: {
    fontSize: "clamp(16px, 2vw, 22px)",
    fontWeight: "bold",
  },

  topNumber: {
    color: "#6c46d9",
    fontSize: "clamp(14px, 2vw, 20px)",
    fontWeight: "bold",
  },

  titleBox: {
    background: "#7f57e7",
    borderRadius: "35px",
    padding: "15px 30px",
    color: "white",

    fontSize:
      "clamp(20px, 4vw, 30px)",

    fontWeight: "900",
    textAlign: "center",
    lineHeight: "1.2",

    boxShadow:
      "0 8px 15px rgba(0,0,0,0.2)",
  },

  questionBox: {
    background: "white",
    borderRadius: "35px",
    padding: "12px 20px",
    width: "fit-content",
    maxWidth: "90%",
    margin: "0 auto 15px",

    fontSize:
      "clamp(18px, 2vw, 20px)",

    fontWeight: "bold",
    textAlign: "center",

    boxShadow:
      "0 8px 15px rgba(0,0,0,0.1)",
  },

  gameBox: {
    background:
      "rgba(255, 255, 255, 0.7)",

    borderRadius: "40px",

    border: "5px solid #b184ff",

    padding: "20px",

    minHeight: "80px",

    width: "min(80%, 500px)",

    margin: "35px auto 0",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    boxShadow:
      "0 10px 20px rgba(0,0,0,0.15)",
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

    fontSize:
      "clamp(55px, 15vw, 80px)",

    fontWeight: "900",

    direction: "rtl",

    unicodeBidi: "plaintext",

    letterSpacing: "-4px",

    flexWrap: "wrap",
  },

  letter: {
    WebkitTextStroke:
      "4px black",

    cursor: "pointer",

    userSelect: "none",
  },

  messageText: {
    position: "absolute",

    top: "50%",

    left: "50%",

    transform:
      "translate(-50%, -50%)",

    fontSize:
      "clamp(24px, 5vw, 40px)",

    fontWeight: "900",

    color: "#ff4f93",

    background:
      "rgba(255,255,255,0.9)",

    padding: "8px 20px",

    borderRadius: "50px",

    boxShadow:
      "0 5px 10px rgba(0,0,0,0.15)",

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

    boxShadow:
      "0 8px 15px rgba(0,0,0,0.15)",
  },

  finishBox: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    height: "90%",
  },

  finishEmoji: {
    fontSize: "40px",
  },

  finishText: {
    fontSize:
      "clamp(28px, 6vw, 40px)",

    color: "#6c46d9",

    fontWeight: "900",
  },

  winnerPopup: {
    position: "fixed",

    top: "50%",

    left: "50%",

    width: "min(40%, 150px)",

    transform:
      "translate(-60%, -60%)",

    background: "white",

    padding: "25px",

    borderRadius: "35px",

    zIndex: 999,

    textAlign: "center",

    boxShadow:
      "0 15px 30px rgba(0,0,0,0.2)",
  },

  winnerEmoji: {
    fontSize: "30px",
  },

  winnerText: {
    fontSize:
      "clamp(24px, 5vw, 35px)",

    color: "#7f57e7",

    fontWeight: "500",
  },

  winnerScore: {
    fontSize: "20px",

    color: "#ff4f93",

    marginTop: "10px",

    fontWeight: "bold",
  }



};