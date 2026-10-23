
"use client";

import { useEffect, useState } from "react";

const questions = [
  {
    question: "1. Why does fluid change direction around a cylinder?",
    options: [
      "The cylinder obstructs the flow, forcing fluid around it",
      "The fluid disappears inside the cylinder",
      "Gravity always pushes the fluid sideways",
      "The fluid has no velocity near the cylinder",
    ],
    answer: 0,
    explanation:
      "The cylinder occupies space in the flow. Fluid moves around its surface, producing a pressure and velocity distribution around the obstacle.",
  },
  {
    question: "2. What is flow separation?",
    options: [
      "When fluid leaves the surface because the boundary layer cannot overcome the adverse pressure gradient",
      "When fluid permanently stops at the inlet",
      "When the cylinder dissolves into the fluid",
      "When pressure is identical everywhere",
    ],
    answer: 0,
    explanation:
      "An adverse pressure gradient can cause the near-wall flow to lose momentum and detach from the surface, creating a wake behind the cylinder.",
  },
  {
    question: "3. What can happen behind a cylinder at suitable Reynolds numbers?",
    options: [
      "Alternating vortices can form and travel downstream",
      "The fluid becomes a solid",
      "The wake always disappears instantly",
      "The fluid must flow backward everywhere",
    ],
    answer: 0,
    explanation:
      "For a circular cylinder, periodic vortex shedding occurs over a range of Reynolds numbers. The alternating vortices form the von Kármán vortex street.",
  },
];

const particles = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  y: 24 + ((i * 43) % 252),
  phase: (i * 29) % 100,
  speed: 0.7 + (i % 5) * 0.12,
}));

