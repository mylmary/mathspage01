
"use client";

import { useState } from "react";

export default function Naca0012Page() {
  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(5);
  const [chord, setChord] = useState(1);
  const [showFlow, setShowFlow] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [running, setRunning] = useState(true);

  const density = 1.225;
  const radians = (angle * Math.PI) / 180;

  // Thin-airfoil theory estimate; valid mainly for small angles
  const liftCoefficient = 2 * Math.PI * radians;
  const dynamicPressure = 0.5 * density * velocity * velocity;
  const liftPerSpan =
    dynamicPressure * chord * liftCoefficient;

  // Approximate NACA 0012 profile coordinates
  const chordPixels = 500;
  const startX = 140;
  const centerY = 300;
  const thicknessScale = chordPixels;

  function thickness(x) {
    const t = 0.12;

    return (
      5 *
      t *
      (0.2969 * Math.sqrt(x) -
        0.126 * x -
        0.3516 * x * x +
        0.2843 * x * x * x -
        0.1015 * x * x * x * x)
    );
  }

  const coordinates = Array.from({ length: 101 }, (_, i) => {
    const x = i / 100;
    return {
      x: startX + x * chordPixels,
      upperY: centerY - thickness(x) * thicknessScale,
      lowerY: centerY + thickness(x) * thicknessScale,
    };
  });

  const upperPath = coordinates
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.upperY}`)
    .join(" ");

  const lowerPath = coordinates
    .slice()
    .reverse()
    .map((p) => `L ${p.x} ${p.lowerY}`)
    .join(" ");

  const airfoilPath = `${upperPath} ${lowerPath} Z`;

  // Schematic streamlines. These are not CFD-computed trajectories.
  const flowLines = Array.from({ length: 11 }, (_, i) => {
    const y0 = 100 + i * 40;
    const slope = Math.tan(-radians) * 0.5;
    const startY = y0 + slope * 350;
    const endY = y0 - slope * 350;
    const influence = Math.exp(-Math.pow((y0 - centerY) / 110, 2));
    const bend = Math.sin(radians) * 65 * influence;

    return {
      id: i,
      d: `M 25 ${startY}
          C 170 ${startY - bend},
            270 ${startY - bend * 1.5},
            360 ${y0 - bend * 1.5}
          S 550 ${y0 + bend},
            770 ${endY}`,
    };
  });

  const questions = [
    {
      question: "What does the designation NACA 0012 tell us?",
      options: [
        "The airfoil has 12 degrees of camber",
        "It is symmetrical and has a maximum thickness of 12% of its chord",
        "Its chord is always 12 metres",
        "It is designed only for supersonic flow",
      ],
      correct: 1,
      explanation:
        "For NACA 0012, the first two digits indicate zero camber, while the final two indicate a maximum thickness of 12% of the chord.",
    },
    {
      question:
        "For a symmetrical airfoil in ideal flow, what is the approximate lift coefficient at zero angle of attack?",
      options: [
        "Approximately zero",
        "Always 1.0",
        "Always negative",
        "Infinite",
      ],
      correct: 0,
      explanation:
        "A symmetrical airfoil at zero angle of attack has approximately zero lift in the ideal thin-airfoil model.",
    },
    {
      question:
        "What generally happens to lift as angle of attack increases within the attached-flow range?",
      options: [
        "Lift coefficient decreases immediately",
        "Lift coefficient remains exactly constant",
        "Lift coefficient generally increases",
        "Air density becomes zero",
      ],
      correct: 2,
      explanation:
        "At small angles, thin-airfoil theory predicts CL ≈ 2πα, with α in radians. At larger angles, separation and stall make this linear model inaccurate.",
    },
  ];

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  function selectAngle(value) {
    setAngle(Number(value));
    resetQuiz();
  }

  function selectVelocity(value) {
    setVelocity(Number(value));
    resetQuiz();
  }

  function selectChord(value) {
    setChord(Number(value));
    resetQuiz();
  }

  const score = questions.reduce(
    (total, q, i) => total + (answers[i] === q.correct ? 1 : 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Physics Lab · Experiment 07
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            NACA 0012 Airfoil Flow
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Explore how angle of attack and free-stream velocity affect the
            airflow around a symmetrical airfoil. Examine its geometry,
            lift coefficient, and estimated lift per unit span.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          {/* Airflow visualization */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="font-semibold">Airfoil visualization</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Relative airflow around a NACA 0012 profile
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
                viewBox="0 0 800 500"
                role="img"
                aria-label="Illustration of airflow around a NACA 0012 symmetrical airfoil"
                className="w-full rounded-xl bg-slate-950"
              >
                <defs>
                  <linearGradient id="airfoilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="50%" stopColor="#164e63" />
                    <stop offset="100%" stopColor="#0e7490" />
                  </linearGradient>

                  <marker
                    id="airArrow"
                    markerWidth="7"
                    markerHeight="7"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6 Z" fill="#67e8f9" />
                  </marker>
                </defs>

                <rect width="800" height="500" fill="#020617" />

                {[80, 130, 180, 230, 280, 330, 380, 430].map((y) => (
                  <line
                    key={y}
                    x1="20"
                    y1={y}
                    x2="780"
                    y2={y}
                    stroke="#164e63"
                    strokeDasharray="3 9"
                    opacity="0.4"
                  />
                ))}

                <text
                  x="28"
                  y="32"
                  fill="#a5f3fc"
                  fontSize="13"
                  fontWeight="600"
                >
                  FREE-STREAM VELOCITY: {velocity} m/s
                </text>

                <text x="28" y="51" fill="#94a3b8" fontSize="12">
                  Angle of attack: {angle}°
                </text>

                {showFlow &&
                  flowLines.map((line) => (
                    <g key={line.id}>
                      <path
                        d={line.d}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        strokeDasharray="7 11"
                        markerEnd="url(#airArrow)"
                        opacity="0.75"
                        className={running ? "airflow-line" : ""}
                        style={{
                          animationDelay: `${line.id * -0.23}s`,
                        }}
                      />
                    </g>
                  ))}

                {/* Airfoil profile */}
                <path
                  d={airfoilPath}
                  fill="url(#airfoilFill)"
                  stroke="#a5f3fc"
                  strokeWidth="2"
                />

                <line
                  x1={startX}
                  y1={centerY}
                  x2={startX + chordPixels}
                  y2={centerY}
                  stroke="#e2e8f0"
                  strokeDasharray="5 5"
                  strokeWidth="1"
                  opacity="0.8"
                />

                <circle cx={startX} cy={centerY} r="4" fill="#f8fafc" />
                <circle
                  cx={startX + chordPixels}
                  cy={centerY}
                  r="4"
                  fill="#f8fafc"
                />

                <text
                  x={startX}
                  y="355"
                  fill="#cbd5e1"
                  fontSize="12"
                  textAnchor="middle"
                >
                  Leading edge
                </text>

                <text
                  x={startX + chordPixels}
                  y="355"
                  fill="#cbd5e1"
                  fontSize="12"
                  textAnchor="middle"
                >
                  Trailing edge
                </text>

                <line
                  x1={startX}
                  y1="385"
                  x2={startX + chordPixels}
                  y2="385"
                  stroke="#94a3b8"
                />
                <line
                  x1={startX}
                  y1="378"
                  x2={startX}
                  y2="392"
                  stroke="#94a3b8"
                />
                <line
                  x1={startX + chordPixels}
                  y1="378"
                  x2={startX + chordPixels}
                  y2="392"
                  stroke="#94a3b8"
                />

                <text
                  x="390"
                  y="408"
                  fill="#e2e8f0"
                  fontSize="13"
                  textAnchor="middle"
                >
                  Chord = {chord.toFixed(1)} m
                </text>

                <text
                  x="400"
                  y="460"
                  fill="#94a3b8"
                  fontSize="12"
                  textAnchor="middle"
                >
                  NACA 0012 · Symmetrical airfoil · 12% thickness
                </text>

                <text x="600" y="32" fill="#67e8f9" fontSize="12">
                  Schematic flow
                </text>
              </svg>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Illustrative streamlines
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-700" />
                  Airfoil surface
                </span>
              </div>

              <p className="mt-4 rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-xs leading-5 text-amber-200">
                This is an illustrative visualization, not a numerical CFD
                simulation. The streamline paths are schematic and do not
                calculate the actual pressure field, wake, or flow separation.
              </p>
            </div>
          </section>

          {/* Parameters */}
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Flow parameters</h2>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label htmlFor="angle" className="text-sm text-slate-300">
                      Angle of attack
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {angle}°
                    </span>
                  </div>

                  <input
                    id="angle"
                    type="range"
                    min="-10"
                    max="15"
                    step="1"
                    value={angle}
                    onChange={(e) => selectAngle(e.target.value)}
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>-10°</span>
                    <span>15°</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label htmlFor="velocity" className="text-sm text-slate-300">
                      Free-stream velocity
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {velocity} m/s
                    </span>
                  </div>

                  <input
                    id="velocity"
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={velocity}
                    onChange={(e) => selectVelocity(e.target.value)}
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>5 m/s</span>
                    <span>60 m/s</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between gap-3">
                    <label htmlFor="chord" className="text-sm text-slate-300">
                      Chord length
                    </label>
                    <span className="text-sm font-semibold text-cyan-300">
                      {chord.toFixed(1)} m
                    </span>
                  </div>

                  <input
                    id="chord"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={chord}
                    onChange={(e) => selectChord(e.target.value)}
                    className="w-full accent-cyan-400"
                  />

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0.5 m</span>
                    <span>2.0 m</span>
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showFlow}
                    onChange={(e) => setShowFlow(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  Show airflow streamlines
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Calculated results</h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">Dynamic pressure</p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {dynamicPressure.toFixed(1)} Pa
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    q = ½ρU²
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">Lift coefficient</p>
                  <p className="mt-2 text-xl font-bold text-cyan-300">
                    {liftCoefficient.toFixed(3)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    CL ≈ 2πα
                  </p>
                </div>

                <div className="col-span-2 rounded-xl bg-slate-800/70 p-4">
                  <p className="text-xs text-slate-400">
                    Estimated lift per unit span
                  </p>
                  <p className="mt-2 text-2xl font-bold text-cyan-300">
                    {liftPerSpan.toFixed(2)} N/m
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    L′ = q × chord × CL
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Assumptions: air density 1.225 kg/m³ and the ideal
                incompressible thin-airfoil model. The lift estimate does not
                account for stall, viscous drag, finite wings, or compressibility.
                Treat it as a theoretical estimate, particularly at large angles.
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
                1. Airfoil geometry
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                NACA 0012 is symmetrical about its chord line. Its maximum
                thickness is 12% of the chord, and its ideal geometric camber
                is zero.
              </p>
            </article>

            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">
                2. Angle of attack
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Increasing a small positive angle of attack generally increases
                lift. At sufficiently high angles, flow separation can cause
                stall, which the simple model cannot predict.
              </p>
            </article>

            <article className="rounded-xl bg-slate-800/60 p-4">
              <h3 className="font-semibold text-cyan-300">
                3. Dynamic pressure
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Dynamic pressure increases with the square of free-stream
                velocity. Under the same lift coefficient, doubling velocity
                produces four times the estimated lift.
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
          Physics Lab · Experiment 07 of 08 · NACA 0012 Airfoil
        </footer>
      </div>

      <style jsx>{`
        .airflow-line {
          animation: airflowMove 2.8s linear infinite;
        }

        @keyframes airflowMove {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -72;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .airflow-line {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

