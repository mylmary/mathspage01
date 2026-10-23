
"use client";

import { useEffect, useState } from "react";

const questions = [
  {
    question: "1. What drives the flow inside a lid-driven cavity?",
    options: [
      "A pressure difference between the inlet and outlet",
      "The movement of the top wall",
      "Gravity acting on the fluid alone",
      "A pump located at the centre",
    ],
    answer: 1,
    explanation:
      "The top wall moves horizontally and transfers momentum to the fluid through viscous shear. This motion creates circulation inside the otherwise closed cavity.",
  },
  {
    question: "2. What happens when the fluid viscosity increases?",
    options: [
      "Viscous effects become more important relative to inertia",
      "The fluid must stop immediately",
      "The Reynolds number always increases",
      "The cavity develops an inlet and an outlet",
    ],
    answer: 0,
    explanation:
      "For fixed density, cavity size, and lid speed, increasing dynamic viscosity reduces the Reynolds number. Viscous effects become more important relative to inertia.",
  },
  {
    question: "3. What is the Reynolds number?",
    options: [
      "The ratio of inertial forces to viscous forces",
      "The ratio of pressure to temperature",
      "The total volume of fluid in the cavity",
      "The speed of sound in the fluid",
    ],
    answer: 0,
    explanation:
      "The Reynolds number Re = ρUL/μ compares inertial and viscous effects. Here, ρ is density, U is lid speed, L is cavity length, and μ is dynamic viscosity.",
  },
];

const tracers = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: 0.12 + ((i * 37) % 76) / 100,
  y: 0.12 + ((i * 23) % 76) / 100,
  phase: i * 0.61,
  size: 2.2 + (i % 3) * 0.6,
}));

