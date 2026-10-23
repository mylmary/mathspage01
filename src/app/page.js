
import Link from "next/link";

function FlowVisual() {
  return (
    <svg
      viewBox="0 0 600 280"
      className="h-full w-full"
      role="img"
      aria-label="Animated fluid flowing around a cylinder"
    >
      <defs>
        <linearGradient id="flowBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#082f49" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="flowColor">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      <rect width="600" height="280" rx="18" fill="url(#flowBg)" />

      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M -20 ${35 + i * 27} C 150 ${35 + i * 27}, 170 ${
            35 + i * 27
          }, 245 ${35 + i * 27} S 410 ${35 + i * 27}, 630 ${
            35 + i * 27
          }`}
          fill="none"
          stroke="#164e63"
          strokeWidth="1"
        />
      ))}

      {[-70, -45, -20, 0, 20, 45, 70].map((offset, i) => (
        <path
          key={i}
          d={`M -20 ${140 + offset}
              C 120 ${140 + offset}, 180 ${140 + offset},
              220 ${140 + offset * 1.9}
              C 270 ${140 + offset * 2.5}, 340 ${
                140 + offset * 2.5
              }, 380 ${140 + offset * 1.9}
              C 430 ${140 + offset}, 480 ${140 + offset}, 620 ${
                140 + offset
              }`}
          fill="none"
          stroke="url(#flowColor)"
          strokeWidth="1.8"
          strokeDasharray="7 8"
          opacity={0.9}
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-120"
            dur={`${2 + i * 0.18}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      <circle
        cx="300"
        cy="140"
        r="42"
        fill="#0f172a"
        stroke="#67e8f9"
        strokeWidth="2.5"
      />
      <circle cx="288" cy="127" r="12" fill="#164e63" opacity=".8" />
      <text
        x="300"
        y="145"
        fill="#e0f2fe"
        fontSize="12"
        textAnchor="middle"
      >
        CYLINDER
      </text>

      <text x="22" y="25" fill="#67e8f9" fontSize="11">
        FLOW VISUALISATION
      </text>
      <text x="22" y="258" fill="#94a3b8" fontSize="11">
        Velocity field · Illustrative preview
      </text>
    </svg>
  );
}

function DamVisual() {
  return (
    <svg
      viewBox="0 0 500 220"
      className="h-full w-full"
      role="img"
      aria-label="Animated water moving after a dam barrier opens"
    >
      <defs>
        <linearGradient id="waterColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      <rect width="500" height="220" rx="14" fill="#0f172a" />

      <path
        d="M0 60 H175 V175 H0Z"
        fill="#075985"
        opacity=".35"
      />

      <path
        d="M0 65 H165 V175 H0Z"
        fill="url(#waterColor)"
        opacity=".8"
      >
        <animate
          attributeName="d"
          values="M0 65 H165 V175 H0Z;M0 65 H145 V175 H0Z;M0 65 H165 V175 H0Z"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      <path d="M175 38 V176" stroke="#94a3b8" strokeWidth="9" />
      <path d="M175 38 V176" stroke="#e2e8f0" strokeWidth="2" />

      <path
        d="M185 145 Q225 120 250 145 T315 145 T380 145 T500 145 V180 H185Z"
        fill="url(#waterColor)"
        opacity=".85"
      >
        <animate
          attributeName="d"
          values="M185 145 Q225 120 250 145 T315 145 T380 145 T500 145 V180 H185Z;M185 145 Q225 160 250 140 T315 150 T380 135 T500 145 V180 H185Z;M185 145 Q225 120 250 145 T315 145 T380 145 T500 145 V180 H185Z"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </path>

      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} r="3" fill="#bae6fd">
          <animateMotion
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
            path={`M ${185 + i * 5} ${115 + i * 8} Q 280 ${
              75 + i * 12
            } 460 ${110 + i * 9}`}
          />
        </circle>
      ))}

      <path d="M0 180 H500" stroke="#64748b" strokeWidth="2" />
      <text x="18" y="25" fill="#67e8f9" fontSize="11">
        DAM-BREAK FLOW
      </text>
      <text x="18" y="204" fill="#94a3b8" fontSize="10">
        Free-surface flow · Illustrative preview
      </text>
    </svg>
  );
}

