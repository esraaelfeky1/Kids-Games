// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Home, RotateCcw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import correctSoundFile from "/sounds/hay1.mp3";
import wrongSoundFile from "/sounds/pop.mp3";
import bgImage from "../assets/WhatsApp Image 2026-05-12 at 5.27.12 PM.jpeg";

export default function TafkheemGame() {
  const navigate = useNavigate();

  const correctSound = useRef(new Audio(correctSoundFile));
  const wrongSound = useRef(new Audio(wrongSoundFile));
  const clickSound = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"));
  const finishSound = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"));

  // الكود الأصلي بالأسئلة الأصلية تماماً
  const questions = [
    { image: "src/assets/drink-water.png", word: "شَرِبَ", missing: "رِ", display: "شَـ - بَ", choices: ["قِـ", "سُـ", "رِ"] },
    { image: "src/assets/worker.png", word: "غَضِبَ", missing: "ضِـ", display: "غَـ - بَ", choices: ["سُـ", "ضِـ", "دَ"] },
    { image: "src/assets/party.png", word: "فَرِحَ", missing: "رِ", display: "فَـ - حَ", choices: ["تَـ", "طَـ", "رِ"] },
    { image: "src/assets/ear.png", word: "سَمِعَ", missing: "مِـ", display: "سَـ - عَ", choices: ["مِـ", "ظَ", "ذَ"] },
    { image: "src/assets/sick(1).png", word: "مَرِضَ", missing: "رِ", display: "مَـ - ضَ", choices: ["كُـ", "رِ", "فَـ"] },
    { image: "src/assets/swing.png", word: "لَعِبَ", missing: "عِـ", display: "لَـ - بَ", choices: ["عِـ", "سَـ", "طَ"] },
    { image: "src/assets/winner.png", word: "رَبِحَ", missing: "بِـ", display: "رَ - حَ", choices: ["سَـ", "خَـ", "بِـ"] },
    { image: "src/assets/friends.png", word: "طَعِمَ", missing: "عِـ", display: "طَـ - مَ", choices: ["عِـ", "رَ", "طَ"] },
    { image: "src/assets/laughing.png", word: "ضَحِكَ", missing: "حِـ", display: "ضَـ - كَ", choices: ["عَـ", "حِـ", "صَـ"] },
    { image: "src/assets/magic.png", word: "نَشِطَ", missing: "شِـ", display: "نَـ - طَ", choices: ["قِـ", "سُـ", "شِـ"] },
  ];

  // التحميل المسبق للصور عند تشغيل اللعبة لأول مرة
  useEffect(() => {
    questions.forEach((q) => {
      const img = new Image();
      img.src = q.image;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [time, setTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const question = questions[currentQuestion];
  const normalize = (str) => str.replace(/[\u0640-\u065F\s]/g, "");

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleAnswer = (letter) => {
    if (finished) return;
    setSelected(letter);
    if (normalize(letter) === normalize(question.missing)) {
      if (soundEnabled) {
        correctSound.current.currentTime = 0;
        correctSound.current.play();
      }
      setShowCorrect(true);
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
        }
      }, 700);
    } else if (soundEnabled) {
      wrongSound.current.currentTime = 0;
      wrongSound.current.play();
    }
  };

  const restartGame = () => {
    if (soundEnabled) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    setCurrentQuestion(0); setSelected(""); setFinished(false); setScore(0); setTime(0); setShowCorrect(false); setShowFinalPopup(false);
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

      <div style={{ ...styles.page, backgroundImage: `url(${bgImage})` }} className="tafkheem-page">
        <div style={styles.card} className="tafkheem-card">
          <div style={styles.topBar}>
            <div style={styles.infoBox}>⭐ {score}</div>
            <div style={styles.infoBox}>⏰ {formatTime(time)}</div>
          </div>
          <div style={styles.titleBox} className="tafkheem-title-box">
            <h1 style={styles.title} className="tafkheem-title"> كمل الكلمة </h1>
          </div>
          <p style={styles.subtitle} className="tafkheem-subtitle"> اختر الحرف الصحيح لإكمال الكلمة</p>
          <div style={styles.questionWrapper}>
            {showFinalPopup && (
              <div style={styles.finalPopup}>
                <div style={styles.finalTitle}>🎉 أحسنت</div>
                <div style={styles.finalScore}>لقد حصلت على {score} نقطة</div>
              </div>
            )}
            {showCorrect && <div style={styles.successPopup}> ممتاز 👏 </div>}
            <div style={styles.questionBox} className="tafkheem-question-box">
              <img src={question.image} alt={question.word} style={styles.image} className="tafkheem-image" />
              <div style={styles.wordBox} className="tafkheem-word-box">
                <div style={styles.word} className="tafkheem-word">{showCorrect ? question.word : question.display}</div>
              </div>
            </div>
          </div>
          <div style={styles.choices} className="tafkheem-choices">
            {question.choices.map((letter, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(letter)} 
                className="tafkheem-choice-btn"
                style={{ ...styles.choiceBtn, backgroundColor: selected === letter ? (normalize(letter) === normalize(question.missing) ? "#7CFC6A" : "#ff8c8c") : "#fff" }}
              >
                {letter}
              </button>
            ))}
          </div>
          <div style={styles.dots} className="tafkheem-dots">
            {questions.map((_, index) => (
              <span key={index} style={{ ...styles.dot, backgroundColor: index <= currentQuestion ? "#67d84f" : "#d3d3d3" }} />
            ))}
          </div>
          <div style={styles.bottomButtons} className="tafkheem-bottom-buttons">
            <button onClick={() => setSoundEnabled(!soundEnabled)} style={styles.circleBtn} className="tafkheem-circle-btn">
              {soundEnabled ? <Volume2 color="white" size={22} /> : <VolumeX color="white" size={22} />}
            </button>
            <button onClick={restartGame} style={styles.circleBtn} className="tafkheem-circle-btn">
              <RotateCcw color="white" size={18} />
            </button>
            <button onClick={() => { if (soundEnabled) clickSound.current.play(); navigate("/Alhorof123"); }} style={styles.circleBtn} className="tafkheem-circle-btn">
              <ArrowRight color="white" size={18} />
            </button>
            <button onClick={() => { if (soundEnabled) clickSound.current.play(); navigate("/home"); }} style={styles.circleBtn} className="tafkheem-circle-btn">
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
    boxSizing: "border-box"
  },
  topBar: { 
    display: "flex", 
    justifyContent: "space-between", 
    marginBottom: "5px", 
    gap: "10px" 
  },
  infoBox: { 
    background: "#fff", 
    padding: "6px 14px", 
    borderRadius: "20px", 
    fontWeight: "bold", 
    fontSize: "14px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  card: { 
    width: "100%",
    maxWidth: "420px",
    padding: "22px 20px 30px 20px", 
    background: "#cfeaf9b2", 
    borderRadius: "32px", 
    border: "3px solid #8cccece3", 
    textAlign: "center",
    boxSizing: "border-box"
  },
  titleBox: { 
    margin: "0 auto", 
    background: "#1684ff", 
    borderRadius: "25px", 
    position: "relative", 
    top: "-38px", 
    marginBottom: "-20px", 
    padding: "4px 20px",
    width: "fit-content"
  },
  title: { 
    color: "#fff", 
    margin: 0, 
    fontSize: "24px", 
    fontWeight: "bold" 
  },
  subtitle: { 
    fontSize: "16px", 
    fontWeight: "600", 
    marginTop: "5px", 
    marginBottom: "22px" 
  },
  questionWrapper: { 
    position: "relative", 
    display: "flex", 
    justifyContent: "center" 
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)" 
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
    zIndex: 10 
  },
  finalTitle: { 
    fontSize: "22px", 
    fontWeight: "bold", 
    color: "#2eb82e", 
    marginBottom: "10px" 
  },
  finalScore: { 
    fontSize: "18px", 
    fontWeight: "bold", 
    color: "#2e2e2e" 
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
    gap: "15px" 
  },
  image: { 
    width: "85px", 
    height: "85px", 
    objectFit: "contain" 
  },
  wordBox: { 
    background: "#f8fbff", 
    border: "3px solid #a7d3f7f1", 
    borderRadius: "20px", 
    width: "110px", 
    height: "62px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  word: { 
    fontSize: "32px", 
    fontWeight: "bold" 
  },
  choices: { 
    display: "flex", 
    justifyContent: "center", 
    gap: "15px", 
    marginTop: "28px", 
    flexWrap: "wrap" 
  },
  choiceBtn: { 
    width: "60px", 
    height: "60px", 
    borderRadius: "20px", 
    border: "3px solid #bbdcf9", 
    fontSize: "30px", 
    fontWeight: "bold", 
    cursor: "pointer" 
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
    borderRadius: "25px" 
  },
  dot: { 
    width: "8px", 
    height: "8px", 
    borderRadius: "50%" 
  },
  bottomButtons: { 
    display: "flex", 
    justifyContent: "center", 
    gap: "12px", 
    marginTop: "28px", 
    flexWrap: "wrap" 
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
    alignItems: "center" 
  }
};