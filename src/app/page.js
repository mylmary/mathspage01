
import Link from "next/link";
import AskMini from "@/components/AskMini";
const simulations = [
  {
    title: "Flow around a cylinder",
    description: "Vortex formation behind an obstacle.",
    source: "Tensorion / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:K%C3%A1rm%C3%A1n_vortex_street_Navier-Stokes_CFD_simulation_in_2D.gif",
    embed: "https://www.youtube-nocookie.com/embed/5jr2ChgVPnE",
  },
  {
    title: "Airflow over an airfoil",
    description: "Velocity and pressure around an airfoil.",
    source: "FetchCFD · OpenFOAM",
    href: "https://fetchcfd.com/view-project/306-Simulation-of-air-flow-around-airfoil-using-OpenFOAM",
    embed:
      "https://fetchcfd.com/embed-project/306-simulation-of-air-flow-around-airfoil-using-openfoam",
  },
  {
    title: "Dam failure",
    description: "Water levels and the stability of a dam.",
    source: "DCS Computing GmbH",
    href: "https://vimeo.com/295525556",
    embed: "https://player.vimeo.com/video/295525556",
  },
];

function SimulationCard({ item }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-video bg-slate-950">
        <iframe
          src={item.embed}
          title={item.title}
          className="h-full w-full border-0"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
        <p className="mt-3 text-xs text-slate-400">
          {item.source}
        </p>
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-sm font-medium text-cyan-800 hover:text-cyan-600"
        >
          View original simulation ↗
        </a>
      </div>
    </article>
  );
}

function LabCard({ href, symbol, title, description }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-slate-200/60 sm:p-8"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-2xl text-cyan-800">
        {symbol}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 group-hover:text-cyan-800">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>

      <p className="mt-6 text-sm font-semibold text-cyan-800">
        Enter {title === "Mathematics" ? "Maths" : title} Lab →
      </p>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            ReactFlow<span className="text-cyan-700">3D</span>
          </Link>

          <div className="flex items-center gap-5 text-sm font-medium">
            <Link
              href="/math"
              className="hidden text-slate-600 hover:text-cyan-800 sm:block"
            >
              Mathematics
            </Link>
            <Link
              href="/physics"
              className="hidden text-slate-600 hover:text-cyan-800 sm:block"
            >
              Physics
            </Link>
            <Link
              href="/physics"
              className="rounded-lg bg-[#260d32] px-4 py-2.5 text-white hover:bg-cyan-900"
            >
              Physics Lab →
            </Link>
                <a
                href="https://median.co/share/rdayxwa#androidphone"
                  target="_blank"
                    rel="noopener noreferrer"
                      className="rounded-lg bg-cyan-700 px-4 py-2.5 text-white transition hover:bg-cyan-800"
                        >
                        Download app ↓
                        </a>

          </div>
        </div>
      </nav>

      {/* Introduction */}
      <header className="relative overflow-hidden border-b border-slate-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full border border-cyan-200/70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 rounded-full border border-cyan-200/60"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-800">
              ReactFlow3D · Interactive Learning Lab
            </p>

            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Explore fluid mechanics through mathematics and physics.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
              Through a self-directed virtual laboratory environment, users can actively manipulate variables to analyze real-world fluid behavior. To get started with learning, select Mathematics or Physics below.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/physics"
                className="rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
              >
                Explore Physics →
              </Link>
              <Link
                href="/math"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-cyan-500"
              >
                Mathematics
              </Link>
            </div>
          </div>

          {/* Actual CFD animation */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60 sm:p-4">
            <div className="flex items-center justify-between gap-3 px-2 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  CFD SIMULATION
                </p>
                <h2 className="mt-1 font-semibold text-slate-900">
                  Flow around a cylinder
                </h2>
              </div>
              <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs text-cyan-800">
                Navier–Stokes
              </span>
            </div>

            <div className="aspect-video overflow-hidden rounded-xl bg-slate-950">
              <iframe
                src="https://www.youtube-nocookie.com/embed/5jr2ChgVPnE"
                title="Navier–Stokes CFD simulation of a vortex street"
                className="h-full w-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <a
              href="https://commons.wikimedia.org/wiki/File:K%C3%A1rm%C3%A1n_vortex_street_Navier-Stokes_CFD_simulation_in_2D.gif"
              target="_blank"
              rel="noreferrer"
              className="mt-3 block px-2 text-xs leading-5 text-slate-500 hover:text-cyan-800"
            >
              Animation and attribution details ↗
            </a>
          </div>
        </div>
      </header>

      {/* Actual simulation examples */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Fluid mechanics
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Examples of fluid motion and computational physics.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {simulations.map((item) => (
              <SimulationCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning labs */}
      <section
        id="learning-labs"
        className="border-y border-slate-200 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Learning labs
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Choose a subject to practise concepts and answer questions.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <LabCard
              href="/math"
              symbol="∑"
              title="Mathematics"
              description="Practise mathematical concepts, work through questions, and understand how mathematical ideas are used to solve problems."
            />

            <LabCard
              href="/physics"
              symbol="⚛"
              title="Physics"
              description="Investigate fluid mechanics, aerodynamics, shock waves, and other physical phenomena through computational physics experiments."
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-800">
              About ReactFlow3D
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Making physical phenomena easier to explore.
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
            <p>
              ReactFlow3D grew out of an interest in computational fluid
              dynamics (CFD), the study of how fluids such as water and air
              move.
            </p>
            <p>
              In a textbook, a flow pattern may appear as a diagram or a set
              of equations. In an experiment, the same phenomenon can be
              investigated by changing conditions and observing the result.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-semibold text-slate-800">
            ReactFlow3D
          </p>
          <p className="text-slate-500">
            Interactive learning in mathematics, physics, and computational
            science.
          </p>
        </div>
      </footer>
              {/* Keep AskMini */}
      <AskMini />

      {/* Local animation styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
    </main>
  );
}
