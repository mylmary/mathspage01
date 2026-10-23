
"use client";

import { useEffect, useState } from "react";

const questions = [
  {
    question: "1. What happens to fluid velocity as it enters a narrower section of a pipe?",
    options: [
      "It decreases to zero",
      "It increases if the flow rate is conserved",
      "It remains constant in every pipe",
      "It becomes independent of pipe area",
    ],
    answer: 1,
    explanation:
      "For steady incompressible flow, the continuity equation requires A₁V₁ = A₂V₂. A smaller cross-sectional area therefore produces a higher average velocity when the flow rate is maintained.",
  },
  {
    question: "2. Under ideal Bernoulli conditions, what happens to static pressure at the throat?",
    options: [
      "It increases because the pipe is narrower",
      "It becomes atmospheric in every case",
      "It decreases as fluid velocity increases",
      "It is always zero",
    ],
    answer: 2,
    explanation:
      "At the same elevation, Bernoulli's equation states that static pressure plus dynamic pressure remains constant along an ideal streamline. An increase in velocity therefore corresponds to a decrease in static pressure.",
  },
  {
    question: "3. Which equation expresses conservation of mass for steady incompressible flow?",
    options: [
      "A₁V₁ = A₂V₂",
      "P₁V₁ = P₂V₂",
      "A₁P₁ = A₂P₂",
      "V₁ + V₂ = 0",
    ],
    answer: 0,
    explanation:
      "The continuity equation states that the volumetric flow rate is constant: Q = AV. The average velocity rises when the cross-sectional area decreases.",
  },
];

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  phase: (i * 31) % 100,
  lane: ((i * 17) % 81) / 100,
  speed: 0.65 + (i % 5) * 0.12,
}));

