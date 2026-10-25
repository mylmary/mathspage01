
import { NextResponse } from "next/server";
import {
  randomBytes,
  pbkdf2Sync,
  timingSafeEqual,
  createHmac,
} from "node:crypto";

export const runtime = "nodejs";

const COOKIE = "math_platform_session";
const HASH_ROUNDS = 180000;

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  const secret = process.env.SESSION_SECRET;

  if (!url || !key || !secret) {
    throw new Error("Server environment variables are missing.");
  }

  return { url: url.replace(/\/$/, ""), key, secret };
}

async function db(path, options = {}) {
  const { url, key } = config();

  return fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });
}

function hashPin(pin, salt = randomBytes(16).toString("hex")) {
  const hash = pbkdf2Sync(pin, salt, HASH_ROUNDS, 32, "sha256");
  return `pbkdf2$${HASH_ROUNDS}$${salt}$${hash.toString("hex")}`;
}

function verifyPin(pin, stored) {
  try {
    const [algorithm, rounds, salt, savedHash] = stored.split("$");
    if (
      algorithm !== "pbkdf2" ||
      !salt ||
      !savedHash ||
      Number(rounds) !== HASH_ROUNDS
    ) {
      return false;
    }

    const actual = pbkdf2Sync(
      pin,
      salt,
      HASH_ROUNDS,
      32,
      "sha256"
    );
    const expected = Buffer.from(savedHash, "hex");

    return (
      actual.length === expected.length &&
      timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}

function sign(value, secret) {
  return createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
}

function createSession(user) {
  const { secret } = config();
  const payload = Buffer.from(
    JSON.stringify({
      ...user,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

function readSession(request) {
  try {
    const token = request.cookies.get(COOKIE)?.value;
    if (!token) return null;

    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = sign(payload, config().secret);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return null;
    }

    const user = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );

    if (!user.exp || user.exp < Date.now()) return null;
    return user;
  } catch {
    return null;
  }
}

function reply(data, status = 200, token = null) {
  const response = NextResponse.json(data, { status });

  if (token) {
    response.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}

function fail(message, status = 400) {
  return reply({ error: message }, status);
}

async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function GET(request) {
  try {
    const action = request.nextUrl.searchParams.get("action");

    if (action === "session") {
      const user = readSession(request);
      return reply({
        user: user
          ? { id: user.id, username: user.username, role: user.role }
          : null,
      });
    }

    if (action === "quiz") {
      const response = await db(
        "quizzes?select=id,title,passing_percentage,questions,original_filename,updated_at&is_published=eq.true&order=updated_at.desc&limit=1"
      );

      const data = await readJson(response);
      if (!response.ok) return fail("Could not load the quiz.", 500);

      return reply({ quiz: Array.isArray(data) ? data[0] || null : null });
    }

    if (action === "results") {
      const user = readSession(request);
      if (!user || user.role !== "teacher") {
        return fail("Teacher login required.", 401);
      }

      const response = await db(
        "student_results?select=*&order=completed_at.desc"
      );
      const data = await readJson(response);

      if (!response.ok) return fail("Could not load results.", 500);
      return reply({ results: data });
    }

    return fail("Unknown action.", 404);
  } catch {
    return fail("Server configuration or database error.", 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === "register") {
      const username = String(body.username || "").trim();
      const pin = String(body.pin || "");

      if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
        return fail("Username must be 3–20 letters, numbers or underscores.");
      }

      if (!/^\d{4}$/.test(pin)) {
        return fail("PIN must contain exactly 4 digits.");
      }

      const registration = await db("rpc/register_student_with_limit", {
        method: "POST",
        body: JSON.stringify({
          p_username: username,
          p_pin_hash: hashPin(pin),
        }),
      });

      if (!registration.ok) {
        const error = await readJson(registration);
        const message = JSON.stringify(error || "").toLowerCase();

        if (
          message.includes("already") ||
          message.includes("duplicate") ||
          message.includes("unique")
        ) {
          return fail("That username is already taken.", 409);
        }

        if (
          message.includes("limit") ||
          message.includes("maximum") ||
          message.includes("capacity")
        ) {
          return fail("The class is full. Ask your teacher for help.", 409);
        }

        return fail("Registration failed. Check the database setup.", 400);
      }

      const lookup = await db(
        `students?select=id,username&username=eq.${encodeURIComponent(username)}`
      );
      const students = await readJson(lookup);

      if (!lookup.ok || !Array.isArray(students) || !students[0]) {
        return fail("Account created, but login could not start.", 500);
      }

      const student = students[0];
      return reply(
        { user: { id: student.id, username, role: "student" } },
        200,
        createSession({
          id: student.id,
          username,
          role: "student",
        })
      );
    }

    
if (action === "login") {
  const username = String(body.username || "").trim();
  const pin = String(body.pin || "");

  if (!username || !/^\d{4}$/.test(pin)) {
    return fail("Enter your username and 4-digit PIN.");
  }

  const response = await db(
    `students?select=id,username,pin_hash&username=eq.${encodeURIComponent(username)}`
  );

  if (!response.ok) {
  const error = await readJson(response);

  console.error("Student login database error:", {
    status: response.status,
    code: error?.code,
    message: error?.message,
  });

  return fail("Could not check your account. Please try again.", 500);
}

  const students = await readJson(response);

  if (!Array.isArray(students) || !students[0]) {
    return fail("Username or PIN is incorrect.", 401);
  }

  const student = students[0];

  if (!verifyPin(pin, student.pin_hash)) {
    return fail("Username or PIN is incorrect.", 401);
  }

  const user = {
    id: student.id,
    username: student.username,
    role: "student",
  };

  return reply(
    { user },
    200,
    createSession(user)
  );
}

    if (action === "teacher-login") {
      const password = String(body.password || "");
      const savedPassword = process.env.TEACHER_PASSWORD;

      if (!savedPassword || password !== savedPassword) {
        return fail("Incorrect teacher password.", 401);
      }

      return reply(
        { user: { username: "teacher", role: "teacher" } },
        200,
        createSession({ username: "teacher", role: "teacher" })
      );
    }

    const user = readSession(request);

    if (action === "logout") {
      const response = reply({ ok: true });
      response.cookies.set(COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    if (action === "publish-quiz") {
      if (!user || user.role !== "teacher") {
        return fail("Teacher login required.", 401);
      }

      const quiz = body.quiz;
      if (
        !quiz ||
        typeof quiz.title !== "string" ||
        !Array.isArray(quiz.questions) ||
        quiz.questions.length === 0
      ) {
        return fail("Provide a quiz title and at least one question.");
      }

      const unpublish = await db("quizzes?is_published=eq.true", {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ is_published: false }),
      });

      if (!unpublish.ok) return fail("Could not replace the published quiz.", 500);

      const response = await db("quizzes", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          title: quiz.title,
          passing_percentage: Number(quiz.passingPercentage ?? quiz.passing_percentage ?? 70),
          questions: quiz.questions,
          original_filename: quiz.originalFilename || quiz.original_filename || null,
          is_published: true,
        }),
      });

      const data = await readJson(response);
      if (!response.ok) return fail("Could not publish the quiz.", 500);

      return reply({ ok: true, quiz: Array.isArray(data) ? data[0] : data });
    }

    if (action === "save-progress") {
      if (!user || user.role !== "student") {
        return fail("Student login required.", 401);
      }

      const response = await db("student_progress", {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          student_id: user.id,
          quiz_id: body.quizId,
          progress: body.progress,
          updated_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) return fail("Could not save progress.", 500);
      return reply({ ok: true });
    }

    if (action === "save-result") {
      if (!user || user.role !== "student") {
        return fail("Student login required.", 401);
      }

      const result = body.result || {};
      const response = await db("student_results", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          student_id: user.id,
          student_username: user.username,
          quiz_id: result.quizId,
          quiz_title: result.quizTitle,
          score: result.score,
          total_questions: result.totalQuestions,
          percentage: result.percentage,
          passed: result.passed,
        }),
      });

      if (!response.ok) return fail("Could not save the result.", 500);
      return reply({ ok: true });
    }

    if (action === "delete-quiz") {
      if (!user || user.role !== "teacher") {
        return fail("Teacher login required.", 401);
      }

      if (!body.confirmed) {
        return fail("Confirm quiz deletion first.");
      }

      const quizId = String(body.quizId || "");
      if (!quizId) return fail("Quiz ID is required.");

      if (body.deleteResults === true) {
        const results = await db(
          `student_results?quiz_id=eq.${encodeURIComponent(quizId)}`,
          { method: "DELETE" }
        );
        if (!results.ok) return fail("Could not delete quiz results.", 500);
      }

      await db(
        `student_progress?quiz_id=eq.${encodeURIComponent(quizId)}`,
        { method: "DELETE" }
      );

      const response = await db(
        `quizzes?id=eq.${encodeURIComponent(quizId)}`,
        { method: "DELETE" }
      );

      if (!response.ok) return fail("Could not delete the quiz.", 500);
      return reply({ ok: true });
    }

    return fail("Unknown action.", 404);
  } catch {
    return fail("Server configuration or database error.", 500);
  }
}
