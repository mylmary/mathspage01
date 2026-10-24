
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const experiments = [
  {
    number: "01",
    title: "Flow Lines",
    route: "/physics/flow-lines",
    description:
      "Investigate streamlines, velocity fields, and fluid motion around obstacles.",
    topic: "Fluid mechanics",
    category: "Fundamentals",
    video: "/simulations/flow-lines.mp4",
  },
  {
    number: "02",
    title: "Sod Shock Tube",
    route: "/physics/sod-shock-tube",
    description:
      "Explore shock waves, expansion waves, and pressure and density changes.",
    topic: "Compressible flow",
    category: "Compressible",
    video: "/simulations/sod-shock-tube.mp4",
  },
  {
    number: "03",
    title: "Lid-Driven Cavity",
    route: "/physics/lid-driven-cavity",
    description:
      "Investigate recirculation, vortex formation, and Reynolds number.",
    topic: "Incompressible flow",
    category: "Fundamentals",
    video: "/simulations/lid-driven-cavity.mp4",
  },
  {
    number: "04",
    title: "Flow Around a Cylinder",
    route: "/physics/cylinder-flow",
    description:
      "Study flow separation, wake formation, drag, and vortex shedding.",
    topic: "External aerodynamics",
    category: "Aerodynamics",
    video: "/simulations/cylinder-flow.mp4",
  },
  {
    number: "05",
    title: "Nozzle Flow",
    route: "/physics/nozzle",
    description:
      "Examine how passage area affects velocity, pressure, and choking.",
    topic: "Internal flow",
    category: "Compressible",
    video: "/simulations/nozzle.mp4",
  },
  {
    number: "06",
    title: "Flat-Plate Boundary Layer",
    route: "/physics/flat-plate",
    description:
      "Observe boundary-layer growth and the effects of viscosity.",
    topic: "Viscous flow",
    category: "Aerodynamics",
    video: "/simulations/flat-plate.mp4",
  },
  {
    number: "07",
    title: "NACA 0012 Airfoil",
    route: "/physics/naca0012",
    description:
      "Explore pressure distribution, lift, and separation at different angles of attack.",
    topic: "Airfoil aerodynamics",
    category: "Aerodynamics",
    video: "/simulations/naca0012.mp4",
  },
  {
    number: "08",
    title: "Dam Break",
    route: "/physics/dam-break",
    description:
      "Investigate transient free-surface motion and gravity-driven waves.",
    topic: "Free-surface flow",
    category: "Multiphase",
    video: "/simulations/dam-break.mp4",
  },
  {
    number: "09",
    title: "Magic Fluids",
    route: "/physics/magic-fluids",
    description:
      "Explore interactive fluid patterns and how obstacles change the motion.",
    topic: "Interactive fluid dynamics",
    category: "Interactive",
    video: "/simulations/magic-fluids.mp4",
  },
];

const categories = [
  "All experiments",
  "Fundamentals",
  "Aerodynamics",
  "Compressible",
  "Multiphase",
  "Interactive",
];

function BrandMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 70"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 25 25 5 49 29 68 10 90 32 90 39 96 42 96 53 90 57 86 63 64 63 64 56 54 56 54 63 20 63 12 58 10 52 5 52 5 39 9 36 9 30Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M25 5 62 63"
        stroke="#43D9F2"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SimulationVideo({ src, title, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center bg-[#10051B] p-5 text-center">
        <div>
          <p className="text-sm font-medium text-slate-200">
            Simulation footage unavailable
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Add the exported CFD video to its path in public/simulations/.
          </p>
        </div>
      </div>
    );
  }

  return (
    <video
      className={`block h-full w-full bg-black object-contain ${className}`}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="metadata"
      aria-label={title}
      onError={() => setFailed(true)}
    >
      Your browser does not support HTML video.
    </video>
  );
}

