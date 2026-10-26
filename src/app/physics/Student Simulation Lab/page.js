
"use client";

import Link from "next/link";

const experiments = [
  {
    title: "Cylinder Flow",
    description: "Explore fluid flow around a cylinder.",
    href: "/physics/Student%20Simulation%20Lab/cylinder-flow",
  },
  {
    title: "Lid-Driven Cavity",
    description: "Investigate circulation inside a driven cavity.",
    href: "/physics/Student%20Simulation%20Lab/lid-driven-cavity",
  },
  {
    title: "Sod Shock Tube",
    description: "Explore shock waves and compressible flow.",
    href: "/physics/Student%20Simulation%20Lab/sod-shock-tube",
  },
  {
    title: "Flow Lines",
    description: "Visualise fluid streamlines and flow patterns.",
    href: "/physics/Student%20Simulation%20Lab/flow-lines",
  },
  {
    title: "Nozzle Flow",
    description: "Explore fluid flow through a nozzle.",
    href: "/physics/Student%20Simulation%20Lab/nozzle",
  },
  {
    title: "Flat Plate",
    description: "Investigate boundary-layer development.",
    href: "/physics/Student%20Simulation%20Lab/flat-plate",
  },
  {
    title: "NACA 0012",
    description: "Explore airflow around an aerofoil.",
    href: "/physics/Student%20Simulation%20Lab/naca0012",
  },
  {
    title: "Dam Break",
    description: "Observe the motion of fluid after a dam breaks.",
    href: "/physics/Student%20Simulation%20Lab/dam-break",
  },
  {
    title: "Magic Fluids",
    description: "Explore interactive fluid behaviour.",
    href: "/physics/Student%20Simulation%20Lab/magic-fluids",
  },
];

export default function StudentSimulationLab() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Student Simulation Lab
            </h1>
            <p className="mt-2 text-slate-300">
              Choose an experiment to open its simulation.
            </p>
          </div>

          <Link
            href="/physics"
            className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
          >
            Back to Physics
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment) => (
            <Link
              key={experiment.title}
              href={experiment.href}
              className="group block rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-blue-400 hover:bg-slate-800"
            >
              <h2 className="text-xl font-semibold group-hover:text-blue-300">
                {experiment.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {experiment.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 font-medium text-blue-400">
                Open experiment
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
