import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";

import app, { db } from "../firebase/config";

// أيقونات كيوت ومنوعة
import {
  ShieldCheck,
  KeyRound,
  BookOpen,
  BarChart3,
  LogOut,
  Star,
  Gift,
  Smile,
  Rocket,
  Download,
  PlusCircle,
} from "lucide-react";

const auth = getAuth(app);

// UID الخاص بحساب الأدمن فقط
const ADMIN_UID = "hyQ6pPXvEEZSUCagu8ekNhhaXga2";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeSection, setActiveSection] = useState("");

  const [quantity, setQuantity] = useState(5);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [generating, setGenerating] = useState(false);

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    used: 0,
  });

  const [generalMessage, setGeneralMessage] = useState("");

  // =========================================================
  // التحقق من جلسة الأدمن عند فتح الصفحة أو عمل Refresh
  // =========================================================
  useEffect(() => {
    // حذف كلمة السر القديمة إذا كانت محفوظة من النسخة السابقة
    localStorage.removeItem("admin_password");

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (
          currentUser &&
          currentUser.uid === ADMIN_UID
        ) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }

        setCheckingAuth(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // تسجيل الدخول
  // =========================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setGeneralMessage("");
    setLoading(true);

    try {
      // تثبيت جلسة Firebase بعد Refresh
      await setPersistence(
        auth,
        browserLocalPersistence
      );

      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      // التأكد أن الحساب هو الأدمن فقط
      if (
        credential.user.uid !== ADMIN_UID
      ) {
        await signOut(auth);

        setEmailError(
          "❌ هذا الحساب غير مصرح له بدخول لوحة التحكم"
        );

        setTimeout(() => {
          setEmailError("");
        }, 3000);

        return;
      }

      setLoggedIn(true);

      // عدم الاحتفاظ بكلمة السر في الذاكرة المحلية
      setPassword("");
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found"
      ) {
        setEmailError(
          "❌ البريد الإلكتروني غير صحيح أو غير مسجل"
        );
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setPasswordError(
          "❌ كلمة المرور غير صحيحة"
        );
      } else {
        setEmailError(
          "❌ خطأ في البريد الإلكتروني"
        );

        setPasswordError(
          "❌ خطأ في كلمة المرور"
        );
      }

      setTimeout(() => {
        setEmailError("");
        setPasswordError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // إنشاء كود
  // =========================================================
  const generateCode = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length
      );

      code += characters[randomIndex];
    }

    return `VX-${code.slice(0, 4)}-${code.slice(4)}`;
  };

  // =========================================================
  // تحديث الإحصائيات
  // =========================================================
  const loadStats = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "books")
      );

      let available = 0;
      let used = 0;

      snapshot.forEach((item) => {
        const data = item.data();

        if (data.status === "used") {
          used++;
        } else {
          available++;
        }
      });

      setStats({
        total: snapshot.size,
        available,
        used,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================================
  // إنشاء الأكواد
  // =========================================================
  const handleGenerateCodes = async () => {
    const amount = Number(quantity);

    if (
      !amount ||
      amount < 1 ||
      amount > 10000
    ) {
      setGeneralMessage(
        "⚠️ اكتبي عددًا من 1 إلى 10000"
      );

      return;
    }

    setGenerating(true);
    setGeneralMessage("");
    setGeneratedCodes([]);

    try {
      const snapshot = await getDocs(
        collection(db, "books")
      );

      const existingCodes = new Set();
      const existingBookNumbers = new Set();

      snapshot.forEach((item) => {
        const data = item.data();

        if (data.code) {
          existingCodes.add(data.code);
        }

        existingCodes.add(item.id);

        if (data.bookNumber) {
          existingBookNumbers.add(
            Number(data.bookNumber)
          );
        }
      });

      let maxBookNumber = 0;

      existingBookNumbers.forEach(
        (number) => {
          if (number > maxBookNumber) {
            maxBookNumber = number;
          }
        }
      );

      const newCodes = [];

      while (newCodes.length < amount) {
        const code = generateCode();

        if (!existingCodes.has(code)) {
          existingCodes.add(code);
          newCodes.push(code);
        }
      }

      const startingNumber =
        maxBookNumber + 1;

      for (
        let start = 0;
        start < newCodes.length;
        start += 500
      ) {
        const batch = writeBatch(db);

        const chunk = newCodes.slice(
          start,
          start + 500
        );

        chunk.forEach(
          (code, index) => {
            const bookNumber =
              startingNumber +
              start +
              index;

            const bookRef = doc(
              db,
              "books",
              code
            );

            batch.set(bookRef, {
              code: code,
              status: "available",
              bookNumber:
                String(
                  bookNumber
                ).padStart(4, "0"),
              createdAt:
                new Date().toISOString(),
            });
          }
        );

        await batch.commit();
      }

      setGeneratedCodes(newCodes);

      setGeneralMessage(
        `🎉 تم إنشاء ${newCodes.length} كود بنجاح!`
      );

      await loadStats();
    } catch (error) {
      console.error(error);

      setGeneralMessage(
        "❌ حصل خطأ أثناء إنشاء الأكواد. تأكدي من اتصال Firebase."
      );
    } finally {
      setGenerating(false);
    }
  };

  // =========================================================
  // تحميل الكتب
  // =========================================================
  const loadBooks = async () => {
    setLoadingBooks(true);
    setGeneralMessage("");

    try {
      const snapshot = await getDocs(
        collection(db, "books")
      );

      const list = [];

      snapshot.forEach((item) => {
        list.push({
          id: item.id,
          ...item.data(),
        });
      });

      list.sort(
        (a, b) =>
          Number(a.bookNumber || 0) -
          Number(b.bookNumber || 0)
      );

      setBooks(list);

      let available = 0;
      let used = 0;

      list.forEach((book) => {
        if (book.status === "used") {
          used++;
        } else {
          available++;
        }
      });

      setStats({
        total: list.length,
        available,
        used,
      });
    } catch (error) {
      console.error(error);

      setGeneralMessage(
        "❌ حصل خطأ أثناء تحميل الكتب."
      );
    } finally {
      setLoadingBooks(false);
    }
  };

  const openCodes = () => {
    setActiveSection("codes");
    setGeneralMessage("");
  };

  const openBooks = async () => {
    setActiveSection("books");
    await loadBooks();
  };

  const openStats = async () => {
    setActiveSection("stats");
    await loadStats();
  };

  // =========================================================
  // تسجيل الخروج
  // =========================================================
  const handleLogout = async () => {
    try {
      await signOut(auth);

      setLoggedIn(false);
      setActiveSection("");
      setGeneratedCodes([]);
      setGeneralMessage("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================================
  // تصدير الأكواد
  // =========================================================
  const handleExportCodes = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "books")
      );

      // التصدير للمطبعة:
      // رقم الكتاب + الكود فقط
      // بدون الحالة / available
      const rows = [
        [
          "رقم الكتاب",
          "الكود",
        ],
      ];

      snapshot.forEach((item) => {
        const data = item.data();

        rows.push([
          data.bookNumber || "",
          data.code || "",
        ]);
      });

      rows.splice(
        1,
        rows.length - 1,
        ...rows
          .slice(1)
          .sort(
            (a, b) =>
              Number(a[0] || 0) -
              Number(b[0] || 0)
          )
      );

      const csvContent =
        "\uFEFF" +
        rows
          .map((row) =>
            row
              .map(
                (cell) =>
                  `"${String(
                    cell
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(",")
          )
          .join("\n");

      const blob = new Blob(
        [csvContent],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "Kids-Games-Book-Codes.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setGeneralMessage(
        "📥 تم تصدير الأكواد بنجاح!"
      );
    } catch (error) {
      console.error(error);

      setGeneralMessage(
        "❌ حصل خطأ أثناء تصدير الأكواد."
      );
    }
  };

  // =========================================================
  // الأيقونات الخلفية
  // =========================================================
  const renderSpaceIcons = () => (
    <>
      <div
        style={{
          ...styles.spaceIcon,
          top: "8%",
          left: "6%",
          animation:
            "wildSpace1 8s ease-in-out infinite",
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
          right: "8%",
          animation:
            "wildSpace2 10s ease-in-out infinite",
        }}
      >
        <Star
          size={34}
          color="#ffb703"
          fill="#ffb703"
        />
      </div>

      <div
        style={{
          ...styles.spaceIcon,
          bottom: "10%",
          left: "10%",
          animation:
            "wildSpace3 9s ease-in-out infinite",
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
          right: "6%",
          animation:
            "wildSpace1 11s ease-in-out infinite",
        }}
      >
        <Rocket
          size={36}
          color="#4ea8de"
        />
      </div>
    </>
  );

  // =========================================================
  // شاشة التحقق من الجلسة
  // =========================================================
  if (checkingAuth) {
    return (
      <div style={styles.page}>
        <style>
          {styles.keyframesStyle}
        </style>

        {renderSpaceIcons()}

        <div
          className="responsive-card"
          style={styles.loginCard}
        >
          <div style={styles.gameIcon}>
            <ShieldCheck
              size={28}
              color="#7b61c9"
            />
          </div>

          <h1 style={styles.loginTitle}>
            لوحة تحكم <br />

            <span
              style={styles.gradientText}
            >
              Kids Games
            </span>
          </h1>

          <p style={styles.subtitle}>
            جاري التحقق من الدخول...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // شاشة تسجيل الدخول
  // =========================================================
  if (!loggedIn) {
    return (
      <div style={styles.page}>
        <style>
          {styles.keyframesStyle}
        </style>

        {renderSpaceIcons()}

        <div
          className="responsive-card"
          style={styles.loginCard}
        >
          <div style={styles.gameIcon}>
            <ShieldCheck
              size={28}
              color="#7b61c9"
            />
          </div>

          <h1 style={styles.loginTitle}>
            لوحة تحكم <br />

            <span
              style={styles.gradientText}
            >
              Kids Games
            </span>
          </h1>

          <p style={styles.subtitle}>
            تسجيل دخول المسؤول
          </p>

          <form onSubmit={handleLogin}>
            <div
              style={
                styles.inputContainer
              }
            >
              {emailError && (
                <div
                  style={
                    styles.floatingError
                  }
                >
                  {emailError}
                </div>
              )}

              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => {
                  setEmail(
                    e.target.value
                  );
                  setEmailError("");
                }}
                style={{
                  ...styles.input,
                  borderColor:
                    emailError
                      ? "#c62828"
                      : "#e0aaff",
                }}
                required
              />
            </div>

            <div
              style={
                styles.inputContainer
              }
            >
              {passwordError && (
                <div
                  style={
                    styles.floatingError
                  }
                >
                  {passwordError}
                </div>
              )}

              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  );
                  setPasswordError("");
                }}
                style={{
                  ...styles.input,
                  borderColor:
                    passwordError
                      ? "#c62828"
                      : "#e0aaff",
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={
                styles.loginButton
              }
            >
              {loading
                ? "جاري الدخول..."
                : "دخول النظام"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================
  // لوحة التحكم الرئيسية
  // =========================================================
  return (
    <div style={styles.page}>
      <style>
        {styles.keyframesStyle}
      </style>

      {renderSpaceIcons()}

      <div
        className="responsive-dashboard"
        style={styles.dashboard}
      >
        {/* الهيدر */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              لوحة التحكم{" "}
              <span
                style={styles.gradientText}
              >
                🎮
              </span>
            </h1>

            <p
              style={styles.headerText}
            >
              إدارة أكواد وكتب Kids Games
              بكل سلاسة
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={
              styles.logoutButton
            }
          >
            <LogOut size={16} />
            خروج
          </button>
        </header>

        {/* الكروت الرئيسية */}
        <div style={styles.cards}>
          <button
            onClick={openCodes}
            style={styles.card}
          >
            <div
              style={
                styles.cardIconBox
              }
            >
              <KeyRound
                size={26}
                color="#7209b7"
              />
            </div>

            <span
              style={styles.cardTitle}
            >
              أكواد الكتب
            </span>

            <span
              style={styles.cardText}
            >
              إنشاء وإدارة التفعيل
            </span>
          </button>

          <button
            onClick={openBooks}
            style={styles.card}
          >
            <div
              style={
                styles.cardIconBox
              }
            >
              <BookOpen
                size={26}
                color="#4ea8de"
              />
            </div>

            <span
              style={styles.cardTitle}
            >
              الكتب
            </span>

            <span
              style={styles.cardText}
            >
              عرض جميع الكتب
            </span>
          </button>

          <button
            onClick={openStats}
            style={styles.card}
          >
            <div
              style={
                styles.cardIconBox
              }
            >
              <BarChart3
                size={26}
                color="#ff006e"
              />
            </div>

            <span
              style={styles.cardTitle}
            >
              الإحصائيات
            </span>

            <span
              style={styles.cardText}
            >
              حالة الاستخدام
            </span>
          </button>
        </div>

        {/* الرسائل العامة */}
        {generalMessage && (
          <div style={styles.message}>
            {generalMessage}
          </div>
        )}

        {/* قسم الأكواد */}
        {activeSection ===
          "codes" && (
          <section
            style={styles.section}
          >
            <h2
              style={
                styles.sectionTitle
              }
            >
              إنشاء وإدارة أكواد الكتب
            </h2>

            <p
              style={
                styles.sectionText
              }
            >
              اكتبي عدد الأكواد المراد
              إنشاؤها (من 1 إلى 10000).
            </p>

            <div
              style={styles.controls}
              className="controls-row"
            >
              <input
                type="number"
                min="1"
                max="10000"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
                style={
                  styles.quantityInput
                }
              />

              <button
                onClick={
                  handleGenerateCodes
                }
                disabled={generating}
                style={
                  styles.primaryButton
                }
              >
                <PlusCircle size={18} />

                {generating
                  ? "جاري الإنشاء..."
                  : "إنشاء الأكواد"}
              </button>

              <button
                onClick={
                  handleExportCodes
                }
                style={
                  styles.secondaryButton
                }
              >
                <Download size={18} />

                تصدير (CSV)
              </button>
            </div>

            {generatedCodes.length >
              0 && (
              <div
                style={
                  styles.generatedBox
                }
              >
                <h3
                  style={
                    styles.generatedTitle
                  }
                >
                  🎉 الأكواد التي تم
                  إنشاؤها:
                </h3>

                <div
                  style={
                    styles.codesGrid
                  }
                >
                  {generatedCodes.map(
                    (code, index) => (
                      <div
                        key={code}
                        style={
                          styles.codeItem
                        }
                      >
                        <span
                          style={{
                            color:
                              "#9d81ba",
                            fontSize:
                              "13px",
                          }}
                        >
                          {index + 1}.
                        </span>

                        <strong
                          style={{
                            direction:
                              "ltr",
                            color:
                              "#2b2d42",
                            fontSize:
                              "14px",
                          }}
                        >
                          {code}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* قسم الكتب */}
        {activeSection ===
          "books" && (
          <section
            style={styles.section}
          >
            <h2
              style={
                styles.sectionTitle
              }
            >
              قائمة الكتب
            </h2>

            <p
              style={
                styles.sectionText
              }
            >
              استعراضي جميع الكتب وأكوادها
              المسجلة.
            </p>

            {loadingBooks ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#8c879c",
                  fontSize: "15px",
                  fontWeight:
                    "bold",
                }}
              >
                جاري تحميل الكتب...
                🌸
              </p>
            ) : books.length ===
              0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#8c879c",
                  fontSize: "15px",
                  fontWeight:
                    "bold",
                }}
              >
                لا توجد كتب حالياً.
              </p>
            ) : (
              <div
                style={
                  styles.tableWrapper
                }
              >
                <table
                  style={styles.table}
                >
                  <thead>
                    <tr>
                      <th
                        style={styles.th}
                      >
                        رقم الكتاب
                      </th>

                      <th
                        style={styles.th}
                      >
                        الكود
                      </th>

                      <th
                        style={styles.th}
                      >
                        الحالة
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {books.map(
                      (book) => (
                        <tr
                          key={book.id}
                        >
                          <td
                            style={
                              styles.td
                            }
                          >
                            {
                              book.bookNumber
                            }
                          </td>

                          <td
                            style={{
                              ...styles.td,
                              direction:
                                "ltr",
                              fontWeight:
                                "bold",
                              color:
                                "#7209b7",
                              fontSize:
                                "14px",
                            }}
                          >
                            {book.code}
                          </td>

                          <td
                            style={
                              styles.td
                            }
                          >
                            <span
                              style={{
                                ...styles.statusBadge,
                                background:
                                  book.status ===
                                  "used"
                                    ? "#ffebee"
                                    : "#e8f5e9",
                                color:
                                  book.status ===
                                  "used"
                                    ? "#c62828"
                                    : "#2e7d32",
                              }}
                            >
                              {book.status ===
                              "used"
                                ? "🔒 مستخدم"
                                : "🔓 متاح"}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* قسم الإحصائيات */}
        {activeSection ===
          "stats" && (
          <section
            style={styles.section}
          >
            <h2
              style={
                styles.sectionTitle
              }
            >
              إحصائيات النظام
            </h2>

            <p
              style={
                styles.sectionText
              }
            >
              نظرة عامة على حالة الأكواد
              المتاحة والمستخدمة.
            </p>

            <div
              style={styles.statsGrid}
            >
              <div
                style={
                  styles.statCard
                }
              >
                <span
                  style={
                    styles.statIcon
                  }
                >
                  📚
                </span>

                <strong
                  style={
                    styles.statNumber
                  }
                >
                  {stats.total}
                </strong>

                <span
                  style={
                    styles.statLabel
                  }
                >
                  إجمالي الكتب
                </span>
              </div>

              <div
                style={
                  styles.statCard
                }
              >
                <span
                  style={
                    styles.statIcon
                  }
                >
                  🔓
                </span>

                <strong
                  style={{
                    ...styles.statNumber,
                    color:
                      "#2e7d32",
                  }}
                >
                  {stats.available}
                </strong>

                <span
                  style={
                    styles.statLabel
                  }
                >
                  أكواد متاحة
                </span>
              </div>

              <div
                style={
                  styles.statCard
                }
              >
                <span
                  style={
                    styles.statIcon
                  }
                >
                  🔒
                </span>

                <strong
                  style={{
                    ...styles.statNumber,
                    color:
                      "#c62828",
                  }}
                >
                  {stats.used}
                </strong>

                <span
                  style={
                    styles.statLabel
                  }
                >
                  أكواد مستخدمة
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {
  keyframesStyle: `
    html, body {
      overflow-y: auto !important;
      height: auto !important;
      min-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    @keyframes wildSpace1 {
      0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
      50% { transform: translate(20px, -20px) rotate(15deg) scale(1.05); }
      100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
    }

    @keyframes wildSpace2 {
      0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
      50% { transform: translate(-20px, 20px) rotate(-15deg) scale(1.05); }
      100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
    }

    @keyframes wildSpace3 {
      0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
      50% { transform: translate(15px, 15px) rotate(10deg) scale(1.05); }
      100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-5px); }
      20% { opacity: 1; transform: translateY(0); }
      80% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-5px); }
    }

    button, button:focus, button:active, button:focus-visible, input:focus {
      outline: none !important;
    }

    @media (max-width: 600px) {
      .responsive-dashboard {
        max-width: 430px !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
      }

      .responsive-card {
        max-width: 330px !important;
        padding: 24px 16px !important;
      }

      .controls-row {
        flex-wrap: nowrap !important;
        gap: 6px !important;
      }

      .controls-row input {
        width: 75px !important;
        padding: 10px 8px !important;
        font-size: 13px !important;
      }

      .controls-row button {
        padding: 10px 10px !important;
        font-size: 12px !important;
        flex: 1;
        justify-content: center !important;
        white-space: nowrap !important;
      }
    }
  `,

  page: {
    minHeight: "100vh",
    height: "auto",
    width: "100%",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #fff0f5 0%, #e0f7fa 50%, #f3e5f5 100%)",
    padding: "30px 20px",
    direction: "rtl",
    fontFamily:
      "Arial, Tahoma, sans-serif",
    position: "relative",
    overflowY: "auto",
  },

  spaceIcon: {
    position: "absolute",
    zIndex: 1,
    pointerEvents: "none",
    filter:
      "drop-shadow(0 4px 8px rgba(0,0,0,0.08))",
  },

  dashboard: {
    width: "100%",
    maxWidth: "750px",
    margin: "0 auto",
    position: "relative",
    zIndex: 5,
    paddingBottom: "120px",
    overflow: "visible",
  },

  loginCard: {
    width: "100%",
    maxWidth: "400px",
    margin: "8vh auto",
    background: "#ffffff",
    padding: "35px 30px",
    borderRadius: "20px",
    boxSizing: "border-box",
    boxShadow:
      "0 12px 35px rgba(114, 9, 183, 0.1)",
    border: "2px solid #f8e8ff",
    textAlign: "center",
    position: "relative",
    zIndex: 5,
  },

  gameIcon: {
    width: "50px",
    height: "50px",
    margin: "0 auto 15px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #f3c4fb, #e0aaff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 6px 15px rgba(114, 9, 183, 0.15)",
  },

  loginTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
    fontWeight: "800",
    color: "#2b2d42",
  },

  gradientText: {
    background:
      "linear-gradient(135deg, #7b61c9, #ff006e)",
    WebkitBackgroundClip:
      "text",
    WebkitTextFillColor:
      "transparent",
  },

  subtitle: {
    marginBottom: "22px",
    color: "#8c879c",
    fontSize: "14px",
    fontWeight: "600",
  },

  inputContainer: {
    marginBottom: "15px",
    position: "relative",
    textAlign: "right",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border: "2px solid #e0aaff",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    background: "#fbf8fe",
    color: "#7209b7",
  },

  floatingError: {
    position: "absolute",
    top: "-12px",
    right: "15px",
    background: "#ffebee",
    color: "#c62828",
    padding: "3px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "800",
    border: "1px solid #ffcdd2",
    boxShadow:
      "0 2px 6px rgba(198, 40, 40, 0.15)",
    zIndex: 10,
    animation:
      "fadeInOut 3s ease forwards",
  },

  loginButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #7209b7, #ff006e)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 6px 20px rgba(114, 9, 183, 0.25)",
    marginTop: "5px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "22px",
    background:
      "rgba(255, 255, 255, 0.95)",
    padding: "20px 25px",
    borderRadius: "18px",
    boxShadow:
      "0 8px 25px rgba(114, 9, 183, 0.05)",
    border: "2px solid #f8e8ff",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#2b2d42",
  },

  headerText: {
    margin: "6px 0 0",
    color: "#8c879c",
    fontSize: "14px",
    fontWeight: "600",
  },

  logoutButton: {
    border: "2px solid #f8d7da",
    borderRadius: "12px",
    padding: "10px 18px",
    background: "#fff5f5",
    color: "#c62828",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
    marginBottom: "22px",
  },

  card: {
    border: "2px solid #f8e8ff",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px 15px",
    minHeight: "120px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow:
      "0 6px 20px rgba(114, 9, 183, 0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  cardIconBox: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#f8f2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#2b2d42",
  },

  cardText: {
    color: "#8c879c",
    fontSize: "12px",
    fontWeight: "600",
  },

  message: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "14px 18px",
    borderRadius: "12px",
    marginBottom: "22px",
    fontSize: "15px",
    fontWeight: "800",
    border: "2px solid #c8e6c9",
    textAlign: "center",
  },

  section: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    boxSizing: "border-box",
    boxShadow:
      "0 10px 30px rgba(114, 9, 183, 0.06)",
    border: "2px solid #f8e8ff",
    marginBottom: "22px",
    width: "100%",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "6px",
    fontSize: "20px",
    fontWeight: "800",
    color: "#2b2d42",
  },

  sectionText: {
    color: "#8c879c",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "18px",
  },

  controls: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "15px",
  },

  quantityInput: {
    width: "110px",
    boxSizing: "border-box",
    padding: "11px 14px",
    border: "2px solid #e0aaff",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    background: "#fbf8fe",
    color: "#7209b7",
  },

  primaryButton: {
    border: "none",
    borderRadius: "12px",
    padding: "11px 18px",
    background:
      "linear-gradient(135deg, #7209b7, #ff006e)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow:
      "0 4px 15px rgba(114, 9, 183, 0.2)",
  },

  secondaryButton: {
    border: "2px solid #e0aaff",
    borderRadius: "12px",
    padding: "11px 18px",
    background: "#fbf8fe",
    color: "#7209b7",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  generatedBox: {
    marginTop: "18px",
    padding: "15px 18px",
    borderRadius: "14px",
    background: "#fbf8fe",
    border: "2px solid #f3e5f5",
  },

  generatedTitle: {
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "15px",
    fontWeight: "800",
    color: "#7209b7",
  },

  codesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
    maxHeight: "220px",
    overflowY: "auto",
  },

  codeItem: {
    background: "#fff",
    border: "2px solid #f0e6ff",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "12px",
    border: "2px solid #f3e5f5",
  },

  table: {
    width: "100%",
    minWidth: "450px",
    borderCollapse: "collapse",
    textAlign: "center",
    background: "#fff",
  },

  th: {
    background: "#fbf8fe",
    padding: "12px",
    whiteSpace: "nowrap",
    fontWeight: "800",
    color: "#7209b7",
    borderBottom:
      "2px solid #f3e5f5",
    fontSize: "14px",
  },

  td: {
    padding: "12px",
    borderBottom:
      "1px solid #f8f0ff",
    whiteSpace: "nowrap",
    fontSize: "14px",
    color: "#4a4e69",
    fontWeight: "600",
  },

  statusBadge: {
    padding: "5px 12px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: "800",
    display: "inline-block",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
  },

  statCard: {
    background: "#fbf8fe",
    border: "2px solid #f3e5f5",
    borderRadius: "16px",
    padding: "20px 15px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    boxShadow:
      "0 4px 15px rgba(114, 9, 183, 0.04)",
  },

  statIcon: {
    fontSize: "24px",
    marginBottom: "4px",
  },

  statNumber: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#7209b7",
  },

  statLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#8c879c",
  },
};

export default Admin;