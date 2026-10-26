
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AskMini from "@/components/AskMini";

const EXPERIMENTS = [
  {
    title: "Cylinder Flow",
    description: "Explore flow separation and vortex shedding around a cylinder.",
    href: "/physics/cylinder-flow",
    video: "/simulations/cylinder-flow.mp4",
    category: "Fluid Mechanics",
    tags: ["Flow", "Vortices"],
  },
  {
    title: "Lid-Driven Cavity",
    description: "Investigate recirculation and velocity patterns inside a cavity.",
    href: "/physics/lid-driven-cavity",
    video: "/simulations/lid-driven-cavity.mp4",
    category: "Fluid Mechanics",
    tags: ["Recirculation", "Velocity"],
  },
  {
    title: "Sod Shock Tube",
    description: "Observe shock waves and discontinuities in compressible flow.",
    href: "/physics/sod-shock-tube",
    video: "/simulations/sod-shock-tube.mp4",
    category: "Compressible Flow",
    tags: ["Shock Waves", "Density"],
  },
  {
    title: "Flow Lines",
    description: "Visualise streamlines and understand how fluids move.",
    href: "/physics/flow-lines",
    video: "/simulations/flow-lines.mp4",
    category: "Fluid Mechanics",
    tags: ["Streamlines", "Visualisation"],
  },
  {
    title: "Nozzle Flow",
    description: "Study how changing nozzle geometry affects fluid velocity.",
    href: "/physics/nozzle",
    video: "/simulations/nozzle.mp4",
    category: "Compressible Flow",
    tags: ["Nozzle", "Velocity"],
  },
  {
    title: "Flat Plate",
    description: "Explore boundary-layer development along a flat plate.",
    href: "/physics/flat-plate",
    video: "/simulations/flat-plate.mp4",
    category: "Aerodynamics",
    tags: ["Boundary Layer", "Drag"],
  },
  {
    title: "NACA 0012 Airfoil",
    description: "Investigate airflow around a symmetric airfoil.",
    href: "/physics/naca0012",
    video: "/simulations/naca0012.mp4",
    category: "Aerodynamics",
    tags: ["Airfoil", "Lift"],
  },
  {
    title: "Dam Break",
    description: "Watch the evolution of a free-surface flow after a dam break.",
    href: "/physics/dam-break",
    video: "/simulations/dam-break.mp4",
    category: "Free-Surface Flow",
    tags: ["Water", "Free Surface"],
  },
];

const CATEGORIES = [
  "All",
  ...new Set(EXPERIMENTS.map((experiment) => experiment.category)),
];

function BrandMark() {
  return (
    <Link href="/physics" className="group inline-flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-lg font-black text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
        R
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        ReactFlow<span className="text-blue-600">3D</span>
      </span>
    </Link>
  );
}

