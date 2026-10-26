
"use client";

import { useState } from "react";

const experiments = [
  {
    title: "Cylinder Flow",
    category: "Fluid Dynamics",
    icon: "🌀",
    description:
      "Explore how fluid moves around a cylinder and observe the wake behind it.",
  },
  {
    title: "Lid-Driven Cavity",
    category: "Fluid Dynamics",
    icon: "💧",
    description:
      "Investigate circulation inside a cavity driven by a moving lid.",
  },
  {
    title: "Sod Shock Tube",
    category: "Compressible Flow",
    icon: "🌊",
    description:
      "Explore shock waves, contact discontinuities and expansion waves.",
  },
  {
    title: "Flow Lines",
    category: "Fluid Dynamics",
    icon: "〰️",
    description:
      "Visualise streamlines and discover how flow patterns change.",
  },
  {
    title: "Nozzle Flow",
    category: "Compressible Flow",
    icon: "🚀",
    description:
      "Explore how fluid velocity and pressure change through a nozzle.",
  },
  {
    title: "Flat Plate",
    category: "Boundary Layers",
    icon: "📈",
    description:
      "Investigate boundary-layer development along a flat surface.",
  },
  {
    title: "NACA 0012 Airfoil",
    category: "Aerodynamics",
    icon: "✈️",
    description:
      "Explore airflow around an airfoil and investigate lift-related flow patterns.",
  },
  {
    title: "Dam Break",
    category: "Free-Surface Flow",
    icon: "🌊",
    description:
      "Observe how water spreads after a barrier is suddenly removed.",
  },
  {
    title: "Magic Fluids",
    category: "Interactive Fluids",
    icon: "✨",
    description:
      "Experiment with colourful, interactive fluid motion.",
  },
];

export default function StudentSimulationLab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(experiments.map((item) => item.category)),
  ];

  const filteredExperiments = experiments.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <a href="/physics/lab" className="text-xl font-bold">
            ⚛ Physics Lab
          </a>

          <a
            href="/physics"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Physics Home
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
          Explore · Learn · Discover
        </p>

        <h1 className="mb-4 text-3xl font-extrabold md:text-5xl">
          Student Simulation Lab
        </h1>

        <p className="mb-8 max-w-2xl leading-7 text-slate-300">
          Choose an experiment, explore the physics, and discover
          how changing conditions affects the results.
        </p>

        <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search experiments..."
            aria-label="Search experiments"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-5 text-sm text-slate-400">
          {filteredExperiments.length} experiments available
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExperiments.map((experiment) => (
            <article
              key={experiment.title}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500"
            >
              <div className="mb-5 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-blue-950 to-cyan-950 text-5xl">
                {experiment.icon}
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                {experiment.category}
              </p>

              <h2 className="mb-3 text-xl font-bold">
                {experiment.title}
              </h2>

              <p className="mb-6 flex-1 text-sm leading-6 text-slate-300">
                {experiment.description}
              </p>

              <button
                type="button"
                onClick={() =>
                  alert(
                    `${experiment.title} will be connected to its simulation in the next stage.`
                  )
                }
                className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Open experiment →
              </button>
            </article>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <p className="rounded-xl border border-slate-800 p-6 text-slate-300">
            No experiments match your search. Try another term or category.
          </p>
        )}
      </section>

      <footer className="border-t border-slate-800 px-5 py-6 text-center text-sm text-slate-500">
        Physics Simulation Lab · Explore physics through experimentation
      </footer>
    </main>
  );
}
