// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/gam.jpeg";

export default function ArabicLettersGame() {
  const navigate = useNavigate();

  // للموبايل فقط
  const isMobile = window.innerWidth <= 668;

  const initialBubbles = [
  // الصف الأول
  {
    id: 8,
    char: "ل",
    top: isMobile ? "25%" : "35%",
    left: isMobile ? "10%" : "10%",
    heavy: false,
  },
  {
    id: 9,
    char: "ق",
    top: isMobile ? "35%" : "42%",
    left: isMobile ? "24%" : "24%",
    heavy: true,
  },
  {
    id: 10,
    char: "ب",
    top: isMobile ? "25%" : "38%",
    left: isMobile ? "38%" : "30%",
    
    heavy: false,
  },
  {
    id: 11,
    char: "غ",
    top: isMobile ? "35%" : "42%",
    left: isMobile ? "52%" : "52%",
    heavy: true,
  },
  {
    id: 12,
    char: "ش",
    top: isMobile ? "25%" : "38%",
    left: isMobile ? "66%" : "66%",
    heavy: false,
  },
  {
    id: 13,
    char: "ظ",
    top: isMobile ? "40%" : "42%",
    left: isMobile ? "80%" : "80%",
    heavy: true,
  },
  {
    id: 14,
    char: "د",
    top: isMobile ? "25%" : "38%",
    left: isMobile ? "92%" : "94%",
    heavy: false,
  },

  // الصف الثاني
  {
    id: 15,
    char: "م",
    top: isMobile ? "54%" : "62%",
    left: isMobile ? "10%" : "8%",
    heavy: false,
  },
  {
    id: 16,
    char: "ط",
    top: isMobile ? "60%" : "66%",
    left: isMobile ? "24%" : "22%",
    heavy: true,
  },
  {
    id: 17,
    char: "ن",
    top: isMobile ? "50%" : "62%",
    left: isMobile ? "38%" : "36%",
    heavy: false,
  },
  {
    id: 18,
    char: "ص",
    top: isMobile ? "60%" : "66%",
    left: isMobile ? "52%" : "50%",
    heavy: true,
  },
  {
    id: 19,
    char: "ف",
    top: isMobile ? "54%" : "62%",
    left: isMobile ? "66%" : "64%",
    heavy: false,
  },
  {
    id: 20,
    char: "خ",
    top: isMobile ? "60%" : "66%",
    left: isMobile ? "80%" : "78%",
    heavy: true,
  },
  {
    id: 21,
    char: "ك",
    top: isMobile ? "54%" : "62%",
    left: isMobile ? "92%" : "92%",
    heavy: false,
  },

  // الصف الثالث
  {
    id: 22,
    char: "و",
    top: isMobile ? "76%" : "84%",
    left: isMobile ? "20%" : "18%",
    heavy: false,
  },
  {
    id: 23,
    char: "غ",
    top: isMobile ? "82%" : "88%",
    left: isMobile ? "38%" : "34%",
    heavy: true,
  },
  {
    id: 24,
    char: "هـ",
    top: isMobile ? "76%" : "84%",
    left: isMobile ? "56%" : "50%",
    heavy: false,
  },
  {
    id: 25,
    char: "ض",
    top: isMobile ? "82%" : "88%",
    left: isMobile ? "74%" : "66%",
    heavy: true,
  },
  {
    id: 26,
    char: "ي",
    top: isMobile ? "76%" : "84%",
    left: isMobile ? "90%" : "82%",
    heavy: false,
  },
];

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [gameWon, setGameWon] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bubbles, setBubbles] = useState(initialBubbles);

  // صوت الحرف الصح
  const correctAudioRef = useRef(null);

  useEffect(() => {
    correctAudioRef.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
    );

    correctAudioRef.current.volume = 0.7;
  }, []);

  // المؤقت
  useEffect(() => {
    if (timeLeft > 0 && !finished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, finished]);

  // التحقق من الفوز
  useEffect(() => {
    const lightLetters = bubbles.filter((b) => !b.heavy);

    if (lightLetters.length === 0 && !finished) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFinished(true);
      setGameWon(true);

      setTimeout(() => {
        setGameWon(false);
      }, 1500);
    }
  }, [bubbles, finished]);

  // تشغيل الصوت
  const playCorrectSound = () => {
    if (correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play();
    }
  };

  // إعادة اللعبة
  const restartGame = () => {
    setScore(0);
    setTimeLeft(50);
    setGameWon(false);
    setFinished(false);
    setBubbles(initialBubbles);
  };

  // الضغط على الحروف
  const handleClick = (id, heavy) => {
    if (finished) return;

    if (!heavy) {
      playCorrectSound();

      setScore((s) => s + 1);

      setBubbles((prev) =>
        prev.filter((bubble) => bubble.id !== id)
      );
    } else {
      setScore((s) => (s > 0 ? s - 1 : 0));
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",

        backgroundImage: `url(${backgroundImg})`,

        // الصورة كاملة في الموبايل بدون قص
        backgroundSize: isMobile ? "100% 100%" : "cover",

        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        padding: isMobile ? "8px" : "15px",

        boxSizing: "border-box",
        direction: "rtl",
        fontFamily: "Arial",
      }}
    >
      {/* الكارد الرئيسي */}
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 20px)",
          margin: "0 auto",
          borderRadius: "22px",
          position: "relative",
          overflow: "hidden",
          padding: isMobile ? "8px" : "15px",
          boxSizing: "border-box",
        }}
      >
        {/* شاشة الفوز */}
        {gameWon && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: isMobile ? "180px" : "220px",
                background: "white",
                borderRadius: "35px",
                padding: isMobile ? "18px" : "25px",
                textAlign: "center",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "30px" : "40px",
                }}
              >
                🎉
              </div>

              <div
                style={{
                  fontSize: isMobile ? "22px" : "30px",
                  fontWeight: "900",
                  color: "#120089",
                  marginTop: "10px",
                }}
              >
                لقد فزت!
              </div>

              <div
                style={{
                  marginTop: "20px",
                  fontSize: isMobile ? "18px" : "22px",
                  fontWeight: "bold",
                  color: "#ff4d88",
                }}
              >
                عدد النقاط: {score}
              </div>
            </div>
          </div>
        )}

        {/* الجزء العلوي */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* الوقت */}
          <div
            style={{
              width: isMobile ? "70px" : "90px",
              background: "#fff7ea",
              border: "3px solid #e3c59a",
              borderRadius: "20px",
              padding: isMobile ? "6px" : "10px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? "13px" : "17px",
                fontWeight: "bold",
              }}
            >
              الوقت
            </div>

            <div
              style={{
                fontSize: isMobile ? "13px" : "15px",
                fontWeight: "900",
                marginTop: "5px",
              }}
            >
              00:
              {timeLeft < 10
                ? `0${timeLeft}`
                : timeLeft}
            </div>
          </div>

          {/* العنوان */}
          <div
            style={{
              width: isMobile ? "42%" : "25%",
              background:
                "linear-gradient(to bottom, #f9df99, #e6b157)",
              border: "4px solid #9b6523",
              borderRadius: isMobile ? "18px" : "90px",
              marginbottom: isMobile ? "5px" : "20px",
              padding: isMobile ? "5px" : "4px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? "15px" : "20px",
                fontWeight: "bold",
                color: "#251f74",
              }}
            >
              لعبة
            </div>

            <div
              style={{
                fontSize: isMobile ? "18px" : "25px",
                fontWeight: "900",
                color: "#120089",
                lineHeight: "1",
              }}
            >
              إصطياد الحرف المرققة
            </div>

            <div
              style={{
                marginTop: "5px",
                borderRadius: "100px",
                padding: isMobile ? "4px" : "8px",
                fontSize: isMobile ? "11px" : "17px",
                fontWeight: "bold",
              }}
            >
              اضغط{" "}
              <span style={{ color: "#ff4d88" }}>
                فقط
              </span>{" "}
              على الحروف المرققة
            </div>
          </div>

          {/* النقاط */}
          <div
            style={{
              width: isMobile ? "65px" : "80px",
              background: "#fff7ea",
              border: "3px solid #e3c59a",
              borderRadius: "20px",
              padding: isMobile ? "6px" : "10px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? "13px" : "16px",
                fontWeight: "bold",
              }}
            >
              النقاط
            </div>

            <div
              style={{
                fontSize: isMobile ? "18px" : "25px",
                fontWeight: "900",
              }}
            >
              {score}
            </div>
          </div>
        </div>

        {/* الفقاعات */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onClick={() =>
              handleClick(bubble.id, bubble.heavy)
            }
            style={{
              position: "absolute",
              top: bubble.top,
              left: bubble.left,
              transform: "translate(-50%, -50%)",

              width: isMobile ? "45px" : "60px",
              height: isMobile ? "45px" : "60px",

              borderRadius: "50%",

              background: !bubble.heavy
                ? "radial-gradient(circle at 30% 30%, #fff, #e88fc3)"
                : "radial-gradient(circle at 30% 30%, #fff, #82bce8)",

              border:
                "3px solid rgba(255,255,255,0.95)",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              fontSize: isMobile ? "20px" : "34px",
              fontWeight: "900",

              cursor: "pointer",

              boxShadow:
                "inset -8px -8px 12px rgba(0,0,0,0.05), 0 8px 18px rgba(0,0,0,0.15)",

              transition: "0.2s",
            }}
          >
            {bubble.char}
          </div>
        ))}

        {/* الأزرار */}
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            right: "15px",
            display: "flex",
            gap: "8px",
          }}
        >
          {/* زر الهوم */}
          <button
            onClick={() => navigate("/home")}
            style={{
              width: isMobile ? "42px" : "55px",
              height: isMobile ? "42px" : "55px",
              borderRadius: "50%",
              border: "none",
              background: "#03abff",
              fontSize: isMobile ? "18px" : "24px",
              cursor: "pointer",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            🏠
          </button>

          {/* زر إعادة */}
          <button
            onClick={restartGame}
            style={{
              width: isMobile ? "42px" : "55px",
              height: isMobile ? "42px" : "55px",
              borderRadius: "50%",
              border: "none",
              background: "#54a114",
              fontSize: isMobile ? "18px" : "24px",
              cursor: "pointer",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            ↻
          </button>

          {/* زر الرجوع */}
          <button
            onClick={() => navigate("/AlHorof1")}
            style={{
              width: isMobile ? "42px" : "55px",
              height: isMobile ? "42px" : "55px",
              borderRadius: "50%",
              border: "none",
              background: "#b72110",
              fontSize: isMobile ? "18px" : "22px",
              cursor: "pointer",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            ⬅
          </button>
        </div>
      </div>
    </div>
  );
}