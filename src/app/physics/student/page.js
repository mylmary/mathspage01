
"use client";

import Link from "next/link";
import AskMini from "@/components/AskMini";

const experiments = [
  {
    title: "Cylinder Flow",
    description: "Explore flow separation and vortex shedding around a cylinder.",
    href: "/physics/cylinder-flow",
    category: "Fluid Mechanics",
  },
  {
    title: "Lid-Driven Cavity",
    description: "Investigate recirculation and velocity patterns inside a cavity.",
    href: "/physics/lid-driven-cavity",
    category: "Fluid Mechanics",
  },
  {
    title: "Sod Shock Tube",
    description: "Observe shock waves in compressible flow.",
    href: "/physics/sod-shock-tube",
    category: "Compressible Flow",
  },
  {
    title: "Flow Lines",
    description: "Explore streamlines and how fluids move.",
    href: "/physics/flow-lines",
    category: "Fluid Mechanics",
  },
  {
    title: "Nozzle Flow",
    description: "Study how nozzle geometry affects fluid velocity.",
    href: "/physics/nozzle",
    category: "Compressible Flow",
  },
  {
    title: "Flat Plate",
    description: "Explore boundary-layer development along a flat plate.",
    href: "/physics/flat-plate",
    category: "Aerodynamics",
  },
  {
    title: "NACA 0012 Airfoil",
    description: "Investigate airflow around a symmetric airfoil.",
    href: "/physics/naca0012",
    category: "Aerodynamics",
  },
  {
    title: "Dam Break",
    description: "Observe free-surface flow after a dam break.",
    href: "/physics/dam-break",
    category: "Free-Surface Flow",
  },
];

export default function StudentPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/physics"
            className="text-xl font-black tracking-tight"
          >
            ReactFlow<span className="text-blue-600">3D</span>
          </Link>

          <Link
            href="/physics/teacher"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-cyan-400 hover:text-blue-700"
          >
            Teacher's Dashboard
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            Interactive Physics Laboratory
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Student Simulation Lab
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore fluid mechanics, aerodynamics, compressible flow and
            free-surface phenomena through your physics simulations.
          </p>

          <a
            href="#student-experiments"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-cyan-400"
          >
            Explore Experiments ↓
          </a>
        </div>
      </section>

      <section
        id="student-experiments"
        className="scroll-mt-24 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
            Experiment Library
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Choose an experiment
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Select any experiment below to open its existing simulation page.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {experiments.map((experiment, index) => (
            <Link
              key={experiment.href}
              href={experiment.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 text-xl font-black text-blue-700 transition group-hover:scale-110">
                {String(index + 1).padStart(2, "0")}
              </div>

              <p className="mt-5 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                {experiment.category}
              </p>

              <h3 className="mt-4 text-lg font-bold text-slate-900 transition group-hover:text-blue-700">
                {experiment.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                {experiment.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-blue-700">
                  Open simulation
                </span>

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            ReactFlow3D · Student Simulation Lab
          </p>

          <Link
            href="/physics"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            ← Back to Physics Homepage
          </Link>
        </div>
      </footer>

      <AskMini />
    </main>
  );
}
