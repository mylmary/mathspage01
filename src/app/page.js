
import Link from "next/link";

function FlowField({ variant = "cylinder", compact = false }) {
  const paths = {
    cylinder: [
      "M0 24 C55 24 62 24 80 24 C110 24 120 5 155 5 S220 24 300 24",
      "M0 42 C50 42 60 42 78 42 C108 42 118 18 155 18 S220 42 300 42",
      "M0 60 C50 60 60 60 78 60 C108 60 118 84 155 84 S220 60 300 60",
      "M0 78 C55 78 62 78 80 78 C110 78 120 102 155 102 S220 78 300 78",
      "M0 96 C55 96 62 96 80 96 C110 96 120 96 155 96 S220 96 300 96",
    ],
    airfoil: [
      "M0 24 C60 24 80 30 115 30 C155 30 190 18 300 18",
      "M0 42 C65 42 85 46 120 42 C170 35 210 38 300 38",
      "M0 60 C65 60 90 62 120 60 C175 58 220 60 300 60",
      "M0 78 C60 78 85 74 120 78 C170 85 215 80 300 80",
      "M0 96 C60 96 85 90 120 96 C170 105 220 98 300 98",
    ],
    dam: [
      "M0 24 Q42 24 58 42 T110 50 T175 30 T240 36 T300 26",
      "M0 42 Q35 42 58 56 T110 62 T175 48 T240 54 T300 44",
      "M0 60 Q35 60 58 70 T110 76 T175 64 T240 70 T300 60",
      "M0 78 Q35 78 58 86 T110 92 T175 80 T240 86 T300 78",
      "M0 96 Q35 96 58 102 T110 108 T175 96 T240 102 T300 96",
    ],
  };

  return (
    <svg
      viewBox="0 0 300 120"
      className={`h-full w-full ${compact ? "" : "min-h-44"}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`flow-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <pattern
          id={`grid-${variant}`}
          width="15"
          height="15"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 15 0 L 0 0 0 15"
            stroke="#94a3b8"
            strokeOpacity=".18"
            strokeWidth=".6"
          />
        </pattern>
      </defs>

      <rect width="300" height="120" rx="12" fill={`url(#grid-${variant})`} />

      {paths[variant].map((path, i) => (
        <path
          key={path}
          d={path}
          stroke={`url(#flow-${variant})`}
          strokeWidth={i === 2 ? 1.8 : 1.15}
          strokeOpacity={0.42 + i * 0.1}
          strokeLinecap="round"
        />
      ))}

      {variant === "cylinder" && (
        <>
          <circle cx="120" cy="60" r="17" fill="#e2e8f0" />
          <circle cx="120" cy="60" r="17" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="120" cy="60" r="3" fill="#0891b2" />
        </>
      )}

      {variant === "airfoil" && (
        <path
          d="M98 61 Q144 32 210 51 Q156 56 98 61Z"
          fill="#dbeafe"
          stroke="#0891b2"
          strokeWidth="1.6"
        />
      )}

      {variant === "dam" && (
        <>
          <path d="M36 12 V108" stroke="#475569" strokeWidth="4" />
          <path d="M36 12 V108" stroke="#94a3b8" strokeWidth="1" />
          <path d="M39 15 V105" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 4" />
        </>
      )}
    </svg>
  );
}

function LabCard({ href, symbol, title, description, color }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200
      bg-white p-6 transition duration-300 hover:-translate-y-1
      hover:border-cyan-300 hover:shadow-xl hover:shadow-slate-200/60"
    >
      <span className={`mb-5 flex h-12 w-12 items-center justify-center
        rounded-xl text-2xl ${color}`}>
        {symbol}
      </span>
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
      <span className="mt-6 font-semibold text-cyan-700 transition group-hover:text-cyan-500">
        Enter lab <span aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-200/80 bg-white/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#200b2d] text-xl font-bold text-cyan-300">
              R
            </span>
            <span className="text-lg font-bold tracking-tight">
              ReactFlow<span className="text-cyan-700">3D</span>
            </span>
          </Link>

          <div className="flex items-center gap-5 text-sm font-medium">
            <Link href="/math" className="hidden text-slate-600 hover:text-cyan-700 sm:block">
              Mathematics
            </Link>
            <Link href="/physics" className="hidden text-slate-600 hover:text-cyan-700 sm:block">
              Physics
            </Link>
            <Link
              href="/physics"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-white transition hover:bg-cyan-800"
            >
              Explore labs <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -right-40 -top-28 h-[30rem] w-[30rem] rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-48 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.02fr_.98fr] lg:gap-16 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-cyan-800">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              INTERACTIVE SCIENCE & ENGINEERING
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.4rem]">
              See the physics.
              <br />
              <span className="text-cyan-700">Understand the flow.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Explore mathematics, fluid mechanics and the physics behind
              the world around us — through visual experiments, not just equations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/physics"
                className="rounded-xl bg-cyan-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/10 transition hover:bg-cyan-800"
              >
                Explore physics <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/math"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-800"
              >
                Mathematics lab
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
              <span>Fluid mechanics</span>
              <span>Mathematics</span>
              <span>Computational science</span>
            </div>
          </div>

          {/* Original flow-field artwork */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-100 via-white to-violet-100 blur-xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/40 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-400">
                    FLOW VISUALISATION
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    Flow around a cylinder
                  </p>
                </div>
                <span className="rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-semibold tracking-wide text-cyan-800">
                  CFD CONCEPT
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-3 sm:p-5">
                <FlowField variant="cylinder" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">INVESTIGATE</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    Velocity · Pressure · Geometry
                  </p>
                </div>
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-6 rounded-full bg-cyan-600" />
                  <span className="h-2 w-2 rounded-full bg-cyan-200" />
                  <span className="h-2 w-2 rounded-full bg-violet-200" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:-left-7">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                The idea
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                Observe. Question. Explore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific examples */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700">
                THE PHENOMENA
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Science is easier to see.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              From separated flow to free-surface waves, explore the
              physical ideas behind real engineering problems.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Flow around a cylinder",
                tag: "FLUID MECHANICS",
                description: "How does an obstacle change the flow around it?",
                variant: "cylinder",
              },
              {
                title: "Airflow over an airfoil",
                tag: "AERODYNAMICS",
                description: "How does geometry influence the surrounding flow?",
                variant: "airfoil",
              },
              {
                title: "Dam-break waves",
                tag: "FREE-SURFACE FLOW",
                description: "What happens when water is suddenly released?",
                variant: "dam",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="p-4 pb-0">
                  <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white p-2 transition group-hover:border-cyan-100">
                    <FlowField variant={item.variant} compact />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold tracking-[.16em] text-cyan-800">
                    {item.tag}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Conceptual illustrations for visual context, not numerical simulation results.
          </p>
        </div>
      </section>

      {/* Learning labs */}
      <section id="learning-labs" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700">
            YOUR WORKSPACE
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Choose your lab.
            </h2>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Start with a question, work through a concept, and build
              your understanding one experiment at a time.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            <LabCard
              href="/math"
              symbol="∑"
              title="Mathematics"
              description="Explore equations, practise problem-solving, and connect mathematical ideas to real applications."
              color="bg-violet-50 text-violet-700"
            />
            <LabCard
              href="/physics"
              symbol="〰"
              title="Physics"
              description="Investigate fluid mechanics, aerodynamics, waves, and the physical principles behind them."
              color="bg-cyan-50 text-cyan-800"
            />
          </div>
        </div>
      </section>

      {/* Short mission statement */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#200b2d] px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full border border-cyan-300/20" />
          <div className="pointer-events-none absolute -right-2 -top-2 h-44 w-44 rounded-full border border-cyan-300/20" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">
                REACTFLOW3D
              </p>
              <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight sm:text-4xl">
                Move beyond the equation. Explore what it means.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                A growing collection of interactive learning experiences
                in mathematics, physics, and computational science.
              </p>
            </div>
            <Link
              href="/physics"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#200b2d] transition hover:bg-cyan-300"
            >
              Start exploring <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-semibold text-slate-800">
            ReactFlow<span className="text-cyan-700">3D</span>
          </p>
          <p className="text-slate-500">
            Mathematics · Physics · Computational science
          </p>
        </div>
      </footer>
    </main>
  );
}
