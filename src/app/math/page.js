

"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const defaultQuiz = {
  title: "Adding and Subtracting Positive and Negative Fractions",
  passingPercentage: 70,
  questions: [
    {
      id: 1,
      question: "What is the value of -2 5/6 + 3 2/3?",
      options: ["6 1/2", "2 1/3", "-6 1/2", "5/6"],
      correctAnswer: "5/6",
      explanation:
        "Convert the mixed fractions to improper fractions and use a common denominator.",
    },
    {
      id: 2,
      question: "What is the value of -7 3/5 - 8 1/8?",
      options: ["16 29/40", "-15 29/40", "2 29/40", "-6 1/2"],
      correctAnswer: "-15 29/40",
      explanation:
        "Convert the mixed numbers to improper fractions before subtracting.",
    },
    {
      id: 3,
      question: "What is the value of 13/25 + 2/5?",
      options: ["3/25", "23/25", "-23/25", "-3/25"],
      correctAnswer: "23/25",
      explanation: "Convert 2/5 to 10/25 before adding.",
    },
  ],
};

const styles = {
  page: "min-h-screen bg-slate-50 text-slate-900",
  container: "mx-auto max-w-6xl px-4 py-8 md:px-8",
  card: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7",
  primary:
    "rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50",
  muted: "text-sm text-slate-500",
};

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function cellText(value) {
  return value == null ? "" : String(value).trim();
}

function parseQuizRows(rows) {
  const questions = [];
  const errors = [];

  if (!rows.length) {
    return {
      questions: [],
      errors: ["The spreadsheet has no question rows."],
    };
  }

  const headers = Object.keys(rows[0] || {});
  const headerMap = new Map(
    headers.map((header) => [normalizeHeader(header), header])
  );

  const getValue = (row, ...names) => {
    for (const name of names) {
      const originalHeader = headerMap.get(normalizeHeader(name));
      if (originalHeader !== undefined) {
        return cellText(row[originalHeader]);
      }
    }
    return "";
  };

  const questionHeader = ["question", "questions", "problem"].some(
    (name) => headerMap.has(normalizeHeader(name))
  );

  if (!questionHeader) {
    return {
      questions: [],
      errors: [
        "Missing question column. Check that your first row contains column headings.",
      ],
    };
  }

  rows.forEach((row, index) => {
    const question = getValue(row, "question", "questions", "problem");

    // Ignore completely blank spreadsheet rows.
    if (!question && Object.values(row).every((v) => !cellText(v))) {
      return;
    }

    const options = [
      getValue(row, "option1", "option 1", "optiona", "option a", "a"),
      getValue(row, "option2", "option 2", "optionb", "option b", "b"),
      getValue(row, "option3", "option 3", "optionc", "option c", "c"),
      getValue(row, "option4", "option 4", "optiond", "option d", "d"),
    ];

    const correctAnswer = getValue(
      row,
      "correctAnswer",
      "correct answer",
      "answer"
    );

    const rowErrors = [];

    if (!question) rowErrors.push("question is missing");

    if (options.some((option) => !option)) {
      rowErrors.push("all four options are required");
    }

    if (!correctAnswer) {
      rowErrors.push("correctAnswer is missing");
    } else if (
      !options.some(
        (option) => option.toLowerCase() === correctAnswer.toLowerCase()
      )
    ) {
      rowErrors.push("correctAnswer must match one of the four options");
    }

    if (rowErrors.length) {
      errors.push(`Row ${index + 2}: ${rowErrors.join("; ")}.`);
      return;
    }

    questions.push({
      id: questions.length + 1,
      question,
      options,
      correctAnswer: options.find(
        (option) => option.toLowerCase() === correctAnswer.toLowerCase()
      ),
      explanation: getValue(row, "explanation", "solution", "working"),
    });
  });

  if (!questions.length && !errors.length) {
    errors.push("No valid questions were found in the spreadsheet.");
  }

  return { questions, errors };
}