function ShockVisual() {
  return (
    <svg
      viewBox="0 0 500 220"
      className="h-full w-full"
      role="img"
      aria-label="Animated shock wave travelling through a tube"
    >
      <defs>
        <linearGradient id="shockBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7f1d1d" />
          <stop offset="45%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
      </defs>

      <rect width="500" height="220" rx="14" fill="#0f172a" />

      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={i * 64}
          y="55"
          width="63"
          height="110"
          fill={i < 3 ? "#7f1d1d" : "#075985"}
          opacity=".35"
        />
      ))}

      <path d="M15 55 H485 M15 165 H485" stroke="#64748b" strokeWidth="2" />

      <path
        d="M125 55 L175 110 L125 165"
        fill="none"
        stroke="#fb7185"
        strokeWidth="3"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;230 0;0 0"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle
            cx={30 + i * 15}
            cy={80 + (i % 3) * 28}
            r="3"
            fill="#fda4af"
          >
            <animate
              attributeName="cx"
              values={`${30 + i * 15};${220 + i * 25};${30 + i * 15}`}
              dur={`${3 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      <text x="18" y="28" fill="#fda4af" fontSize="11">
        SHOCK TUBE
      </text>
      <text x="18" y="200" fill="#94a3b8" fontSize="10">
        Compressible flow · Illustrative preview
      </text>
    </svg>
  );
}

function LabCard({ href, title, description, children, label }) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-500"
    >
      <div className="overflow-hidden bg-slate-950">{children}</div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          {label}
        </p>
        <h3 className="mt-2 text-xl font-bold group-hover:text-cyan-300">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
        <p className="mt-5 text-sm font-medium text-cyan-400">
          Open experiment →
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">

        {/* Brand navigation */}
        <nav className="mb-10 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ReactFlow3D logo"
              className="h-12 w-12 rounded-xl object-contain"
            />
            <span className="text-lg font-bold tracking-tight sm:text-xl">
              ReactFlow<span className="text-cyan-400">3D</span>
            </span>
          </Link>

          <div className="flex gap-4 text-sm text-slate-300">
            <Link href="/math" className="hover:text-cyan-300">
              Maths
            </Link>
            <Link href="/physics" className="hover:text-cyan-300">
              Physics
            </Link>
          </div>
        </nav>

        {/* Hero: compact text, large scientific visual */}
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Interactive mathematics & physics
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              See the physics.
              <span className="block text-cyan-400">
                Test what happens.
              </span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              ReactFlow3D is a learning platform built around interactive
              science experiments. Explore fluid motion, shock waves, and
              mathematical concepts, then work through questions related
              to what you observe.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/physics"
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Explore physics →
              </Link>
              <Link
                href="/math"
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-500"
              >
                Open maths lab
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Starting with browser-based experiments, with 3D and
              AI-assisted learning as longer-term directions.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-2xl shadow-cyan-950/20">
            <FlowVisual />
          </div>
        </section>

        {/* Live-looking experiment previews */}
        <section className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Inside the lab
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Physics in motion
              </h2>
            </div>

            <Link
              href="/physics"
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              All physics experiments →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <LabCard
              href="/physics/flow-lines"
              label="Fluid mechanics"
              title="Flow Lines"
              description="Follow the paths of moving fluid and examine how flow behaves."
            >
              <div className="aspect-[16/9]">
                <FlowVisual />
              </div>
            </LabCard>

            <LabCard
              href="/physics/dam-break"
              label="Free-surface flow"
              title="Dam Break"
              description="Watch water spread after a barrier is removed."
            >
              <div className="aspect-[16/9]">
                <DamVisual />
              </div>
            </LabCard>

            <LabCard
              href="/physics/sod-shock-tube"
              label="Compressible flow"
              title="Shock Tube"
              description="Explore the movement of shock waves and changes in flow conditions."
            >
              <div className="aspect-[16/9]">
                <ShockVisual />
              </div>
            </LabCard>
          </div>
        </section>

        {/* Existing subject cards, same routes and colour family */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Choose a learning lab
          </h2>
          <p className="mt-2 text-slate-400">
            Start with mathematics or move straight into a physics experiment.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Link
              href="/math"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-cyan-500"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-950 text-3xl">
                ∑
              </div>
              <h3 className="text-2xl font-bold group-hover:text-cyan-300">
                Mathematics
              </h3>
              <p className="mt-3 leading-7 text-slate-400">
                Practise concepts and solve problems, with room to connect
                mathematical ideas to scientific applications.
              </p>
              <p className="mt-6 font-medium text-cyan-400">
                Enter Maths Lab →
              </p>
            </Link>

            <Link
              href="/physics"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-cyan-500"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-950 text-3xl">
                ⚛
              </div>
              <h3 className="text-2xl font-bold group-hover:text-cyan-300">
                Physics
              </h3>
              <p className="mt-3 leading-7 text-slate-400">
                Explore fluid mechanics, aerodynamics, shock waves, and
                computational physics experiments.
              </p>
              <p className="mt-6 font-medium text-cyan-400">
                Enter Physics Lab →
              </p>
            </Link>
          </div>
        </section>

        {/* About: short and specific */}
        <section className="mt-20 grid gap-8 border-t border-slate-800 pt-12 md:grid-cols-2 md:gap-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              About ReactFlow3D
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Built around curiosity about how things move.
            </h2>
          </div>

          <div className="space-y-4 leading-7 text-slate-300">
            <p>
              ReactFlow3D began with an interest in computational fluid
              dynamics: using mathematics and computing to study how water
              and air move.
            </p>
            <p>
              The project brings that interest into science learning.
              Rather than only reading about a physical process, learners
              should be able to examine a visual example, ask questions,
              and explore the principles behind it.
            </p>
            <p>
              We are developing the platform in stages, starting with
              interactive browser-based activities and working towards
              more advanced geometry-based simulations.
            </p>
          </div>
        </section>

        {/* What comes next */}
        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 text-2xl">〰️</div>
            <h3 className="font-semibold">Fluid simulation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Study flow around objects, free surfaces, and changing
              geometries.
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 text-2xl">🧠</div>
            <h3 className="font-semibold">AI-assisted learning</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Develop learning activities that can respond to students'
              answers and areas of difficulty.
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 text-2xl">◈</div>
            <h3 className="font-semibold">3D and immersive experiments</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Work towards interactive three-dimensional and VR experiences
              for exploring physical systems.
            </p>
          </article>
        </section>

        <footer className="mt-16 border-t border-slate-800 py-7 text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>
              <span className="font-semibold text-slate-300">ReactFlow3D</span>
              {" "}· Mathematics, physics, and computational science
            </p>
            <div className="flex gap-5">
              <Link href="/math" className="hover:text-cyan-300">
                Maths
              </Link>
              <Link href="/physics" className="hover:text-cyan-300">
                Physics
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
