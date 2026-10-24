
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const experiments = [
  {
    number: "01",
    title: "Flow Lines",
    route: "/physics/flow-lines",
    description: "Investigate streamlines, velocity fields, and fluid motion around obstacles.",
    topic: "Fluid mechanics",
    category: "Fundamentals",
    video: "/simulations/flow-lines.mp4",
  },
  {
    number: "02",
    title: "Sod Shock Tube",
    route: "/physics/sod-shock-tube",
    description: "Explore shock waves, expansion waves, and pressure and density changes.",
    topic: "Compressible flow",
    category: "Compressible",
    video: "/simulations/sod-shock-tube.mp4",
  },
  {
    number: "03",
    title: "Lid-Driven Cavity",
    route: "/physics/lid-driven-cavity",
    description: "Investigate recirculation, vortex formation, and Reynolds number.",
    topic: "Incompressible flow",
    category: "Fundamentals",
    video: "/simulations/lid-driven-cavity.mp4",
  },
  {
    number: "04",
    title: "Flow Around a Cylinder",
    route: "/physics/cylinder-flow",
    description: "Study flow separation, wake formation, drag, and vortex shedding.",
    topic: "External aerodynamics",
    category: "Aerodynamics",
    video: "/simulations/cylinder-flow.mp4",
  },
  {
    number: "05",
    title: "Nozzle Flow",
    route: "/physics/nozzle",
    description: "Examine how passage area affects velocity, pressure, and choking.",
    topic: "Internal flow",
    category: "Compressible",
    video: "/simulations/nozzle.mp4",
  },
  {
    number: "06",
    title: "Flat-Plate Boundary Layer",
    route: "/physics/flat-plate",
    description: "Observe boundary-layer growth and the effects of viscosity.",
    topic: "Viscous flow",
    category: "Aerodynamics",
    video: "/simulations/flat-plate.mp4",
  },
  {
    number: "07",
    title: "NACA 0012 Airfoil",
    route: "/physics/naca0012",
    description: "Explore pressure distribution, lift, and separation at different angles of attack.",
    topic: "Airfoil aerodynamics",
    category: "Aerodynamics",
    video: "/simulations/naca0012.mp4",
  },
  {
    number: "08",
    title: "Dam Break",
    route: "/physics/dam-break",
    description: "Investigate transient free-surface motion and gravity-driven waves.",
    topic: "Free-surface flow",
    category: "Multiphase",
    video: "/simulations/dam-break.mp4",
  },
  {
    number: "09",
    title: "Magic Fluids",
    route: "/physics/magic-fluids",
    description: "Explore interactive fluid patterns and how obstacles change fluid motion.",
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

/* Reconstructed from the supplied logo:
   white rear outline + cyan foreground outline and diagonal. */
function BrandMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 70"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Rear / white outline */}
      <path
        d="M35 29 L52 11 L70 29 L84 15 L99 31 L99 37 L104 40 L104 52 L98 56 L94 62 L73 62"
        transform="translate(-9 0)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Foreground / cyan outline */}
      <path
        d="M5 35 L5 29 L24 9 L60 62 L47 62 L47 55 Q47 49 41 49 L32 49 Q26 49 26 55 L26 62 L13 62 Q5 62 5 53 L5 43 L9 40 L9 35 Z"
        stroke="#16BBD4"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Signature diagonal */}
      <path
        d="M24 9 L60 62"
        stroke="#16BBD4"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SimulationVideo({ src, title, compact = false }) {
  const [status, setStatus] = useState("loading");

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#180D25]">
      <video
        key={src}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        controls={!compact}
        preload="metadata"
        aria-label={title}
        onLoadedData={() => setStatus("ready")}
        onError={() => setStatus("unavailable")}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center p-5 text-center">
          <div className="max-w-xs">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16BBD4"
                strokeWidth="1.5"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m10 9 5 3-5 3V9Z" />
              </svg>
            </div>

            <p className="text-sm font-semibold text-white">
              {status === "unavailable"
                ? "Video unavailable"
                : "Loading simulation"}
            </p>

            <p className="mt-2 text-xs leading-5 text-white/55">
              {status === "unavailable"
                ? "Check the video file path, file format, and server response."
                : "Waiting for the simulation footage to load."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroSimulation() {
  const [mode, setMode] = useState("video");
  const viewerUrl = process.env.NEXT_PUBLIC_OMNIVERSE_VIEWER_URL;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#DCD1E8] bg-white shadow-[0_24px_80px_-35px_rgba(54,24,75,0.24)]">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#159DB7]">
            Simulation laboratory
          </p>
          <h2 className="mt-1.5 text-base font-semibold tracking-tight text-[#271432]">
            Flow around a cylinder
          </h2>
        </div>

        <div className="flex rounded-xl bg-[#F0EBF6] p-1">
          {["video", "3d"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              aria-pressed={mode === item}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                mode === item
                  ? "bg-[#321344] text-white shadow-sm"
                  : "text-[#766781] hover:text-[#321344]"
              }`}
            >
              {item === "video" ? "Simulation" : "Live 3D"}
            </button>
          ))}
        </div>
      </div>

      <div className="aspect-[4/3] bg-[#180D25] sm:aspect-[5/3]">
        {mode === "video" ? (
          <SimulationVideo
            src="/simulations/cylinder-flow.mp4"
            title="CFD simulation of flow around a cylinder"
          />
        ) : viewerUrl ? (
          <iframe
            src={viewerUrl}
            title="Interactive NVIDIA Omniverse viewer"
            className="h-full w-full border-0"
            allow="fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="max-w-sm">
              <BrandMark className="mx-auto mb-5 h-14 w-16 text-white" />
              <h3 className="font-semibold text-white">
                Live viewer not connected
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Configure your deployed Omniverse streaming application to
                enable interactive 3D.
              </p>
              <a
                href="https://docs.omniverse.nvidia.com/embedded-web-viewer/latest/workflow/streaming-and-messaging.html"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                NVIDIA viewer documentation ↗
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-[#EAE3F0] border-t border-[#EAE3F0]">
        {[
          ["PHENOMENON", "Vortex shedding"],
          ["FIELD", "Velocity"],
          ["GEOMETRY", "Cylinder"],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 p-3.5 sm:p-4">
            <p className="text-[9px] font-semibold tracking-wider text-[#94859E]">
              {label}
            </p>
            <p className="mt-1.5 text-xs font-semibold text-[#321344] sm:text-sm">
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
  const [activeCategory, setActiveCategory] = useState("All experiments");

  const filteredExperiments = useMemo(() => {
    const term = query.trim().toLowerCase();

    return experiments.filter((experiment) => {
      const matchesCategory =
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

      return matchesCategory && searchableText.includes(term);
    });
  }, [query, activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F4FA] text-[#271432] selection:bg-[#B8F1F8]">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #f7f4fa;
        }

        .experiment-card {
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .experiment-card:hover {
          transform: translateY(-4px);
          border-color: #A9DDE7;
          box-shadow: 0 18px 40px -28px rgba(49, 19, 68, 0.3);
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
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-[#E9E1F0]/90 bg-[#F7F4FA]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <BrandMark className="h-10 w-12 text-[#321344]" />
            <span className="text-base font-bold tracking-tight sm:text-lg">
              ReactFlow<span className="text-[#159DB7]">3D</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <a
              href="#experiments"
              className="text-sm font-medium text-[#6E607A] transition hover:text-[#159DB7]"
            >
              Experiments
            </a>
            <a
              href="#learn"
              className="text-sm font-medium text-[#6E607A] transition hover:text-[#159DB7]"
            >
              Learning
            </a>
            <Link
              href="/"
              className="text-sm font-medium text-[#6E607A] transition hover:text-[#159DB7]"
            >
              Home
            </Link>
          </div>

          <a
            href="#experiments"
            className="inline-flex items-center gap-2 rounded-xl bg-[#321344] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#49215F] sm:text-sm"
          >
            Enter the lab <span>↗</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative border-b border-[#E8DFF0]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(210,188,231,0.4),transparent_43%),radial-gradient(ellipse_at_92%_65%,rgba(67,217,242,0.12),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#D9C8E8] bg-white/70 px-3.5 py-2">
              <BrandMark className="h-5 w-7 text-[#321344]" />
              <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#68427D] sm:text-xs">
                Interactive CFD laboratory
              </span>
            </div>

            <h1 className="text-[clamp(2.8rem,6.5vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.065em] text-[#271432]">
              Understand
              <br />
              the physics.
              <br />
              <span className="text-[#159DB7]">See the flow.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#6E607A] sm:text-lg sm:leading-8">
              Explore computational fluid dynamics through real simulation
              footage and interactive experiments. Investigate the physics,
              understand the equations, and connect physical intuition with
              numerical methods.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#experiments"
                className="inline-flex items-center gap-3 rounded-xl bg-[#321344] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#49215F]"
              >
                Explore experiments <span>↓</span>
              </a>

              <a
                href="#learn"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D9CDE2] bg-white/60 px-5 py-3.5 text-sm font-semibold text-[#493454] transition hover:border-[#A9DDE7] hover:bg-white"
              >
                What will I learn?
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-9 gap-y-4 border-t border-[#E4DAEB] pt-6">
              <div>
                <p className="text-2xl font-bold text-[#321344]">09</p>
                <p className="mt-1 text-xs text-[#94859E]">Experiments</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#321344]">06</p>
                <p className="mt-1 text-xs text-[#94859E]">Categories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#159DB7]">3D</p>
                <p className="mt-1 text-xs text-[#94859E]">Viewer-ready</p>
              </div>
            </div>
          </div>

          <HeroSimulation />
        </div>
      </section>

      {/* Experiment library */}
      <section
        id="experiments"
        className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#159DB7]">
              The experiment library
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Pick a flow. Ask a question.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#786A83] sm:text-base">
              Explore fluid mechanics, compressible flow, boundary layers,
              and aerodynamics through specific physical problems.
            </p>
          </div>

          <p className="shrink-0 text-sm text-[#94859E]">
            <span className="font-bold text-[#321344]">
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
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94859E]"
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
              className="h-12 w-full rounded-xl border border-[#E2D8EB] bg-white px-12 text-sm text-[#321344] outline-none placeholder:text-[#A79AAF] focus:border-[#65C9D9] focus:ring-4 focus:ring-[#43D9F2]/10"
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
                  className={`shrink-0 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "border-[#321344] bg-[#321344] text-white"
                      : "border-[#E2D8EB] bg-white/60 text-[#786A83] hover:border-[#A9DDE7] hover:text-[#321344]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredExperiments.map((experiment) => (
            <Link
              key={experiment.route}
              href={experiment.route}
              className="experiment-card group flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-[#E7DEEE] bg-white p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3 px-1 pt-1">
                <span className="text-[10px] font-bold tracking-[.14em] text-[#A095AA]">
                  EXP. {experiment.number}
                </span>
                <span className="rounded-full border border-[#BDEAF0] bg-[#EFFBFD] px-3 py-1.5 text-[10px] font-semibold text-[#147D91] sm:text-xs">
                  {experiment.category}
                </span>
              </div>

              <div className="relative my-4 aspect-video overflow-hidden rounded-xl border border-[#352240] bg-[#180D25]">
                <SimulationVideo
                  src={experiment.video}
                  title={`${experiment.title} simulation preview`}
                  compact
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-[#180D25]/85 px-2 py-1 text-[9px] font-medium text-white/75">
                  SIMULATION PREVIEW
                </span>
              </div>

              <h3 className="text-lg font-bold tracking-tight text-[#321344] transition group-hover:text-[#147D91] sm:text-xl">
                {experiment.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-[#786A83]">
                {experiment.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#EEE7F2] pt-4">
                <span className="text-xs font-medium text-[#94859E]">
                  {experiment.topic}
                </span>
                <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#147D91]">
                  Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#E2D8EB] bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold text-[#321344]">
              No matching experiments
            </p>
            <p className="mt-2 text-sm text-[#786A83]">
              Try another search term or browse all experiments.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All experiments");
              }}
              className="mt-5 rounded-xl bg-[#321344] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#49215F]"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Learning outcomes */}
      <section id="learn" className="border-y border-[#E8DFF0] bg-[#EFE8F5]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#159DB7]">
                From observation to understanding
              </p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Connect what you see to the equations.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#786A83] sm:text-base">
                Build intuition for the phenomena behind CFD. Investigate
                how geometry, boundary conditions, and modelling assumptions
                affect the flow.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Fluid mechanics",
                  description: "Streamlines, vorticity, circulation, and boundary layers.",
                },
                {
                  number: "02",
                  title: "Compressible flow",
                  description: "Shock waves, expansion waves, pressure, and density.",
                },
                {
                  number: "03",
                  title: "Aerodynamics",
                  description: "Flow separation, pressure distribution, lift, and drag.",
                },
                {
                  number: "04",
                  title: "Numerical methods",
                  description: "Boundary conditions, discretization, and modelling limitations.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-2xl border border-[#E0D4E9] bg-white/80 p-5 transition hover:border-[#A9DDE7] hover:bg-white"
                >
                  <span className="text-xs font-bold tracking-[.15em] text-[#159DB7]">
                    {item.number}
                  </span>
                  <h3 className="mt-4 font-bold text-[#321344]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#786A83]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl bg-[#321344] p-7 text-white sm:p-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#72E5F3]">
                  Start with a physical question
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  What happens when the flow changes?
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                  Choose a geometry, investigate the flow, and build your
                  understanding one experiment at a time.
                </p>
              </div>

              <Link
                href="/physics/flow-lines"
                className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-xl bg-[#8CEBF5] px-5 py-3.5 text-sm font-bold text-[#321344] transition hover:bg-white sm:self-auto"
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
          <BrandMark className="h-8 w-10 text-[#321344]" />
          <span className="text-sm font-bold">
            ReactFlow<span className="text-[#159DB7]">3D</span>
          </span>
        </Link>

        <p className="text-xs leading-5 text-[#94859E]">
          An interactive space for computational fluid dynamics.
        </p>

        <a
          href="#experiments"
          className="text-xs font-semibold text-[#786A83] transition hover:text-[#147D91]"
        >
          Back to experiments ↑
        </a>
      </footer>
    </main>
  );
}
