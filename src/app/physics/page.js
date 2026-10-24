
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const PLUM = "#35143F";
const TEAL = "#087F98";

const experiments = [
  {
    title: "Cylinder Flow",
    category: "External flow",
    description:
      "Investigate how fluid moves around a cylinder, including wake formation, flow separation, and vortex shedding.",
    route: "/physics/cylinder-flow",
    video: "/simulations/cylinder-flow.mp4",
    tags: ["Wake", "Vortices", "Separation"],
  },
  {
    title: "Lid-Driven Cavity",
    category: "Internal flow",
    description:
      "Explore how a moving lid drives circulation inside a cavity and creates primary and secondary vortices.",
    route: "/physics/lid-driven-cavity",
    video: "/simulations/lid-driven-cavity.mp4",
    tags: ["Recirculation", "Vorticity", "Boundaries"],
  },
  {
    title: "Sod Shock Tube",
    category: "Compressible flow",
    description:
      "Follow a pressure discontinuity as shock waves, expansion waves, and contact surfaces travel through a gas.",
    route: "/physics/sod-shock-tube",
    video: "/simulations/sod-shock-tube.mp4",
    tags: ["Shock waves", "Pressure", "Density"],
  },
  {
    title: "Flow Lines",
    category: "Flow visualisation",
    description:
      "Trace the structure of a flow field and see how streamlines reveal direction, turning, and complex flow patterns.",
    route: "/physics/flow-lines",
    video: "/simulations/flow-lines.mp4",
    tags: ["Streamlines", "Velocity", "Flow fields"],
  },
  {
    title: "Nozzle Flow",
    category: "Compressible flow",
    description:
      "Examine how a changing passage affects fluid acceleration, pressure, and the structure of the flow.",
    route: "/physics/nozzle",
    video: "/simulations/nozzle.mp4",
    tags: ["Acceleration", "Pressure", "Geometry"],
  },
  {
    title: "Flat Plate",
    category: "External flow",
    description:
      "Observe the development of the boundary layer as fluid moves over a surface.",
    route: "/physics/flat-plate",
    video: "/simulations/flat-plate.mp4",
    tags: ["Boundary layer", "Viscosity", "Drag"],
  },
  {
    title: "NACA 0012 Airfoil",
    category: "Aerodynamics",
    description:
      "Investigate airflow around an airfoil and examine how its shape influences velocity and pressure.",
    route: "/physics/naca0012",
    video: "/simulations/naca0012.mp4",
    tags: ["Lift", "Pressure", "Aerodynamics"],
  },
  {
    title: "Dam Break",
    category: "Free-surface flow",
    description:
      "Watch a column of water collapse and spread, revealing transient motion and changing flow fronts.",
    route: "/physics/dam-break",
    video: "/simulations/dam-break.mp4",
    tags: ["Transient flow", "Gravity", "Water"],
  },
  {
    title: "Magic Fluids",
    category: "Flow visualisation",
    description:
      "Explore fluid behaviour through a visual experiment designed to make complex motion easier to investigate.",
    route: "/physics/magic-fluids",
    video: "/simulations/magic-fluids.mp4",
    tags: ["Motion", "Patterns", "Visualisation"],
  },
];

const categories = [
  "All experiments",
  "External flow",
  "Internal flow",
  "Compressible flow",
  "Flow visualisation",
  "Aerodynamics",
  "Free-surface flow",
];

function BrandMark() {
  return (
    <Link
      href="/"
      aria-label="ReactFlow3D home"
      className="inline-flex items-center text-2xl font-semibold tracking-tight"
    >
      <span className="text-[#111827]">ReactFlow</span>
      <span className="text-[#087F98]">3D</span>
    </Link>
  );
}

