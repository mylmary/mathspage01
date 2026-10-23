"use client";

import Link from "next/link";

const experiments = [
{
number: "01",
title: "Flow Lines",
route: "/physics/flow-lines",
description: "Explore streamlines, velocity, and how fluid moves around different shapes.",
topic: "Fluid flow",
icon: "〰️",
},
{
number: "02",
title: "Sod Shock Tube",
route: "/physics/sod-shock-tube",
description: "Investigate shock waves, expansion waves, and changes in pressure and density.",
topic: "Compressible flow",
icon: "💥",
},
{
number: "03",
title: "Lid-Driven Cavity",
route: "/physics/lid-driven-cavity",
description: "See how a moving lid creates circulation and vortices inside a closed cavity.",
topic: "Vortices",
icon: "🌀",
},
{
number: "04",
title: "Flow Around a Cylinder",
route: "/physics/cylinder-flow",
description: "Explore flow separation, drag, and vortex shedding behind a cylinder.",
topic: "External flow",
icon: "⭕",
},
{
number: "05",
title: "Nozzle Flow",
route: "/physics/nozzle",
description: "Study how a changing passage affects fluid speed, pressure, and compressibility.",
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
description: "Explore airflow around an airfoil and the effects of angle of attack.",
topic: "Aerodynamics",
icon: "✈️",
},
{
number: "08",
title: "Dam Break",
route: "/physics/dam-break",
description: "Investigate how water propagates after a barrier is suddenly removed.",
topic: "Free-surface flow",
icon: "🌊",
},
];

export default function PhysicsPage() {
return (
<main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8 lg:px-12">
<div className="mx-auto max-w-7xl">
<Link
href="/"
className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
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

      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        Choose an experiment to explore fluid motion, pressure, shock waves,
        vortices, and aerodynamics. Open a topic to begin investigating
        the physics behind it.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          8 experiments
        </span>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          Fluid mechanics
        </span>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          Computational physics
        </span>
      </div>
    </header>

    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Choose an experiment</h2>
        <span className="text-sm text-slate-500">01–08</span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {experiments.map((experiment) => (
          <Link
            key={experiment.route}
            href={experiment.route}
            className="group flex min-h-64 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-500 hover:bg-slate-900/80"
          >
            <div className="mb-5 flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 text-2xl">
                {experiment.icon}
              </span>
              <span className="text-sm font-medium text-slate-500">
                {experiment.number}
              </span>
            </div>

            <h3 className="text-lg font-semibold transition group-hover:text-cyan-300">
              {experiment.title}
            </h3>

            <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
              {experiment.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-800 pt-4">
              <span className="text-xs text-cyan-400">
                {experiment.topic}
              </span>
              <span className="text-sm text-white transition group-hover:translate-x-1">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    <footer className="mt-12 border-t border-slate-800 py-6 text-sm leading-6 text-slate-500">
      Each card links to a separate experiment page. The corresponding
      route must exist in your app for that page to open.
    </footer>
  </div>
</main>

);
}