export default function CylinderFlowPage() {
  const [velocity, setVelocity] = useState(1);
  const [viscosity, setViscosity] = useState(0.01);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));
    }, 40);

    return () => clearInterval(timer);
  }, [playing]);

  const reynolds = (velocity * 0.1) / viscosity;

  const score = questions.reduce(
    (total, question, i) =>
      total +
      (submitted[i] && answers[i] === question.answer ? 1 : 0),
    0
  );

  function resetSimulation() {
    setProgress(0);
    setPlaying(true);
  }

  function particlePosition(particle) {
    const x = ((progress * particle.speed + particle.phase) % 100) / 100;
    const cylinderX = 200;
    const cylinderY = 160;
    const radius = 38;

    const px = 20 + x * 360;
    let py = particle.y;

    // Illustrative deflection around the cylinder.
    if (px > cylinderX - 55 && px < cylinderX + 55) {
      const dx = (px - cylinderX) / 55;
      const distance = Math.sqrt(Math.max(0, 1 - dx * dx));
      const side = particle.y < cylinderY ? -1 : 1;

      if (Math.abs(particle.y - cylinderY) < 72) {
        py = cylinderY + side * (radius + 12 + distance * 35);
      }
    }

    // Illustrative downstream wake oscillation.
    if (px > cylinderX + 40) {
      const downstream = Math.min(1, (px - cylinderX - 40) / 100);
      const frequency = (px - cylinderX) * 0.045 - progress * 0.12;
      py += Math.sin(frequency) * 13 * downstream;
    }

    return { x: px, y: Math.max(12, Math.min(308, py)) };
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <a
          href="/physics"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Physics Experiments
        </a>

        <header className="mb-8 mt-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Experiment 04 · Fluid Dynamics
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
            Flow Around a Cylinder
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Observe how fluid moves around a circular obstacle and
            how the wake behind it can develop into alternating
            vortices.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Flow visualization
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Follow the fluid particles as they pass the cylinder.
                </p>
              </div>

              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                Illustrative model
              </span>
            </div>

            <div className="mt-7 rounded-xl border border-slate-700 bg-slate-950 p-3 sm:p-5">
              <svg
                viewBox="0 0 400 320"
                role="img"
                aria-label="Illustration of fluid moving around a cylinder and forming a wake"
                className="w-full"
              >
                <defs>
                  <clipPath id="flowClip">
                    <rect x="10" y="10" width="380" height="300" />
                  </clipPath>

                  <marker
                    id="flowArrow"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6 Z" fill="#67e8f9" />
                  </marker>
                </defs>

                <rect
                  x="10"
                  y="10"
                  width="380"
                  height="300"
                  rx="8"
                  fill="#0f172a"
                  stroke="#475569"
                  strokeWidth="2"
                />

                <g clipPath="url(#flowClip)">
                  {[50, 100, 150, 200, 250, 300].map((y) => (
                    <line
                      key={y}
                      x1="15"
                      y1={y}
                      x2="385"
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="3 7"
                    />
                  ))}

                  <path
                    d="M15 70 H130 Q165 70 178 112"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    opacity="0.65"
                  />
                  <path
                    d="M15 250 H130 Q165 250 178 208"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    opacity="0.65"
                  />

                  <path
                    d="M238 140 C270 100 292 220 325 160 S365 120 390 160"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                  <path
                    d="M238 180 C270 220 292 100 325 160 S365 200 390 160"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />

                  {particles.map((particle) => {
                    const point = particlePosition(particle);

                    return (
                      <circle
                        key={particle.id}
                        cx={point.x}
                        cy={point.y}
                        r={particle.id % 4 === 0 ? 3 : 2}
                        fill={
                          particle.id % 4 === 0
                            ? "#fb923c"
                            : "#67e8f9"
                        }
                        opacity="0.9"
                      />
                    );
                  })}
                </g>

                <circle
                  cx="200"
                  cy="160"
                  r="38"
                  fill="#94a3b8"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />

                <circle
                  cx="188"
                  cy="148"
                  r="9"
                  fill="#cbd5e1"
                  opacity="0.45"
                />

                <line
                  x1="25"
                  y1="30"
                  x2="85"
                  y2="30"
                  stroke="#67e8f9"
                  strokeWidth="2"
                  markerEnd="url(#flowArrow)"
                />

                <text
                  x="28"
                  y="49"
                  fill="#67e8f9"
                  fontSize="11"
                >
                  Inlet flow
                </text>

                <text
                  x="200"
                  y="217"
                  fill="#e2e8f0"
                  fontSize="11"
                  textAnchor="middle"
                >
                  Cylinder
                </text>

                <text
                  x="305"
                  y="284"
                  fill="#fb923c"
                  fontSize="11"
                  textAnchor="middle"
                >
                  Wake region
                </text>
              </svg>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  Fluid tracers
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  Wake tracers
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  Cylinder
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="flowProgress">
                    Animation progress
                  </label>
                  <span className="text-cyan-300">
                    {Math.round(progress)}%
                  </span>
                </div>

                <input
                  id="flowProgress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setPlaying(!playing)}
                  className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  {playing ? "Pause" : "Play"}
                </button>

                <button
                  onClick={resetSimulation}
                  className="rounded-lg border border-slate-600 px-5 py-2.5 hover:bg-slate-800"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">What to observe</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                <li>Fluid divides and passes around the cylinder.</li>
                <li>
                  The boundary layer can separate from the cylinder
                  surface.
                </li>
                <li>
                  The downstream wake can contain alternating vortices.
                </li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">
                Flow parameters
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Adjust the incoming velocity and kinematic viscosity.
                The Reynolds number is calculated from these values.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="flowVelocity" className="text-sm">
                    Inlet velocity, U
                  </label>
                  <span className="font-semibold text-cyan-300">
                    {velocity.toFixed(1)} m/s
                  </span>
                </div>

                <input
                  id="flowVelocity"
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="mt-4 w-full accent-cyan-400"
                />
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="flowViscosity" className="text-sm">
                    Kinematic viscosity, ν
                  </label>
                  <span className="font-semibold text-cyan-300">
                    {viscosity.toFixed(3)} m²/s
                  </span>
                </div>

                <input
                  id="flowViscosity"
                  type="range"
                  min="0.005"
                  max="0.05"
                  step="0.005"
                  value={viscosity}
                  onChange={(e) => setViscosity(Number(e.target.value))}
                  className="mt-4 w-full accent-cyan-400"
                />
              </div>

              <div className="mt-7 rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-5">
                <p className="text-sm text-slate-400">
                  Reynolds number
                </p>
                <p className="mt-2 text-4xl font-bold text-cyan-300">
                  {reynolds.toFixed(1)}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Re = UD/ν, using cylinder diameter D = 0.1 m.
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                The parameter sliders update the Reynolds number.
                They do not calculate a new flow solution or predict
                vortex shedding from the governing equations.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">
                Physics concept
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Flow around a cylinder is a common benchmark for
                studying boundary layers, drag, separation, and
                vortex shedding.
              </p>

              <div className="mt-4 rounded-lg bg-slate-950 p-4">
                <p className="font-semibold text-cyan-300">
                  Reynolds number
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Re = ρUD/μ = UD/ν
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  U is the inlet speed, D is the cylinder diameter,
                  ρ is fluid density, μ is dynamic viscosity, and ν
                  is kinematic viscosity.
                </p>
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                Knowledge check
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Test your understanding
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Answer all three questions and check your results.
              </p>
            </div>

            {Object.keys(submitted).length === questions.length && (
              <div className="rounded-xl bg-cyan-400/10 px-4 py-3">
                <p className="text-sm text-slate-300">Your score</p>
                <p className="text-2xl font-bold text-cyan-300">
                  {score} / {questions.length}
                </p>
              </div>
            )}
          </div>

          <div className="mt-7 space-y-6">
            {questions.map((item, index) => (
              <article
                key={item.question}
                className="rounded-xl border border-slate-700 p-4 sm:p-5"
              >
                <h3 className="font-semibold leading-6">
                  {item.question}
                </h3>

                <div className="mt-4 space-y-3">
                  {item.options.map((option, optionIndex) => {
                    const correct = optionIndex === item.answer;
                    const selected = answers[index] === optionIndex;
                    const checked = !!submitted[index];

                    let style =
                      "border-slate-700 hover:border-slate-500";

                    if (checked && correct) {
                      style = "border-emerald-500 bg-emerald-500/10";
                    } else if (checked && selected && !correct) {
                      style = "border-rose-500 bg-rose-500/10";
                    } else if (selected) {
                      style = "border-cyan-400 bg-cyan-400/10";
                    }

                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6 ${style}`}
                      >
                        <input
                          type="radio"
                          name={`cylinder-question-${index}`}
                          checked={selected}
                          disabled={checked}
                          onChange={() =>
                            setAnswers((previous) => ({
                              ...previous,
                              [index]: optionIndex,
                            }))
                          }
                          className="mt-1 accent-cyan-400"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      setSubmitted((previous) => ({
                        ...previous,
                        [index]: true,
                      }))
                    }
                    disabled={
                      answers[index] === undefined ||
                      !!submitted[index]
                    }
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Check answer
                  </button>

                  {submitted[index] && (
                    <button
                      onClick={() => {
                        setSubmitted((previous) => {
                          const next = { ...previous };
                          delete next[index];
                          return next;
                        });
                        setAnswers((previous) => {
                          const next = { ...previous };
                          delete next[index];
                          return next;
                        });
                      }}
                      className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
                    >
                      Try again
                    </button>
                  )}
                </div>

                {submitted[index] && (
                  <div className="mt-4 rounded-lg bg-slate-950 p-4">
                    <p
                      className={`font-semibold ${
                        answers[index] === item.answer
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {answers[index] === item.answer
                        ? "Correct!"
                        : "Not quite. Review the explanation."}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>

          <button
            onClick={() => {
              setAnswers({});
              setSubmitted({});
            }}
            className="mt-6 rounded-lg border border-slate-600 px-5 py-2.5 hover:bg-slate-800"
          >
            Reset all questions
          </button>
        </section>

        <footer className="mt-8 border-t border-slate-800 pt-6 text-sm">
          <a
            href="/physics"
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← All experiments
          </a>
        </footer>
      </div>
    </main>
  );
}
