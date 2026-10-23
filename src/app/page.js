
import Link from "next/link";

const experiments = [
  {
    number: "01",
    title: "Flow Lines",
    description: "See how fluid moves around objects and through a flow field.",
    topic: "Fluid motion",
    route: "/physics/flow-lines",
    color: "bg-sky-50",
    accent: "#0284c7",
    visual: "flow",
  },
  {
    number: "02",
    title: "Sod Shock Tube",
    description: "Watch pressure waves travel through gas at different states.",
    topic: "Compressible flow",
    route: "/physics/sod-shock-tube",
    color: "bg-orange-50",
    accent: "#ea580c",
    visual: "shock",
  },
  {
    number: "03",
    title: "Dam Break",
    description: "Release a wall of water and observe the resulting wave.",
    topic: "Free-surface flow",
    route: "/physics/dam-break",
    color: "bg-cyan-50",
    accent: "#0891b2",
    visual: "dam",
  },
];

function FlowPreview() {
  return (
    <svg
      viewBox="0 0 440 290"
      className="h-full w-full"
      role="img"
      aria-label="Animated fluid streamlines passing around an obstacle"
    >
      <defs>
        <linearGradient id="flowGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {[55, 85, 115, 145, 175, 205, 235].map((y) => (
        <g key={y}>
          <path
            d={`M 10 ${y} C 100 ${y}, 115 ${y}, 145 ${y} C 175 ${y}, 180 ${y - 35}, 220 ${y - 35} S 300 ${y}, 430 ${y}`}
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="7 8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-60"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}

      <circle
        cx="220"
        cy="145"
        r="34"
        fill="#ffffff"
        stroke="#64748b"
        strokeWidth="2"
      />
      <circle cx="220" cy="145" r="5" fill="#94a3b8" />

      <text x="20" y="25" fontSize="12" fill="#64748b">
        FLOW DIRECTION →
      </text>
    </svg>
  );
}

function ShockPreview() {
  return (
    <svg
      viewBox="0 0 440 290"
      className="h-full w-full"
      role="img"
      aria-label="Shock wave moving through a tube"
    >
      <rect
        x="30"
        y="82"
        width="380"
        height="112"
        rx="12"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="2"
      />

      <rect x="34" y="86" width="180" height="104" rx="8" fill="#fed7aa" />
      <rect x="214" y="86" width="192" height="104" rx="8" fill="#bae6fd" />

      <path
        d="M214 86 V194"
        stroke="#ea580c"
        strokeWidth="4"
        strokeDasharray="5 5"
      >
        <animate
          attributeName="d"
          values="M214 86 V194;M280 86 V194;M214 86 V194"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle
            cx={65 + i * 29}
            cy="125"
            r="4"
            fill="#c2410c"
          />
          <circle
            cx={65 + i * 29}
            cy="151"
            r="4"
            fill="#c2410c"
          />
          <circle
            cx={250 + i * 29}
            cy="125"
            r="4"
            fill="#0369a1"
          />
          <circle
            cx={250 + i * 29}
            cy="151"
            r="4"
            fill="#0369a1"
          />
        </g>
      ))}

      <text x="70" y="62" fontSize="13" fill="#c2410c">
        High pressure
      </text>
      <text x="270" y="62" fontSize="13" fill="#0369a1">
        Low pressure
      </text>
      <text x="135" y="225" fontSize="12" fill="#64748b">
        Pressure wave travels through the tube
      </text>
    </svg>
  );
}

function DamPreview() {
  return (
    <svg
      viewBox="0 0 440 290"
      className="h-full w-full"
      role="img"
      aria-label="Water flowing from a reservoir after a dam is removed"
    >
      <path
        d="M25 75 H185 V205 H25 Z"
        fill="#67e8f9"
        opacity="0.8"
      />

      <path
        d="M185 75 V205"
        stroke="#64748b"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M190 155 C230 150 245 185 280 190 S350 200 410 200 L410 225 L190 225 Z"
        fill="#22d3ee"
        opacity="0.85"
      >
        <animate
          attributeName="d"
          values="
            M190 155 C230 150 245 185 280 190 S350 200 410 200 L410 225 L190 225 Z;
            M190 155 C230 145 245 160 280 175 S350 185 410 190 L410 225 L190 225 Z;
            M190 155 C230 150 245 185 280 190 S350 200 410 200 L410 225 L190 225 Z
          "
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={220 + i * 42}
          cy={180 + (i % 2) * 12}
          r="4"
          fill="#0284c7"
        >
          <animate
            attributeName="cx"
            values={`${220 + i * 42};${245 + i * 42};${220 + i * 42}`}
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      <text x="45" y="55" fontSize="13" fill="#0e7490">
        Reservoir
      </text>
      <text x="230" y="255" fontSize="12" fill="#64748b">
        Water spreads downstream
      </text>
    </svg>
  );
}

