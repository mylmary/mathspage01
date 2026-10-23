import Link from "next/link";

const experiments = [
{
number: "01",
title: "Flow Lines",
route: "/physics/flow-lines",
description: "Explore streamlines, velocity, and fluid motion around shapes.",
topic: "Fluid flow",
icon: "〰️",
},
{
number: "02",
title: "Sod Shock Tube",
route: "/physics/sod-shock-tube",
description: "Investigate shock waves, expansion waves, pressure, and density.",
topic: "Compressible flow",
icon: "💥",
},
{
number: "03",
title: "Lid-Driven Cavity",
route: "/physics/lid-driven-cavity",
description: "Explore circulation and vortices created by a moving cavity lid.",
topic: "Vortices",
icon: "🌀",
},
{
number: "04",
title: "Flow Around a Cylinder",
route: "/physics/cylinder-flow",
description: "Study flow separation, drag, and vortex shedding.",
topic: "External flow",
icon: "⭕",
},
{
number: "05",
title: "Nozzle Flow",
route: "/physics/nozzle",
description: "Explore how a changing passage affects fluid speed and pressure.",
topic: "Internal flow",
icon: "🚀",
},
{
number: "06",
title: "Flat Plate",
route: "/physics/flat-plate",
description: "Learn how a boundary layer develops along a flat surface.",
topic: "Boundary layers",
icon: "📏",
},
{
number: "07",
title: "NACA 0012 Airfoil",
route: "/physics/naca0012",
description: "Investigate airflow around an airfoil and angle of attack.",
topic: "Aerodynamics",
icon: "✈️",
},
{
number: "08",
title: "Dam Break",
route: "/physics/dam-break",
description: "Explore how water flows after a barrier is suddenly removed.",
topic: "Free-surface flow",
icon: "🌊",
},
{
number: "09",
title: "Magic Fluids",
route: "/physics/magic-fluids",
description: "Create swirling fluid patterns and explore how forces and obstacles change the flow.",
  topic: "Interactive fluid dynamics",
},
];

export default function PhysicsPage() {
return (
<main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8 lg:px-12">
<div className="mx-auto max-w-7xl">
<Link
href="/"
className="text-sm text-slate-400 transition hover:text-white"
>
← Back to Home
</Link>

    <header className="mb-10 mt-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
        Interactive Science Lab
      </p>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Physics & CFD Experiments
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-slate-300">
        Choose an experiment to explore fluid motion, pressure, shock
        waves, vortices, and aerodynamics.
      </p>

      <p className="mt-5 text-sm text-slate-500">
        8 experiments available
      </p>
    </header>

    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {experiments.map((experiment) => (
        <Link
          key={experiment.route}
          href={experiment.route}
          className="group flex min-h-64 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-500"
        >
          <div className="mb-5 flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 text-2xl">
              {experiment.icon}
            </span>

            <span className="text-sm text-slate-500">
              {experiment.number}
            </span>
          </div>

          <h2 className="text-lg font-semibold transition group-hover:text-cyan-300">
            {experiment.title}
          </h2>

          <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
            {experiment.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-800 pt-4">
            <span className="text-xs text-cyan-400">
              {experiment.topic}
            </span>

            <span className="text-sm text-white">
              Open →
            </span>
          </div>
        </Link>
      ))}
    </section>
  </div>
</main>

);
}
