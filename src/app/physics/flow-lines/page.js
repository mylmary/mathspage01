
"use client";

import { useEffect, useRef, useState } from "react";

const shapes = ["Circle", "Airfoil", "Flat plate"];
const questions = [
  {
    question: "What happens to the flow behind the object?",
    options: [
      "The flow always stays uniform",
      "A wake can form behind the object",
      "The fluid stops moving everywhere",
    ],
    answer: 1,
    explanation:
      "The object disturbs the incoming flow. Depending on its shape, orientation and flow conditions, a wake can form downstream.",
  },
  {
    question: "What happens when you rotate a flat plate into the flow?",
    options: [
      "The flow interaction can change significantly",
      "The flow becomes independent of the object",
      "The fluid density becomes zero",
    ],
    answer: 0,
    explanation:
      "Changing the angle changes the projected area and pressure distribution. At suitable conditions, separation and drag can increase.",
  },
];

export default function PhysicsPage() {
  const canvasRef = useRef(null);
  const [shape, setShape] = useState("Airfoil");
  const [angle, setAngle] = useState(8);
  const [speed, setSpeed] = useState(5);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let frame;
    let particles = [];
    let width = 0;
    let height = 0;
    let tick = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: 230 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        offset: i * 0.17,
        life: Math.random(),
      }));
    }

    function draw() {
      ctx.fillStyle = "#071b25";
      ctx.fillRect(0, 0, width, height);

      // Wind-tunnel grid
      ctx.strokeStyle = "rgba(119, 190, 205, 0.09)";
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

      const cx = width * 0.48;
      const cy = height * 0.5;
      const scale = Math.min(width, height) * 0.18;
      const radians = (angle * Math.PI) / 180;

      function localPoint(x, y) {
        return {
          x: cx + x * Math.cos(radians) - y * Math.sin(radians),
          y: cy + x * Math.sin(radians) + y * Math.cos(radians),
        };
      }

      function insideObject(x, y) {
        const dx = x - cx;
        const dy = y - cy;
        const lx = dx * Math.cos(radians) + dy * Math.sin(radians);
        const ly = -dx * Math.sin(radians) + dy * Math.cos(radians);

        if (shape === "Circle") {
          return lx * lx + ly * ly < scale * scale * 0.48;
        }
        if (shape === "Flat plate") {
          return Math.abs(lx) < scale * 0.75 &&
            Math.abs(ly) < scale * 0.09;
        }
        return (
          Math.abs(lx) < scale &&
          Math.abs(ly) < scale * 0.23 * (1 - Math.abs(lx) / scale) + 2
        );
      }

      // Animated, illustrative flow field.
      // This is not a numerical CFD solver.
      function velocity(x, y) {
        const dx = x - cx;
        const dy = y - cy;
        const lx = dx * Math.cos(radians) + dy * Math.sin(radians);
        const ly = -dx * Math.sin(radians) + dy * Math.cos(radians);

        const a = shape === "Circle" ? scale * 0.7 : scale * 0.95;
        const r2 = lx * lx + ly * ly + 100;
        const influence = Math.exp(-Math.abs(lx) / (a * 1.6));
        const deflection =
          (ly / (Math.abs(ly) + scale * 0.25)) *
          influence *
          scale *
          0.12;

        let vx = speed * 0.85;
        let vy = 0;

        if (Math.abs(lx) < a * 2.3) {
          vy += deflection * speed * 0.11;
          vx *= 1 - 0.45 * Math.exp(-r2 / (a * a * 0.45));
        }

        // Approximate downstream wake disturbance
        if (lx > a * 0.7 && lx < a * 5) {
          const wake = Math.exp(
            -((ly / (a * 0.65 + lx * 0.13)) ** 2)
          );
          vx *= 1 - 0.48 * wake;
          vy += Math.sin(lx * 0.045 + tick * 0.04) *
            wake * speed * 0.3;
        }

        const angleX = vx * Math.cos(radians) -
          vy * Math.sin(radians);
        const angleY = vx * Math.sin(radians) +
          vy * Math.cos(radians);

        return { x: angleX, y: angleY };
      }

      // Streamlines: integrate the illustrative vector field.
      for (let sy = 12; sy < height; sy += 13) {
        let x = 0;
        let y = sy;
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let i = 0; i < 150; i++) {
          const v = velocity(x, y);
          x += v.x * 0.65;
          y += v.y * 0.65;

          if (insideObject(x, y)) break;
          ctx.lineTo(x, y);
          if (x > width || y < 0 || y > height) break;
        }

        ctx.strokeStyle = "rgba(79, 214, 222, 0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Object
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(radians);
      ctx.fillStyle = "#e5f4f2";
      ctx.strokeStyle = "#72eee0";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#43e6d5";
      ctx.shadowBlur = 12;

      ctx.beginPath();
      if (shape === "Circle") {
        ctx.ellipse(0, 0, scale * 0.7, scale * 0.7, 0, 0, Math.PI * 2);
      } else if (shape === "Flat plate") {
        ctx.rect(-scale * 0.75, -scale * 0.09, scale * 1.5, scale * 0.18);
      } else {
        ctx.moveTo(-scale, 0);
        ctx.quadraticCurveTo(-scale * 0.25, -scale * 0.36, scale, 0);
        ctx.quadraticCurveTo(-scale * 0.25, scale * 0.12, -scale, 0);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Moving smoke particles
      for (const p of particles) {
        const v = velocity(p.x, p.y);
        if (!paused) {
          p.x += v.x * 0.45;
          p.y += v.y * 0.45;

          if (p.x > width || p.y < 0 || p.y > height ||
              insideObject(p.x, p.y)) {
            p.x = 0;
            p.y = Math.random() * height;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(145, 255, 233, 0.8)";
        ctx.fill();
      }

      ctx.fillStyle = "#8cb9c4";
      ctx.font = "11px sans-serif";
      ctx.fillText("INLET →", 12, 20);
      ctx.fillText("FLOW VISUALIZATION · ILLUSTRATIVE", 12, height - 12);

      if (!paused) tick++;
      frame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [shape, angle, speed, paused]);

  const question = questions[questionIndex];

  function nextQuestion() {
    setQuestionIndex((questionIndex + 1) % questions.length);
    setSelected(null);
    setShowAnswer(false);
  }

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="font-bold tracking-tight">
            <span className="text-teal-700">PHYSICS</span> LAB
          </a>
          <span className="text-sm text-slate-500">
            CFD Learning Studio
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-5 lg:grid-cols-[1fr_330px]">
        <section className="min-w-0 space-y-5">
          <div>
            <p className="text-sm font-semibold text-teal-700">
              MODULE 01 / EXTERNAL FLOW
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Explore the flow
            </h1>
            <p className="mt-2 text-slate-600">
              Change the object. Observe the smoke. Predict what happens next.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#071b25] shadow-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-sm font-medium text-white">
                Wind tunnel
              </span>
              <button
                onClick={() => setPaused(!paused)}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white"
              >
                {paused ? "▶ Resume" : "Ⅱ Pause"}
              </button>
            </div>
            <canvas
              ref={canvasRef}
              className="block h-[340px] w-full sm:h-[430px]"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Configure the experiment</h2>
            <div className="mt-4">
              <label className="text-sm font-medium">Object geometry</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {shapes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setShape(item)}
                    className={`rounded-xl border p-3 text-sm ${
                      shape === item
                        ? "border-teal-600 bg-teal-50 text-teal-800"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <label htmlFor="angle" className="font-medium">
                  Orientation / angle
                </label>
                <span>{angle}°</span>
              </div>
              <input
                id="angle"
                type="range"
                min="-30"
                max="30"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="mt-3 w-full accent-teal-700"
              />
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <label htmlFor="speed" className="font-medium">
                  Inlet flow speed
                </label>
                <span>{speed} m/s*</span>
              </div>
              <input
                id="speed"
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="mt-3 w-full accent-teal-700"
              />
              <p className="mt-2 text-xs text-slate-500">
                *Illustrative control value, not a validated CFD measurement.
              </p>
            </div>
          </div>

          <p className="text-xs leading-5 text-slate-500">
            Model note: this prototype animates a simplified flow-field
            approximation. It does not solve the Navier–Stokes equations or
            calculate validated pressure, drag or turbulence values.
          </p>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-teal-700">
              KNOWLEDGE CHECK
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Question {questionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-500">External flow</span>
            </div>

            <h2 className="mt-4 text-lg font-semibold leading-7">
              {question.question}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Use the visualization to make a prediction.
            </p>

            <div className="mt-5 space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelected(index);
                    setShowAnswer(false);
                  }}
                  className={`w-full rounded-xl border p-3 text-left text-sm ${
                    selected === index
                      ? "border-teal-600 bg-teal-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="mr-2 font-semibold text-teal-700">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <button
              disabled={selected === null}
              onClick={() => setShowAnswer(true)}
              className="mt-4 w-full rounded-xl bg-teal-700 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check answer
            </button>

            {showAnswer && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="font-semibold">
                  {selected === question.answer
                    ? "Correct!"
                    : "Not quite. Review the flow."}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {question.explanation}
                </p>
                <button
                  onClick={nextQuestion}
                  className="mt-3 text-sm font-semibold text-teal-800"
                >
                  Next question →
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-[#153b38] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              Experiment objective
            </p>
            <h3 className="mt-3 text-lg font-semibold">
              Think like a CFD engineer
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Change one parameter at a time. Compare the flow around each
              shape and explain why the pattern changes.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
