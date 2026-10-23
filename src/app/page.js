
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto flex min-h-[75vh] max-w-5xl flex-col items-center justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Interactive Learning
        </p>

        <h1 className="mt-4 text-center text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Learning Lab
        </h1>

        <p className="mt-5 max-w-xl text-center text-lg text-slate-600">
          Choose a subject to explore, practise, and learn through interactive
          activities.
        </p>

        <div className="mt-12 grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          <Link
            href="/math"
            className="group rounded-2xl border border-blue-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl">
              ∑
            </div>

            <h2 className="mt-6 text-2xl font-bold">Mathematics</h2>

            <p className="mt-3 leading-6 text-slate-600">
              Practise maths with interactive quizzes, questions, and learning
              activities.
            </p>

            <div className="mt-6 font-semibold text-blue-700 group-hover:text-blue-900">
              Explore Maths →
            </div>
          </Link>

          <Link
            href="/physics"
            className="group rounded-2xl border border-teal-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-teal-500 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-3xl">
              ≋
            </div>

            <h2 className="mt-6 text-2xl font-bold">Physics</h2>

            <p className="mt-3 leading-6 text-slate-600">
              Explore physical concepts through visual experiments and
              computational fluid dynamics.
            </p>

            <div className="mt-6 font-semibold text-teal-700 group-hover:text-teal-900">
              Explore Physics →
            </div>
          </Link>
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          Learn by exploring. Understand by experimenting.
        </p>
      </div>
    </main>
  );
}
