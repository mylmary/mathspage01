"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const questions = [
{
question: "1. What do the flow lines show?",
options: [
"The path and direction of fluid motion",
"The temperature of the object only",
"The weight of the fluid",
"The colour of the object",
],
answer: 0,
explanation:
"Flow lines help us visualize the direction of fluid motion. In a steady flow, streamlines are tangent to the local velocity direction.",
},
{
question: "2. What happens when fluid passes around an object?",
options: [
"The fluid always stops completely",
"The flow changes direction around the object",
"The object creates more fluid",
"The fluid loses all its velocity",
],
answer: 1,
explanation:
"The object obstructs the flow, so the fluid moves around it. The pattern depends on the shape, angle, speed, and flow conditions.",
},
{
question: "3. What can a wake behind an object indicate?",
options: [
"The fluid has disappeared",
"The object has no effect on the flow",
"A region of disturbed flow behind the object",
"The fluid has become a solid",
],
answer: 2,
explanation:
"A wake is a region of disturbed flow downstream of an object. Depending on the conditions, it may contain recirculation or vortices.",
},
];

export default function FlowLinesPage() {
const canvasRef = useRef(null);
const [shape, setShape] = useState("cylinder");
const [angle, setAngle] = useState(0);
const [speed, setSpeed] = useState(3);
const [showLines, setShowLines] = useState(true);
const [answers, setAnswers] = useState({});
const [submitted, setSubmitted] = useState(false);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;

const ctx = canvas.getContext("2d");
if (!ctx) return;

let animationId;
let time = 0;
let particles = [];

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = Array.from({ length: 115 }, (_, i) => ({
    x: (i / 115) * rect.width,
    y: Math.random() * rect.height,
    offset: Math.random() * Math.PI * 2,
  }));
};

resizeCanvas();

const draw = () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const objectSize = Math.min(width * 0.105, 39);
  const radians = (angle * Math.PI) / 180;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#071321";
  ctx.fillRect(0, 0, width, height);

  // Background grid
  ctx.strokeStyle = "rgba(148,163,184,0.08)";
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const shapeFactor =
    shape === "plate" ? 0.55 : shape === "airfoil" ? 0.8 : 1;

  // Visual approximation of fluid deflection around the object.
  const flowY = (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const sigmaX = objectSize * 1.45;
    const sigmaY = objectSize * 1.5;
    const nearObject = Math.exp(
      -(dx * dx) / (sigmaX * sigmaX) -
        (dy * dy) / (sigmaY * sigmaY)
    );

    const wake = dx > 0
      ? Math.exp(-dx / (objectSize * 5)) *
        Math.exp(-(dy * dy) / (objectSize * objectSize * 2.8))
      : 0;

    const deflection =
      (-dy / sigmaY) *
      nearObject *
      objectSize *
      speed *
      0.48 *
      shapeFactor;

    const wakeMotion =
      Math.sin(time * 0.045 - dx * 0.055) *
      wake *
      objectSize *
      0.35;

    return deflection + wakeMotion;
  };

  // Draw illustrative streamlines.
  if (showLines) {
    for (let line = -5; line <= 5; line++) {
      const startY = cy + line * objectSize * 0.65;
      ctx.beginPath();
      ctx.strokeStyle =
        line === 0
          ? "rgba(34,211,238,0.8)"
          : "rgba(56,189,248,0.45)";
      ctx.lineWidth = line === 0 ? 1.7 : 1;

      for (let x = 0; x <= width; x += 4) {
        const y =
          startY +
          flowY(x, startY) *
            (Math.abs(line) < 2 ? 1.8 : 1.1) +
          (x > cx
            ? Math.sin((x - cx) * 0.045 + time * 0.04 + line) *
              Math.min((x - cx) / 5, 1) *
              objectSize *
              0.12
            : 0);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }

  // Update and draw moving tracer particles.
  particles.forEach((particle) => {
    particle.x += speed * 0.65;

    if (particle.x > width) {
      particle.x = 0;
      particle.y = Math.random() * height;
    }

    const y = particle.y + flowY(particle.x, particle.y);

    ctx.beginPath();
    ctx.arc(particle.x, y, 1.7, 0, Math.PI * 2);
    ctx.fillStyle = "#67e8f9";
    ctx.fill();
  });

  // Draw object, rotated by the selected angle.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(radians);

  ctx.fillStyle = "#f59e0b";
  ctx.strokeStyle = "#fde68a";
  ctx.lineWidth = 2;

  ctx.beginPath();

  if (shape === "cylinder") {
    ctx.ellipse(0, 0, objectSize, objectSize, 0, 0, Math.PI * 2);
  } else if (shape === "plate") {
    ctx.rect(-objectSize * 1.2, -objectSize * 0.18,
      objectSize * 2.4, objectSize * 0.36);
  } else {
    ctx.moveTo(-objectSize * 1.3, -objectSize * 0.48);
    ctx.quadraticCurveTo(
      objectSize * 0.15,
      -objectSize * 0.8,
      objectSize * 1.4,
      0
    );
    ctx.quadraticCurveTo(
      objectSize * 0.15,
      objectSize * 0.8,
      -objectSize * 1.3,
      objectSize * 0.48
    );
    ctx.closePath();
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Flow direction arrow
  ctx.strokeStyle = "#a5f3fc";
  ctx.fillStyle = "#a5f3fc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(18, 24);
  ctx.lineTo(65, 24);
  ctx.lineTo(57, 18);
  ctx.moveTo(65, 24);
  ctx.lineTo(57, 30);
  ctx.stroke();

  ctx.font = "12px sans-serif";
  ctx.fillText("Flow direction", 18, 45);

  time += speed * 0.3;
  animationId = requestAnimationFrame(draw);
};

draw();

window.addEventListener("resize", resizeCanvas);

return () => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resizeCanvas);
};

}, [shape, angle, speed, showLines]);

