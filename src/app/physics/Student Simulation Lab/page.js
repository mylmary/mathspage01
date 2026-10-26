
"use client";

import Link from "next/link";
import { useState } from "react";

const experiments = [
  { title: "Cylinder Flow", path: "cylinder-flow" },
  { title: "Lid-Driven Cavity", path: "lid-driven-cavity" },
  { title: "Sod Shock Tube", path: "sod-shock-tube" },
  { title: "Flow Lines", path: "flow-lines" },
  { title: "Nozzle", path: "nozzle" },
  { title: "Flat Plate", path: "flat-plate" },
  { title: "NACA 0012", path: "naca0012" },
  { title: "Dam Break", path: "dam-break" },
  { title: "Magic Fluids", path: "magic-fluids" },
];

const experimentBase = "/physics/Student%20Simulation%20Lab";

export default function StudentSimulationLab() {
  const [search, setSearch] = useState("");

  const filtered = experiments.filter((experiment) =>
    experiment.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Student Simulation Lab
            </h1>
            <p className="mt-2 text-slate-300">
              Select an experiment to open its simulation.
            </p>
          </div>

          <Link
            href="/physics"
            className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
          >
            Back to Physics
          </Link>
        </header>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search experiments..."
          className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((experiment) => (
            <Link
              key={experiment.path}
              href={`${experimentBase}/${experiment.path}`}
              className="rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-blue-400 hover:bg-slate-800"
            >
              <h2 className="text-xl font-semibold">
                {experiment.title}
              </h2>
              <p className="mt-4 font-medium text-blue-400">
                Open experiment →
              </p>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-slate-300">No matching experiments found.</p>
        )}
      </div>
    </main>
  );
}