function SimulationVideo({ src, title, compact = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-[#F0F5F7] ${
        compact ? "aspect-[16/10]" : "aspect-video"
      }`}
    >
      {!failed ? (
        <video
          key={src}
          src={src}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${title} simulation preview`}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 px-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#087F98] shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M4 7.5h16M4 12h16M4 16.5h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600">
            Simulation preview unavailable
          </p>
          <p className="max-w-xs text-xs leading-5 text-slate-500">
            Check that the video exists at{" "}
            <code className="break-all">{src}</code>.
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-slate-950/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        Simulation preview
      </div>
    </div>
  );
}

function HeroSimulation() {
  const [mode, setMode] = useState("video");
  const viewerUrl = process.env.NEXT_PUBLIC_OMNIVERSE_VIEWER_URL;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(17,24,39,0.07)] sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 pt-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#087F98]">
            Interactive flow lab
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            Flow around a cylinder
          </h2>
        </div>

        <div
          className="inline-flex rounded-xl bg-slate-100 p-1"
          aria-label="Choose simulation preview"
        >
          <button
            type="button"
            onClick={() => setMode("video")}
            aria-pressed={mode === "video"}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "video"
                ? "bg-white text-[#35143F] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Video
          </button>
          <button
            type="button"
            onClick={() => setMode("3d")}
            aria-pressed={mode === "3d"}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "3d"
                ? "bg-white text-[#35143F] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Live 3D
          </button>
        </div>
      </div>

      {mode === "video" ? (
        <SimulationVideo
          src="/simulations/cylinder-flow.mp4"
          title="Flow around a cylinder"
        />
      ) : viewerUrl ? (
        <div className="aspect-video overflow-hidden rounded-2xl bg-slate-100">
          <iframe
            src={viewerUrl}
            title="ReactFlow3D live simulation viewer"
            className="h-full w-full border-0"
            allow="fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center rounded-2xl bg-[#F3F7F9] px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#087F98] shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <path
                d="M12 3 21 8v8l-9 5-9-5V8l9-5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="m3.5 8.2 8.5 5 8.5-5M12 13.2V21"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Live 3D viewer
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            The 3D viewer can be connected here when it is ready. For now, switch
            to Video to explore the available simulation preview.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-1 pt-4">
        <p className="text-sm text-slate-500">
          Explore the wake, velocity patterns, and flow separation.
        </p>
        <Link
          href="/physics/cylinder-flow"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#087F98] transition hover:text-[#35143F]"
        >
          Open experiment <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

function ExperimentCard({ experiment }) {
  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 transition duration-200 hover:-translate-y-1 hover:border-[#B6DDE4] hover:shadow-[0_14px_35px_rgba(17,24,39,0.07)] sm:p-4">
      <SimulationVideo
        src={experiment.video}
        title={experiment.title}
        compact
      />

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#087F98]">
          {experiment.category}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          {experiment.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
          {experiment.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {experiment.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F0F7F8] px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={experiment.route}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#35143F] transition hover:border-[#35143F] hover:bg-[#35143F] hover:text-white"
        >
          Open experiment <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function PhysicsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All experiments");

  const filteredExperiments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return experiments.filter((experiment) => {
      const matchesCategory =
        activeCategory === "All experiments" ||
        experiment.category === activeCategory;

      const searchableText = [
        experiment.title,
        experiment.category,
        experiment.description,
        ...experiment.tags,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!term || searchableText.includes(term));
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <BrandMark />

          <nav className="flex items-center gap-3" aria-label="Main navigation">
            <Link
              href="/"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
            >
              Home
            </Link>
            <a
              href="#experiments"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#35143F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4B2058] sm:px-5"
            >
              Physics Lab <span aria-hidden="true">→</span>
            </a>
          </nav>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute -right-36 -top-32 -z-10 h-[460px] w-[460px] rounded-full border border-[#BFEAF0] sm:h-[620px] sm:w-[620px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 -top-20 -z-10 h-[350px] w-[350px] rounded-full border border-[#D5F0F3] sm:h-[490px] sm:w-[490px]"
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#087F98] sm:text-sm">
              ReactFlow3D · Interactive learning lab
            </p>

            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#111827] sm:text-5xl lg:text-6xl">
              Explore flow. Investigate the physics.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              See how fluids move around objects, through channels, and across
              changing geometries. Run experiments, inspect flow patterns, and
              connect what you observe to the physics behind it.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <a
                href="#experiments"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#087F98] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#06677B]"
              >
                Explore experiments <span aria-hidden="true">→</span>
              </a>
              <a
                href="#ai-in-the-lab"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-[#35143F] hover:text-[#35143F]"
              >
                How AI is used
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#087F98]" />
                Flow visualisation
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#35143F]" />
                Geometry-based experiments
              </span>
            </div>
          </div>

          <HeroSimulation />
        </div>
      </section>

      <section
        id="experiments"
        className="scroll-mt-24 border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F98]">
                Simulation library
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Choose an experiment
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Select a flow problem to inspect its behaviour and explore the
                physical processes involved.
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              <label
                htmlFor="experiment-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Find an experiment
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                >
                  <circle
                    cx="10.8"
                    cy="10.8"
                    r="6.8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="m16 16 4.2 4.2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  id="experiment-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search flow, pressure, vortices..."
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#087F98] focus:ring-2 focus:ring-[#087F98]/15"
                />
              </div>
            </div>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const selected = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={selected}
                  className={`min-h-10 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "border-[#35143F] bg-[#35143F] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#B6DDE4] hover:text-[#35143F]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500" aria-live="polite">
              {filteredExperiments.length}{" "}
              {filteredExperiments.length === 1 ? "experiment" : "experiments"}
            </p>
            {(search || activeCategory !== "All experiments") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All experiments");
                }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#087F98] hover:bg-[#F0F7F8]"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredExperiments.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExperiments.map((experiment) => (
                <ExperimentCard
                  key={experiment.route}
                  experiment={experiment}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-[#F7F9FC] px-5 py-12 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No matching experiments
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Try another search term or select a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All experiments");
                }}
                className="mt-5 rounded-xl bg-[#35143F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4B2058]"
              >
                Show all experiments
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        id="ai-in-the-lab"
        className="scroll-mt-24 bg-[#F7F9FC] py-14 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087F98]">
              Behind the simulations
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              AI in the lab
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Trained scientific machine-learning models can estimate flow
              fields for supported geometries and conditions. This makes it
              possible to explore predicted fluid behaviour interactively,
              alongside established principles of fluid mechanics.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Set the problem",
                description:
                  "Start with a geometry, flow conditions, and the physical setup of an experiment.",
              },
              {
                number: "02",
                title: "Predict the flow",
                description:
                  "A compatible trained model estimates the flow field for inputs within its supported range.",
              },
              {
                number: "03",
                title: "Inspect the results",
                description:
                  "Explore visual patterns and quantities such as velocity, pressure, and recirculation.",
              },
              {
                number: "04",
                title: "Interpret the physics",
                description:
                  "Relate observed behaviour to fluid mechanics and compare predictions with validated results where available.",
              },
            ].map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5F7] text-sm font-bold text-[#087F98]">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#C8E8ED] bg-[#EFF9FA] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#087F98]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3 21 20H3L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9v5m0 3h.01"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Predictions need physical context
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  AI predictions are not automatically equivalent to validated
                  computational fluid dynamics (CFD). Accuracy depends on the
                  model, its training data, and the conditions being investigated.
                  Use reference simulations and physical principles to assess
                  results where available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <BrandMark />
          <p className="text-sm text-slate-500">
            Interactive experiments in fluid mechanics and scientific computing.
          </p>
          <Link
            href="/"
            className="text-sm font-semibold text-[#087F98] transition hover:text-[#35143F]"
          >
            Back to home ↑
          </Link>
        </div>
      </footer>
    </main>
  );
}
