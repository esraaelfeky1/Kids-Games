// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";

import {
  Volume2,
  VolumeX,
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// =========================
// استيراد الصور (Imports) لمنع اختفائها عند رفع المشروع
// =========================
import bgImage from "../assets/WhatsApp Image 2026-05-12 at 5.27.12 PM.jpeg";
import loveImg from "../assets/love.png";
import frogImg from "../assets/frog.png";
import aeroplaneImg from "../assets/aeroplane.png";
import emailImg from "../assets/email.png";
import inLoveImg from "../assets/in-love.png";
import drumImg from "../assets/drum.png";
import sheepImg from "../assets/sheep.png";
import ducksImg from "../assets/ducks.png";
import africaImg from "../assets/africa.png";
import toothImg from "../assets/tooth.png";
import manicureImg from "../assets/manicure.png";

export default function TafkheemGame() {
  const navigate = useNavigate();

  // =========================
  // الأصوات
  // =========================

  const correctSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3"
    )
  );

  const wrongSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3"
    )
  );

  const clickSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
    )
  );

  const finishSound = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
    )
  );

  // =========================
  // الأسئلة (باستخدام المتغيرات المستوردة)
  // =========================

  const questions = [
    {
      image: loveImg,
      word: "صقر",
      missing: "ص",
      display: "_قر",
      choices: ["س", "ص", "ث"],
    },
    {
      image: frogImg,
      word: "ضفدع",
      missing: "ض",
      display: "_فدع",
      choices: ["ض", "د", "ظ"],
    },
    {
      image: aeroplaneImg,
      word: "طائرة",
      missing: "ط",
      display: "_ائرة",
      choices: ["ت", "ط", "ث"],
    },
    {
      image: emailImg,
      word: "ظرف",
      missing: "ظ",
      display: "_رف",
      choices: ["ز", "ظ", "ذ"],
    },
    {
      image: inLoveImg,
      word: "قطة",
      missing: "ق",
      display: "_طة",
      choices: ["ك", "ق", "ف"],
    },
    {
      image: drumImg,
      word: "طبلة",
      missing: "ط",
      display: "_بلة",
      choices: ["ت", "د", "ط"],
    },
    {
      image: sheepImg,
      word: "خروف",
      missing: "خ",
      display: "_روف",
      choices: ["ح", "خ", "ج"],
    },
    {
      image: ducksImg,
      word: "بطة",
      missing: "ط",
      display: "ب_ة",
      choices: ["ت", "ش", "ط"],
    },
    {
      image: africaImg,
      word: "غزال",
      missing: "غ",
      display: "_زال",
      choices: ["غ", "خ", "ع"],
    },
    {
      image: toothImg,
      word: "ضرس",
      missing: "ض",
      display: "_رس",
      choices: ["ت", "ض", "د"],
    },
    {
      image: manicureImg,
      word: "ظفر",
      missing: "ظ",
      display: "_فر",
      choices: ["ز", "ذ", "ظ"],
    },
  ];

  // =========================
  // States
  // =========================

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const question = questions[currentQuestion];

  // =========================
  // التايمر
  // =========================

  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  // =========================
  // تنسيق الوقت
  // =========================

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // =========================
  // إعادة اللعبة
  // =========================

  const restartGame = () => {
    if (soundEnabled) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }

    setCurrentQuestion(0);
    setSelected("");
    setProgress(0);
    setFinished(false);
    setScore(0);
    setTime(0);
    setShowCorrect(false);
    setShowFinalPopup(false);
  };

  // =========================
  // الرجوع
  // =========================

  const AlHorof1 = () => {
    if (soundEnabled) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    navigate("/AlHorof1");
  };

  // =========================
  // الهوم
  // =========================

  const goHome = () => {
    if (soundEnabled) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    navigate("/home");
  };

  // =========================
  // الإجابة
  // =========================

  const handleAnswer = (letter) => {
    if (finished) return;

    setSelected(letter);

    // إجابة صحيحة
    if (letter === question.missing) {
      if (soundEnabled) {
        correctSound.current.currentTime = 0;
        correctSound.current.play();
      }

      setShowCorrect(true);

      const newProgress = progress + 1;
      setProgress(newProgress);
      setScore((prev) => prev + 10);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelected("");
          setShowCorrect(false);
        } else {
          if (soundEnabled) {
            finishSound.current.currentTime = 0;
            finishSound.current.play();
          }

          setFinished(true);
          setShowFinalPopup(true);

          setTimeout(() => {
            setShowFinalPopup(false);
          }, 3000);
        }
      }, 700);
    } else {
      if (soundEnabled) {
        wrongSound.current.currentTime = 0;
        wrongSound.current.play();
      }
    }
  };

  // =========================
  // الصوت
  // =========================

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .tafkheem-page {
            padding: 0px 10px !important;
            align-items: flex-start !important;
            padding-top: 2px !important;
          }

          .tafkheem-card {
            width: 92% !important;
            max-width: 380px !important;
            padding: 26px 18px 32px 18px !important;
            border-radius: 32px !important;
            margin: auto !important;
          }

          .tafkheem-title-box {
            top: -36px !important;
            margin-bottom: -20px !important;
            width: fit-content !important;
            padding: 6px 22px !important;
          }

          .tafkheem-title {
            font-size: 22px !important;
          }

          .tafkheem-subtitle {
            font-size: 16px !important;
            margin-top: 4px !important;
            margin-bottom: 24px !important;
          }

          .tafkheem-question-box {
            width: 94% !important;
            padding: 22px 14px !important;
            gap: 16px !important;
            border-radius: 24px !important;
          }

          .tafkheem-image {
            width: 85px !important;
            height: 85px !important;
          }

          .tafkheem-word-box {
            width: 105px !important;
            height: 62px !important;
            border-radius: 20px !important;
          }

          .tafkheem-word {
            font-size: 32px !important;
          }

          .tafkheem-choices {
            margin-top: 26px !important;
            gap: 16px !important;
          }

          .tafkheem-choice-btn {
            width: 62px !important;
            height: 62px !important;
            font-size: 30px !important;
            border-radius: 20px !important;
          }

          .tafkheem-dots {
            margin-top: 26px !important;
            padding: 10px 14px !important;
            width: 160px !important;
          }

          .tafkheem-bottom-buttons {
            margin-top: 26px !important;
            gap: 14px !important;
          }

          .tafkheem-circle-btn {
            width: 44px !important;
            height: 44px !important;
          }
        }
      `}</style>

      <div
        style={{
          ...styles.page,
          backgroundImage: `url(${bgImage})`,
        }}
        className="tafkheem-page"
      >
        <div style={styles.card} className="tafkheem-card">
          {/* Top Bar */}
          <div style={styles.topBar}>
            <div style={styles.infoBox}>⭐ {score}</div>
            <div style={styles.infoBox}>⏰ {formatTime(time)}</div>
          </div>

          {/* العنوان */}
          <div style={styles.titleBox} className="tafkheem-title-box">
            <h1 style={styles.title} className="tafkheem-title">كمل الكلمة</h1>
          </div>

          <p style={styles.subtitle} className="tafkheem-subtitle">
            اختر الحرف المفخم المناسب
          </p>

          {/* السؤال */}
          <div style={styles.questionWrapper}>
            {/* رسالة النهاية */}
            {showFinalPopup && (
              <div style={styles.finalPopup}>
                <div style={styles.finalTitle}>🎉 أحسنت</div>
                <div style={styles.finalScore}>
                  لقد حصلت على {score} نقطة
                </div>
              </div>
            )}

            {/* رسالة الصح */}
            {showCorrect && (
              <div style={styles.successPopup}>ممتاز 👏</div>
            )}

            <div style={styles.questionBox} className="tafkheem-question-box">
              <img
                src={question.image}
                alt={question.word}
                style={styles.image}
                className="tafkheem-image"
              />

              <div style={styles.wordBox} className="tafkheem-word-box">
                <div style={styles.word} className="tafkheem-word">
                  {showCorrect ? question.word : question.display}
                </div>
              </div>
            </div>
          </div>

          {/* الاختيارات */}
          <div style={styles.choices} className="tafkheem-choices">
            {question.choices.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(letter)}
                className="tafkheem-choice-btn"
                style={{
                  ...styles.choiceBtn,
                  backgroundColor:
                    selected === letter
                      ? letter === question.missing
                        ? "#7CFC6A"
                        : "#ff8c8c"
                      : "#fff",
                }}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* التقدم */}
          <div style={styles.dots} className="tafkheem-dots">
            {questions.map((_, index) => (
              <span
                key={index}
                style={{
                  ...styles.dot,
                  backgroundColor:
                    index <= currentQuestion ? "#67d84f" : "#d3d3d3",
                }}
              />
            ))}
          </div>

          {/* الأزرار */}
          <div style={styles.bottomButtons} className="tafkheem-bottom-buttons">
            {/* الصوت */}
            <button
              onClick={toggleSound}
              style={styles.circleBtn}
              className="tafkheem-circle-btn"
            >
              {soundEnabled ? (
                <Volume2 color="white" size={22} />
              ) : (
                <VolumeX color="white" size={22} />
              )}
            </button>

            {/* إعادة */}
            <button
              onClick={restartGame}
              style={styles.circleBtn}
              className="tafkheem-circle-btn"
            >
              <RotateCcw color="white" size={18} />
            </button>

            {/* رجوع */}
            <button
              onClick={AlHorof1}
              style={styles.circleBtn}
              className="tafkheem-circle-btn"
            >
              <ArrowRight color="white" size={18} />
            </button>

            {/* هوم */}
            <button
              onClick={goHome}
              style={styles.circleBtn}
              className="tafkheem-circle-btn"
            >
              <Home color="white" size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial",
    direction: "rtl",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
    gap: "10px",
  },

  infoBox: {
    background: "#fff",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "22px 20px 30px 20px",
    background: "#cfeaf9b2",
    borderRadius: "32px",
    border: "3px solid #8cccece3",
    textAlign: "center",
    boxSizing: "border-box",
  },

  titleBox: {
    margin: "0 auto",
    background: "#1684ff",
    borderRadius: "25px",
    position: "relative",
    top: "-38px",
    marginBottom: "-20px",
    padding: "4px 20px",
    width: "fit-content",
  },

  title: {
    color: "#fff",
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "5px",
    marginBottom: "22px",
  },

  questionWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },

  successPopup: {
    position: "absolute",
    top: "-25px",
    background: "#41c441",
    color: "#fff",
    padding: "6px 18px",
    borderRadius: "18px",
    fontSize: "20px",
    fontWeight: "bold",
    zIndex: 5,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  finalPopup: {
    position: "absolute",
    top: "-10px",
    background: "#ffffffed",
    width: "220px",
    padding: "15px",
    borderRadius: "20px",
    border: "3px solid #b8daf7",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    zIndex: 10,
  },

  finalTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2eb82e",
    marginBottom: "10px",
  },

  finalScore: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2e2e2e",
  },

  questionBox: {
    background: "#ffffffe2",
    width: "90%",
    margin: "auto",
    borderRadius: "24px",
    border: "3px solid #beddf0",
    padding: "20px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "15px",
  },

  image: {
    width: "85px",
    height: "85px",
    objectFit: "contain",
  },

  wordBox: {
    background: "#f8fbff",
    border: "3px solid #a7d3f7f1",
    borderRadius: "20px",
    width: "110px",
    height: "62px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  word: {
    fontSize: "32px",
    fontWeight: "bold",
  },

  choices: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "28px",
    flexWrap: "wrap",
  },

  choiceBtn: {
    width: "60px",
    height: "60px",
    borderRadius: "20px",
    border: "3px solid #bbdcf9",
    fontSize: "30px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  dots: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    marginTop: "28px",
    background: "#fff",
    width: "150px",
    maxWidth: "90%",
    marginInline: "auto",
    padding: "8px",
    borderRadius: "25px",
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },

  bottomButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "28px",
    flexWrap: "wrap",
  },

  circleBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    background: "#7f57e7",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};