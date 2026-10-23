
"use client";

import { useEffect, useState } from "react";

export default function DamBreakPage() {
  const [waterHeight, setWaterHeight] = useState(3);
  const [gravity, setGravity] = useState(9.81);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setProgress((previous) => {
        const next = previous + 0.35 * speed;
        if (next >= 100) {
          setRunning(false);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [running, speed]);

  // Simplified shallow-water characteristic estimates
  const waveSpeed = Math.sqrt(gravity * waterHeight);
  const froudeNumber = waveSpeed / Math.sqrt(gravity * waterHeight);
  const characteristicTime = Math.sqrt(waterHeight / gravity);
  const elapsedTime = (progress / 100) * 4 * characteristicTime;
  const frontPosition = 230 + (progress / 100) * 490;

  // Schematic free-surface profile; not a numerical solution
  const initialSurfaceY = 345 - waterHeight * 48;
  const frontSurfaceY =
    345 - Math.max(0.18 * waterHeight, waterHeight * (1 - progress / 125)) * 48;

  const waterPath = `
    M 45 345
    L 45 ${initialSurfaceY}
    L 230 ${initialSurfaceY}
    C ${260 + progress * 0.4} ${initialSurfaceY + progress * 0.45},
      ${frontPosition - 90} ${frontSurfaceY - 12},
      ${frontPosition} ${frontSurfaceY}
    L ${frontPosition} 345
    Z
  `;

  const questions = [
    {
      question: "What triggers a dam-break flow in this experiment?",
      options: [
        "The water becomes less dense",
        "A barrier is suddenly removed or opened",
        "Gravity becomes zero",
        "The channel becomes vertical",
      ],
      correct: 1,
      explanation:
        "Dam-break flow begins when a retaining barrier is removed or opened, allowing water to flow into a region that was previously blocked or dry.",
    },
    {
      question: "What happens when gravitational acceleration increases?",
      options: [
        "The characteristic wave speed decreases",
        "The characteristic wave speed increases",
        "The initial water height must become zero",
        "The fluid stops moving",
      ],
      correct: 1,
      explanation:
        "The shallow-water characteristic speed is approximately c = √(gh). For a fixed water depth, increasing gravity increases this speed.",
    },
    {
      question: "Which equation represents the characteristic speed used here?",
      options: [
        "c = gh",
        "c = g/h",
        "c = √(gh)",
        "c = h/g",
      ],
      correct: 2,
      explanation:
        "For shallow-water waves, the characteristic speed is c = √(gh), where g is gravitational acceleration and h is water depth.",
    },
  ];

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  function resetSimulation() {
    setRunning(false);
    setProgress(0);
  }

  function changeHeight(value) {
    setWaterHeight(Number(value));
    resetSimulation();
    resetQuiz();
  }

  function changeGravity(value) {
    setGravity(Number(value));
    resetSimulation();
    resetQuiz();
  }

  function changeSpeed(value) {
    setSpeed(Number(value));
  }

  const score = questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question.correct ? 1 : 0),
    0
  );

  const particles = Array.from({ length: 24 }, (_, i) => {
    const x = 70 + ((i * 37 + progress * 5) % Math.max(80, frontPosition - 80));
    const depth = 10 + ((i * 19) % Math.max(30, waterHeight * 35));
    const y = 345 - depth;

    return { id: i, x, y };
  });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Physics Lab · Experiment 08
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dam-Break Simulation
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Observe how water spreads after a barrier is removed. Investigate
            the influence of initial water depth and gravity on the
            characteristic speed of the resulting flow.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          {/* Simulation display */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="font-semibold">Water-column collapse</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Initially, water is held behind a barrier
                </p>
              </div>

              <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs text-cyan-300">
                {progress.toFixed(0)}% progress
              </span>
            </div>

            <div className="p-3 sm:p-5">
              <svg
                viewBox="0 0 800 430"
                role="img"
                aria-label="Illustration of water spreading along a horizontal channel after a dam is removed"
                className="w-full rounded-xl bg-slate-950"
              >
                <defs>
                  <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
                  </linearGradient>

                  <linearGradient id="groundFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>

                  <marker
                    id="waterArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6 Z" fill="#bae6fd" />
                  </marker>
                </defs>

                <rect width="800" height="430" fill="#020617" />

                {/* Background grid */}
                {[70, 150, 230, 310, 390, 470, 550, 630, 710].map((x) => (
                  <line
                    key={`x${x}`}
                    x1={x}
                    y1="35"
                    x2={x}
                    y2="345"
                    stroke="#1e293b"
                    strokeDasharray="3 7"
                  />
                ))}

                {[75, 135, 195, 255, 315].map((y) => (
                  <line
                    key={`y${y}`}
                    x1="30"
                    y1={y}
                    x2="770"
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="3 7"
                  />
                ))}

                <text
                  x="35"
                  y="28"
                  fill="#a5f3fc"
                  fontSize="13"
                  fontWeight="600"
                >
                  INITIAL DEPTH: {waterHeight.toFixed(1)} m
                </text>

                <text x="620" y="28" fill="#94a3b8" fontSize="12">
                  g = {gravity.toFixed(2)} m/s²
                </text>

                {/* Channel floor */}
                <path
                  d="M 30 345 L 770 345 L 770 380 L 30 380 Z"
                  fill="url(#groundFill)"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                {/* Water region */}
                <path
                  d={waterPath}
                  fill="url(#waterFill)"
                  stroke="#67e8f9"
                  strokeWidth="2"
                />

                {/* Initial barrier position */}
                {progress === 0 ? (
                  <g>
                    <rect
                      x="222"
                      y={initialSurfaceY}
                      width="16"
                      height={345 - initialSurfaceY}
                      fill="#94a3b8"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <text
                      x="230"
                      y={initialSurfaceY - 12}
                      fill="#e2e8f0"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      Barrier
                    </text>
                  </g>
                ) : (
                  <g>
                    <line
                      x1="230"
                      y1={initialSurfaceY}
                      x2="230"
                      y2="345"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      strokeWidth="2"
                      opacity="0.7"
                    />
                    <text
                      x="230"
                      y="365"
                      fill="#cbd5e1"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      Removed barrier
                    </text>
                  </g>
                )}

                {/* Illustrative water particles */}
                {showParticles &&
                  progress > 0 &&
                  particles.map((particle) => {
                    const localDepth = Math.max(
                      0,
                      345 - particle.y
                    );
                    const localSurface = initialSurfaceY;

                    if (
                      particle.x > frontPosition ||
                      particle.y < frontSurfaceY ||
                      particle.y > 340 ||
                      particle.y < localSurface - 5
                    ) {
                      return null;
                    }

                    return (
                      <circle
                        key={particle.id}
                        cx={particle.x}
                        cy={particle.y}
                        r="2.5"
                        fill="#e0f2fe"
                        opacity={0.45 + (particle.id % 5) * 0.1}
                      />
                    );
                  })}

                {/* Flow direction */}
                {progress > 0 && (
                  <g opacity="0.95">
                    {[300, 420, 540].map((x, i) => (
                      <line
                        key={x}
                        x1={x}
                        y1={320 - i * 8}
                        x2={x + 48}
                        y2={320 - i * 8}
                        stroke="#e0f2fe"
                        strokeWidth="2"
                        markerEnd="url(#waterArrow)"
                      />
                    ))}
                  </g>
                )}

                {/* Front marker */}
                <line
                  x1={frontPosition}
                  y1={frontSurfaceY}
                  x2={frontPosition}
                  y2="345"
                  stroke="#fbbf24"
                  strokeDasharray="5 5"
                  strokeWidth="1.5"
                />

                <text
                  x={Math.min(frontPosition, 700)}
                  y={Math.max(60, frontSurfaceY - 15)}
                  fill="#fcd34d"
                  fontSize="12"
                  textAnchor="middle"
                >
                  Water front
                </text>

                <text
                  x="400"
                  y="410"
                  fill="#cbd5e1"
                  fontSize="13"
                  textAnchor="middle"
                >
                  Horizontal channel
                </text>
              </svg>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Water
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Advancing front marker
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Channel floor
                </span>
              </div>

              <p className="mt-4 rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-xs leading-5 text-amber-200">
                This is a schematic animation, not a numerical shallow-water
                or CFD solver. The water profile and front position are
                illustrative; they do not predict the physical front location.
              </p>

              {/* Playback controls */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (progress >= 100) setProgress(0);
                    setRunning(true);
                  }}
                  disabled={running}
                  className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {progress >= 100 ? "Run again" : "Start simulation"}
                </button>

                <button
                  type="button"
                  onClick={() => setRunning(false)}
                  disabled={!running}
                  className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Pause
                </button>

                <button
                  type="button"
                  onClick={resetSimulation}
                  className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="progress"
                  className="mb-2 flex justify-between text-xs text-slate-400"
                >
                  <span>Simulation progress</span>
                  <span>{progress.toFixed(0)}%</span>
                </label>

                <input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={progress}
                  onChange={(e) => {
                    setProgress(Number(e.target.value));
                    setRunning(false);
                  }}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </section>

          {/* Controls and calculated results */}
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Simulation parameters</h2>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label
                      htmlFor="height"
                      className="text-sm text-slate-300"
                    >
                      Initial water depth
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {waterHeight.toFixed(1)} m
                    </span>
                  </div>

                  <input
                    id="height"
                    type="range"
                    min="1"
                    max="4"
                    step="0.1"
                    value={waterHeight}
                    onChange={(e) => changeHeight(e.target.value)}
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 m</span>
                    <span>4 m</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label
                      htmlFor="gravity"
                      className="text-sm text-slate-300"
                    >
                      Gravitational acceleration
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {gravity.toFixed(2)} m/s²
                    </span>
                  </div>

                  <input
                    id="gravity"
                    type="range"
                    min="1"
                    max="15"
                    step="0.1"
                    value={gravity}
                    onChange={(e) => changeGravity(e.target.value)}
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 m/s²</span>
                    <span>15 m/s²</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label
                      htmlFor="speed"
                      className="text-sm text-slate-300"
                    >
                      Animation speed
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {speed.toFixed(1)}×
                    </span>
                  </div>

                  <input
                    id="speed"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={(e) => changeSpeed(e.target.value)}
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0.5×</span>
                    <span>2.0×</span>
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showParticles}
                    onChange={(e) => setShowParticles(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  Show water particles
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Calculated results</h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">
                    Characteristic speed
                  </p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {waveSpeed.toFixed(2)} m/s
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    c = √(gh)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">
                    Characteristic time
                  </p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {characteristicTime.toFixed(3)} s
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    t* = √(h/g)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">
                    Ideal Froude number
                  </p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {froudeNumber.toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    c / √(gh)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">
                    Illustrative elapsed time
                  </p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {elapsedTime.toFixed(2)} s
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Based on progress
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                The characteristic speed and time are idealized shallow-water
                scales. The Froude number shown here is defined using that same
                characteristic speed, so it is 1 by construction; it is not a
                measured local flow Froude number.
              </p>
            </div>
          </section>
        </div>

        {/* Learning concepts */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">What should you observe?</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">
                1. Sudden release
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Removing the barrier allows water to move into the region
                that was previously blocked. Gravity drives the redistribution
                of water.
              </p>
            </article>

            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">
                2. Water depth
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Greater initial depth increases the characteristic shallow-water
                speed, according to c = √(gh), when gravity is held constant.
              </p>
            </article>

            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">
                3. Physical modelling
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                A predictive dam-break model must account for conservation of
                mass and momentum. More detailed models may also require
                friction, turbulence, and wetting and drying treatment.
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

                    let style =
                      "border-slate-700 bg-slate-950 hover:border-slate-500";

                    if (isSelected) {
                      style =
                        "border-cyan-500 bg-cyan-950/40 text-cyan-100";
                    }

                    if (submitted && isCorrect) {
                      style =
                        "border-emerald-600 bg-emerald-950/30 text-emerald-200";
                    } else if (submitted && isSelected && !isCorrect) {
                      style =
                        "border-red-600 bg-red-950/30 text-red-200";
                    }

                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [index]: optionIndex,
                          }))
                        }
                        className={`rounded-lg border p-3 text-left text-sm transition ${style}`}
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
          Physics Lab · Experiment 08 of 08 · Dam-Break Flow
        </footer>
      </div>
    </main>
  );
}

