import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { db } from "../firebase/config";

import {
  Gamepad2,
  Sparkles,
  Star,
  Heart,
  Gift,
  Smile,
  Rocket,
  Cloud,
  Moon,
  Sun,
  Zap,
} from "lucide-react";

// =========================================
// Google Provider
// =========================================

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

function Activation() {
  const [code, setCode] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // تحميل خاص بتسجيل Google
  const [googleLoading, setGoogleLoading] =
    useState(false);

  // تحميل خاص بتفعيل الكتاب
  const [activationLoading, setActivationLoading] =
    useState(false);

  const [user, setUser] = useState(null);

  const [showCodeForm, setShowCodeForm] =
    useState(false);

  const [googleHover, setGoogleHover] =
    useState(false);

  const [buttonHover, setButtonHover] =
    useState(false);

  const googlePopupCheckRef =
    useRef(null);

  const navigate = useNavigate();

  const auth = getAuth();

  // =========================================
  // رسالة مؤقتة
  // =========================================

  const showTemporaryMessage = (
    text,
    type = "error"
  ) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // =========================================
  // إيقاف مراقبة نافذة Google
  // =========================================

  const stopGooglePopupWatcher = () => {
    if (googlePopupCheckRef.current) {
      clearInterval(
        googlePopupCheckRef.current
      );

      googlePopupCheckRef.current = null;
    }
  };

  // =========================================
  // تسجيل الدخول باستخدام Google
  // =========================================

  const handleGoogleLogin = async () => {
    // تنظيف أي رسائل قديمة
    setMessage("");
    setMessageType("");

    // تشغيل زر Google
    setGoogleLoading(true);

    // =========================================
    // مهم:
    // مراقبة نافذة Google
    // =========================================

    // في البداية لا نستطيع الوصول مباشرة
    // إلى نافذة Firebase الداخلية،
    // لذلك نراقب تغير حالة التركيز والنافذة.
    //
    // الهدف الأساسي:
    // عند إغلاق نافذة Google يرجع الزر
    // للحالة الطبيعية في أسرع وقت ممكن.

    let popupOpened = false;

    const startWatcher = () => {
      stopGooglePopupWatcher();

      googlePopupCheckRef.current =
        setInterval(() => {
          if (!document.hasFocus()) {
            popupOpened = true;
            return;
          }

          if (popupOpened) {
            stopGooglePopupWatcher();

            // لو رجع التركيز للصفحة
            // والـ Promise لم ينتهِ بعد،
            // نرجع الزر لحالته الطبيعية.

            setGoogleLoading(false);
          }
        }, 150);
    };

    startWatcher();

    try {
      // =========================================
      // فتح نافذة Google
      // =========================================

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      // =========================================
      // توقف المراقبة
      // =========================================

      stopGooglePopupWatcher();

      const selectedUser = result.user;

      if (!selectedUser) {
        setGoogleLoading(false);

        showTemporaryMessage(
          "❌ لم يتم تسجيل الدخول، حاولي مرة أخرى.",
          "error"
        );

        return;
      }

      // =========================================
      // تسجيل الدخول نجح
      // =========================================

      setUser(selectedUser);

      // =========================================
      // البحث عن بيانات الحساب
      // =========================================

      const userRef = doc(
        db,
        "users",
        selectedUser.uid
      );

      const userSnapshot =
        await getDoc(userRef);

      // =========================================
      // الحساب سبق وفعل كتاب
      // =========================================

      if (userSnapshot.exists()) {
        const userData =
          userSnapshot.data();

        const activatedCode =
          userData.activatedBookCode;

        if (
          activatedCode &&
          String(activatedCode).trim() !== ""
        ) {
          setGoogleLoading(false);

          navigate("/home", {
            replace: true,
          });

          return;
        }
      }

      // =========================================
      // الحساب جديد أو لم يفعل كتاب
      // =========================================

      setShowCodeForm(true);

      setGoogleLoading(false);
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      // =========================================
      // إيقاف مراقبة النافذة
      // =========================================

      stopGooglePopupWatcher();

      // =========================================
      // لو المستخدم قفل نافذة Google
      // =========================================

      if (
        error.code ===
          "auth/popup-closed-by-user" ||
        error.code ===
          "auth/cancelled-popup-request"
      ) {
        // أهم جزء
        // يرجع الزر فورًا للحالة الطبيعية

        setGoogleLoading(false);

        setMessage("");
        setMessageType("");

        return;
      }

      // =========================================
      // لو Popup اتمنعت
      // =========================================

      if (
        error.code ===
        "auth/popup-blocked"
      ) {
        setGoogleLoading(false);

        showTemporaryMessage(
          "المتصفح منع نافذة Google المنبثقة.",
          "error"
        );

        return;
      }

      // =========================================
      // أي خطأ آخر
      // =========================================

      setGoogleLoading(false);

      showTemporaryMessage(
        "❌ فشل تسجيل الدخول، حاولي مرة أخرى.",
        "error"
      );
    }
  };

  // =========================================
  // تفعيل الكتاب
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredCode = code
      .trim()
      .toUpperCase();

    // =========================================
    // التأكد من الكود
    // =========================================

    if (!enteredCode) {
      showTemporaryMessage(
        "⚠️ من فضلك ادخلي كود الكتاب",
        "warning"
      );

      return;
    }

    // =========================================
    // التأكد من Google
    // =========================================

    if (!user) {
      showTemporaryMessage(
        "⚠️ سجلي الدخول بحساب Google أولًا",
        "warning"
      );

      return;
    }

    setActivationLoading(true);
    setMessage("");

    try {
      const bookRef = doc(
        db,
        "books",
        enteredCode
      );

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      // =========================================
      // Transaction
      // =========================================

      await runTransaction(
        db,
        async (transaction) => {
          const bookSnapshot =
            await transaction.get(
              bookRef
            );

          // =========================================
          // الكود غير موجود
          // =========================================

          if (!bookSnapshot.exists()) {
            throw new Error(
              "CODE_NOT_FOUND"
            );
          }

          const book =
            bookSnapshot.data();

          // =========================================
          // الكود متاح
          // =========================================

          if (
            book.status === "available"
          ) {
            transaction.update(
              bookRef,
              {
                status: "used",

                activatedBy:
                  user.uid,

                activatedEmail:
                  user.email || "",

                activatedAt:
                  serverTimestamp(),
              }
            );

            transaction.set(
              userRef,
              {
                activatedBookCode:
                  enteredCode,

                activatedAt:
                  serverTimestamp(),

                email:
                  user.email || "",

                displayName:
                  user.displayName || "",
              },
              {
                merge: true,
              }
            );

            return;
          }

          // =========================================
          // نفس الحساب يستخدم نفس الكود
          // =========================================

          if (
            book.status === "used" &&
            book.activatedBy === user.uid
          ) {
            transaction.set(
              userRef,
              {
                activatedBookCode:
                  enteredCode,

                email:
                  user.email || "",

                displayName:
                  user.displayName || "",
              },
              {
                merge: true,
              }
            );

            return;
          }

          // =========================================
          // الكود مستخدم مع حساب آخر
          // =========================================

          throw new Error(
            "CODE_ALREADY_USED"
          );
        }
      );

      // =========================================
      // نجاح التفعيل
      // =========================================

      showTemporaryMessage(
        "🎉 تم تفعيل الكتاب بنجاح!",
        "success"
      );

      setTimeout(() => {
        navigate("/home", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error(
        "Activation error:",
        error
      );

      // =========================================
      // الكود غير موجود
      // =========================================

      if (
        error.message ===
        "CODE_NOT_FOUND"
      ) {
        showTemporaryMessage(
          "❌ كود غير صحيح",
          "error"
        );
      }

      // =========================================
      // الكود مستخدم مع حساب آخر
      // =========================================

      else if (
        error.message ===
        "CODE_ALREADY_USED"
      ) {
        showTemporaryMessage(
          "⚠️ هذا الكود مستخدم من قبل",
          "warning"
        );
      }

      // =========================================
      // خطأ آخر
      // =========================================

      else {
        showTemporaryMessage(
          "❌ حدث خطأ، حاولي مجددًا",
          "error"
        );
      }

      setActivationLoading(false);
    }
  };

  // =========================================
  // الواجهة
  // =========================================

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes wildSpace1 {
            0% {
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }

            20% {
              transform: translate(70px, -60px) rotate(45deg) scale(1.1);
            }

            40% {
              transform: translate(-50px, -90px) rotate(-30deg) scale(0.95);
            }

            60% {
              transform: translate(-80px, 40px) rotate(60deg) scale(1.15);
            }

            80% {
              transform: translate(40px, 70px) rotate(-45deg) scale(1.05);
            }

            100% {
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }
          }

          @keyframes wildSpace2 {
            0% {
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }

            25% {
              transform: translate(-70px, 60px) rotate(-50deg) scale(1.15);
            }

            50% {
              transform: translate(60px, 80px) rotate(35deg) scale(0.9);
            }

            75% {
              transform: translate(80px, -50px) rotate(-20deg) scale(1.1);
            }

            100% {
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }
          }

          @keyframes wildSpace3 {
            0% {
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }

            33% {
              transform: translate(60px, 60px) rotate(40deg) scale(1.08);
            }

            66% {
              transform: translate(-70px, -60px) rotate(-40deg) scale(1.08);
            }

            100% {
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }
          }

          button,
          button:focus,
          button:active,
          button:focus-visible {
            outline: none !important;
          }
        `}
      </style>

      {/* =========================================
          الخلفية المتحركة
      ========================================= */}

      <div
        style={{
          ...styles.spaceIcon,
          top: "8%",
          left: "10%",
          animation:
            "wildSpace1 7s ease-in-out infinite",
        }}
      >
        <Gift
          size={38}
          color="#ff5c8d"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          top: "12%",
          right: "12%",
          animation:
            "wildSpace2 9s ease-in-out infinite",
        }}
      >
        <Star
          size={36}
          color="#ffb703"
          fill="#ffb703"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          bottom: "10%",
          left: "12%",
          animation:
            "wildSpace3 8s ease-in-out infinite",
        }}
      >
        <Smile
          size={38}
          color="#06d6a0"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          bottom: "12%",
          right: "10%",
          animation:
            "wildSpace1 10s ease-in-out infinite",
        }}
      >
        <Rocket
          size={36}
          color="#4ea8de"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          top: "45%",
          left: "4%",
          animation:
            "wildSpace2 6.5s ease-in-out infinite",
        }}
      >
        <Heart
          size={34}
          color="#ff006e"
          fill="#ff006e"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          top: "40%",
          right: "5%",
          animation:
            "wildSpace3 7.5s ease-in-out infinite",
        }}
      >
        <Sparkles
          size={36}
          color="#7209b7"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          top: "5%",
          left: "45%",
          animation:
            "wildSpace1 8.5s ease-in-out infinite",
        }}
      >
        <Cloud
          size={40}
          color="#48cae4"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          bottom: "6%",
          left: "45%",
          animation:
            "wildSpace2 9.5s ease-in-out infinite",
        }}
      >
        <Moon
          size={34}
          color="#7b2cbf"
          fill="#7b2cbf"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          top: "22%",
          left: "25%",
          animation:
            "wildSpace3 7s ease-in-out infinite",
        }}
      >
        <Sun
          size={34}
          color="#fb8500"
          fill="#fb8500"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          bottom: "25%",
          right: "25%",
          animation:
            "wildSpace1 8s ease-in-out infinite",
        }}
      >
        <Zap
          size={32}
          color="#ffb703"
          fill="#ffb703"
        />
      </div>

      {/* =========================================
          صفحة Google
      ========================================= */}

      {!user && !showCodeForm ? (
        <div style={styles.card}>
          <div
            style={styles.cardBubbleTop}
          />

          <div
            style={styles.cardBubbleBottom}
          />

          <div style={styles.gameIcon}>
            <Gamepad2
              size={32}
              color="#7b61c9"
            />
          </div>

          <h1 style={styles.title}>
            أهلاً بك في
            <br />

            <span
              style={styles.gradientText}
            >
              Kids Games
            </span>
          </h1>

          <p style={styles.welcomeText}>
            <Heart
              size={14}
              color="#ff6b6b"
              fill="#ff6b6b"
              style={{
                verticalAlign:
                  "middle",
                marginLeft: "4px",
              }}
            />

            عالم ممتع مليء بالألعاب
            التعليمية
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            onMouseEnter={() =>
              setGoogleHover(true)
            }
            onMouseLeave={() =>
              setGoogleHover(false)
            }
            style={{
              ...styles.googleButton,

              ...(googleHover
                ? styles.googleButtonHover
                : {}),

              ...(googleLoading
                ? {
                    opacity: 0.7,
                    cursor: "wait",
                  }
                : {}),
            }}
          >
            <span
              style={
                styles.googleIconBox
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                style={{
                  display: "block",
                }}
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />

                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.18 21.31 7.23 24 12 24z"
                />

                <path
                  fill="#FBBC05"
                  d="M5.28 14.25c-.25-.72-.38-1.5-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.43 8.15 0 9.92 1.2 12s.43 3.85 1.2 5.4l4.08-3.15z"
                />

                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.69 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"
                />
              </svg>
            </span>

            <span>
              {googleLoading
                ? "جاري تسجيل الدخول..."
                : "المتابعة باستخدام Google"}
            </span>
          </button>

          {message && (
            <div
              style={{
                ...styles.simpleMessage,

                background:
                  messageType ===
                  "warning"
                    ? "#fff8e1"
                    : "#ffebee",

                color:
                  messageType ===
                  "warning"
                    ? "#b78103"
                    : "#c62828",
              }}
            >
              {message}
            </div>
          )}
        </div>
      ) : showCodeForm ? (
        /* =========================================
           صفحة التفعيل
        ========================================= */

        <div
          style={
            styles.newActivationCard
          }
        >
          <div
            style={styles.cardGlow1}
          />

          <div
            style={styles.cardGlow2}
          />

          <div
            style={
              styles.activationIconHeader
            }
          >
            <Gamepad2
              size={28}
              color="#7209b7"
            />
          </div>

          <h1
            style={
              styles.activationWelcomeName
            }
          >
            أهلاً{" "}
            {user?.displayName ||
              "بك"}{" "}

            <Heart
              size={18}
              color="#ff006e"
              fill="#ff006e"
              style={{
                verticalAlign:
                  "middle",
                marginRight: "4px",
              }}
            />
          </h1>

          <p
            style={
              styles.activationSubtext
            }
          >
            اكتبي الكود الموجود داخل كتابك
            لفتح الألعاب التعليمية
          </p>

          <form
            onSubmit={handleSubmit}
            style={styles.activationForm}
          >
            <div
              style={styles.inputLabel}
            >
              كود الكتاب
            </div>

            <div
              style={
                styles.inputWrapperContainer
              }
            >
              {message && (
                <div
                  style={{
                    ...styles.overlayAlertBadge,

                    background:
                      messageType ===
                      "success"
                        ? "#e8f5e9"
                        : messageType ===
                          "warning"
                        ? "#fff8e1"
                        : "#ffebee",

                    color:
                      messageType ===
                      "success"
                        ? "#2e7d32"
                        : messageType ===
                          "warning"
                        ? "#b78103"
                        : "#c62828",

                    borderColor:
                      messageType ===
                      "success"
                        ? "#c8e6c9"
                        : messageType ===
                          "warning"
                        ? "#ffe082"
                        : "#ef9a9a",
                  }}
                >
                  {message}
                </div>
              )}

              <input
                type="text"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="VX-7K29-PQ81"
                style={
                  styles.softInput
                }
                maxLength={20}
                disabled={
                  activationLoading
                }
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.cuteActionButton,

                ...(buttonHover
                  ? styles.cuteActionButtonHover
                  : {}),

                ...(activationLoading
                  ? {
                      opacity: 0.7,
                      cursor: "wait",
                    }
                  : {}),
              }}
              onMouseEnter={() =>
                setButtonHover(true)
              }
              onMouseLeave={() =>
                setButtonHover(false)
              }
              disabled={
                activationLoading
              }
            >
              {activationLoading
                ? "جاري التحقق..."
                : "تفعيل الكتاب"}
            </button>
          </form>

          <div
            style={styles.smallHelpBox}
          >
            💡 ستجدين كود التفعيل المطبوع
            داخل الكتاب
          </div>
        </div>
      ) : null}
    </div>
  );
}

// =========================================
// Styles
// =========================================

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #fff0f5 0%, #e0f7fa 50%, #f3e5f5 100%)",
    direction: "rtl",
    fontFamily:
      "Arial, Tahoma, sans-serif",
  },

  spaceIcon: {
    position: "absolute",
    zIndex: 1,
    pointerEvents: "none",
    filter:
      "drop-shadow(0 6px 12px rgba(0,0,0,0.08))",
  },

  card: {
    width: "clamp(280px, 30vw, 354px)",
    boxSizing: "border-box",
    background:
      "rgba(255, 255, 255, 0.98)",
    borderRadius: "28px",
    padding: "26px 22px",
    textAlign: "center",
    position: "relative",
    zIndex: 5,
    boxShadow:
      "0 14px 38px rgba(139, 114, 232, 0.17)",
    border: "3px solid #ffffff",
    overflow: "hidden",
  },

  newActivationCard: {
    width: "clamp(290px, 31vw, 360px)",
    boxSizing: "border-box",
    background: "#ffffff",
    borderRadius: "38px",
    padding: "32px 24px",
    textAlign: "center",
    position: "relative",
    zIndex: 5,
    boxShadow:
      "0 22px 50px rgba(114, 9, 183, 0.15)",
    border: "3px solid #f8e8ff",
    overflow: "hidden",
  },

  cardGlow1: {
    position: "absolute",
    top: "-30px",
    right: "-30px",
    width: "100px",
    height: "100px",
    background:
      "linear-gradient(135deg, #ff70a6, #ff99c8)",
    borderRadius: "50%",
    opacity: 0.2,
    zIndex: 0,
  },

  cardGlow2: {
    position: "absolute",
    bottom: "-30px",
    left: "-30px",
    width: "100px",
    height: "100px",
    background:
      "linear-gradient(135deg, #7209b7, #4ea8de)",
    borderRadius: "50%",
    opacity: 0.2,
    zIndex: 0,
  },

  cardBubbleTop: {
    position: "absolute",
    top: "-20px",
    right: "-20px",
    width: "85px",
    height: "85px",
    background:
      "linear-gradient(135deg, #ffdde1, #ee9ca7)",
    borderRadius: "50%",
    opacity: 0.25,
    zIndex: 0,
  },

  cardBubbleBottom: {
    position: "absolute",
    bottom: "-25px",
    left: "-25px",
    width: "95px",
    height: "95px",
    background:
      "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    borderRadius: "50%",
    opacity: 0.25,
    zIndex: 0,
  },

  gameIcon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 12px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #fff3c4, #ffd1ec)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 5px 16px rgba(255, 150, 190, 0.24)",
    transform: "rotate(-3deg)",
    zIndex: 2,
    position: "relative",
  },

  activationIconHeader: {
    width: "58px",
    height: "58px",
    margin: "0 auto 14px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #f3c4fb, #e0aaff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 6px 18px rgba(114, 9, 183, 0.2)",
    zIndex: 2,
    position: "relative",
  },

  title: {
    margin: "0",
    color: "#7b61c9",
    fontSize:
      "clamp(21px, 4.8vw, 28px)",
    fontWeight: "800",
    lineHeight: "1.3",
    zIndex: 2,
    position: "relative",
  },

  gradientText: {
    background:
      "linear-gradient(135deg, #7b61c9, #ff78a8)",
    WebkitBackgroundClip:
      "text",
    WebkitTextFillColor:
      "transparent",
  },

  welcomeText: {
    color: "#8c879c",
    fontSize:
      "clamp(13px, 2.7vw, 15px)",
    margin: "8px 0 16px",
    fontWeight: "600",
    zIndex: 2,
    position: "relative",
  },

  activationWelcomeName: {
    margin: "0 0 6px",
    color: "#2b2d42",
    fontSize:
      "clamp(17px, 3.8vw, 20px)",
    fontWeight: "800",
    zIndex: 2,
    position: "relative",
  },

  activationSubtext: {
    color: "#7e7890",
    lineHeight: "1.4",
    fontSize:
      "clamp(12.5px, 2.7vw, 14px)",
    margin: "0 auto 18px",
    fontWeight: "600",
    zIndex: 2,
    position: "relative",
  },

  googleButton: {
    width: "fit-content",
    maxWidth: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "2px solid #d4c5ff",
    outline: "none",
    borderRadius: "14px",
    padding: "10px 18px",
    background:
      "linear-gradient(135deg, #f9f6ff, #f2ecff)",
    color: "#6b54b0",
    fontSize:
      "clamp(13px, 2.9vw, 15px)",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 4px 14px rgba(139, 114, 232, 0.12)",
    minHeight: "44px",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
    zIndex: 2,
    position: "relative",
  },

  googleButtonHover: {
    transform: "translateY(-2px)",
    boxShadow:
      "0 6px 18px rgba(139, 114, 232, 0.22)",
    background:
      "linear-gradient(135deg, #efe6ff, #e4d7ff)",
  },

  googleIconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "21px",
    height: "21px",
    background: "#ffffff",
    borderRadius: "50%",
    boxShadow:
      "0 2px 5px rgba(0,0,0,0.04)",
  },

  simpleMessage: {
    marginTop: "14px",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
  },

  activationForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "88%",
    margin: "0 auto",
    zIndex: 2,
    position: "relative",
  },

  inputLabel: {
    alignSelf: "stretch",
    textAlign: "right",
    marginBottom: "6px",
    color: "#6200ee",
    fontWeight: "800",
    fontSize: "17px",
  },

  inputWrapperContainer: {
    position: "relative",
    width: "100%",
    marginBottom: "14px",
  },

  overlayAlertBadge: {
    position: "absolute",
    top: "-12px",
    left: "14px",
    right: "14px",
    zIndex: 10,
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "11.5px",
    fontWeight: "800",
    textAlign: "center",
    border: "1.5px solid",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",
    pointerEvents: "none",
  },

  softInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px 11px",
    border: "2px solid #e0aaff",
    borderRadius: "14px",
    fontSize:
      "clamp(14px, 3vw, 16px)",
    fontWeight: "600",
    textAlign: "center",
    direction: "ltr",
    outline: "none",
    background: "#fbf8fe",
    color: "#9d81ba",
    minHeight: "44px",
    boxShadow:
      "inset 0 1px 3px rgba(0,0,0,0.02)",
  },

  cuteActionButton: {
    width: "100%",
    margin: "0 auto",
    border: "none",
    outline: "none",
    borderRadius: "14px",
    padding: "12px 18px",
    background:
      "linear-gradient(135deg, #7209b7, #ff006e)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 5px 16px rgba(114, 9, 183, 0.28)",
    minHeight: "46px",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
    zIndex: 2,
    position: "relative",
  },

  cuteActionButtonHover: {
    transform: "translateY(-2px)",
    boxShadow:
      "0 7px 20px rgba(114, 9, 183, 0.38)",
  },

  smallHelpBox: {
    margin: "14px auto 0 auto",
    width: "fit-content",
    maxWidth: "100%",
    padding: "7px 12px",
    borderRadius: "10px",
    background: "#fff9e6",
    color: "#997b14",
    fontSize:
      "clamp(11.5px, 2.4vw, 13px)",
    lineHeight: "1.4",
    fontWeight: "600",
    zIndex: 2,
    position: "relative",
  },
};

export default Activation;