const score = questions.reduce(
(total, question, index) =>
total + (answers[index] === question.answer ? 1 : 0),
0
);

return (
<main className="min-h-screen bg-slate-950 px-4 py-7 text-white sm:px-8">
<div className="mx-auto max-w-6xl">
<Link
href="/physics"
className="text-sm text-slate-400 hover:text-cyan-300"
>
← Back to Physics Experiments
</Link>

    <header className="mb-7 mt-7">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Experiment 01 · Fluid Mechanics
      </p>

      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        Flow Lines: Observe Fluid Motion
      </h1>

      <p className="mt-3 max-w-3xl leading-7 text-slate-400">
        Change the object's shape, angle, and flow speed. Observe how
        the illustrative flow pattern changes as fluid passes around
        the object.
      </p>
    </header>

    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <h2 className="font-semibold">Flow visualization</h2>
          <span className="text-xs text-cyan-400">
            Animated model
          </span>
        </div>

        <canvas
          ref={canvasRef}
          className="block h-[330px] w-full sm:h-[410px]"
          aria-label="Animated illustrative fluid flow around an object"
        />

        <div className="space-y-5 p-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Object shape
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["cylinder", "Cylinder"],
                ["airfoil", "Airfoil"],
                ["plate", "Flat plate"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setShape(value)}
                  className={`rounded-lg border px-2 py-3 text-sm transition ${
                    shape === value
                      ? "border-cyan-400 bg-cyan-950 text-cyan-200"
                      : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between gap-3">
              <label htmlFor="flow-speed" className="text-sm">
                Flow speed
              </label>
              <span className="text-sm text-cyan-300">{speed} units</span>
            </div>
            <input
              id="flow-speed"
              type="range"
              min="1"
              max="8"
              step="1"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between gap-3">
              <label htmlFor="object-angle" className="text-sm">
                Object angle
              </label>
              <span className="text-sm text-cyan-300">{angle}°</span>
            </div>
            <input
              id="object-angle"
              type="range"
              min="-45"
              max="45"
              step="5"
              value={angle}
              onChange={(event) => setAngle(Number(event.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <button
            onClick={() => setShowLines((current) => !current)}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-cyan-400"
          >
            {showLines ? "Hide flow lines" : "Show flow lines"}
          </button>
        </div>
      </div>

      <aside className="space-y-5">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">What to observe</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
            <li>
              <span className="font-medium text-cyan-300">Shape:</span>{" "}
              Compare the patterns around the cylinder, airfoil, and plate.
            </li>
            <li>
              <span className="font-medium text-cyan-300">Speed:</span>{" "}
              Increase the setting to see the tracer particles move faster.
            </li>
            <li>
              <span className="font-medium text-cyan-300">Angle:</span>{" "}
              Rotate the object and observe how its orientation changes.
            </li>
            <li>
              <span className="font-medium text-cyan-300">Wake:</span>{" "}
              Look at the disturbed pattern downstream of the object.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-5">
          <h2 className="font-semibold text-amber-200">
            About this simulation
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This is a simplified animated visualization for learning.
            The displayed flow pattern is illustrative; it is not
            calculated by solving the Navier–Stokes equations. It does
            not predict real pressure, drag, lift, or vortex shedding.
          </p>
        </section>
      </aside>
    </section>

    <section className="mt-10">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Knowledge check
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          Test your understanding
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Answer all three questions, then check your score.
        </p>
      </div>

      <div className="space-y-5">
        {questions.map((question, index) => (
          <article
            key={question.question}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <h3 className="font-semibold">{question.question}</h3>

            <div className="mt-4 space-y-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = answers[index] === optionIndex;
                const isCorrect = question.answer === optionIndex;

                let optionStyle =
                  "border-slate-700 hover:border-slate-500";

                if (submitted && isCorrect) {
                  optionStyle = "border-emerald-500 bg-emerald-950/40";
                } else if (submitted && isSelected && !isCorrect) {
                  optionStyle = "border-red-500 bg-red-950/30";
                } else if (isSelected) {
                  optionStyle = "border-cyan-400 bg-cyan-950/50";
                }

                return (
                  <button
                    key={option}
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [index]: optionIndex,
                      }))
                    }
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm leading-6 transition ${optionStyle}`}
                  >
                    <span className="font-semibold text-slate-400">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                <span className="font-semibold text-cyan-300">
                  Explanation:{" "}
                </span>
                {question.explanation}
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {!submitted ? (
          <button
            disabled={Object.keys(answers).length !== questions.length}
            onClick={() => setSubmitted(true)}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <>
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3">
              Score:{" "}
              <span className="font-bold text-cyan-300">
                {score} / {questions.length}
              </span>
            </div>
            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm hover:border-cyan-400"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </section>

    <footer className="mt-12 border-t border-slate-800 py-6">
      <Link
        href="/physics"
        className="text-sm text-cyan-300 hover:text-cyan-200"
      >
        ← Return to all Physics experiments
      </Link>
    </footer>
  </div>
</main>

);
}
