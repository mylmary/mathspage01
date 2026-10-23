
"use client";

import { useEffect, useState } from "react";

const questions = [
  {
    question: "1. What causes the shock wave to form?",
    options: [
      "The high-pressure gas expands into the low-pressure gas",
      "Both sides have exactly the same pressure",
      "The tube wall heats the gas uniformly",
      "Gravity pulls the gas toward the low-pressure side",
    ],
    answer: 0,
    explanation:
      "The initial pressure difference drives gas motion. Under the right conditions, a compression wave steepens into a shock wave that travels into the low-pressure gas.",
  },
  {
    question: "2. What happens across a contact discontinuity?",
    options: [
      "Pressure always drops to zero",
      "Pressure and velocity remain continuous, but density can change",
      "Density and pressure must both remain constant",
      "The gas stops moving everywhere",
    ],
    answer: 1,
    explanation:
      "In the ideal Sod shock-tube solution, pressure and velocity are continuous across the contact surface, while density and temperature can change.",
  },
  {
    question: "3. What is a rarefaction wave?",
    options: [
      "A region where gas expands and pressure decreases",
      "A solid barrier inside the tube",
      "A wave that always increases pressure",
      "A region where all gas particles stop",
    ],
    answer: 0,
    explanation:
      "The rarefaction fan is an expansion wave. Pressure, density, and temperature generally decrease through the fan in the standard Sod problem.",
  },
];

export default function ShockTubePage() {
  const [pressureRatio, setPressureRatio] = useState(10);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setProgress((previous) =>
        previous >= 100 ? 0 : previous + 0.35
      );
    }, 40);

    return () => clearInterval(timer);
  }, [playing]);

  const resetSimulation = () => {
    setProgress(0);
    setPlaying(true);
  };

  // Illustrative wave positions, not a numerical Sod solver.
  const shockPosition = Math.min(91, 53 + progress * 0.34);
  const contactPosition = Math.min(76, 50 + progress * 0.22);
  const fanLeft = Math.max(13, 50 - progress * 0.25);
  const fanRight = Math.min(49, 50 - progress * 0.01);

  const score = questions.reduce(
    (total, question, index) =>
      total +
      (submitted[index] && answers[index] === question.answer
        ? 1
        : 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <a
          href="/physics"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Physics Experiments
        </a>

        <header className="mt-7 mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Experiment 02 · Fluid Dynamics
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            1D Shock Tube — Sod&apos;s Problem
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Investigate how a sudden pressure difference generates
            a shock wave, a contact discontinuity, and a rarefaction
            fan inside a tube.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Interactive tube
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Watch the wave regions move from the initial interface.
                </p>
              </div>

              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
                Conceptual model
              </span>
            </div>

            <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-6">
              <div className="mb-3 flex justify-between text-xs text-slate-400">
                <span>Left: high pressure</span>
                <span>Right: low pressure</span>
              </div>

              <div className="relative h-28 overflow-hidden rounded-lg border-2 border-slate-500">
                <div
                  className="absolute inset-y-0 left-0 bg-rose-600/70"
                  style={{ width: `${contactPosition}%` }}
                />

                <div
                  className="absolute inset-y-0 bg-sky-500/60"
                  style={{
                    left: `${contactPosition}%`,
                    right: 0,
                  }}
                />

                <div
                  className="absolute inset-y-0 bg-gradient-to-r from-amber-300/30 to-amber-100/5"
                  style={{
                    left: `${fanLeft}%`,
                    width: `${Math.max(0, fanRight - fanLeft)}%`,
                  }}
                />

                <div
                  className="absolute inset-y-0 w-0.5 bg-white/80"
                  style={{ left: "50%" }}
                />

                <div
                  className="absolute inset-y-0 w-1 bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]"
                  style={{ left: `${shockPosition}%` }}
                />

                <div
                  className="absolute inset-y-0 w-0.5 border-l-2 border-dashed border-white"
                  style={{ left: `${contactPosition}%` }}
                />

                <div className="absolute inset-0 flex items-center justify-around text-xs font-bold text-white sm:text-sm">
                  <span>Compressed / driven gas</span>
                  <span className="hidden sm:inline">Expansion</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
                <div className="rounded-lg bg-amber-400/10 p-3">
                  <div className="font-semibold text-amber-300">
                    Shock wave
                  </div>
                  <div className="mt-1 text-slate-400">
                    Compression
                  </div>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="font-semibold">Contact surface</div>
                  <div className="mt-1 text-slate-400">
                    Density changes
                  </div>
                </div>
                <div className="rounded-lg bg-sky-400/10 p-3">
                  <div className="font-semibold text-sky-300">
                    Rarefaction
                  </div>
                  <div className="mt-1 text-slate-400">
                    Expansion fan
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor="time">Simulation progress</label>
                  <span className="text-cyan-300">
                    {Math.round(progress)}%
                  </span>
                </div>

                <input
                  id="time"
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
                  The shock travels into the initially low-pressure
                  region.
                </li>
                <li>
                  The contact surface separates gas regions with
                  different densities.
                </li>
                <li>
                  The rarefaction fan represents gradual expansion
                  into the lower-pressure region.
                </li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">
                Initial conditions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Change the initial pressure ratio to explore why
                pressure differences matter.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="ratio" className="text-sm">
                    Pressure ratio (left/right)
                  </label>
                  <span className="font-semibold text-cyan-300">
                    {pressureRatio}:1
                  </span>
                </div>

                <input
                  id="ratio"
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={pressureRatio}
                  onChange={(event) =>
                    setPressureRatio(Number(event.target.value))
                  }
                  className="mt-4 w-full accent-cyan-400"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>2:1</span>
                  <span>20:1</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between rounded-lg bg-slate-950 p-3">
                  <span className="text-sm text-slate-400">
                    Left pressure
                  </span>
                  <span> {pressureRatio} units</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-950 p-3">
                  <span className="text-sm text-slate-400">
                    Right pressure
                  </span>
                  <span>1 unit</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-950 p-3">
                  <span className="text-sm text-slate-400">
                    Initial interface
                  </span>
                  <span>x = 0.5</span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                The pressure slider changes the displayed initial
                conditions only. Wave speeds and positions are not
                recalculated from the compressible-flow equations.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">
                Physics concept
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Sod&apos;s problem is a standard test of the
                one-dimensional compressible Euler equations. The
                tube starts with two uniform gas states separated
                by a diaphragm. Removing the diaphragm produces
                three characteristic wave regions.
              </p>

              <div className="mt-4 rounded-lg bg-slate-950 p-4 text-sm leading-6">
                <p className="font-semibold text-cyan-300">
                  Governing conservation laws
                </p>
                <p className="mt-2 text-slate-300">
                  Mass, momentum, and total energy are conserved
                  across the flow, with appropriate jump conditions
                  across the shock.
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
            onClick={() => {
              setAnswers({});
              setSubmitted({});
            }}
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
            href="/physics/cavity-flow"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Next experiment: Lid-Driven Cavity →
          </a>
        </footer>
      </div>
    </main>
  );
}