function SimulationVideo({ src, title }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full min-h-48 overflow-hidden bg-slate-950">
      {!failed ? (
        <video
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          aria-label={`${title} simulation preview`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 p-6 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-2xl text-cyan-300">
            ◈
          </div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-400">
            Simulation preview
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/10" />

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Preview
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-lg font-bold text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-300">
          Interactive physics environment
        </p>
      </div>
    </div>
  );
}

function HeroSimulation() {
  const [mode, setMode] = useState("preview");
  const viewerUrl = process.env.NEXT_PUBLIC_OMNIVERSE_VIEWER_URL;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-violet-500/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl shadow-blue-950/30">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">
              Physics Simulation
            </p>
            <p className="text-xs text-slate-400">
              Explore fluid behaviour
            </p>
          </div>

          <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                mode === "preview"
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              Preview
            </button>

            <button
              type="button"
              onClick={() => setMode("live")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                mode === "live"
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              Live 3D
            </button>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden">
          {mode === "preview" ? (
            <>
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/simulations/cylinder-flow.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5">
                <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200 backdrop-blur">
                  Fluid dynamics
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  See the science in motion.
                </h3>
              </div>
            </>
          ) : viewerUrl ? (
            <iframe
              title="Live 3D Physics Viewer"
              src={viewerUrl}
              className="absolute inset-0 h-full w-full border-0 bg-slate-950"
              allow="fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 px-6 text-center">
              <div className="mb-5 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-3xl text-cyan-300">
                ◈
              </div>

              <h3 className="text-xl font-bold text-white">
                Live 3D Viewer
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
                Configure your 3D viewer URL to enable the live simulation
                experience.
              </p>

              <p className="mt-4 rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-cyan-200">
                NEXT_PUBLIC_OMNIVERSE_VIEWER_URL
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExperimentCard({ experiment }) {
  return (
    <Link
      href={`/signin?callbackUrl=${encodeURIComponent(experiment.href)}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-xl hover:shadow-blue-950/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      <SimulationVideo src={experiment.video} title={experiment.title} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
            {experiment.category}
          </span>
          <span className="text-lg text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-600">
            →
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
          {experiment.title}
        </h3>

        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
          {experiment.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {experiment.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-blue-700">
            Sign in to explore
          </span>
          <span className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function PlatformPageCard({ title, description, href, icon }) {
  return (
    <Link
      href={href}
      className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 sm:p-6"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 text-2xl text-blue-700 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-slate-900 transition-colors group-hover:text-blue-700">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
          Open page
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function PhysicsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredExperiments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return EXPERIMENTS.filter((experiment) => {
      const matchesCategory =
        activeCategory === "All" ||
        experiment.category === activeCategory;

      const searchableText = [
        experiment.title,
        experiment.description,
        experiment.category,
        ...experiment.tags,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <BrandMark />

          <nav className="flex items-center gap-3">
            <a
              href="#experiments"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-blue-700 sm:inline-flex"
            >
              Experiments
            </a>

            <a
              href="#platform-pages"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-blue-700 sm:inline-flex"
            >
              Platform
            </a>

            <Link
              href="/signin"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full border border-cyan-200/50" />
          <div className="absolute left-1/2 top-20 h-52 w-52 -translate-x-1/2 rounded-full border border-blue-200/50" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="animate-[fadeInUp_0.7s_ease-out_both]">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              Interactive Physics Laboratory
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Explore physics.
              <span className="mt-2 block bg-gradient-to-r from-cyan-600 via-blue-700 to-violet-700 bg-clip-text text-transparent">
                Visualise every flow.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover fluid mechanics, aerodynamics and wave behaviour
              through animated previews and immersive 3D simulations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#experiments"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-800"
              >
                Explore experiments <span>↓</span>
              </a>

              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700"
              >
                Sign in to get started
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-2xl font-black text-slate-900">08</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Experiments
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">3D</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Visualisation
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">Live</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Previews
                </p>
              </div>
            </div>
          </div>

          <div className="animate-[fadeInUp_0.9s_ease-out_both]">
            <HeroSimulation />
          </div>
        </div>
      </section>

      {/* Experiment library */}
      <section id="experiments" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
                Experiment Library
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Choose your next experiment
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Search the library or filter by subject. Select an experiment
                to sign in before opening its simulation.
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              <label htmlFor="experiment-search" className="sr-only">
                Search experiments
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                  ⌕
                </span>
                <input
                  id="experiment-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search experiments..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-700/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-blue-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredExperiments.map((experiment, index) => (
              <div
                key={experiment.href}
                className="animate-[fadeInUp_0.5s_ease-out_both]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <ExperimentCard experiment={experiment} />
              </div>
            ))}
          </div>

          {filteredExperiments.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="text-lg font-bold text-slate-800">
                No experiments found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try another search term or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-5 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* The two new pages at the bottom */}
      <section
        id="platform-pages"
        className="scroll-mt-24 border-t border-slate-200 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
              Platform
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Your physics workspace
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Access the teaching dashboard or open the student simulation
              laboratory.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <PlatformPageCard
              title="Teacher's Dashboard"
              description="Access teaching tools and your physics dashboard."
              href="/physics/teacher"
              icon="▦"
            />

            <PlatformPageCard
              title="Student Simulation Lab"
              description="Enter the student laboratory and explore simulations."
              href="/physics/lab"
              icon="⚛"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <BrandMark />
          <p className="text-sm text-slate-500">
            Interactive experiments in fluid mechanics and scientific computing.
          </p>
          <Link
            href="/signin"
            className="text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
          >
            Sign in →
          </Link>
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
  );
}
