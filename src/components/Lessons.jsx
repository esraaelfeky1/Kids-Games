// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Lessons() {
  const navigate = useNavigate();

  const lessons = [
    "الحروف",
    "تشكيل الحروف",
    "المد",
    "السكون",
    "التنوين",
    "الشدة",
    "التاء المربوطة",
    "اللام الشمسية والقمرية",
    "ياء الملكية",
    "ألف اللينة",
    "ألف الوصل وهمزة القطع",
    "كراسي الهمزة",
    "علامات الترقيم",
  ];

  // ✅ صوت hover / touch
  // ✅ صوت جديد مختلف تمامًا - bright click

const playSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  // ✨ النغمة الأساسية
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";

  // حركة سريعة للصوت
  osc.frequency.setValueAtTime(700, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(
    1300,
    audioCtx.currentTime + 0.06
  );

  gain.gain.setValueAtTime(0.28, audioCtx.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.12
  );

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  // ✨ لمعة صغيرة للصوت
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();

  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1800, audioCtx.currentTime + 0.03);

  gain2.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.03);

  gain2.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.10
  );

  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);

  // ▶️ تشغيل
  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);

  osc2.start(audioCtx.currentTime + 0.03);
  osc2.stop(audioCtx.currentTime + 0.10);
};
  return (
    <div style={styles.page}>
      <h2 className="title" style={styles.title}>
        دروس الكتاب
      </h2>

      <div className="grid" style={styles.grid}>
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="card"
            style={{
              ...styles.card,
              backgroundColor: colors[index % colors.length],
            }}

            // ✅ صوت مع تمرير الماوس
            onMouseEnter={() => {
              playSound();
            }}

            // ✅ صوت مع لمس الشاشة
            onTouchStart={() => {
              playSound();
            }}

            onClick={() => {
              playSound();

              if (lesson === "الحروف") {
                navigate("/AlHorof1");
              }
              
              if (lesson === "تشكيل الحروف") {
                navigate("/alhorof123");
              }

              if (lesson === "المد") {
                navigate("/mad");
              }

              if (lesson === "السكون") {
                navigate("/Sukoon");
              }
              
              if (lesson === "التنوين") {
                navigate("/Nunation");
              }

              if (lesson === "الشدة") {
                navigate("/Shadda");
              }

              if (lesson === "التاء المربوطة") {
                navigate("/Tamarbuta");
              }

              if (lesson === "اللام الشمسية والقمرية") {
                navigate("/Sun");
              }

              if (lesson === "ياء الملكية") {
                navigate("/Ownership");
              }

              if (lesson === "ألف اللينة") {
                navigate("/Soft");
              }

              if (lesson === "ألف الوصل وهمزة القطع") {
                navigate("/Hamza");
              }

              if (lesson === "كراسي الهمزة") {
                navigate("/ChairHamza");
              }

              if (lesson === "علامات الترقيم") {
                navigate("/Marks");
              }

            }}
          >
            {lesson}
          </div>
        ))}
      </div>
    </div>
  );
}

const colors = [
  "#cfe3e3",
  "#e6dcc5",
  "#dcd6dc",
  "#e6cfcf",
  "#cfdde6",
  "#e6e3cf",
  "#e6d5c3",
  "#dcd6e6",
  "#e6e6c3",
];

const styles = {
  page: {
    padding: "25px ",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial",
  },

  title: {
    width: "100%",
    maxWidth: "850px",
    textAlign: "right",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    width: "100%",
    maxWidth: "850px",
  },

  card: {
    padding: "13px",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 8px rgba(18, 17, 17, 0.1)",
    textAlign: "center",
  },
};

const extraCSS = `
/* 👈 إخفاء السكرول نهائياً مع المحفاظة على المقاسات الأصلية تماماً */
html, body {
  overflow: hidden !important;
  height: 100% !important;
  margin: 0 !important;
}

.grid {
  direction: rtl;
}

.card:hover {
  transform: translateY(-5px) scale(1.03);
}

.card:active {
  transform: scale(0.95);
}

/* الشاشات الصغيرة (الموبايل): تصغير البادينج من الجوانب بالعرض شوية */
@media (max-width: 500px) {
  .grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  .title {
    margin-top: -15px !important;
  }

  .card {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding-left: 6px !important;  /* 👈 تصغير البادينج الجانبي اليسار */
    padding-right: 6px !important; /* 👈 تصغير البادينج الجانبي اليمين */
  }
}

/* شاشات التابلت: نمنع تمطيط الأزرار بزيادة ونخليها بنفس حجم وشكل اللاب الطبيعي */
@media (min-width: 501px) and (max-width: 899px) {
  .grid {
    max-width: 650px !important;
    grid-template-columns: repeat(3, 1fr) !important;
  }
  
  .title {
    max-width: 650px !important;
  }
}

/* الشاشات الكبيرة (اللاب توب) */
@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(4, 1fr) !important;
  }

  .title {
    margin-top: 30px !important;
  }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = extraCSS;
  document.head.appendChild(style);
}