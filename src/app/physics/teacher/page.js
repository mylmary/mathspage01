
"use client";

import Link from "next/link";

const experiments = [
  { title: "Cylinder Flow", href: "/physics/cylinder-flow" },
  { title: "Lid-Driven Cavity", href: "/physics/lid-driven-cavity" },
  { title: "Sod Shock Tube", href: "/physics/sod-shock-tube" },
  { title: "Flow Lines", href: "/physics/flow-lines" },
  { title: "Nozzle Flow", href: "/physics/nozzle" },
  { title: "Flat Plate", href: "/physics/flat-plate" },
  { title: "NACA 0012 Airfoil", href: "/physics/naca0012" },
  { title: "Dam Break", href: "/physics/dam-break" },
];

export default function TeacherPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/physics"
            className="text-xl font-black tracking-tight"
          >
            ReactFlow<span className="text-blue-600">3D</span>
          </Link>

          <Link
            href="/physics/student"
            className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Student Lab →
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Teacher Workspace
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Teacher's Dashboard
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Access your physics teaching workspace and open the available
            simulations for classroom demonstrations and lesson preparation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#teaching-tools"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              Open Teaching Tools ↓
            </a>

            <Link
              href="/physics"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Physics Homepage
            </Link>
          </div>
        </div>
      </section>

      <section
        id="teaching-tools"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-700">
            Teaching Resources
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Physics simulations
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Select a simulation to open its existing physics page.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment, index) => (
            <Link
              key={experiment.href}
              href={experiment.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-xl font-bold text-cyan-700">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-5 text-lg font-bold transition group-hover:text-blue-700">
                {experiment.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Open this physics experiment.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Open simulation
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            ReactFlow3D · Teacher Workspace
          </p>

          <Link
            href="/physics"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            ← Back to Physics Homepage
          </Link>
        </div>
      </footer>
    </main>
  );
}
