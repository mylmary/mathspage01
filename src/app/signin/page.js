"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
const router = useRouter();
const searchParams = useSearchParams();

const [role, setRole] = useState("student");
const [username, setUsername] = useState("");
const [pin, setPin] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(event) {
event.preventDefault();
setError("");
setLoading(true);

try {
  const response = await fetch("/api/platform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      role === "student"
        ? { action: "login", username, pin }
        : { action: "teacher-login", password }
    ),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.error || "Sign-in failed. Please try again.");
    return;
  }

  const callbackUrl = searchParams.get("callbackUrl");
  const destination =
    callbackUrl && callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//")
      ? callbackUrl
      : role === "teacher"
        ? "/physics/teacher"
        : "/physics/lab";

  router.replace(destination);
  router.refresh();
} catch {
  setError("Could not connect to the server. Please try again.");
} finally {
  setLoading(false);
}

}

return (
<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
<Link
href="/physics"
className="text-sm font-semibold text-blue-700 hover:text-blue-900"
>
← Back to Physics
</Link>

    <div className="mt-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 text-2xl font-black text-white">
        R
      </div>

      <h1 className="mt-4 text-2xl font-black">
        Sign in to ReactFlow3D
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Access your physics learning workspace.
      </p>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => {
          setRole("student");
          setError("");
        }}
        className={`rounded-lg px-3 py-3 text-sm font-semibold ${
          role === "student"
            ? "bg-blue-700 text-white"
            : "text-slate-600 hover:bg-white"
        }`}
      >
        Student
      </button>

      <button
        type="button"
        onClick={() => {
          setRole("teacher");
          setError("");
        }}
        className={`rounded-lg px-3 py-3 text-sm font-semibold ${
          role === "teacher"
            ? "bg-blue-700 text-white"
            : "text-slate-600 hover:bg-white"
        }`}
      >
        Teacher
      </button>
    </div>

    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {role === "student" ? (
        <>
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold"
            >
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="[A-Za-z0-9_]{3,20}"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="pin"
              className="mb-2 block text-sm font-semibold"
            >
              Four-digit PIN
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              value={pin}
              onChange={(event) =>
                setPin(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              required
              pattern="[0-9]{4}"
              maxLength={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Enter your PIN"
            />
          </div>
        </>
      ) : (
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold"
          >
            Teacher password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Enter teacher password"
          />
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-700 px-5 py-3.5 font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>

    {role === "student" && (
      <p className="mt-5 text-center text-sm text-slate-600">
        Don't have a student account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-700 hover:underline"
        >
          Register
        </Link>
      </p>
    )}
  </div>
</main>

);
}
