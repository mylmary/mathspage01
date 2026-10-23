
"use client";

import { useEffect, useRef, useState } from "react";

export default function MagicFluidsPage() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef(null);

  const [brush, setBrush] = useState(30);
  const [force, setForce] = useState(1.2);
  const [palette, setPalette] = useState("rainbow");
  const [obstacle, setObstacle] = useState(false);
  const [paused, setPaused] = useState(false);
  const [clearCount, setClearCount] = useState(0);
  const [burstCount, setBurstCount] = useState(0);

  const settingsRef = useRef({ brush, force, palette, obstacle, paused });

  useEffect(() => {
    settingsRef.current = { brush, force, palette, obstacle, paused };
  }, [brush, force, palette, obstacle, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let animation;
    let hue = 0;
    let lastTime = 0;

    const particles = particlesRef.current;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#07111f";
      ctx.fillRect(0, 0, width, height);
    }

    function addParticles(x, y, vx = 0, vy = 0) {
      const s = settingsRef.current;
      const count = Math.round(5 + s.brush / 4);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * s.force * 2;

        particles.push({
          x: x + (Math.random() - 0.5) * s.brush,
          y: y + (Math.random() - 0.5) * s.brush,
          vx: vx * 0.25 + Math.cos(angle) * speed,
          vy: vy * 0.25 + Math.sin(angle) * speed,
          life: 180 + Math.random() * 100,
          hue: hue + Math.random() * 60,
          size: 1.5 + Math.random() * 2.5,
        });
      }

      if (particles.length > 5000) {
        particles.splice(0, particles.length - 5000);
      }
    }

    function getPosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function pointerDown(event) {
      canvas.setPointerCapture(event.pointerId);
      const p = getPosition(event);
      pointerRef.current = p;
      addParticles(p.x, p.y);
    }

    function pointerMove(event) {
      if (!pointerRef.current) return;

      const p = getPosition(event);
      const previous = pointerRef.current;
      const dx = p.x - previous.x;
      const dy = p.y - previous.y;
      const distance = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.ceil(distance / 7));

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        addParticles(
          previous.x + dx * t,
          previous.y + dy * t,
          dx * settingsRef.current.force * 0.1,
          dy * settingsRef.current.force * 0.1
        );
      }

      pointerRef.current = p;
    }

    function pointerUp() {
      pointerRef.current = null;
    }

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("resize", resize);

    resize();

    function animate(time) {
      const dt = Math.min(2, (time - (lastTime || time)) / 16.67 || 1);
      lastTime = time;
      const s = settingsRef.current;

      if (!s.paused) {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(7, 17, 31, 0.14)";
        ctx.fillRect(0, 0, width, height);

        hue = (hue + 0.4) % 360;

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          // A swirling velocity field creates a fluid-like visual effect.
          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const distance = Math.max(50, Math.hypot(dx, dy));

          p.vx += (-dy / distance) * 0.04 * s.force * dt;
          p.vy += (dx / distance) * 0.04 * s.force * dt;

          p.vx += Math.sin(p.y * 0.012 + time * 0.0005) * 0.025;
          p.vy += Math.cos(p.x * 0.012 + time * 0.0005) * 0.025;

          p.vx *= 0.994;
          p.vy *= 0.994;

          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;

          if (s.obstacle) {
            const radius = Math.min(width, height) * 0.11;
            const ox = p.x - width / 2;
            const oy = p.y - height / 2;
            const d = Math.hypot(ox, oy);

            if (d < radius + p.size) {
              const nx = ox / (d || 1);
              const ny = oy / (d || 1);

              p.x = width / 2 + nx * (radius + p.size);
              p.y = height / 2 + ny * (radius + p.size);

              const dot = p.vx * nx + p.vy * ny;
              p.vx -= 1.8 * dot * nx;
              p.vy -= 1.8 * dot * ny;
            }
          }

          if (
            p.life <= 0 ||
            p.x < -30 || p.x > width + 30 ||
            p.y < -30 || p.y > height + 30
          ) {
            particles.splice(i, 1);
            continue;
          }

          let color;

          if (s.palette === "ocean") {
            color = `hsl(${190 + p.hue % 45}, 95%, 65%)`;
          } else if (s.palette === "fire") {
            color = `hsl(${Math.max(0, 15 + p.hue % 45)}, 100%, 60%)`;
          } else if (s.palette === "violet") {
            color = `hsl(${265 + p.hue % 55}, 95%, 70%)`;
          } else {
            color = `hsl(${p.hue}, 100%, 65%)`;
          }

          ctx.globalAlpha = Math.min(1, p.life / 25);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 9;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        if (s.obstacle) {
          const radius = Math.min(width, height) * 0.11;

          ctx.beginPath();
          ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(148, 163, 184, 0.2)";
          ctx.fill();
          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animation = requestAnimationFrame(animate);
    }

    animation = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    particlesRef.current.length = 0;
  }, [clearCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;

      for (let j = 0; j < 35; j++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * force * 2;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 180 + Math.random() * 100,
          hue: Math.random() * 360,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    }
  }, [burstCount]);

  return (
    <main className="page">
      <header className="header">
        <a href="/physics" className="back">← Physics Lab</a>
        <div className="heading">
          <span className="eyebrow">INTERACTIVE EXPERIMENT</span>
          <h1>Magic Fluids</h1>
          <p>Draw on the screen and explore moving fluid patterns.</p>
        </div>
        <span className="live">● LIVE CANVAS</span>
      </header>

      <section className="workspace">
        <div className="stage">
          <div className="stageHeader">
            <span>◉ Fluid playground</span>
            <span className="hint">CLICK OR TOUCH AND DRAG</span>
          </div>

          <canvas
            ref={canvasRef}
            className="fluidCanvas"
            aria-label="Interactive fluid particle simulation"
          />

          <div className="stageFooter">
            <span>Try fast strokes, circles, and different directions.</span>
            <button onClick={() => setClearCount(v => v + 1)}>
              Clear canvas
            </button>
          </div>
        </div>

        <aside className="controls">
          <h2>Experiment controls</h2>
          <p className="description">
            Change one setting at a time to compare the patterns.
          </p>

          <label>
            <span>Brush size</span>
            <strong>{brush}px</strong>
          </label>
          <input
            type="range"
            min="10"
            max="80"
            value={brush}
            onChange={e => setBrush(Number(e.target.value))}
          />

          <label>
            <span>Flow force</span>
            <strong>{force.toFixed(1)}×</strong>
          </label>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={force}
            onChange={e => setForce(Number(e.target.value))}
          />

          <label className="selectLabel" htmlFor="palette">Colour palette</label>
          <select
            id="palette"
            value={palette}
            onChange={e => setPalette(e.target.value)}
          >
            <option value="rainbow">Rainbow</option>
            <option value="ocean">Ocean</option>
            <option value="fire">Fire</option>
            <option value="violet">Violet</option>
          </select>

          <button
            className="obstacleToggle"
            onClick={() => setObstacle(v => !v)}
            aria-pressed={obstacle}
          >
            <span>
              <strong>Circular obstacle</strong>
              <small>{obstacle ? "Obstacle enabled" : "Add an object to the flow"}</small>
            </span>
            <span className={`switch ${obstacle ? "on" : ""}`}>
              <span />
            </span>
          </button>

          <button
            className="primary"
            onClick={() => setPaused(v => !v)}
          >
            {paused ? "▶ Resume flow" : "Ⅱ Pause flow"}
          </button>

          <button
            className="secondary"
            onClick={() => setBurstCount(v => v + 1)}
          >
            ✦ Random burst
          </button>

          <div className="challenge">
            <span>TRY THIS</span>
            <h3>Make a vortex</h3>
            <p>
              Draw a circular motion. Increase the flow force and compare
              how the particles move. Enable the obstacle to explore how
              the visual flow changes around an object.
            </p>
          </div>
        </aside>
      </section>

      <footer className="footer">
        Interactive learning playground · Particle-based visual model,
        not a validated CFD solver.
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 28px clamp(14px, 4vw, 48px);
          background: #07111f;
          color: #e5eefb;
          font-family: Arial, Helvetica, sans-serif;
        }
        .header {
          max-width: 1400px;
          margin: 0 auto 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .back {
          color: #cbd5e1;
          text-decoration: none;
          border: 1px solid #334155;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 13px;
        }
        .eyebrow {
          display: block;
          color: #38bdf8;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 2px;
          margin-bottom: 7px;
        }
        h1 { margin: 0; font-size: clamp(28px, 4vw, 42px); }
        .heading p, .description { color: #94a3b8; font-size: 13px; }
        .live { color: #6ee7b7; font-size: 10px; letter-spacing: 1px; }
        .workspace {
          max-width: 1400px;
          margin: auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 18px;
          align-items: start;
        }
        .stage, .controls {
          min-width: 0;
          background: #0b1728;
          border: 1px solid #24354a;
          border-radius: 16px;
          overflow: hidden;
        }
        .stageHeader, .stageFooter {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          font-size: 12px;
          border-bottom: 1px solid #24354a;
        }
        .hint { color: #64748b; font-size: 9px; letter-spacing: 1px; }
        .fluidCanvas {
          display: block;
          width: 100%;
          height: min(66vh, 650px);
          min-height: 360px;
          background: #07111f;
          cursor: crosshair;
          touch-action: none;
        }
        .stageFooter {
          color: #94a3b8;
          font-size: 11px;
          border-bottom: 0;
          border-top: 1px solid #24354a;
        }
        button, select { font: inherit; cursor: pointer; }
        .stageFooter button, .secondary {
          color: #cbd5e1;
          background: #13253a;
          border: 1px solid #34465d;
          padding: 9px 12px;
          border-radius: 8px;
        }
        .controls { padding: 20px; }
        .controls h2 { font-size: 17px; margin: 0 0 8px; }
        .description { line-height: 1.6; margin: 0 0 22px; }
        label {
          display: flex;
          justify-content: space-between;
          margin: 20px 0 10px;
          font-size: 12px;
          color: #cbd5e1;
        }
        input[type="range"] { width: 100%; accent-color: #38bdf8; }
        .selectLabel { display: block; }
        select {
          width: 100%;
          padding: 11px;
          background: #101f33;
          color: white;
          border: 1px solid #34465d;
          border-radius: 8px;
        }
        .obstacleToggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          text-align: left;
          padding: 16px 0;
          margin: 20px 0;
          color: #e5eefb;
          background: transparent;
          border: 0;
          border-top: 1px solid #24354a;
          border-bottom: 1px solid #24354a;
        }
        .obstacleToggle strong, .obstacleToggle small { display: block; }
        .obstacleToggle strong { font-size: 12px; }
        .obstacleToggle small { color: #94a3b8; font-size: 10px; margin-top: 5px; }
        .switch {
          flex-shrink: 0;
          width: 38px;
          height: 22px;
          padding: 2px;
          border-radius: 20px;
          background: #334155;
        }
        .switch > span {
          display: block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          transition: transform .15s;
        }
        .switch.on { background: #0284c7; }
        .switch.on > span { transform: translateX(16px); }
        .primary, .secondary { width: 100%; padding: 12px; border-radius: 9px; margin-bottom: 9px; }
        .primary { color: white; background: #0284c7; border: 0; font-weight: bold; }
        .challenge {
          margin-top: 14px;
          padding: 14px;
          border: 1px solid #24465a;
          border-radius: 10px;
          background: #0e293c;
        }
        .challenge > span { color: #38bdf8; font-size: 9px; font-weight: bold; letter-spacing: 1.5px; }
        .challenge h3 { font-size: 14px; margin: 10px 0 7px; }
        .challenge p { font-size: 11px; line-height: 1.7; color: #9db0c7; margin: 0; }
        .footer { text-align: center; color: #64748b; font-size: 10px; margin: 20px auto 0; }
        @media (max-width: 850px) {
          .workspace { grid-template-columns: minmax(0, 1fr); }
          .controls { width: auto; }
          .fluidCanvas { height: 55vh; min-height: 320px; }
          .heading { flex: 1; }
        }
        @media (max-width: 480px) {
          .page { padding: 18px 10px; }
          .header { gap: 12px; }
          .fluidCanvas { min-height: 300px; }
          .controls { padding: 16px; }
        }
      `}</style>
    </main>
  );
}