function HeroSimulation() {
  const [viewerMode, setViewerMode] = useState("video");

  const viewerUrl = process.env.NEXT_PUBLIC_OMNIVERSE_VIEWER_URL;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#10051B] shadow-2xl shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Simulation laboratory
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white sm:text-base">
            Flow around a cylinder
          </h2>
        </div>

        <div className="flex rounded-lg border border-white/10 p-1">
          <button
            type="button"
            onClick={() => setViewerMode("video")}
            aria-pressed={viewerMode === "video"}
            className={`rounded-md px-3 py-2 text-xs transition ${
              viewerMode === "video"
                ? "bg-cyan-300 text-[#10051B]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Video
          </button>

          <button
            type="button"
            onClick={() => setViewerMode("3d")}
            aria-pressed={viewerMode === "3d"}
            className={`rounded-md px-3 py-2 text-xs transition ${
              viewerMode === "3d"
                ? "bg-cyan-300 text-[#10051B]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live 3D
          </button>
        </div>
      </div>

      <div className="aspect-[4/3] bg-black sm:aspect-[5/3]">
        {viewerMode === "video" ? (
          <SimulationVideo
            src="/simulations/cylinder-flow.mp4"
            title="CFD simulation of flow around a cylinder"
          />
        ) : viewerUrl ? (
          <iframe
            src={viewerUrl}
            title="Interactive NVIDIA Omniverse simulation"
            className="h-full w-full border-0"
            allow="fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="max-w-sm">
              <BrandMark className="mx-auto mb-5 h-12 w-16 text-cyan-300" />
              <h3 className="font-semibold text-white">
                Connect the live 3D viewer
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Configure your deployed Omniverse streaming application
                through NEXT_PUBLIC_OMNIVERSE_VIEWER_URL.
              </p>
              <a
                href="https://docs.omniverse.nvidia.com/embedded-web-viewer/latest/workflow/streaming-and-messaging.html"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex text-sm text-cyan-300 hover:text-cyan-200"
              >
                NVIDIA viewer documentation ↗
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
        {[
          ["PHENOMENON", "Vortex shedding"],
          ["FIELD", "Velocity"],
          ["GEOMETRY", "Cylinder"],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 p-3 sm:p-4">
            <p className="text-[9px] tracking-wider text-slate-500">
              {label}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-200 sm:text-sm">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhysicsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All experiments");

  const filteredExperiments = useMemo(() => {
    const term = query.trim().toLowerCase();

    return experiments.filter((experiment) => {
      const categoryMatches =
        activeCategory === "All experiments" ||
        experiment.category === activeCategory;

      const searchableText = [
        experiment.title,
        experiment.description,
        experiment.topic,
        experiment.category,
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatches && searchableText.includes(term);
    });
  }, [query, activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0611] text-white selection:bg-cyan-300/25">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        .experiment-card {
          transition:
            border-color 220ms ease,
            background-color 220ms ease,
            transform 220ms ease;
        }

        .experiment-card:hover {
          transform: translateY(-4px);
          border-color: rgba(67, 217, 242, 0.38);
          background-color: rgba(255, 255, 255, 0.045);
        }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/[0.08]">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <BrandMark className="h-10 w-12 text-white transition-transform duration-300 group-hover:scale-105" />
            <span className="text-base font-semibold tracking-tight sm:text-lg">
              ReactFlow<span className="text-cyan-300">3D</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <a
              href="#experiments"
              className="text-sm text-slate-300 transition hover:text-cyan-300"
            >
              Experiments
            </a>
            <a
              href="#learn"
              className="text-sm text-slate-300 transition hover:text-cyan-300"
            >
              What you can learn
            </a>
            <Link
              href="/"
              className="text-sm text-slate-300 transition hover:text-cyan-300"
            >
              Home
            </Link>
          </div>

          <a
            href="#experiments"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-cyan-300 px-3 py-2.5 text-xs font-semibold text-[#10051B] transition hover:bg-cyan-200 sm:px-4 sm:text-sm"
          >
            Enter the lab ↗
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative border-b border-white/[0.07]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_12%,rgba(96,34,125,0.23),transparent_40%),radial-gradient(ellipse_at_90%_70%,rgba(24,157,183,0.09),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3.5 py-2">
              <BrandMark className="h-5 w-7 text-cyan-300" />
              <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-200 sm:text-xs">
                Interactive CFD laboratory
              </span>
            </div>

            <h1 className="text-[clamp(2.8rem,6.5vw,5.7rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
              Understand
              <br />
              the physics.
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-white bg-clip-text text-transparent">
                See the flow.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Explore computational fluid dynamics through simulation
              footage and interactive experiments. Investigate physical
              phenomena and connect your observations to the equations
              behind fluid motion.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#experiments"
                className="inline-flex items-center gap-3 rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-semibold text-[#10051B] transition hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Explore experiments ↓
              </a>

              <a
                href="#learn"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-white/[0.04]"
              >
                What will I learn?
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-semibold">09</p>
                <p className="mt-1 text-xs text-slate-500">Experiments</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">06</p>
                <p className="mt-1 text-xs text-slate-500">Categories</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">3D</p>
                <p className="mt-1 text-xs text-slate-500">
                  Viewer-ready design
                </p>
              </div>
            </div>
          </div>

          <HeroSimulation />
        </div>
      </section>

      {/* Experiments */}
      <section
        id="experiments"
        className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.22em] text-cyan-300">
              The experiment library
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Pick a flow. Ask a question.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Explore fluid mechanics, compressible flow, boundary layers,
              and aerodynamics through individual physical problems.
            </p>
          </div>

          <p className="shrink-0 text-sm text-slate-500">
            <span className="font-semibold text-white">
              {String(filteredExperiments.length).padStart(2, "0")}
            </span>{" "}
            of {String(experiments.length).padStart(2, "0")} experiments
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
          <label className="relative block w-full md:max-w-sm">
            <span className="sr-only">Search experiments</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search physics, flow, vortices..."
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
            {categories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-xs font-medium transition sm:text-sm ${
                    active
                      ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredExperiments.map((experiment) => (
            <Link
              key={experiment.route}
              href={experiment.route}
              className="experiment-card group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] font-medium tracking-[.14em] text-slate-500">
                  EXP. {experiment.number}
                </span>
                <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-1.5 text-[10px] text-cyan-200 sm:text-xs">
                  {experiment.category}
                </span>
              </div>

              <div className="relative my-5 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                <SimulationVideo
                  src={experiment.video}
                  title={`${experiment.title} simulation preview`}
                  className="transition duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <h3 className="text-lg font-semibold tracking-tight text-white transition group-hover:text-cyan-200 sm:text-xl">
                {experiment.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
                {experiment.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                <span className="text-xs text-slate-500">
                  {experiment.topic}
                </span>
                <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-cyan-300">
                  Open experiment →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-lg font-medium text-white">
              No matching experiments
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try another search term or browse all experiments.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All experiments");
              }}
              className="mt-5 rounded-lg border border-cyan-300/30 px-4 py-2.5 text-sm text-cyan-200 transition hover:bg-cyan-300/10"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Learning outcomes */}
      <section id="learn" className="border-y border-white/[0.07] bg-[#10091A]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.22em] text-cyan-300">
                Learn through physical phenomena
              </p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Connect what you see to the equations.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                Build an understanding of the phenomena behind CFD and
                investigate how geometry, boundary conditions, and
                modelling assumptions affect flow.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Fluid mechanics",
                  description:
                    "Streamlines, vorticity, circulation, and boundary layers.",
                },
                {
                  number: "02",
                  title: "Compressible flow",
                  description:
                    "Shock waves, expansion waves, pressure, and density.",
                },
                {
                  number: "03",
                  title: "Aerodynamics",
                  description:
                    "Flow separation, pressure distribution, lift, and drag.",
                },
                {
                  number: "04",
                  title: "Numerical methods",
                  description:
                    "Boundary conditions, discretization, and modelling limitations.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-cyan-300/20"
                >
                  <span className="text-xs font-medium tracking-[.15em] text-cyan-300">
                    {item.number}
                  </span>
                  <h3 className="mt-4 font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-2xl border border-cyan-300/20 bg-[#0B0611] p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">
              Start with a physical question
            </p>
            <div className="mt-3 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  What happens when the flow changes?
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Choose a geometry, inspect the flow, and build your
                  understanding one experiment at a time.
                </p>
              </div>
              <Link
                href="/physics/flow-lines"
                className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-semibold text-[#10051B] transition hover:bg-cyan-200 sm:self-auto"
              >
                Start exploring ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark className="h-7 w-9 text-white" />
          <span className="text-sm font-semibold">
            ReactFlow<span className="text-cyan-300">3D</span>
          </span>
        </Link>

        <p className="text-xs leading-5 text-slate-500">
          An interactive space for computational fluid dynamics.
        </p>

        <a
          href="#experiments"
          className="text-xs text-slate-400 transition hover:text-cyan-300"
        >
          Back to experiments ↑
        </a>
      </footer>
    </main>
  );
}