export default function VenturiFlowPage() {
  const [inletVelocity, setInletVelocity] = useState(2);
  const [throatRatio, setThroatRatio] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  const density = 1000;
  const inletArea = 1;
  const throatArea = throatRatio * inletArea;

  const throatVelocity = inletVelocity / throatRatio;

  const inletDynamicPressure =
    0.5 * density * inletVelocity ** 2;

  const throatDynamicPressure =
    0.5 * density * throatVelocity ** 2;

  const pressureDrop =
    throatDynamicPressure - inletDynamicPressure;

  const flowRate = inletArea * inletVelocity;

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setProgress((previous) =>
        previous >= 100 ? 0 : previous + 0.45
      );
    }, 40);

    return () => clearInterval(timer);
  }, [playing]);

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

  // Pipe boundaries, normalized along the pipe's length.
  function pipeHalfHeight(x) {
    const contraction = Math.max(
      0,
      Math.min(1, (x - 0.28) / 0.22)
    );
    const expansion = Math.max(
      0,
      Math.min(1, (x - 0.52) / 0.25)
    );

    const smooth = (t) => t * t * (3 - 2 * t);

    const narrowed =
      0.34 -
      (0.34 - 0.34 * throatRatio) * smooth(contraction);

    return narrowed +
      (0.34 - 0.34 * throatRatio) * smooth(expansion);
  }

  function particlePosition(particle) {
    const x = ((progress * particle.speed + particle.phase) % 100) / 100;

    const centerY = 160;
    const halfHeight = pipeHalfHeight(x);
    const lane = (particle.lane - 0.5) * 1.65;

    return {
      x: 20 + x * 360,
      y: centerY + lane * halfHeight * 200,
    };
  }

  function resetQuestion(index) {
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
            Experiment 05 · Fluid Mechanics
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Bernoulli&apos;s Principle and Venturi Flow
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Follow fluid through a converging-diverging pipe.
            Investigate how cross-sectional area affects velocity,
            flow rate, and static pressure.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Venturi tube visualization
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Watch particles pass through the constriction.
                </p>
              </div>

              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                Ideal-flow model
              </span>
            </div>

            <div className="mt-7 rounded-xl border border-slate-700 bg-slate-950 p-3 sm:p-5">
              <svg
                viewBox="0 0 400 320"
                role="img"
                aria-label="Venturi pipe showing fluid particles moving through a narrow throat"
                className="w-full"
              >
                <defs>
                  <clipPath id="venturiClip">
                    <path
                      d={`M10 ${160 - 0.34 * 200}
                        L${400 * 0.28} ${160 - 0.34 * 200}
                        L${400 * 0.5} ${160 - 0.34 * throatRatio * 200}
                        L${400 * 0.75} ${160 - 0.34 * 200}
                        L390 ${160 - 0.34 * 200}
                        L390 ${160 + 0.34 * 200}
                        L${400 * 0.75} ${160 + 0.34 * 200}
                        L${400 * 0.5} ${160 + 0.34 * throatRatio * 200}
                        L${400 * 0.28} ${160 + 0.34 * 200}
                        L10 ${160 + 0.34 * 200} Z`}
                    />
                  </clipPath>

                  <linearGradient id="venturiFluid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.12" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.12" />
                  </linearGradient>

                  <marker
                    id="venturiArrow"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
                  </marker>
                </defs>

                <path
                  d={`M10 ${160 - 0.34 * 200}
                    L${400 * 0.28} ${160 - 0.34 * 200}
                    L${400 * 0.5} ${160 - 0.34 * throatRatio * 200}
                    L${400 * 0.75} ${160 - 0.34 * 200}
                    L390 ${160 - 0.34 * 200}
                    L390 ${160 + 0.34 * 200}
                    L${400 * 0.75} ${160 + 0.34 * 200}
                    L${400 * 0.5} ${160 + 0.34 * throatRatio * 200}
                    L${400 * 0.28} ${160 + 0.34 * 200}
                    L10 ${160 + 0.34 * 200} Z`}
                  fill="url(#venturiFluid)"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                <g clipPath="url(#venturiClip)">
                  <line
                    x1="15"
                    y1="160"
                    x2="390"
                    y2="160"
                    stroke="#475569"
                    strokeDasharray="4 6"
                  />

                  {particles.map((particle) => {
                    const point = particlePosition(particle);

                    return (
                      <circle
                        key={particle.id}
                        cx={point.x}
                        cy={point.y}
                        r={particle.id % 4 === 0 ? 3.5 : 2.5}
                        fill={
                          particle.id % 4 === 0
                            ? "#fbbf24"
                            : "#67e8f9"
                        }
                      />
                    );
                  })}
                </g>

                <line
                  x1="22"
                  y1="160"
                  x2="70"
                  y2="160"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  markerEnd="url(#venturiArrow)"
                />

                <line
                  x1="182"
                  y1="160"
                  x2="224"
                  y2="160"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  markerEnd="url(#venturiArrow)"
                />

                <line
                  x1="318"
                  y1="160"
                  x2="365"
                  y2="160"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  markerEnd="url(#venturiArrow)"
                />

                <text x="65" y="45" textAnchor="middle" fill="#67e8f9" fontSize="12">
                  Inlet
                </text>
                <text x="200" y="105" textAnchor="middle" fill="#67e8f9" fontSize="12">
                  Throat
                </text>
                <text x="330" y="45" textAnchor="middle" fill="#67e8f9" fontSize="12">
                  Outlet
                </text>

                <text x="65" y="65" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  Lower speed
                </text>
                <text x="200" y="123" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  Higher speed
                </text>
                <text x="330" y="65" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  Lower speed
                </text>

                <text x="200" y="302" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  Flow direction →
                </text>
              </svg>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  Fluid particles
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  Highlighted particles
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="venturiProgress">Animation progress</label>
                  <span className="text-cyan-300">
                    {Math.round(progress)}%
                  </span>
                </div>

                <input
                  id="venturiProgress"
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
                <li>
                  The pipe narrows at the throat, reducing its cross-sectional area.
                </li>
                <li>
                  Fluid velocity increases through the throat to conserve mass.
                </li>
                <li>
                  Under ideal, horizontal-flow assumptions, static pressure falls as velocity increases.
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
                Adjust the inlet velocity and throat area ratio.
                The model recalculates the ideal velocity and pressure change.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="inletVelocity" className="text-sm">
                    Inlet velocity
                  </label>
                  <span className="font-semibold text-cyan-300">
                    {inletVelocity.toFixed(1)} m/s
                  </span>
                </div>

                <input
                  id="inletVelocity"
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={inletVelocity}
                  onChange={(e) => setInletVelocity(Number(e.target.value))}
                  className="mt-4 w-full accent-cyan-400"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>1 m/s</span>
                  <span>5 m/s</span>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="throatRatio" className="text-sm">
                    Throat / inlet area
                  </label>
                  <span className="font-semibold text-cyan-300">
                    {(throatRatio * 100).toFixed(0)}%
                  </span>
                </div>

                <input
                  id="throatRatio"
                  type="range"
                  min="0.4"
                  max="0.8"
                  step="0.1"
                  value={throatRatio}
                  onChange={(e) => setThroatRatio(Number(e.target.value))}
                  className="mt-4 w-full accent-cyan-400"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>40% (narrower)</span>
                  <span>80% (wider)</span>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Inlet velocity</p>
                  <p className="mt-1 text-2xl font-bold">
                    {inletVelocity.toFixed(2)} m/s
                  </p>
                </div>

                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Throat velocity</p>
                  <p className="mt-1 text-2xl font-bold text-cyan-300">
                    {throatVelocity.toFixed(2)} m/s
                  </p>
                </div>

                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    Ideal static pressure drop
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-300">
                    {(pressureDrop / 1000).toFixed(2)} kPa
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Inlet pressure minus throat pressure is negative;
                    this value reports the positive pressure decrease.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    Relative volumetric flow rate
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {flowRate.toFixed(2)} m³/s
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    For the normalized inlet area A₁ = 1 m².
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Calculations assume steady, incompressible, horizontal flow
                with negligible friction. The normalized area is illustrative;
                the animation is not a numerical fluid solver.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Physics concept</h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Bernoulli&apos;s equation relates static pressure, velocity,
                and elevation along a streamline for ideal steady flow.
                The continuity equation connects velocity to cross-sectional area.
              </p>

              <div className="mt-4 rounded-lg bg-slate-950 p-4">
                <p className="font-semibold text-cyan-300">
                  Continuity equation
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  A₁V₁ = A₂V₂
                </p>

                <p className="mt-5 font-semibold text-cyan-300">
                  Bernoulli&apos;s equation
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  P + ½ρV² + ρgz = constant
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
                          name={`venturi-question-${index}`}
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
                      answers[index] === undefined || !!submitted[index]
                    }
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Check answer
                  </button>

                  {submitted[index] && (
                    <button
                      onClick={() => resetQuestion(index)}
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
            ← Previous: Flow Around a Cylinder
          </a>
        </footer>
      </div>
    </main>
  );
}

