
"use client";

import { useState } from "react";

export default function FlatPlatePage() {
  const [velocity, setVelocity] = useState(5);
  const [length, setLength] = useState(1);
  const [viscosity, setViscosity] = useState(0.000015);
  const [showBoundaryLayer, setShowBoundaryLayer] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [running, setRunning] = useState(true);

  // Simplified flat-plate boundary-layer calculations
  const reynoldsNumber = (velocity * length) / viscosity;

  // Approximate laminar boundary-layer thickness at the plate's trailing edge
  const boundaryLayerThickness =
    (5 * length) / Math.sqrt(reynoldsNumber);

  // Local boundary-layer thickness at the midpoint
  const midpointThickness =
    (5 * (length / 2)) /
    Math.sqrt((velocity * (length / 2)) / viscosity);

  // Average skin-friction coefficient for a laminar flat plate
  const skinFrictionCoefficient =
    1.328 / Math.sqrt(reynoldsNumber);

  const questions = [
    {
      question: "What happens to the fluid velocity directly at a stationary plate?",
      options: [
        "It equals the free-stream velocity",
        "It becomes zero",
        "It becomes twice the free-stream velocity",
        "It cannot be determined",
      ],
      correct: 1,
      explanation:
        "The no-slip condition states that fluid touching a stationary surface has zero velocity relative to that surface.",
    },
    {
      question:
        "For a laminar boundary layer, what happens to its thickness as distance from the leading edge increases?",
      options: [
        "It decreases to zero",
        "It remains constant",
        "It generally increases",
        "It becomes independent of distance",
      ],
      correct: 2,
      explanation:
        "For the ideal laminar flat-plate model, boundary-layer thickness grows approximately with the square root of distance from the leading edge.",
    },
    {
      question:
        "At the same plate length and free-stream velocity, what happens when kinematic viscosity increases?",
      options: [
        "Reynolds number increases",
        "Reynolds number decreases",
        "Reynolds number stays constant",
        "The plate length increases",
      ],
      correct: 1,
      explanation:
        "Reynolds number is Re = U L / ν. Increasing kinematic viscosity decreases Reynolds number and increases the predicted laminar boundary-layer thickness.",
    },
  ];

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  function changeVelocity(value) {
    setVelocity(Number(value));
    resetQuiz();
  }

  function changeLength(value) {
    setLength(Number(value));
    resetQuiz();
  }

  function changeViscosity(value) {
    setViscosity(Number(value));
    resetQuiz();
  }

  const score = questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question.correct ? 1 : 0),
    0
  );

  // Coordinates for the boundary-layer envelope in the illustration
  const plateStart = 105;
  const plateEnd = 745;
  const plateY = 355;
  const plateWidth = plateEnd - plateStart;

  const envelopePoints = Array.from({ length: 41 }, (_, i) => {
    const fraction = i / 40;
    const x = plateStart + fraction * plateWidth;
    const thickness = 10 + 105 * Math.sqrt(fraction);
    return `${x},${plateY - thickness}`;
  }).join(" ");

  const lowerEnvelopePoints = Array.from({ length: 41 }, (_, i) => {
    const fraction = i / 40;
    const x = plateStart + fraction * plateWidth;
    const thickness = 10 + 105 * Math.sqrt(fraction);
    return `${x},${plateY + thickness}`;
  }).join(" ");

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Physics Lab · Experiment 06
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Flow Over a Flat Plate
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Investigate boundary-layer development, the no-slip condition,
            Reynolds number, and skin friction as fluid flows over a flat
            surface.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          {/* Simulation */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="font-semibold">Boundary-layer visualization</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Flow direction: left to right
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRunning(!running)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
              >
                {running ? "Pause flow" : "Resume flow"}
              </button>
            </div>

            <div className="p-3 sm:p-5">
              <svg
                viewBox="0 0 800 490"
                role="img"
                aria-label="Illustration of fluid moving over a flat plate with a growing boundary layer"
                className="w-full rounded-xl bg-slate-950"
              >
                <defs>
                  <linearGradient
                    id="boundaryGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.32" />
                  </linearGradient>

                  <marker
                    id="flowArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6 Z" fill="#67e8f9" />
                  </marker>
                </defs>

                {/* Free-stream region */}
                <rect
                  x="0"
                  y="0"
                  width="800"
                  height="490"
                  fill="#020617"
                />

                {[65, 115, 165, 215, 265].map((y) => (
                  <g key={y}>
                    <line
                      x1="30"
                      y1={y}
                      x2="755"
                      y2={y}
                      stroke="#164e63"
                      strokeWidth="1"
                      strokeDasharray="4 8"
                      opacity="0.55"
                    />
                    <line
                      x1="45"
                      y1={y}
                      x2="110"
                      y2={y}
                      stroke="#67e8f9"
                      strokeWidth="2"
                      markerEnd="url(#flowArrow)"
                    />
                  </g>
                ))}

                <text
                  x="42"
                  y="35"
                  fill="#a5f3fc"
                  fontSize="14"
                  fontWeight="600"
                >
                  FREE STREAM
                </text>

                <text x="42" y="54" fill="#94a3b8" fontSize="12">
                  U∞ = {velocity.toFixed(1)} m/s
                </text>

                {/* Boundary-layer envelope */}
                {showBoundaryLayer && (
                  <>
                    <polygon
                      points={[
                        `${plateStart},${plateY}`,
                        envelopePoints,
                        `${plateEnd},${plateY}`,
                      ].join(" ")}
                      fill="url(#boundaryGradient)"
                    />

                    <polyline
                      points={envelopePoints}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      strokeDasharray="7 5"
                    />

                    <text
                      x="475"
                      y="205"
                      fill="#67e8f9"
                      fontSize="13"
                    >
                      Boundary-layer edge
                    </text>

                    <line
                      x1="590"
                      y1="212"
                      x2="650"
                      y2="250"
                      stroke="#67e8f9"
                      strokeWidth="1.5"
                    />
                  </>
                )}

                {/* Animated flow tracers */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const y = 270 + i * 12;

                  return (
                    <g key={i} opacity={0.9 - i * 0.1}>
                      <line
                        x1={plateStart + 15}
                        y1={y}
                        x2={plateEnd - 10}
                        y2={y}
                        stroke="#38bdf8"
                        strokeWidth="1.4"
                        strokeDasharray="5 13"
                        className={running ? "flat-flow-line" : ""}
                        style={{
                          animationDelay: `${i * -0.4}s`,
                        }}
                      />
                    </g>
                  );
                })}

                {/* Plate */}
                <rect
                  x={plateStart}
                  y={plateY}
                  width={plateWidth}
                  height="18"
                  rx="2"
                  fill="#64748b"
                />

                <line
                  x1={plateStart}
                  y1={plateY}
                  x2={plateEnd}
                  y2={plateY}
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />

                <text
                  x="425"
                  y="400"
                  fill="#e2e8f0"
                  fontSize="15"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  STATIONARY FLAT PLATE
                </text>

                <text
                  x={plateStart}
                  y="435"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  Leading edge
                </text>

                <text
                  x={plateEnd}
                  y="435"
                  fill="#94a3b8"
                  fontSize="12"
                  textAnchor="end"
                >
                  Trailing edge
                </text>

                {/* Plate length */}
                <line
                  x1={plateStart}
                  y1="455"
                  x2={plateEnd}
                  y2="455"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />

                <line
                  x1={plateStart}
                  y1="448"
                  x2={plateStart}
                  y2="462"
                  stroke="#94a3b8"
                />

                <line
                  x1={plateEnd}
                  y1="448"
                  x2={plateEnd}
                  y2="462"
                  stroke="#94a3b8"
                />

                <text
                  x="425"
                  y="477"
                  fill="#cbd5e1"
                  fontSize="13"
                  textAnchor="middle"
                >
                  Plate length L = {length.toFixed(1)} m
                </text>

                {/* Local velocity profile */}
                <g transform="translate(125, 65)">
                  <rect
                    x="0"
                    y="0"
                    width="210"
                    height="155"
                    rx="10"
                    fill="#0f172a"
                    stroke="#334155"
                  />

                  <text
                    x="12"
                    y="20"
                    fill="#e2e8f0"
                    fontSize="11"
                    fontWeight="600"
                  >
                    VELOCITY PROFILE
                  </text>

                  <line
                    x1="30"
                    y1="122"
                    x2="190"
                    y2="122"
                    stroke="#94a3b8"
                  />

                  <line
                    x1="30"
                    y1="122"
                    x2="30"
                    y2="35"
                    stroke="#94a3b8"
                  />

                  <path
                    d="M30 122 C42 92, 65 58, 112 44 L185 44"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                  />

                  <text x="34" y="140" fill="#94a3b8" fontSize="9">
                    u = 0
                  </text>

                  <text x="145" y="36" fill="#a5f3fc" fontSize="9">
                    U∞
                  </text>

                  <text x="100" y="151" fill="#94a3b8" fontSize="9">
                    Velocity →
                  </text>
                </g>
              </svg>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Free-stream flow
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Stationary plate
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-700" />
                  Boundary-layer region
                </span>
              </div>

              <p className="mt-4 rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-xs leading-5 text-amber-200">
                This is an illustrative visualization, not a numerical CFD
                solver. The controls update analytical estimates; the displayed
                boundary-layer shape is schematic.
              </p>
            </div>
          </section>

          {/* Controls */}
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Flow parameters</h2>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label htmlFor="velocity" className="text-sm text-slate-300">
                      Free-stream velocity
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {velocity.toFixed(1)} m/s
                    </span>
                  </div>

                  <input
                    id="velocity"
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={velocity}
                    onChange={(e) => changeVelocity(e.target.value)}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 m/s</span>
                    <span>20 m/s</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label htmlFor="length" className="text-sm text-slate-300">
                      Plate length
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {length.toFixed(1)} m
                    </span>
                  </div>

                  <input
                    id="length"
                    type="range"
                    min="0.2"
                    max="2"
                    step="0.1"
                    value={length}
                    onChange={(e) => changeLength(e.target.value)}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0.2 m</span>
                    <span>2.0 m</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label
                      htmlFor="viscosity"
                      className="text-sm text-slate-300"
                    >
                      Kinematic viscosity
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {(viscosity * 1e6).toFixed(0)} × 10⁻⁶ m²/s
                    </span>
                  </div>

                  <input
                    id="viscosity"
                    type="range"
                    min="0.000005"
                    max="0.00005"
                    step="0.000001"
                    value={viscosity}
                    onChange={(e) => changeViscosity(e.target.value)}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>5 × 10⁻⁶</span>
                    <span>50 × 10⁻⁶</span>
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showBoundaryLayer}
                    onChange={(e) => setShowBoundaryLayer(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  Show boundary-layer envelope
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Calculated results</h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">Reynolds number</p>
                  <p className="mt-2 break-all text-xl font-bold text-cyan-300">
                    {reynoldsNumber.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">ReL = UL/ν</p>
                </div>

                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">Estimated δ at L</p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {(boundaryLayerThickness * 1000).toFixed(2)} mm
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    δ ≈ 5L/√ReL
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">Thickness at L/2</p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {(midpointThickness * 1000).toFixed(2)} mm
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Laminar estimate
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">
                    Average skin friction
                  </p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {skinFrictionCoefficient.toFixed(4)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Cf = 1.328/√ReL
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                These estimates assume steady, incompressible flow over a
                smooth flat plate with a laminar boundary layer. They may not
                describe the actual flow if transition or separation occurs.
              </p>
            </div>
          </section>
        </div>

        {/* Concept explanation */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">What should you observe?</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">1. No-slip condition</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Fluid in contact with the stationary plate has zero velocity
                relative to the plate. The velocity increases away from the
                surface.
              </p>
            </article>

            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">2. Boundary-layer growth</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Viscous effects extend farther from the surface as fluid moves
                downstream. For a laminar plate, thickness scales approximately
                with the square root of distance.
              </p>
            </article>

            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">3. Reynolds number</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Reynolds number compares inertial and viscous effects. Its
                value helps assess the flow regime, although transition also
                depends on disturbances and surface conditions.
              </p>
            </article>
          </div>
        </section>

        {/* Quiz */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Knowledge check
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                Test your understanding
              </h2>
            </div>

            <span className="text-sm text-slate-400">
              {Object.keys(answers).length} of {questions.length} answered
            </span>
          </div>

          <div className="mt-6 space-y-6">
            {questions.map((question, index) => (
              <article
                key={index}
                className="rounded-xl border border-slate-800 p-4 sm:p-5"
              >
                <h3 className="font-medium leading-6">
                  {index + 1}. {question.question}
                </h3>

                <div className="mt-4 grid gap-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[index] === optionIndex;
                    const isCorrect = question.correct === optionIndex;

                    let optionStyle =
                      "border-slate-700 bg-slate-950 hover:border-slate-500";

                    if (isSelected) {
                      optionStyle =
                        "border-cyan-500 bg-cyan-950/40 text-cyan-100";
                    }

                    if (submitted && isCorrect) {
                      optionStyle =
                        "border-emerald-600 bg-emerald-950/30 text-emerald-200";
                    } else if (submitted && isSelected && !isCorrect) {
                      optionStyle =
                        "border-red-600 bg-red-950/30 text-red-200";
                    }

                    return (
                      <button
                        type="button"
                        key={optionIndex}
                        disabled={submitted}
                        onClick={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [index]: optionIndex,
                          }))
                        }
                        className={`rounded-lg border p-3 text-left text-sm transition ${optionStyle}`}
                      >
                        <span className="mr-3 text-slate-500">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {question.explanation}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!submitted ? (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length !== questions.length}
                className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Check answers
              </button>
            ) : (
              <>
                <div className="rounded-lg bg-slate-800 px-4 py-3">
                  Score:{" "}
                  <span className="font-bold text-cyan-300">
                    {score}/{questions.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={resetQuiz}
                  className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800"
                >
                  Try again
                </button>
              </>
            )}
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-800 pt-5 text-sm text-slate-500">
          Physics Lab · Experiment 06 of 08 · Flat-Plate Boundary Layer
        </footer>
      </div>

      <style jsx>{`
        .flat-flow-line {
          animation: moveFlow 2.5s linear infinite;
        }

        @keyframes moveFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -72;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .flat-flow-line {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

