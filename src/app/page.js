
import Link from "next/link";

const experiments = [
  {
    number: "01",
    title: "Flow Line Observation",
    description:
      "Observe streamlines, smoke movement, wakes, and how changing an object's shape affects the flow.",
    href: "/physics/flow-lines",
    category: "FLOW VISUALIZATION",
    symbol: "〰",
  },
  {
    number: "02",
    title: "1D Shock Tube — Sod's Problem",
    description:
      "Explore shock waves, contact discontinuities, expansion fans, density, pressure, and velocity.",
    href: "/physics/sod-shock-tube",
    category: "COMPRESSIBLE FLOW",
    symbol: "≋",
  },
  {
    number: "03",
    title: "2D Lid-Driven Cavity",
    description:
      "Investigate recirculation, vortex formation, and velocity patterns inside a square cavity.",
    href: "/physics/lid-driven-cavity",
    category: "INCOMPRESSIBLE FLOW",
    symbol: "□",
  },
  {
    number: "04",
    title: "Flow Over a Cylinder",
    description:
      "Explore flow separation, the wake, and vortex shedding behind a circular cylinder.",
    href: "/physics/cylinder-flow",
    category: "EXTERNAL FLOW",
    symbol: "○",
  },
  {
    number: "05",
    title: "Converging-Diverging Nozzle",
    description:
      "Study acceleration, pressure changes, choking, and supersonic flow through a nozzle.",
    href: "/physics/nozzle",
    category: "GAS DYNAMICS",
    symbol: "⟫",
  },
  {
    number: "06",
    title: "Flat Plate Boundary Layer",
    description:
      "Examine boundary-layer growth, wall shear, and laminar-to-turbulent flow concepts.",
    href: "/physics/flat-plate",
    category: "BOUNDARY LAYERS",
    symbol: "▤",
  },
  {
    number: "07",
    title: "NACA 0012 Airfoil — Stall Analysis",
    description:
      "Change the angle of attack and investigate lift, separation, and stall behaviour.",
    href: "/physics/naca0012",
    category: "AERODYNAMICS",
    symbol: "✈",
  },
  {
    number: "08",
    title: "Multiphase Dam Break",
    description:
      "Explore free-surface motion, gravity-driven flow, and the interaction between water and air.",
    href: "/physics/dam-break",
    category: "MULTIPHASE FLOW",
    symbol: "≈",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-teal-700">LEARNING</span> LAB
          </Link>

          <span className="hidden text-sm text-slate-500 sm:block">
            Interactive learning and computational physics
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:pt-16">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
          Your learning workspace
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          What would you like to explore?
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Practise mathematics, explore physical phenomena, and investigate
          fluid motion through interactive experiments.
        </p>

        {/* SUBJECT SELECTION */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link
            href="/math"
            className="group rounded-2xl border border-blue-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-md sm:p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl font-bold text-blue-800">
              ∑
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-blue-700">
              SUBJECT 01
            </p>

            <h2 className="mt-2 text-2xl font-bold">Mathematics</h2>

            <p className="mt-3 leading-7 text-slate-600">
              Work through maths questions, practise concepts, and test your
              understanding with interactive quizzes.
            </p>

            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700 group-hover:gap-3">
              Open Mathematics <span>→</span>
            </span>
          </Link>

          <a
            href="#physics-lab"
            className="group rounded-2xl border border-teal-200 bg-[#123b37] p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-3xl text-teal-200">
              〰
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-teal-200">
              SUBJECT 02
            </p>

            <h2 className="mt-2 text-2xl font-bold">Physics</h2>

            <p className="mt-3 leading-7 text-slate-200">
              Explore computational fluid dynamics, observe flow behaviour,
              change simulation parameters, and investigate the physics behind
              each experiment.
            </p>

            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-200 group-hover:gap-3">
              Explore Physics Experiments <span>↓</span>
            </span>
          </a>
        </div>

        {/* PHYSICS EXPERIMENTS */}
        <section id="physics-lab" className="scroll-mt-6 pt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-teal-700">
                PHYSICS / CFD LAB
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Choose an experiment
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Select a flow problem to investigate its geometry, boundary
                conditions, flow structures, and governing physics.
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {experiments.length} experiments
            </span>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {experiments.map((experiment) => (
              <Link
                key={experiment.number}
                href={experiment.href}
                className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl text-teal-800">
                    {experiment.symbol}
                  </div>

                  <span className="text-sm font-semibold text-slate-400">
                    {experiment.number}
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-bold tracking-[0.15em] text-teal-700">
                  {experiment.category}
                </p>

                <h3 className="mt-2 text-lg font-bold leading-6">
                  {experiment.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {experiment.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-semibold text-teal-800">
                    Open experiment
                  </span>

                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-200 py-6 text-sm text-slate-500">
          Learning Lab · Mathematics and Computational Physics
        </footer>
      </section>
    </main>
  );
}