function SimulationVisual({ type }) {
  if (type === "flow") return <FlowPreview />;
  if (type === "shock") return <ShockPreview />;
  return <DamPreview />;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Navigation */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ReactFlow3D logo"
              className="h-11 w-11 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-xl font-bold tracking-tight text-slate-800">
              React<span className="text-sky-600">Flow3D</span>
            </span>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium sm:gap-8">
            <Link href="/math" className="text-slate-600 hover:text-sky-600">
              Maths
            </Link>
            <Link
              href="/physics"
              className="text-slate-600 hover:text-sky-600"
            >
              Physics
            </Link>
            <a
              href="#simulations"
              className="hidden text-slate-600 hover:text-sky-600 sm:block"
            >
              Simulations
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Interactive maths and science
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              See the science.
              <span className="block text-sky-600">Try it yourself.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Work through maths problems and explore physics using visual
              examples, animations, and interactive experiments.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/physics"
                className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700"
              >
                Open Physics
              </Link>
              <Link
                href="/math"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              >
                Open Maths
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Learn at your own pace. Test ideas. See what changes.
            </p>
          </div>

          {/* Animated illustration */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-8 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white p-3 shadow-xl shadow-sky-100/70 sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Flow around an object
                  </p>
                  <p className="text-xs text-slate-500">
                    Visual example
                  </p>
                </div>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                  Fluid mechanics
                </span>
              </div>

              <div className="h-64 sm:h-72">
                <FlowPreview />
              </div>

              <div className="flex flex-wrap gap-2 px-2 pb-2">
                <span className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-700">
                  Flow direction
                </span>
                <span className="rounded-lg bg-cyan-50 px-3 py-2 text-xs text-cyan-700">
                  Streamlines
                </span>
                <span className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700">
                  Obstacle
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject selection */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            Choose a subject
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            What would you like to work on?
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/math"
            className="group rounded-2xl border border-violet-100 bg-violet-50/70 p-6 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60 sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                ∑
              </div>
              <span className="text-2xl text-violet-500 transition group-hover:translate-x-1">
                →
              </span>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-slate-900">Maths</h3>
            <p className="mt-2 max-w-md leading-7 text-slate-600">
              Practise problems, follow worked examples, and build your
              understanding step by step.
            </p>
            <span className="mt-5 inline-block font-semibold text-violet-700">
              Go to Maths →
            </span>
          </Link>

          <Link
            href="/physics"
            className="group rounded-2xl border border-sky-100 bg-sky-50/70 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/60 sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                🌊
              </div>
              <span className="text-2xl text-sky-500 transition group-hover:translate-x-1">
                →
              </span>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-slate-900">Physics</h3>
            <p className="mt-2 max-w-md leading-7 text-slate-600">
              Explore fluid flow, shock waves, cavity flow, nozzles, and other
              physics experiments.
            </p>
            <span className="mt-5 inline-block font-semibold text-sky-700">
              Go to Physics →
            </span>
          </Link>
        </div>
      </section>

      {/* Simulation previews */}
      <section id="simulations" className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                Physics experiments
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Watch what happens
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                Preview a few experiments, then open Physics to choose from
                all eight activities.
              </p>
            </div>
            <Link
              href="/physics"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              All 8 experiments →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment) => (
              <article
                key={experiment.number}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`${experiment.color} relative h-56 p-3`}>
                  <SimulationVisual type={experiment.visual} />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600">
                    Experiment {experiment.number}
                  </span>
                </div>

                <div className="p-5">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: experiment.accent }}
                  >
                    {experiment.topic}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {experiment.title}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                    {experiment.description}
                  </p>
                  <Link
                    href={experiment.route}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900"
                  >
                    Open experiment <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            About ReactFlow3D
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900">
            Learn by changing things and seeing the result.
          </h2>
        </div>

        <div>
          <p className="leading-7 text-slate-600">
            ReactFlow3D is being developed to make science easier to explore
            through interactive learning. The current activities focus on
            maths and physics, with more detailed simulations and 3D learning
            experiences planned for the future.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-50 px-4 py-2 text-sm text-sky-700">
              Visual learning
            </span>
            <span className="rounded-full bg-cyan-50 px-4 py-2 text-sm text-cyan-700">
              Physics simulations
            </span>
            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm text-violet-700">
              Future 3D experiments
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-semibold text-slate-700">ReactFlow3D</span>
            {" "}· Interactive maths and science
          </p>
          <div className="flex gap-5">
            <Link href="/math" className="hover:text-sky-700">
              Maths
            </Link>
            <Link href="/physics" className="hover:text-sky-700">
              Physics
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
