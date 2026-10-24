
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const experiments = [
  {
    number: "01",
    title: "Flow Lines",
    route: "/physics/flow-lines",
    description:
      "Trace velocity fields and streamlines to understand how geometry and boundary conditions redirect fluid motion.",
    topic: "Velocity and streamlines",
    category: "Fundamentals",
    video: "/simulations/flow-lines.mp4",
  },
  {
    number: "02",
    title: "Sod Shock Tube",
    route: "/physics/sod-shock-tube",
    description:
      "Follow a Riemann problem as discontinuities develop into a shock, a contact surface, and a rarefaction wave.",
    topic: "Compressible flow",
    category: "Compressible",
    video: "/simulations/sod-shock-tube.mp4",
  },
  {
    number: "03",
    title: "Lid-Driven Cavity",
    route: "/physics/lid-driven-cavity",
    description:
      "Study how a moving wall transfers momentum to a viscous fluid, generating a primary vortex and secondary recirculation.",
    topic: "Navier–Stokes equations",
    category: "Fundamentals",
    video: "/simulations/lid-driven-cavity.mp4",
  },
  {
    number: "04",
    title: "Flow Around a Cylinder",
    route: "/physics/cylinder-flow",
    description:
      "Examine separation, alternating vortex shedding, wake instability, and the relationship between Reynolds number and drag.",
    topic: "External aerodynamics",
    category: "Aerodynamics",
    video: "/simulations/cylinder-flow.mp4",
  },
  {
    number: "05",
    title: "Nozzle Flow",
    route: "/physics/nozzle",
    description:
      "Connect area changes to velocity, pressure, Mach number, and choking in compressible internal flow.",
    topic: "Compressible flow",
    category: "Compressible",
    video: "/simulations/nozzle.mp4",
  },
  {
    number: "06",
    title: "Flat-Plate Boundary Layer",
    route: "/physics/flat-plate",
    description:
      "Examine the growth of the viscous boundary layer and the development of velocity gradients near a solid wall.",
    topic: "Viscous flow",
    category: "Aerodynamics",
    video: "/simulations/flat-plate.mp4",
  },
  {
    number: "07",
    title: "NACA 0012 Airfoil",
    route: "/physics/naca0012",
    description:
      "Investigate pressure distribution, circulation, lift, and separation as angle of attack and flow conditions change.",
    topic: "Airfoil aerodynamics",
    category: "Aerodynamics",
    video: "/simulations/naca0012.mp4",
  },
  {
    number: "08",
    title: "Dam Break",
    route: "/physics/dam-break",
    description:
      "Follow gravity-driven free-surface motion and the propagation of a transient wave after a barrier is removed.",
    topic: "Free-surface flow",
    category: "Multiphase",
    video: "/simulations/dam-break.mp4",
  },
  {
    number: "09",
    title: "Magic Fluids",
    route: "/physics/magic-fluids",
    description:
      "Experiment with interactive fluid patterns and examine how forces and obstacles influence the resulting motion.",
    topic: "Interactive flow",
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

const methods = [
  {
    number: "01",
    name: "PINNs",
    fullName: "Physics-Informed Neural Networks",
    purpose: "Learn a solution constrained by physical equations.",
    details:
      "A neural network represents velocity and pressure as functions of position and, when needed, time. Automatic differentiation estimates the derivatives required by the governing equations. Training penalizes equation residuals alongside errors in boundary conditions and any available observations.",
    input: "Coordinates, time, boundary conditions",
    output: "Velocity and pressure at queried points",
    limitation:
      "Training can become difficult when the flow contains sharp gradients, multiple scales, or complicated geometries. A low residual at sampled points does not guarantee a physically accurate solution everywhere.",
  },
  {
    number: "02",
    name: "FNO",
    fullName: "Fourier Neural Operator",
    purpose: "Learn mappings between fields rather than individual points.",
    details:
      "An FNO lifts an input field into latent features, applies learned transformations in Fourier space, combines them with local transformations, and repeats the process across layers. This lets it learn nonlocal relationships in a spatial field.",
    input: "Sampled fields and flow conditions",
    output: "A predicted solution field",
    limitation:
      "Standard implementations are most straightforward on regular grids. Resolution changes, boundary treatment, geometry representation, and out-of-distribution conditions still require careful evaluation.",
  },
  {
    number: "03",
    name: "PINO",
    fullName: "Physics-Informed Neural Operator",
    purpose: "Combine operator learning with physical constraints.",
    details:
      "PINO learns a mapping from problem inputs to solution fields. Its objective can combine supervised errors against CFD data with residuals of the governing equations. Physics constraints can be evaluated at resolutions different from the training data resolution, provided the discretization and implementation support it.",
    input: "Geometry, flow conditions, optional CFD samples",
    output: "Predicted fields for a family of flow problems",
    limitation:
      "PINO does not automatically guarantee conservation or accuracy. Loss balancing, adequate training coverage, numerical residual quality, and validation against independent CFD solutions remain essential.",
  },
  {
    number: "04",
    name: "Graph operators",
    fullName: "Mesh-based and graph neural operators",
    purpose: "Represent flow on irregular meshes and complex geometry.",
    details:
      "Mesh nodes or cells become graph nodes, while mesh connections or spatial neighborhoods become edges. Message passing updates local representations using neighboring information, allowing the network to learn how geometry and nearby flow states influence each other.",
    input: "Mesh or geometry graph, boundary conditions, flow parameters",
    output: "Node-wise or cell-wise flow predictions",
    limitation:
      "Mesh quality, graph connectivity, computational cost, and transfer to unseen meshes or geometries can strongly affect performance. Conservation properties must be assessed, not assumed.",
  },
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
        d="M8 35 27 15 46 35 64 15 85 35 85 43 92 47 92 55 85 60 64 60"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 35 8 54 14 60 32 60 32 52 Q32 46 38 46 L47 46 Q53 46 53 52 L53 60 64 60"
        stroke="#16BBD4"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 15 64 60"
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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-xl text-cyan-300">
              {status === "unavailable" ? "!" : "▶"}
            </div>
            <p className="text-sm font-semibold text-white">
              {status === "unavailable"
                ? "Video unavailable"
                : "Loading simulation"}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/60">
              {status === "unavailable"
                ? "Check that the file exists and is encoded in a browser-supported format."
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
            Flow simulation
          </p>
          <h2 className="mt-1.5 text-base font-semibold text-[#271432]">
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
                  ? "bg-[#321344] text-white"
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
                A deployed streaming application is required for live 3D.
                A video preview is not a live CFD solver.
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

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#159DB7]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-[#271432] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[#786A83] sm:text-base">
        {description}
      </p>
    </div>
  );
}

export default function PhysicsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All experiments");
  const [activeMethod, setActiveMethod] = useState("02");

  const filteredExperiments = useMemo(() => {
    const term = query.trim().toLowerCase();

    return experiments.filter((experiment) => {
      const categoryMatches =
        activeCategory === "All experiments" ||
        experiment.category === activeCategory;

      const text = [
        experiment.title,
        experiment.description,
        experiment.topic,
        experiment.category,
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatches && text.includes(term);
    });
  }, [query, activeCategory]);

  const selectedMethod =
    methods.find((method) => method.number === activeMethod) || methods[1];

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
          border-color: #a9dde7;
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

          <div className="hidden items-center gap-6 md:flex">
            <a href="#experiments" className="text-sm text-[#6E607A] hover:text-[#159DB7]">
              Experiments
            </a>
            <a href="#ai-methods" className="text-sm text-[#6E607A] hover:text-[#159DB7]">
              AI methods
            </a>
            <a href="#cavity" className="text-sm text-[#6E607A] hover:text-[#159DB7]">
              Lid-driven cavity
            </a>
          </div>

          <a
            href="#experiments"
            className="rounded-xl bg-[#321344] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#49215F] sm:text-sm"
          >
            Explore the lab ↗
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
                AI for computational fluid dynamics
              </span>
            </div>

            <h1 className="text-[clamp(2.8rem,6.5vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.065em] text-[#271432]">
              Can AI understand
              <br />
              <span className="text-[#159DB7]">fluid flow?</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#6E607A] sm:text-lg sm:leading-8">
              Investigate how physics-informed networks and neural operators
              learn to predict velocity, pressure, and vortices across
              different flow conditions and geometries.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#ai-methods"
                className="rounded-xl bg-[#321344] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#49215F]"
              >
                Understand the models ↓
              </a>
              <a
                href="#cavity"
                className="rounded-xl border border-[#D9CDE2] bg-white/70 px-5 py-3.5 text-sm font-semibold text-[#493454] transition hover:bg-white"
              >
                Start with the cavity
              </a>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[#E4DAEB] pt-6">
              <div>
                <p className="text-lg font-bold text-[#321344]">PINNs</p>
                <p className="mt-1 text-xs leading-5 text-[#94859E]">Equation-constrained learning</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#321344]">PINO</p>
                <p className="mt-1 text-xs leading-5 text-[#94859E]">Physics-informed operators</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#159DB7]">Graphs</p>
                <p className="mt-1 text-xs leading-5 text-[#94859E]">Irregular mesh learning</p>
              </div>
            </div>
          </div>

          <HeroSimulation />
        </div>
      </section>

      {/* Model library */}
      <section id="ai-methods" className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <SectionHeading
          eyebrow="How AI learns fluid mechanics"
          title="Different models learn different things."
          description="A PINN approximates a solution field; a neural operator learns a mapping between fields. Physics-informed operator learning adds governing-equation constraints, while graph-based methods represent relationships across meshes and complex geometries."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {methods.map((method) => (
            <button
              key={method.number}
              type="button"
              onClick={() => setActiveMethod(method.number)}
              aria-pressed={activeMethod === method.number}
              className={`rounded-2xl border p-5 text-left transition ${
                activeMethod === method.number
                  ? "border-[#8DD8E5] bg-[#EAF9FB] shadow-sm"
                  : "border-[#E7DEEE] bg-white hover:border-[#C7B5D7]"
              }`}
            >
              <span className="text-xs font-bold tracking-[.15em] text-[#159DB7]">
                METHOD {method.number}
              </span>
              <h3 className="mt-4 text-xl font-bold text-[#321344]">{method.name}</h3>
              <p className="mt-1 text-xs font-medium text-[#94859E]">
                {method.fullName}
              </p>
              <p className="mt-4 text-sm leading-6 text-[#6E607A]">
                {method.purpose}
              </p>
              <span className="mt-5 inline-block text-xs font-bold text-[#147D91]">
                Examine method →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-[#E1D6EA] bg-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.17em] text-[#159DB7]">
            {selectedMethod.fullName}
          </p>
          <h3 className="mt-3 text-2xl font-bold text-[#321344]">
            {selectedMethod.purpose}
          </h3>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#6E607A]">
            {selectedMethod.details}
          </p>

          <div className="mt-7 grid gap-5 border-t border-[#EEE7F2] pt-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-bold text-[#321344]">Typical inputs</h4>
              <p className="mt-2 text-sm leading-6 text-[#786A83]">
                {selectedMethod.input}
              </p>
              <h4 className="mt-5 text-sm font-bold text-[#321344]">Typical output</h4>
              <p className="mt-2 text-sm leading-6 text-[#786A83]">
                {selectedMethod.output}
              </p>
            </div>
            <div className="rounded-xl bg-[#F7F4FA] p-5">
              <h4 className="text-sm font-bold text-[#321344]">
                What must still be tested
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#786A83]">
                {selectedMethod.limitation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governing equations */}
      <section className="border-y border-[#E8DFF0] bg-[#EFE8F5]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <SectionHeading
            eyebrow="The physics underneath the prediction"
            title="Every prediction has to answer to the equations."
            description="For incompressible Newtonian flow, velocity and pressure are coupled through momentum conservation and the incompressibility constraint. A learned field can look plausible while still violating either equation."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#DED1E8] bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#159DB7]">
                Momentum conservation
              </p>
              <div className="mt-5 overflow-x-auto text-[#321344]">
                <p className="font-mono text-sm leading-8 sm:text-base">
                  ∂u/∂t + (u · ∇)u
                </p>
                <p className="font-mono text-sm leading-8 sm:text-base">
                  = −(1/ρ)∇p + ν∇²u
                </p>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#786A83]">
                Local acceleration and convective acceleration balance the
                pressure-gradient force and viscous diffusion. These terms
                explain how a moving wall transfers momentum and how viscous
                effects redistribute it through the cavity.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DED1E8] bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#159DB7]">
                Mass conservation
              </p>
              <p className="mt-5 font-mono text-lg text-[#321344]">
                ∇ · u = 0
              </p>
              <p className="mt-5 text-sm leading-7 text-[#786A83]">
                For constant-density incompressible flow, the velocity field
                must be divergence-free. A model can predict smooth-looking
                streamlines yet produce artificial sources or sinks if this
                constraint is not satisfied accurately.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-[#321344] p-6 text-white sm:p-8">
            <h3 className="text-lg font-bold">How physics enters training</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">
              A typical objective combines data error, momentum residual,
              continuity residual, and boundary-condition error. The exact
              terms depend on the model and problem formulation.
            </p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-white/15 bg-white/[0.05] p-4 font-mono text-sm leading-7 text-[#A6F0F7]">
              L = λdata Ldata + λmom Lmomentum
              <br />
              + λcont Lcontinuity + λbc Lboundary
            </div>
            <p className="mt-4 text-xs leading-6 text-white/60">
              Illustrative loss structure, not a claim about the exact
              implementation of every PINN, PINO, or PhysicsNeMo model.
            </p>
          </div>
        </div>
      </section>

      {/* Lid-driven cavity */}
      <section id="cavity" className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <SectionHeading
          eyebrow="First benchmark · Lid-driven cavity"
          title="A moving wall creates the entire flow."
          description="The lid-driven cavity is a canonical incompressible-flow benchmark: a square cavity is filled with viscous fluid, its top wall moves tangentially, and the other three walls remain stationary."
        />

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-[#E1D6EA] bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-[#321344]">Physical setup</h3>
              <span className="rounded-full bg-[#EAF9FB] px-3 py-1.5 text-xs font-semibold text-[#147D91]">
                2D benchmark
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl bg-[#180D25] p-3 sm:p-5">
              <svg
                viewBox="0 0 340 290"
                role="img"
                aria-label="Schematic of a square lid-driven cavity showing a moving upper wall, stationary side and bottom walls, and a recirculating primary vortex"
                className="h-auto w-full"
              >
                <defs>
                  <marker id="cavityArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6Z" fill="#69E5F3" />
                  </marker>
                </defs>

                <rect x="43" y="48" width="250" height="194" fill="#21112E" stroke="#D9CBE7" strokeWidth="3" />
                <path d="M43 48 H293" stroke="#69E5F3" strokeWidth="5" />

                <g stroke="#69E5F3" strokeWidth="2" fill="none" markerEnd="url(#cavityArrow)">
                  <path d="M77 33 H130" />
                  <path d="M159 33 H212" />
                  <path d="M241 33 H279" />
                </g>

                <g stroke="#D7C7E5" strokeWidth="1.6" fill="none" opacity="0.85">
                  <path d="M70 92 C92 64 145 67 178 92 C220 122 229 181 184 209 C142 234 85 211 77 167 C72 143 92 121 118 121 C145 121 160 145 151 164 C145 177 126 181 113 170" />
                  <path d="M86 101 C110 82 148 87 169 106 C195 131 202 170 176 194 C153 216 115 208 100 185 C88 167 96 144 114 137 C132 130 146 145 140 159" />
                </g>

                <path d="M59 255 H276" stroke="#8C7B9A" strokeWidth="1" strokeDasharray="4 5" />
                <text x="168" y="274" fill="#D8C9E6" textAnchor="middle" fontSize="11">Stationary bottom wall</text>
                <text x="168" y="18" fill="#69E5F3" textAnchor="middle" fontSize="11">Moving lid · U = U₀</text>
                <text x="168" y="147" fill="#FFFFFF" textAnchor="middle" fontSize="12" fontWeight="600">Primary vortex</text>
                <text x="24" y="145" fill="#D8C9E6" textAnchor="middle" fontSize="10" transform="rotate(-90 24 145)">No slip</text>
                <text x="312" y="145" fill="#D8C9E6" textAnchor="middle" fontSize="10" transform="rotate(90 312 145)">No slip</text>
              </svg>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#94859E]">
              Conceptual schematic of the recirculation pattern, not CFD output
              or a quantitatively solved velocity field.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#F7F4FA] p-4">
                <p className="text-xs text-[#94859E]">Reynolds number</p>
                <p className="mt-1 text-lg font-bold text-[#321344]">
                  Re = U₀L/ν
                </p>
              </div>
              <div className="rounded-xl bg-[#F7F4FA] p-4">
                <p className="text-xs text-[#94859E]">Boundary condition</p>
                <p className="mt-1 text-lg font-bold text-[#321344]">
                  No slip
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                n: "01",
                title: "The lid supplies momentum",
                body:
                  "The top wall moves at speed U₀ while the remaining walls are stationary. No slip requires the fluid velocity to match each wall's velocity at the boundary. The moving lid therefore creates strong velocity gradients near the top wall.",
              },
              {
                n: "02",
                title: "Viscosity communicates the motion",
                body:
                  "Viscous diffusion transfers momentum from the moving region into the interior. Pressure adjusts to enforce incompressibility. Together, advection, pressure, and viscosity establish a recirculating primary vortex.",
              },
              {
                n: "03",
                title: "Reynolds number changes the structure",
                body:
                  "Re = U₀L/ν compares inertial effects with viscous effects. At low Reynolds numbers, viscosity strongly smooths the motion. At higher values, thinner shear layers and more complex recirculation can develop, including secondary corner vortices.",
              },
              {
                n: "04",
                title: "The numerical solution is the reference",
                body:
                  "A CFD solver discretizes the governing equations on a mesh and iterates or advances the solution until the relevant residuals and convergence criteria are satisfied. The resulting velocity and pressure fields provide reference data for evaluating the learned model.",
              },
            ].map((item) => (
              <div key={item.n} className="flex gap-4 rounded-2xl border border-[#E7DEEE] bg-white p-5 sm:p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF9FB] text-xs font-bold text-[#147D91]">
                  {item.n}
                </span>
                <div>
                  <h3 className="font-bold text-[#321344]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#786A83]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#D7C9E5] bg-white p-6 sm:p-8">
          <h3 className="text-xl font-bold text-[#321344]">
            How a PINN solves the cavity
          </h3>
          <ol className="mt-5 space-y-4">
            {[
              "Represent the velocity and pressure as neural-network outputs: uθ(x,y), vθ(x,y), and pθ(x,y).",
              "Use automatic differentiation to calculate spatial derivatives and the steady momentum and continuity residuals.",
              "Sample interior collocation points and penalize equation violations; enforce u = U₀, v = 0 on the lid and u = v = 0 on the stationary walls.",
              "Optimize the network parameters, then evaluate its predicted fields on a grid for visualization and quantitative comparison.",
              "Validate against a converged numerical reference using velocity-profile errors, divergence, momentum residuals, and vortex locations.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-7 text-[#786A83]">
                <span className="font-bold text-[#159DB7]">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-xl bg-[#F7F4FA] p-5">
            <p className="text-sm font-bold text-[#321344]">
              Important numerical detail
            </p>
            <p className="mt-2 text-sm leading-7 text-[#786A83]">
              At the upper corners, the moving lid meets stationary side walls,
              creating a discontinuity in the prescribed tangential wall
              velocity. This can cause difficult local gradients and affect
              PINN training. Corner treatment, sampling, loss weighting, and
              the reference solver's boundary implementation should therefore
              be documented when comparing methods.
            </p>
          </div>
        </div>
      </section>

      {/* AI workflow */}
      <section className="border-y border-[#E8DFF0] bg-[#EFE8F5]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <SectionHeading
            eyebrow="From CFD data to rapid prediction"
            title="How a geometry-conditioned operator is trained."
            description="For repeated predictions across changing shapes or operating conditions, a neural operator can learn an approximate solution map from geometry and flow inputs to velocity and pressure fields."
          />

          <div className="mt-9 grid gap-3 md:grid-cols-4">
            {[
              {
                n: "01",
                title: "Describe the problem",
                body:
                  "Encode geometry as a mask, signed-distance field, or mesh, together with Reynolds number, inlet conditions, and boundary data.",
              },
              {
                n: "02",
                title: "Generate reference flows",
                body:
                  "Solve representative cases using a CFD solver and record velocity, pressure, and any required physical quantities.",
              },
              {
                n: "03",
                title: "Train the operator",
                body:
                  "Learn geometry-and-condition-to-field mappings using CFD supervision, physics-based losses, or a combination of both.",
              },
              {
                n: "04",
                title: "Test unseen cases",
                body:
                  "Compare predictions against independent simulations, new conditions, and geometries absent from training.",
              },
            ].map((step) => (
              <div key={step.n} className="rounded-2xl border border-[#DED1E8] bg-white p-5">
                <span className="text-xs font-bold tracking-[.15em] text-[#159DB7]">
                  STEP {step.n}
                </span>
                <h3 className="mt-4 font-bold text-[#321344]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#786A83]">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-[#321344] p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8CEBF5]">
              The learned mapping
            </p>
            <div className="mt-5 flex flex-col items-stretch gap-3 text-center sm:flex-row sm:items-center">
              <div className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] p-4">
                <p className="text-sm font-bold">Geometry + conditions</p>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  Shape, Reynolds number, boundary data
                </p>
              </div>
              <span className="text-2xl text-[#8CEBF5]">→</span>
              <div className="flex-1 rounded-xl border border-[#8CEBF5]/30 bg-[#8CEBF5]/10 p-4">
                <p className="text-sm font-bold">Trained operator</p>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  Learned approximation of the solution map
                </p>
              </div>
              <span className="text-2xl text-[#8CEBF5]">→</span>
              <div className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] p-4">
                <p className="text-sm font-bold">Predicted flow</p>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  Velocity, pressure, derived quantities
                </p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-6 text-white/60">
              The model approximates the CFD solution map over its learned
              domain. It does not replace the governing physics or guarantee
              accuracy for arbitrary unseen shapes and conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Experiments */}
      <section id="experiments" className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <SectionHeading
          eyebrow="Flow problems"
          title="Nine problems. Different physics to explain."
          description="Each case highlights a distinct mechanism, from viscous recirculation to compressible shocks. Use the library to study the physical problem before comparing numerical and learned predictions."
        />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
          <label className="relative block w-full md:max-w-sm">
            <span className="sr-only">Search experiments</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search flow problems..."
              className="h-12 w-full rounded-xl border border-[#E2D8EB] bg-white px-4 text-sm text-[#321344] outline-none placeholder:text-[#A79AAF] focus:border-[#65C9D9] focus:ring-4 focus:ring-[#43D9F2]/10"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`shrink-0 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition sm:text-sm ${
                  activeCategory === category
                    ? "border-[#321344] bg-[#321344] text-white"
                    : "border-[#E2D8EB] bg-white/70 text-[#786A83] hover:border-[#A9DDE7]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-sm text-[#94859E]">
          Showing {filteredExperiments.length} of {experiments.length} flow problems
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredExperiments.map((experiment) => (
            <Link
              key={experiment.route}
              href={experiment.route}
              className="experiment-card flex min-h-[350px] flex-col overflow-hidden rounded-2xl border border-[#E7DEEE] bg-white p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3 px-1 pt-1">
                <span className="text-[10px] font-bold tracking-[.14em] text-[#A095AA]">
                  CASE {experiment.number}
                </span>
                <span className="rounded-full border border-[#BDEAF0] bg-[#EFFBFD] px-3 py-1.5 text-[10px] font-semibold text-[#147D91]">
                  {experiment.category}
                </span>
              </div>

              <div className="relative my-4 aspect-video overflow-hidden rounded-xl border border-[#352240] bg-[#180D25]">
                <SimulationVideo
                  src={experiment.video}
                  title={`${experiment.title} simulation`}
                  compact
                />
              </div>

              <h3 className="text-lg font-bold text-[#321344]">{experiment.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#786A83]">
                {experiment.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#EEE7F2] pt-4">
                <span className="text-xs text-[#94859E]">{experiment.topic}</span>
                <span className="text-sm font-bold text-[#147D91]">Open case →</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#E2D8EB] bg-white px-6 py-14 text-center">
            <h3 className="font-bold text-[#321344]">No matching cases</h3>
            <p className="mt-2 text-sm text-[#786A83]">
              Try another term or reset the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All experiments");
              }}
              className="mt-5 rounded-xl bg-[#321344] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* NVIDIA / PhysicsNeMo */}
      <section className="border-t border-[#E8DFF0] bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-12 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#159DB7]">
              Research implementation
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#321344] sm:text-4xl">
              From the equations to PhysicsNeMo.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#786A83] sm:text-base">
              NVIDIA PhysicsNeMo provides tools for developing physics-ML
              models, including physics-informed learning and neural
              operators. A practical workflow can use a conventional CFD
              solver for reference data, train a model to approximate the
              solution, and evaluate its accuracy and inference cost.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#786A83]">
              The important comparison is not whether AI produces a
              convincing picture, but how closely it reproduces reference
              fields, whether it respects physical constraints, how it
              generalizes to new geometries, and how much computational
              time it saves.
            </p>

            <a
              href="https://developer.nvidia.com/physicsnemo"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#321344] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#49215F]"
            >
              NVIDIA PhysicsNeMo ↗
            </a>
          </div>

          <div className="rounded-2xl border border-[#E1D6EA] bg-[#F7F4FA] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[#321344]">
              What a credible evaluation measures
            </h3>
            <div className="mt-6 space-y-5">
              {[
                ["Field accuracy", "Relative L2 error in velocity and pressure against independent CFD solutions."],
                ["Physical consistency", "Continuity and momentum residuals, boundary-condition errors, and relevant conservation checks."],
                ["Generalization", "Performance on unseen Reynolds numbers, geometries, and boundary conditions."],
                ["Computational cost", "Training expense, inference latency, memory use, and comparison with the CFD baseline."],
              ].map(([title, body]) => (
                <div key={title} className="border-b border-[#E6DDEC] pb-4 last:border-0 last:pb-0">
                  <h4 className="text-sm font-bold text-[#321344]">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#786A83]">{body}</p>
                </div>
              ))}
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
          Computational fluid dynamics · Physics-informed machine learning
        </p>

        <a
          href="#ai-methods"
          className="text-xs font-semibold text-[#786A83] transition hover:text-[#147D91]"
        >
          Back to AI methods ↑
        </a>
      </footer>
    </main>
  );
}