export default function CavityFlowPage() {
  const [lidVelocity, setLidVelocity] = useState(1);
  const [viscosity, setViscosity] = useState(0.01);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setProgress((previous) =>
        previous >= 100 ? 0 : previous + 0.4
      );
    }, 40);

    return () => clearInterval(timer);
  }, [playing]);

  const reynolds = lidVelocity / viscosity;

  const score = questions.reduce(
    (total, question, index) =>
      total +
      (submitted[index] && answers[index] === question.answer
        ? 1
        : 0),
    0
  );

  function resetSimulation() {
    setProgress(0);
    setPlaying(true);
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted({});
  }

  // Stylized circulation field for teaching purposes.
  // These paths are not computed from the Navier-Stokes equations.
  function getTracerPosition(tracer) {
    const t = progress * 0.035 * lidVelocity + tracer.phase;
    const attenuation = 0.65 + 0.35 / (1 + reynolds * 0.002);

    const x = 0.5 + (tracer.x - 0.5) * Math.cos(t) * attenuation
      - (tracer.y - 0.5) * Math.sin(t) * 0.72;

    const y = 0.5 + (tracer.x - 0.5) * Math.sin(t) * 0.55
      + (tracer.y - 0.5) * Math.cos(t) * attenuation;

    return {
      x: Math.max(0.06, Math.min(0.94, x)),
      y: Math.max(0.06, Math.min(0.94, y)),
    };
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
            Experiment 03 · Fluid Dynamics
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Lid-Driven Cavity Flow
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Explore how a moving top wall sets fluid in motion,
            creating a circulating flow pattern inside a closed
            square cavity.
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
                  Follow the tracer particles as the lid moves.
                </p>
              </div>

              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
                Illustrative model
              </span>
            </div>

            <div className="mt-7 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-6">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                <span>Closed cavity</span>
                <span>Top wall moving →</span>
              </div>

              <svg
                viewBox="0 0 400 340"
                role="img"
                aria-label="Animated illustration of circulating fluid in a square cavity driven by a moving top wall"
                className="w-full"
              >
                <defs>
                  <clipPath id="cavityClip">
                    <rect x="45" y="42" width="310" height="250" />
                  </clipPath>

                  <linearGradient
                    id="cavityFill"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0e7490" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
                  </linearGradient>

                  <marker
                    id="lidArrow"
                    markerWidth="7"
                    markerHeight="7"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
                  </marker>
                </defs>

                <rect
                  x="45"
                  y="42"
                  width="310"
                  height="250"
                  fill="url(#cavityFill)"
                  stroke="#64748b"
                  strokeWidth="5"
                />

                <line
                  x1="53"
                  y1="28"
                  x2="344"
                  y2="28"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  markerEnd="url(#lidArrow)"
                />

                <text
                  x="199"
                  y="17"
                  fill="#fbbf24"
                  fontSize="12"
                  textAnchor="middle"
                >
                  Moving lid
                </text>

                <g clipPath="url(#cavityClip)">
                  <ellipse
                    cx="200"
                    cy="166"
                    rx="112"
                    ry="92"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    opacity="0.7"
                  />

                  <ellipse
                    cx="200"
                    cy="166"
                    rx="76"
                    ry="60"
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="1.5"
                    strokeDasharray="4 5"
                    opacity="0.7"
                  />

                  <path
                    d="M90 105 C105 65, 180 55, 245 77"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />

                  <path
                    d="M280 105 C335 160, 295 245, 220 258"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />

                  <path
                    d="M210 260 C120 280, 65 220, 80 145"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />

                  {tracers.map((tracer) => {
                    const position = getTracerPosition(tracer);

                    return (
                      <circle
                        key={tracer.id}
                        cx={45 + position.x * 310}
                        cy={42 + position.y * 250}
                        r={tracer.size}
                        fill={
                          tracer.id % 4 === 0
                            ? "#fbbf24"
                            : "#67e8f9"
                        }
                        opacity="0.9"
                      />
                    );
                  })}
                </g>

                <text
                  x="200"
                  y="316"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  Stationary bottom and side walls
                </text>
              </svg>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  Fluid tracers
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  Selected tracers
                </span>
                <span>Arrows indicate lid motion</span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="cavityProgress">
                    Animation progress
                  </label>
                  <span className="text-cyan-300">
                    {Math.round(progress)}%
                  </span>
                </div>

                <input
                  id="cavityProgress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) =>
                    setProgress(Number(event.target.value))
                  }
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
                <li>
                  The moving lid transfers momentum to the fluid.
                </li>
                <li>
                  Fluid circulation develops within the closed cavity.
                </li>
                <li>
                  The stationary walls constrain the flow and create
                  strong velocity gradients near the boundaries.
                </li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">
                Simulation parameters
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Change the lid speed and kinematic viscosity to
                examine their relationship with the Reynolds number.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="lidVelocity" className="text-sm">
                    Lid velocity, U
                  </label>
                  <span className="font-semibold text-cyan-300">
                    {lidVelocity.toFixed(1)} m/s
                  </span>
                </div>

                <input
                  id="lidVelocity"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={lidVelocity}
                  onChange={(event) =>
                    setLidVelocity(Number(event.target.value))
                  }
                  className="mt-4 w-full accent-cyan-400"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>0.5 m/s</span>
                  <span>2.0 m/s</span>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="viscosity" className="text-sm">
                    Kinematic viscosity, ν
                  </label>
                  <span className="font-semibold text-cyan-300">
                    {viscosity.toFixed(3)} m²/s
                  </span>
                </div>

                <input
                  id="viscosity"
                  type="range"
                  min="0.005"
                  max="0.05"
                  step="0.005"
                  value={viscosity}
                  onChange={(event) =>
                    setViscosity(Number(event.target.value))
                  }
                  className="mt-4 w-full accent-cyan-400"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>0.005 m²/s</span>
                  <span>0.050 m²/s</span>
                </div>
              </div>

              <div className="mt-7 rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-5">
                <p className="text-sm text-slate-400">
                  Calculated Reynolds number
                </p>

                <p className="mt-2 text-4xl font-bold text-cyan-300">
                  {reynolds.toFixed(1)}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Re = UL/ν, using a reference cavity length L = 1 m.
                  The displayed value updates with both sliders.
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                The sliders calculate the Reynolds number, but the
                tracer motion is not a Navier–Stokes solution.
                Changing the parameters does not produce a
                physically validated velocity field.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">
                Physics concept
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Lid-driven cavity flow is a standard benchmark for
                incompressible viscous-flow solvers. The top wall
                moves while the remaining walls stay stationary.
                The resulting flow depends on the Reynolds number.
              </p>

              <div className="mt-4 rounded-lg bg-slate-950 p-4">
                <p className="font-semibold text-cyan-300">
                  Momentum equation
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-300">
                  ∂u/∂t + (u · ∇)u = −∇p/ρ + ν∇²u
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This is the incompressible Navier–Stokes momentum
                  equation per unit mass, with constant viscosity.
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
                    const isCorrect = optionIndex === item.answer;
                    const isSelected =
                      answers[index] === optionIndex;
                    const showResult = submitted[index];

                    let optionStyle =
                      "border-slate-700 hover:border-slate-500";

                    if (showResult && isCorrect) {
                      optionStyle =
                        "border-emerald-500 bg-emerald-500/10";
                    } else if (
                      showResult &&
                      isSelected &&
                      !isCorrect
                    ) {
                      optionStyle =
                        "border-rose-500 bg-rose-500/10";
                    } else if (isSelected) {
                      optionStyle =
                        "border-cyan-400 bg-cyan-400/10";
                    }

                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6 transition ${optionStyle}`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          checked={isSelected}
                          disabled={!!submitted[index]}
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
            onClick={resetQuiz}
            className="mt-6 rounded-lg border border-slate-600 px-5 py-2.5 hover:bg-slate-800"
          >
            Reset all questions
          </button>
        </section>

        <footer className="mt-8 flex flex-wrap justify-between gap-4 border-t border-slate-800 pt-6 text-sm">
          <a
            href="/physics"
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← All experiments
          </a>

          <a
            href="/physics/cylinder-flow"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Previous: Cylinder Flow →
          </a>
        </footer>
      </div>
    </main>
  );
}

