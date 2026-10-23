import Link from "next/link";

export default function HomePage() {
return (
<main className="min-h-screen bg-slate-950 px-5 py-12 text-white sm:px-8">
<div className="mx-auto max-w-5xl">
<header className="mb-12 text-center">
<p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
Interactive Learning Lab
</p>

      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Explore. Experiment. Learn.
      </h1>

      <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
        Choose a subject to explore concepts, solve problems, and
        investigate how things work.
      </p>
    </header>

    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Link
        href="/math"
        className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-cyan-500"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-950 text-3xl">
          ∑
        </div>

        <h2 className="text-2xl font-bold group-hover:text-cyan-300">
          Mathematics
        </h2>

        <p className="mt-3 leading-7 text-slate-400">
          Practise mathematical concepts, answer questions, and build
          your problem-solving skills.
        </p>

        <p className="mt-7 font-medium text-cyan-400">
          Enter Maths Lab →
        </p>
      </Link>

      <Link
        href="/physics"
        className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-cyan-500"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-950 text-3xl">
          ⚛
        </div>

        <h2 className="text-2xl font-bold group-hover:text-cyan-300">
          Physics
        </h2>

        <p className="mt-3 leading-7 text-slate-400">
          Explore fluid mechanics, aerodynamics, shock waves, and
          computational physics experiments.
        </p>

        <p className="mt-7 font-medium text-cyan-400">
          Enter Physics Lab →
        </p>
      </Link>
    </section>

    <footer className="mt-12 text-center text-sm text-slate-600">
      An interactive space for learning science and mathematics.
    </footer>
  </div>
</main>

);
}