export default function QuizPlatform() {
  const [role, setRole] = useState(null);
  const [studentView, setStudentView] = useState("overview");
  const [studentName, setStudentName] = useState("");
  const [studentNameInput, setStudentNameInput] = useState("");
  const [studentPinInput, setStudentPinInput] = useState("");
  const [studentAuthMode, setStudentAuthMode] = useState("login");
  const [studentAuthError, setStudentAuthError] = useState("");
  const [studentAuthBusy, setStudentAuthBusy] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [teacherLoginBusy, setTeacherLoginBusy] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState(false);
  const [deleteResultsToo, setDeleteResultsToo] = useState(false);
  const [platformMessage, setPlatformMessage] = useState("");
  const [teacherNameInput, setTeacherNameInput] = useState("");
  const [teacherAuthorized, setTeacherAuthorized] = useState(false);
  const [teacherLoginError, setTeacherLoginError] = useState("");
  const [studentResults, setStudentResults] = useState([]);

  const [publishedQuiz, setPublishedQuiz] = useState(null);
  const [draftQuiz, setDraftQuiz] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const [difficultyLevel, setDifficultyLevel] = useState("Beginner");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [aiExplanation, setAIExplanation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function loadSharedPlatform() {
      try {
        const [sessionResponse, quizResponse] = await Promise.all([
          fetch("/api/platform?action=session", { cache: "no-store" }),
          fetch("/api/platform?action=quiz", { cache: "no-store" }),
        ]);
        const sessionData = await sessionResponse.json();
        const quizData = await quizResponse.json();
        if (cancelled) return;
        const user = sessionData?.user;
        if (user?.role === "student") {
          setRole("student");
          setStudentName(user.username);
          setStudentNameInput(user.username);
          setStudentId(user.id);
        } else if (user?.role === "teacher") {
          setRole("teacher");
          setTeacherAuthorized(true);
          loadTeacherResults();
        }
        const rawQuiz = quizData?.quiz;
        if (rawQuiz && Array.isArray(rawQuiz.questions)) {
          setPublishedQuiz({
            ...rawQuiz,
            passingPercentage: Number(rawQuiz.passing_percentage ?? rawQuiz.passingPercentage ?? 70),
          });
        } else {
          setPublishedQuiz(null);
        }
      } catch {
        if (!cancelled) setPlatformMessage("Could not connect to the shared platform. Please refresh and try again.");
      }
    }
    loadSharedPlatform();
    return () => { cancelled = true; };
  }, []);

  const loadTeacherResults = async () => {
    try {
      const response = await fetch("/api/platform?action=results", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not load results.");
      const rows = Array.isArray(data.results) ? data.results : [];
      setStudentResults(rows.map((item) => ({
        ...item,
        studentName: item.student_username ?? item.studentName ?? "Student",
        quizTitle: item.quiz_title ?? item.quizTitle ?? "Quiz",
        totalQuestions: item.total_questions ?? item.totalQuestions ?? 0,
        completedAt: item.completed_at ?? item.completedAt ?? null,
      })));
    } catch (error) {
      setPlatformMessage(error.message || "Could not load student results.");
    }
  };

  const activeQuiz = publishedQuiz || defaultQuiz;
  const questions = activeQuiz.questions;
  const question = questions[currentQuestion];

  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const saveProgress = (progress) => {
    if (!studentId || !activeQuiz?.id) return;
    fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save-progress", quizId: activeQuiz.id, progress }),
    }).catch(() => {});
  };

  const handleStudentLogin = async (event) => {
    event.preventDefault();
    setStudentAuthError("");
    setStudentAuthBusy(true);
    try {
      const response = await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: studentAuthMode === "register" ? "register" : "login",
          username: studentNameInput.trim(),
          pin: studentPinInput,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Student sign-in failed.");
      setStudentName(data.user.username);
      setStudentNameInput(data.user.username);
      setStudentId(data.user.id);
      setStudentPinInput("");
      setStudentAuthError("");
      setStudentView("overview");
      resetAttempt();
    } catch (error) {
      setStudentAuthError(error.message || "Could not sign in.");
    } finally {
      setStudentAuthBusy(false);
    }
  };

  const handleTeacherLogin = async (event) => {
    event.preventDefault();
    setTeacherLoginBusy(true);
    setTeacherLoginError("");
    try {
      const response = await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "teacher-login", password: teacherNameInput }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Teacher login failed.");
      setTeacherAuthorized(true);
      await loadTeacherResults();
    } catch (error) {
      setTeacherLoginError(error.message || "Access denied.");
    } finally {
      setTeacherLoginBusy(false);
    }
  };

  const resetAttempt = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
    setAnswers([]);
    setDifficultyLevel("Beginner");
    setCorrectStreak(0);
    setAIExplanation("");
    setAchievements([]);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    // Allow the teacher to upload the same file again.
    event.target.value = "";

    if (!file) return;

    setUploading(true);
    setUploadErrors([]);
    setUploadMessage("");
    setDraftQuiz(null);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (!["xlsx", "xls", "csv"].includes(extension)) {
        throw new Error("Please upload an .xlsx, .xls, or .csv file.");
      }

      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        raw: false,
      });

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!firstSheet) {
        throw new Error("No worksheet was found in this file.");
      }

      const rows = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
        raw: false,
      });

      const result = parseQuizRows(rows);

      setUploadErrors(result.errors);

      if (!result.questions.length || result.errors.length) {
        return;
      }

      setDraftQuiz({
        title: file.name.replace(/\.(xlsx|xls|csv)$/i, ""),
        passingPercentage: 70,
        questions: result.questions,
      });

      setUploadMessage(
        `Loaded ${result.questions.length} questions. Review them before publishing.`
      );
    } catch (error) {
      setUploadErrors([
        error instanceof Error
          ? error.message
          : "The spreadsheet could not be read.",
      ]);
    } finally {
      setUploading(false);
    }
  };

  const publishQuiz = async () => {
    if (!draftQuiz?.questions?.length) return;
    setUploading(true);
    setUploadMessage("");
    try {
      const response = await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish-quiz", quiz: draftQuiz }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not publish quiz.");
      const savedQuiz = data.quiz || draftQuiz;
      setPublishedQuiz({
        ...savedQuiz,
        passingPercentage: Number(savedQuiz.passing_percentage ?? savedQuiz.passingPercentage ?? draftQuiz.passingPercentage ?? 70),
      });
      resetAttempt();
      setUploadMessage("Quiz published successfully for all students.");
      setDraftQuiz(null);
      setUploadErrors([]);
    } catch (error) {
      setUploadErrors([error.message || "Could not publish the quiz."]);
    } finally {
      setUploading(false);
    }
  };

  const deletePublishedQuiz = async () => {
    if (!publishedQuiz?.id) return;
    const confirmed = window.confirm(
      `Delete the published quiz “${publishedQuiz.title}”?${deleteResultsToo ? " Its student results will also be deleted." : " Student results will be kept."}`
    );
    if (!confirmed) return;
    setDeletingQuiz(true);
    setPlatformMessage("");
    try {
      const response = await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-quiz",
          quizId: publishedQuiz.id,
          confirmed: true,
          deleteResults: deleteResultsToo,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not delete the quiz.");
      setPublishedQuiz(null);
      setDeleteResultsToo(false);
      setPlatformMessage("Published quiz deleted. Student results were " + (deleteResultsToo ? "deleted too." : "preserved."));
    } catch (error) {
      setPlatformMessage(error.message || "Could not delete the quiz.");
    } finally {
      setDeletingQuiz(false);
    }
  };

  const handleSubmit = () => {
    if (!question || !selectedAnswer || showResult) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const updatedScore = score + (isCorrect ? 1 : 0);
    const updatedStreak = isCorrect ? correctStreak + 1 : 0;
    const updatedAnswers = [
      ...answers,
      {
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      },
    ];

    setScore(updatedScore);
    setCorrectStreak(updatedStreak);
    setAnswers(updatedAnswers);
    saveProgress({
      currentQuestion,
      selectedAnswer,
      showResult: true,
      score: updatedScore,
      quizFinished: false,
      answers: updatedAnswers,
      difficultyLevel: updatedStreak >= 3 ? "Advanced" : updatedStreak >= 2 ? "Intermediate" : "Beginner",
      correctStreak: updatedStreak,
      achievements,
    });

    if (isCorrect) {
      if (updatedScore >= 3) {
        setAchievements((previous) =>
          previous.includes("Quick Learner")
            ? previous
            : [...previous, "Quick Learner"]
        );
      }

      if (updatedStreak >= 5) {
        setAchievements((previous) =>
          previous.includes("Math Master")
            ? previous
            : [...previous, "Math Master"]
        );
      }
    }

    setDifficultyLevel(
      updatedStreak >= 3
        ? "Advanced"
        : updatedStreak >= 2
          ? "Intermediate"
          : "Beginner"
    );

    setShowResult(true);
  };

  const handleNext = () => {
    setSelectedAnswer("");
    setShowResult(false);
    setAIExplanation("");

    if (currentQuestion + 1 < questions.length) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      saveProgress({
        currentQuestion: nextQuestion,
        selectedAnswer: "",
        showResult: false,
        score,
        quizFinished: false,
        answers,
        difficultyLevel,
        correctStreak,
        achievements,
      });
    } else {
      setQuizFinished(true);
      const finalPercentage = questions.length
        ? Math.round((score / questions.length) * 100)
        : 0;
      const result = {
        studentName,
        quizTitle: activeQuiz.title,
        score,
        totalQuestions: questions.length,
        percentage: finalPercentage,
        passed: finalPercentage >= activeQuiz.passingPercentage,
        completedAt: new Date().toISOString(),
      };
      fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-result",
          result: {
            quizId: activeQuiz.id,
            quizTitle: activeQuiz.title,
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: result.percentage,
            passed: result.passed,
          },
        }),
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Could not save result.");
        if (role === "teacher") await loadTeacherResults();
      }).catch(() => setPlatformMessage("Your quiz ended, but the result could not be saved to the shared database. Please tell your teacher."));
      saveProgress({
        currentQuestion,
        selectedAnswer: "",
        showResult: false,
        score,
        quizFinished: true,
        answers,
        difficultyLevel,
        correctStreak,
        achievements,
      });
    }
  };

  const generateAIExplanation = () => {
    // This is a local placeholder, not a live AI service.
    setLoadingAI(true);

    setAIExplanation(
      question?.explanation ||
        "Review the fractions, find a common denominator where necessary, and simplify your answer."
    );

    setLoadingAI(false);
  };

  const returnHome = () => {
    fetch("/api/platform", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }).catch(() => {});
    setStudentId(null);
    setRole(null);
    setStudentView("overview");
    setStudentName("");
    setStudentNameInput("");
    setTeacherNameInput("");
    setTeacherAuthorized(false);
    setTeacherLoginError("");
  };

  const NavBar = () => (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-8">
        <button
          onClick={returnHome}
          className="text-left text-lg font-bold tracking-tight"
        >
          Math Learning
        </button>

        <button className={styles.secondary} onClick={returnHome}>
          Change role
        </button>
      </div>
    </header>
  );

  // 1. ROLE SELECTION
  if (!role) {
    return (
      <main className={`${styles.page} flex items-center`}>
        <div className="mx-auto w-full max-w-4xl px-5 py-16">
          <div className="mb-10 text-center">
            <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-700">
              Learn at your own pace
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Welcome to Math Learning
            </h1>

            <p className="mx-auto max-w-xl text-lg text-slate-600">
              Choose how you would like to use the platform.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <button
              onClick={() => {
                setRole("student");
                setStudentView("overview");
                setStudentName("");
                setStudentNameInput("");
                setStudentPinInput("");
                setStudentAuthError("");
                setStudentAuthMode("login");
              }}
              className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                📘
              </div>
              <h2 className="mb-3 text-2xl font-bold">Student</h2>
              <p className="mb-6 text-slate-600">
                View your learning overview, practise maths questions, and
                check your results.
              </p>
              <span className="font-semibold text-blue-700">
                Enter student page →
              </span>
            </button>

            <button
              onClick={() => {
                setRole("teacher");
                setTeacherAuthorized(false);
                setTeacherNameInput("");
                setTeacherLoginError("");
              }}
              className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                📊
              </div>
              <h2 className="mb-3 text-2xl font-bold">Teacher</h2>
              <p className="mb-6 text-slate-600">
                Upload a maths spreadsheet, review its questions, and
                publish a quiz for students.
              </p>
              <span className="font-semibold text-emerald-700">
                Enter teacher page →
              </span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Ask for the teacher name before showing any teacher dashboard content.
  if (role === "teacher" && !teacherAuthorized) {
    return (
      <main className={`${styles.page} flex min-h-screen items-center justify-center px-4`}>
        <form onSubmit={handleTeacherLogin} className={`${styles.card} w-full max-w-md`}>
          <h1 className="mb-2 text-2xl font-bold">Teacher access</h1>
          <p className="mb-5 text-slate-600">Enter the teacher password to continue.</p>
          <label htmlFor="teacher-name" className="mb-2 block font-semibold">Teacher password</label>
          <input id="teacher-name" value={teacherNameInput} onChange={(e) => setTeacherNameInput(e.target.value)}
            type="password" autoComplete="current-password" className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Enter teacher password" required />
          {teacherLoginError && <p role="alert" className="mb-4 text-sm text-red-700">{teacherLoginError}</p>}
          <button type="submit" disabled={teacherLoginBusy} className={`${styles.primary} w-full`}>{teacherLoginBusy ? "Signing in…" : "Open teacher dashboard"}</button>
          <button type="button" className={`${styles.secondary} mt-3 w-full`} onClick={returnHome}>Back</button>
        </form>
      </main>
    );
  }

  // Student accounts use a username and four-digit PIN.
  if (role === "student" && !studentName) {
    return (
      <main className={`${styles.page} flex min-h-screen items-center justify-center px-4`}>
        <form onSubmit={handleStudentLogin} className={`${styles.card} w-full max-w-md`}>
          <h1 className="mb-2 text-2xl font-bold">Student account</h1>
          <p className="mb-5 text-slate-600">Sign in to continue, or create an account if your class has space.</p>
          <div className="mb-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setStudentAuthMode("login"); setStudentAuthError(""); }} className={studentAuthMode === "login" ? styles.primary : styles.secondary}>Sign in</button>
            <button type="button" onClick={() => { setStudentAuthMode("register"); setStudentAuthError(""); }} className={studentAuthMode === "register" ? styles.primary : styles.secondary}>Register</button>
          </div>
          <label htmlFor="student-name" className="mb-2 block font-semibold">Username</label>
          <input id="student-name" value={studentNameInput} onChange={(e) => setStudentNameInput(e.target.value)} autoComplete="username" minLength={3} maxLength={20} pattern="[A-Za-z0-9_]+" className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="3–20 letters, numbers or _" required />
          <label htmlFor="student-pin" className="mb-2 block font-semibold">4-digit PIN</label>
          <input id="student-pin" value={studentPinInput} onChange={(e) => setStudentPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))} type="password" inputMode="numeric" autoComplete={studentAuthMode === "register" ? "new-password" : "current-password"} pattern="[0-9]{4}" maxLength={4} className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Enter 4 digits" required />
          {studentAuthError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{studentAuthError}</p>}
          <button type="submit" disabled={studentAuthBusy} className={`${styles.primary} w-full`}>{studentAuthBusy ? "Please wait…" : studentAuthMode === "register" ? "Create account" : "Sign in"}</button>
          <button type="button" className={`${styles.secondary} mt-3 w-full`} onClick={returnHome}>Back</button>
          <p className="mt-4 text-xs text-slate-500">Keep your PIN private. If you forget it, ask your teacher for help.</p>
        </form>
      </main>
    );
  }

  // 2. TEACHER PAGE
  if (role === "teacher" && teacherAuthorized) {
    return (
      <main className={styles.page}>
        <NavBar />

        <div className={styles.container}>
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-emerald-700">
              TEACHER WORKSPACE
            </p>
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              Manage your maths quizzes
            </h1>
            <p className={styles.muted}>
              Upload your spreadsheet, check the questions, and publish
              them for students.
            </p>
          </div>

          <section className={`${styles.card} mb-6`}>
            <h2 className="mb-2 text-xl font-bold">
              Upload a question spreadsheet
            </h2>
            <p className="mb-5 text-slate-600">
              Supported formats: Excel (.xlsx, .xls) and CSV. Use the
              first worksheet and include the required column headings.
            </p>

            <label className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">
              {uploading ? "Reading file..." : "Choose spreadsheet"}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <p className="mb-2 text-sm font-semibold">
              Required columns
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "question",
                "option1",
                "option2",
                "option3",
                "option4",
                "correctAnswer",
              ].map((header) => (
                <code
                  key={header}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs"
                >
                  {header}
                </code>
              ))}
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Optional column: explanation. Column headings are not
              case-sensitive.
            </p>

            {uploadMessage && (
              <p
                role="status"
                className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-800"
              >
                {uploadMessage}
              </p>
            )}

            {uploadErrors.length > 0 && (
              <div
                role="alert"
                className="mt-5 rounded-xl bg-red-50 p-4 text-red-800"
              >
                <h3 className="mb-2 font-bold">
                  Please correct the spreadsheet
                </h3>
                <ul className="list-inside list-disc space-y-1">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {draftQuiz && (
            <section className={`${styles.card} mb-6`}>
              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="mb-1 text-sm font-semibold text-amber-700">
                    DRAFT — NOT YET PUBLISHED
                  </p>
                  <h2 className="text-2xl font-bold">
                    {draftQuiz.title}
                  </h2>
                  <p className={styles.muted}>
                    {draftQuiz.questions.length} questions imported
                  </p>
                </div>

                <button
                  className={styles.primary}
                  onClick={publishQuiz}
                >
                  Publish quiz
                </button>
              </div>

              <div className="space-y-4">
                {draftQuiz.questions.map((item, index) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="mb-3 font-semibold">
                      {index + 1}. {item.question}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {item.options.map((option) => (
                        <div
                          key={option}
                          className={`rounded-lg border p-3 text-sm ${
                            option === item.correctAnswer
                              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                              : "border-slate-200"
                          }`}
                        >
                          {option}
                          {option === item.correctAnswer
                            ? " ✓ Correct answer"
                            : ""}
                        </div>
                      ))}
                    </div>
                    {item.explanation && (
                      <p className="mt-3 text-sm text-slate-500">
                        Explanation: {item.explanation}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className={`${styles.card} mb-6`}>
            <h2 className="mb-2 text-xl font-bold">Student test results</h2>
            <p className="mb-4 text-sm text-slate-500">
              Results are loaded from the shared database so the teacher can view results across devices.
            </p>
            {studentResults.length ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead><tr className="border-b border-slate-200">
                    <th className="p-3">Student</th><th className="p-3">Test</th>
                    <th className="p-3">Score</th><th className="p-3">Percentage</th>
                    <th className="p-3">Status</th><th className="p-3">Completed</th>
                  </tr></thead>
                  <tbody>{[...studentResults].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).map((item, index) => (
                    <tr key={`${item.studentName}-${item.quizTitle}-${index}`} className="border-b border-slate-100">
                      <td className="p-3 font-medium">{item.studentName}</td>
                      <td className="p-3">{item.quizTitle}</td>
                      <td className="p-3">{item.score} / {item.totalQuestions}</td>
                      <td className="p-3">{item.percentage}%</td>
                      <td className={`p-3 font-semibold ${item.passed ? "text-emerald-700" : "text-amber-700"}`}>{item.passed ? "Passed" : "Not passed"}</td>
                      <td className="p-3">{item.completedAt ? new Date(item.completedAt).toLocaleString() : "—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <p className="text-slate-600">No completed student tests have been recorded yet.</p>}
          </section>

          <section className={styles.card}>
            <h2 className="mb-2 text-xl font-bold">Published quiz</h2>
            {platformMessage && <p role="status" className="my-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">{platformMessage}</p>}

            {publishedQuiz ? (
              <>
                <p className="font-semibold">{publishedQuiz.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {publishedQuiz.questions.length} questions · Pass mark{" "}
                  {publishedQuiz.passingPercentage}%
                </p>
                <p className="mt-3 text-sm text-emerald-700">
                  This quiz is published for students using the shared platform.
                </p>
                <label className="mt-4 flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={deleteResultsToo} onChange={(e) => setDeleteResultsToo(e.target.checked)} className="mt-1" />
                  <span>Also delete student results for this quiz (optional). Results are kept by default.</span>
                </label>
                <button onClick={deletePublishedQuiz} disabled={deletingQuiz} className="mt-4 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white disabled:opacity-50">
                  {deletingQuiz ? "Deleting…" : "Delete published quiz"}
                </button>
              </>
            ) : (
              <p className="text-slate-600">
                No teacher-uploaded quiz has been published yet. Students will not have a shared quiz until you publish one.
              </p>
            )}
          </section>
        </div>
      </main>
    );
  }

  // 3. STUDENT OVERVIEW AND QUIZ
  return (
    <main className={styles.page}>
      <NavBar />

      <div className={styles.container}>
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold text-blue-700">
            STUDENT WORKSPACE
          </p>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Welcome, {studentName}
          </h1>
          <p className={styles.muted}>
            Learn, practise, and review your progress.
          </p>
          {platformMessage && <p role="status" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{platformMessage}</p>}
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            className={
              studentView === "overview"
                ? styles.primary
                : styles.secondary
            }
            onClick={() => setStudentView("overview")}
          >
            Overview
          </button>
          <button
            className={
              studentView === "quiz" ? styles.primary : styles.secondary
            }
            onClick={() => {
              if (quizFinished) resetAttempt();
              setStudentView("quiz");
            }}
          >
            Questions
          </button>
        </div>

        {studentView === "overview" && (
          <>
            <section className="mb-6 rounded-3xl bg-slate-900 p-6 text-white md:p-8">
              <p className="mb-2 text-sm text-slate-300">
                YOUR CURRENT QUIZ
              </p>
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                {activeQuiz.title}
              </h2>
              <p className="mb-6 text-slate-300">
                {questions.length} questions · Pass mark{" "}
                {activeQuiz.passingPercentage}%
              </p>
              <button
                onClick={() => {
                  if (quizFinished) resetAttempt();
                  setStudentView("quiz");
                }}
                className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-slate-100"
              >
                Start practising →
              </button>
            </section>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className={styles.card}>
                <p className={styles.muted}>Level</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {difficultyLevel}
                </h3>
              </div>
              <div className={styles.card}>
                <p className={styles.muted}>Correct streak</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {correctStreak}
                </h3>
              </div>
              <div className={styles.card}>
                <p className={styles.muted}>Questions answered</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {answers.length}
                </h3>
              </div>
              <div className={styles.card}>
                <p className={styles.muted}>Latest score</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {quizFinished ? `${percentage}%` : "—"}
                </h3>
              </div>
            </div>

            {achievements.length > 0 && (
              <section className={styles.card}>
                <h2 className="mb-4 text-xl font-bold">
                  Achievements unlocked
                </h2>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((achievement) => (
                    <span
                      key={achievement}
                      className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-900"
                    >
                      🏆 {achievement}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {!publishedQuiz && (
              <p className="mt-5 text-sm text-slate-500">
                You are viewing the sample quiz. A teacher-uploaded quiz
                will replace it when published.
              </p>
            )}
          </>
        )}

        {studentView === "quiz" && (
          <>
            {quizFinished ? (
              <section className={`${styles.card} text-center`}>
                <h2 className="mb-4 text-3xl font-bold">Quiz complete</h2>
                <p className="mb-2 text-lg">
                  Score: {score} / {questions.length}
                </p>
                <p className="mb-6 text-2xl font-bold">{percentage}%</p>

                <div
                  className={`mb-6 rounded-xl p-4 font-semibold ${
                    percentage >= activeQuiz.passingPercentage
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-amber-50 text-amber-800"
                  }`}
                >
                  {percentage >= activeQuiz.passingPercentage
                    ? "Congratulations! You passed."
                    : "Keep practising and try again."}
                </div>

                <div className="mb-6 space-y-3 text-left">
                  {answers.map((answer, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <p className="mb-2 font-semibold">
                        {index + 1}. {answer.question}
                      </p>
                      <p className="text-sm text-slate-600">
                        Your answer: {answer.selectedAnswer}
                      </p>
                      {!answer.isCorrect && (
                        <p className="mt-1 text-sm text-emerald-700">
                          Correct answer: {answer.correctAnswer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  className={styles.primary}
                  onClick={resetAttempt}
                >
                  Try again
                </button>
              </section>
            ) : question ? (
              <section className={styles.card}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-blue-700">
                    {activeQuiz.title}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>

                <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <h2 className="mb-6 text-2xl font-bold leading-relaxed">
                  {question.question}
                </h2>

                <div className="mb-6 grid gap-3">
                  {question.options.map((option, index) => {
                    const selected = selectedAnswer === option;
                    const isCorrect = option === question.correctAnswer;

                    let optionStyle =
                      "border-slate-200 hover:border-slate-400";

                    if (selected) {
                      optionStyle = "border-blue-600 bg-blue-50";
                    }

                    if (showResult && isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50";
                    } else if (showResult && selected && !isCorrect) {
                      optionStyle = "border-red-500 bg-red-50";
                    }

                    return (
                      <button
                        key={`${index}-${option}`}
                        disabled={showResult}
                        onClick={() => setSelectedAnswer(option)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${optionStyle}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {!showResult ? (
                  <button
                    disabled={!selectedAnswer}
                    onClick={handleSubmit}
                    className={`${styles.primary} w-full`}
                  >
                    Submit answer
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`rounded-xl p-5 ${
                        selectedAnswer === question.correctAnswer
                          ? "bg-emerald-50 text-emerald-900"
                          : "bg-red-50 text-red-900"
                      }`}
                    >
                      <h3 className="mb-2 text-lg font-bold">
                        {selectedAnswer === question.correctAnswer
                          ? "Correct!"
                          : "Not quite"}
                      </h3>

                      {selectedAnswer !== question.correctAnswer && (
                        <p className="mb-2">
                          Correct answer: {question.correctAnswer}
                        </p>
                      )}

                      <p>
                        {question.explanation ||
                          "Review the correct answer before moving on."}
                      </p>
                    </div>

                    <button
                      onClick={generateAIExplanation}
                      className={styles.secondary + " w-full"}
                    >
                      Explain answer
                    </button>

                    {loadingAI && (
                      <p className={styles.muted}>Preparing explanation...</p>
                    )}

                    {aiExplanation && (
                      <div className="rounded-xl bg-blue-50 p-4 text-blue-900">
                        <h3 className="mb-2 font-bold">Explanation</h3>
                        <p>{aiExplanation}</p>
                      </div>
                    )}

                    <button
                      onClick={handleNext}
                      className={`${styles.primary} w-full`}
                    >
                      {currentQuestion + 1 === questions.length
                        ? "Finish quiz"
                        : "Next question"}
                    </button>
                  </div>
                )}
              </section>
            ) : (
              <section className={styles.card}>
                No questions are available for this quiz.
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
