
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "reactflow3d_student_workspace_v1";

const simulations = [
  {
    title: "Cylinder Flow",
    description: "Explore flow separation, wakes and vortex shedding.",
    href: "/physics/cylinder-flow",
    category: "Fluid Mechanics",
    level: "Intermediate",
  },
  {
    title: "Lid-Driven Cavity",
    description: "Study circulation and velocity inside a moving-lid cavity.",
    href: "/physics/lid-driven-cavity",
    category: "Fluid Mechanics",
    level: "Intermediate",
  },
  {
    title: "Sod Shock Tube",
    description: "Investigate shock waves and compressible flow.",
    href: "/physics/sod-shock-tube",
    category: "Compressible Flow",
    level: "Advanced",
  },
  {
    title: "Flow Lines",
    description: "Understand streamlines and fluid movement.",
    href: "/physics/flow-lines",
    category: "Fluid Mechanics",
    level: "Beginner",
  },
  {
    title: "Nozzle Flow",
    description: "Explore the relationship between nozzle geometry and velocity.",
    href: "/physics/nozzle",
    category: "Compressible Flow",
    level: "Intermediate",
  },
  {
    title: "Flat Plate",
    description: "Learn how a boundary layer develops along a surface.",
    href: "/physics/flat-plate",
    category: "Aerodynamics",
    level: "Intermediate",
  },
  {
    title: "NACA 0012 Airfoil",
    description: "Explore airflow around an airfoil and the effects of angle of attack.",
    href: "/physics/naca0012",
    category: "Aerodynamics",
    level: "Intermediate",
  },
  {
    title: "Dam Break",
    description: "Observe transient free-surface flow and wave propagation.",
    href: "/physics/dam-break",
    category: "Free-Surface Flow",
    level: "Intermediate",
  },
];

const materials = [
  {
    id: "continuity",
    category: "Fluid Mechanics",
    title: "1. Conservation of Mass",
    subtitle: "The continuity equation",
    level: "Foundation",
    content: [
      {
        heading: "The central idea",
        text: "Mass cannot be created or destroyed in an ordinary fluid-flow problem. The mass entering a control volume must balance the mass leaving it and any accumulation inside it.",
      },
      {
        heading: "For steady, incompressible flow",
        formula: "A₁V₁ = A₂V₂",
        text: "If the cross-sectional area decreases, the average velocity must increase to maintain the same flow rate.",
      },
      {
        heading: "Try it in the lab",
        text: "Open the Nozzle Flow simulation. Compare wider and narrower sections, then record how the velocity changes. Check whether your observations agree with continuity.",
      },
    ],
  },
  {
    id: "bernoulli",
    category: "Fluid Mechanics",
    title: "2. Pressure and Velocity",
    subtitle: "Bernoulli's principle",
    level: "Foundation",
    content: [
      {
        heading: "The central idea",
        text: "Under suitable conditions, pressure energy, kinetic energy and gravitational potential energy trade off along a streamline.",
      },
      {
        heading: "Bernoulli equation",
        formula: "p + ½ρV² + ρgz = constant",
        text: "Here p is pressure, ρ is density, V is speed, g is gravitational acceleration and z is elevation.",
      },
      {
        heading: "Important limitation",
        text: "The simple equation assumes steady flow, negligible viscous losses and appropriate streamline conditions. Real flows can lose mechanical energy through friction and turbulence.",
      },
      {
        heading: "Try it in the lab",
        text: "Explore the Nozzle Flow simulation. Compare the pressure and velocity fields if both are provided. Do not assume that every flow has a simple inverse pressure-velocity relationship.",
      },
    ],
  },
  {
    id: "reynolds",
    category: "Fluid Mechanics",
    title: "3. Reynolds Number",
    subtitle: "Inertia versus viscosity",
    level: "Foundation",
    content: [
      {
        heading: "The central idea",
        text: "The Reynolds number compares inertial effects with viscous effects. It helps characterise flow behaviour, although the transition to turbulence depends on geometry and disturbances.",
      },
      {
        heading: "Equation",
        formula: "Re = ρVL / μ",
        text: "Here ρ is density, V is a characteristic speed, L is a characteristic length and μ is dynamic viscosity.",
      },
      {
        heading: "How to interpret it",
        text: "Low Reynolds numbers generally indicate that viscous effects are important. Higher Reynolds numbers indicate stronger relative inertial effects and may be associated with unsteady or turbulent flow.",
      },
      {
        heading: "Try it in the lab",
        text: "Explore Cylinder Flow. If the simulation allows you to change the flow speed or fluid properties, observe how the wake changes and record the conditions.",
      },
    ],
  },
  {
    id: "boundary",
    category: "Aerodynamics",
    title: "4. Boundary Layers",
    subtitle: "What happens near a solid wall?",
    level: "Intermediate",
    content: [
      {
        heading: "The central idea",
        text: "Because of the no-slip condition, fluid velocity at a stationary solid wall is zero relative to that wall. A velocity gradient develops near the surface.",
      },
      {
        heading: "Why it matters",
        text: "Boundary layers affect wall shear stress, drag, heat transfer and the possibility of flow separation.",
      },
      {
        heading: "Try it in the lab",
        text: "Open the Flat Plate simulation. Look for changes in the velocity profile with distance from the leading edge. Note whether the boundary layer thickens downstream.",
      },
    ],
  },
  {
    id: "airfoil",
    category: "Aerodynamics",
    title: "5. Lift and Airfoils",
    subtitle: "Understanding the NACA 0012",
    level: "Intermediate",
    content: [
      {
        heading: "The central idea",
        text: "An airfoil changes the flow field around it, producing pressure distributions and forces. Lift is the component of aerodynamic force perpendicular to the incoming flow.",
      },
      {
        heading: "Angle of attack",
        text: "Changing the angle between the airfoil chord and the incoming flow changes the pressure distribution and generally changes lift and drag. At sufficiently high angles, separation can cause stall.",
      },
      {
        heading: "Try it in the lab",
        text: "Explore the NACA 0012 simulation. If angle of attack is adjustable, compare several settings and record any changes in the flow field.",
      },
    ],
  },
  {
    id: "shock",
    category: "Compressible Flow",
    title: "6. Shock Waves",
    subtitle: "Rapid changes in compressible flow",
    level: "Advanced",
    content: [
      {
        heading: "The central idea",
        text: "A shock wave is a thin region across which properties such as pressure, density, temperature and velocity change sharply.",
      },
      {
        heading: "Conservation laws",
        text: "Across a shock, mass, momentum and total energy are conserved, while entropy increases for a physical shock.",
      },
      {
        heading: "Try it in the lab",
        text: "Open the Sod Shock Tube simulation. Observe the wave structures and compare the regions on either side of each wave.",
      },
    ],
  },
  {
    id: "free-surface",
    category: "Free-Surface Flow",
    title: "7. Dam-Break Flow",
    subtitle: "Transient water motion",
    level: "Intermediate",
    content: [
      {
        heading: "The central idea",
        text: "A dam-break problem models the rapid release of water after a barrier is removed. Gravity drives the motion, while inertia and free-surface dynamics shape the flow.",
      },
      {
        heading: "What to observe",
        text: "Look for the advancing water front, changing water depth and the propagation of disturbances. The exact behaviour depends on the initial conditions and geometry.",
      },
      {
        heading: "Try it in the lab",
        text: "Open Dam Break. Record what changes first after the simulation starts and describe how the water front moves over time.",
      },
    ],
  },
  {
    id: "streamlines",
    category: "Fluid Mechanics",
    title: "8. Streamlines and Flow Fields",
    subtitle: "Reading fluid motion",
    level: "Foundation",
    content: [
      {
        heading: "The central idea",
        text: "A streamline is a curve whose tangent at every point follows the instantaneous velocity direction. In steady flow, streamlines coincide with particle paths and streaklines under standard conditions.",
      },
      {
        heading: "Interpreting the field",
        text: "Closely spaced streamlines can indicate regions of higher speed when the visualisation uses consistent spacing and scaling, but the drawing alone is not a universal quantitative measure.",
      },
      {
        heading: "Try it in the lab",
        text: "Open Flow Lines. Identify regions where the flow turns, accelerates or appears to recirculate. Describe what the visualisation actually shows.",
      },
    ],
  },
];

const initialData = {
  notes: [],
  tasks: [
    { id: "task-1", text: "Read one learning material", done: false },
    { id: "task-2", text: "Run a simulation and observe the flow", done: false },
    { id: "task-3", text: "Record an observation in my notes", done: false },
  ],
  completed: [],
};

const navItems = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "simulations", label: "Simulation Lab", icon: "◈" },
  { id: "materials", label: "Learning Materials", icon: "▤" },
  { id: "notes", label: "My Notes", icon: "✎" },
  { id: "checklist", label: "Study Checklist", icon: "✓" },
];

const categories = [
  "All",
  "Fluid Mechanics",
  "Aerodynamics",
  "Compressible Flow",
  "Free-Surface Flow",
];

const styles = {
  page: "min-h-screen bg-[#07111f] text-slate-100",
  panel: "rounded-2xl border border-slate-800 bg-[#0d1a2b]",
  field:
    "w-full rounded-xl border border-slate-700 bg-[#091525] px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10",
  button:
    "inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300",
};

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 px-5 py-10 text-center">
      <div className="text-2xl text-cyan-400">◇</div>
      <p className="mt-3 font-semibold text-slate-200">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export default function StudentPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("continuity");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [taskText, setTaskText] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setData({
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : initialData.tasks,
          completed: Array.isArray(parsed.completed)
            ? parsed.completed
            : [],
        });
      }
    } catch (error) {
      console.error("Could not load student workspace:", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStatus("Saved on this device");
    } catch (error) {
      console.error("Could not save student workspace:", error);
      setStatus("Could not save. Check browser storage settings.");
    }
  }, [data, ready]);

  const filteredSimulations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return simulations.filter((simulation) => {
      const matchesCategory =
        category === "All" || simulation.category === category;

      const searchableText =
        `${simulation.title} ${simulation.description} ${simulation.category}`.toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });
  }, [search, category]);

  const selectedMaterialData =
    materials.find((item) => item.id === selectedMaterial) || materials[0];

  const completedCount = data.completed.length;
  const taskCount = data.tasks.length;
  const doneTaskCount = data.tasks.filter((task) => task.done).length;

  function toggleExperiment(href) {
    setData((current) => {
      const exists = current.completed.includes(href);

      return {
        ...current,
        completed: exists
          ? current.completed.filter((item) => item !== href)
          : [...current.completed, href],
      };
    });
  }

  function saveNote(event) {
    event.preventDefault();

    const title = noteTitle.trim();
    const body = noteBody.trim();

    if (!title || !body) return;

    if (editingNoteId) {
      setData((current) => ({
        ...current,
        notes: current.notes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title, body, updatedAt: new Date().toISOString() }
            : note
        ),
      }));
    } else {
      setData((current) => ({
        ...current,
        notes: [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            title,
            body,
            createdAt: new Date().toISOString(),
          },
          ...current.notes,
        ],
      }));
    }

    setNoteTitle("");
    setNoteBody("");
    setEditingNoteId(null);
  }

  function editNote(note) {
    setNoteTitle(note.title);
    setNoteBody(note.body);
    setEditingNoteId(note.id);
    setActiveTab("notes");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id) {
    if (!window.confirm("Delete this note?")) return;

    setData((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== id),
    }));

    if (editingNoteId === id) {
      setNoteTitle("");
      setNoteBody("");
      setEditingNoteId(null);
    }
  }

  function addTask(event) {
    event.preventDefault();

    const text = taskText.trim();
    if (!text) return;

    setData((current) => ({
      ...current,
      tasks: [
        ...current.tasks,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text,
          done: false,
        },
      ],
    }));

    setTaskText("");
  }

  function toggleTask(id) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    }));
  }

  function deleteTask(id) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
    }));
  }

  function openTab(id) {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setStatus("");
  }

  return (
    <main className={styles.page}>
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-[#091525] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="border-b border-slate-800 px-6 py-6">
            <Link
              href="/physics"
              className="inline-flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-slate-950">
                P
              </span>
              <span>
                <span className="block text-base font-black tracking-tight text-white">
                  Physics Lab
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  Student workspace
                </span>
              </span>
            </Link>
          </div>

          <div className="px-4 pt-7">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Learning space
            </p>

            <nav className="mt-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                    activeTab === item.id
                      ? "bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <span className="w-5 text-center text-lg">{item.icon}</span>
                  {item.label}
                  {item.id === "notes" && data.notes.length > 0 && (
                    <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                      {data.notes.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0d1a2b] p-4">
              <p className="text-sm font-bold text-white">Learn by exploring</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Read a concept, test it in a simulation and write down what you
                discover.
              </p>
              <button
                type="button"
                onClick={() => openTab("materials")}
                className="mt-4 text-xs font-bold text-cyan-300 hover:text-cyan-200"
              >
                Open learning materials →
              </button>
            </div>

            <Link
              href="/physics"
              className="mt-4 flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <span>←</span> Back to Physics
            </Link>
          </div>
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#07111f]/90 backdrop-blur-xl">
            <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation"
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-slate-200 lg:hidden"
                >
                  ☰
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    Student Learning Space
                  </p>
                  <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                    Simulate. Understand. Record. Improve.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {ready ? status || "Workspace ready" : "Loading workspace…"}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-bold text-cyan-300">
                  S
                </span>
              </div>
            </div>
          </header>

          <div className="px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
            {!ready ? (
              <div className="py-20 text-center text-sm text-slate-400">
                Loading your learning workspace…
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div>
                    <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-[#102a42] via-[#0d1a2b] to-[#0d1524] p-6 sm:p-9">
                      <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-cyan-300/10" />
                      <div className="pointer-events-none absolute -right-2 -top-10 h-44 w-44 rounded-full border border-cyan-300/10" />

                      <div className="relative max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                          Your physics workspace
                        </p>
                        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                          Turn theory into
                          <span className="block text-cyan-300">
                            understanding.
                          </span>
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                          Study fluid mechanics and aerodynamics through
                          interactive experiments. Explore the concepts, record
                          your observations and track your learning.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => openTab("simulations")}
                            className={styles.button}
                          >
                            Explore simulations <span className="ml-2">→</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openTab("materials")}
                            className={styles.secondary}
                          >
                            Read learning materials
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        {
                          label: "Simulations explored",
                          value: `${completedCount}/${simulations.length}`,
                          detail: "Mark an experiment complete",
                        },
                        {
                          label: "Learning materials",
                          value: materials.length,
                          detail: "Concepts and equations",
                        },
                        {
                          label: "Personal notes",
                          value: data.notes.length,
                          detail: "Your saved observations",
                        },
                        {
                          label: "Study tasks",
                          value: `${doneTaskCount}/${taskCount}`,
                          detail: "Tasks completed",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={`${styles.panel} p-5`}
                        >
                          <p className="text-xs font-semibold text-slate-400">
                            {stat.label}
                          </p>
                          <p className="mt-3 text-3xl font-black tracking-tight text-white">
                            {stat.value}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {stat.detail}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10">
                      <SectionHeading
                        eyebrow="Start here"
                        title="Continue your learning"
                        description="Choose a learning activity and work through it at your own pace."
                      />

                      <div className="grid gap-4 md:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => openTab("materials")}
                          className={`${styles.panel} p-5 text-left transition hover:border-cyan-400/50`}
                        >
                          <span className="text-2xl text-cyan-300">▤</span>
                          <h3 className="mt-4 font-bold text-white">
                            Study a concept
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Review equations and the physics behind each
                            experiment.
                          </p>
                          <span className="mt-4 inline-block text-sm font-bold text-cyan-300">
                            Browse materials →
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openTab("simulations")}
                          className={`${styles.panel} p-5 text-left transition hover:border-cyan-400/50`}
                        >
                          <span className="text-2xl text-cyan-300">◈</span>
                          <h3 className="mt-4 font-bold text-white">
                            Run an experiment
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Explore a simulation and observe how the flow
                            behaves.
                          </p>
                          <span className="mt-4 inline-block text-sm font-bold text-cyan-300">
                            Open simulation lab →
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openTab("notes")}
                          className={`${styles.panel} p-5 text-left transition hover:border-cyan-400/50`}
                        >
                          <span className="text-2xl text-cyan-300">✎</span>
                          <h3 className="mt-4 font-bold text-white">
                            Record an observation
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Keep equations, results and questions in one place.
                          </p>
                          <span className="mt-4 inline-block text-sm font-bold text-cyan-300">
                            Write a note →
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-10">
                      <SectionHeading
                        eyebrow="Suggested experiments"
                        title="Explore the lab"
                        description="Start with a topic that interests you. You can mark an experiment complete when you finish exploring it."
                      />

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {simulations.slice(0, 3).map((simulation) => (
                          <article
                            key={simulation.href}
                            className={`${styles.panel} p-5`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300">
                                {simulation.category}
                              </span>
                              {data.completed.includes(simulation.href) && (
                                <span className="text-xs font-semibold text-emerald-300">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-white">
                              {simulation.title}
                            </h3>
                            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                              {simulation.description}
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                              <Link
                                href={simulation.href}
                                className={styles.button}
                              >
                                Open lab →
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleExperiment(simulation.href)}
                                className="text-xs font-semibold text-slate-400 hover:text-cyan-300"
                              >
                                {data.completed.includes(simulation.href)
                                  ? "Undo"
                                  : "Mark complete"}
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "simulations" && (
                  <div>
                    <SectionHeading
                      eyebrow="Interactive laboratory"
                      title="Simulation Lab"
                      description="Choose an experiment, investigate the flow field and compare your observations with the learning materials."
                    />

                    <div className={`${styles.panel} mb-6 p-4`}>
                      <div className="grid gap-3 md:grid-cols-[1fr_240px]">
                        <input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Search experiments..."
                          aria-label="Search experiments"
                          className={styles.field}
                        />
                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          aria-label="Filter by topic"
                          className={styles.field}
                        >
                          {categories.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <p className="mb-4 text-xs text-slate-500">
                      Showing {filteredSimulations.length} of{" "}
                      {simulations.length} experiments
                    </p>

                    {filteredSimulations.length === 0 ? (
                      <EmptyState
                        title="No experiments found"
                        description="Try another search or select a different topic."
                      />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredSimulations.map((simulation, index) => {
                          const completed = data.completed.includes(
                            simulation.href
                          );

                          return (
                            <article
                              key={simulation.href}
                              className={`${styles.panel} flex flex-col p-5 transition hover:border-slate-600`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 font-black text-cyan-300">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                {completed ? (
                                  <span className="text-xs font-bold text-emerald-300">
                                    ✓ Completed
                                  </span>
                                ) : (
                                  <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                                    {simulation.level}
                                  </span>
                                )}
                              </div>

                              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
                                {simulation.category}
                              </p>
                              <h3 className="mt-2 text-lg font-bold text-white">
                                {simulation.title}
                              </h3>
                              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
                                {simulation.description}
                              </p>

                              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                                <Link
                                  href={simulation.href}
                                  className={styles.button}
                                >
                                  Open simulation →
                                </Link>
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleExperiment(simulation.href)
                                  }
                                  className={styles.secondary}
                                >
                                  {completed ? "Undo" : "Complete"}
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "materials" && (
                  <div>
                    <SectionHeading
                      eyebrow="Study centre"
                      title="Learning Materials"
                      description="Short concept guides, essential equations and practical questions to help you connect theory to your experiments."
                    />

                    <div className="grid items-start gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
                      <div className={`${styles.panel} p-3`}>
                        <p className="px-3 py-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                          Study topics
                        </p>

                        <div className="space-y-1">
                          {materials.map((material) => (
                            <button
                              key={material.id}
                              type="button"
                              onClick={() => setSelectedMaterial(material.id)}
                              className={`w-full rounded-xl px-3 py-3 text-left transition ${
                                selectedMaterial === material.id
                                  ? "bg-cyan-400/10 text-cyan-300"
                                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                              }`}
                            >
                              <span className="block text-sm font-semibold">
                                {material.title}
                              </span>
                              <span className="mt-1 block text-xs text-slate-500">
                                {material.category}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <article className={`${styles.panel} p-5 sm:p-8`}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                            {selectedMaterialData.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {selectedMaterialData.level}
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                          {selectedMaterialData.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                          {selectedMaterialData.subtitle}
                        </p>

                        <div className="mt-8 space-y-7">
                          {selectedMaterialData.content.map((section) => (
                            <section key={section.heading}>
                              <h4 className="font-bold text-slate-100">
                                {section.heading}
                              </h4>

                              {section.formula && (
                                <div className="my-4 overflow-x-auto rounded-xl border border-cyan-400/20 bg-[#07111f] px-4 py-5 text-center">
                                  <p className="font-mono text-xl font-bold text-cyan-300 sm:text-2xl">
                                    {section.formula}
                                  </p>
                                </div>
                              )}

                              <p className="mt-2 text-sm leading-7 text-slate-400">
                                {section.text}
                              </p>
                            </section>
                          ))}
                        </div>

                        <div className="mt-8 rounded-xl border border-slate-700 bg-[#091525] p-4">
                          <p className="text-sm font-bold text-white">
                            Put the theory into practice
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            Open the related simulation, observe the results and
                            record what you discover in your personal notes.
                          </p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setNoteTitle(
                                  `Notes: ${selectedMaterialData.title}`
                                );
                                setNoteBody("");
                                setEditingNoteId(null);
                                openTab("notes");
                              }}
                              className={styles.button}
                            >
                              Take notes
                            </button>
                            <button
                              type="button"
                              onClick={() => openTab("simulations")}
                              className={styles.secondary}
                            >
                              Browse experiments
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    <SectionHeading
                      eyebrow="Personal study notebook"
                      title="My Notes"
                      description="Write your observations, calculations, questions and conclusions. Your notes are saved in this browser on this device."
                    />

                    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <form
                        onSubmit={saveNote}
                        className={`${styles.panel} p-5 sm:p-6`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-bold text-white">
                            {editingNoteId ? "Edit note" : "Create a note"}
                          </h3>
                          {editingNoteId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteId(null);
                                setNoteTitle("");
                                setNoteBody("");
                              }}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              Cancel edit
                            </button>
                          )}
                        </div>

                        <label className="mt-5 block text-sm font-semibold text-slate-300">
                          Note title
                        </label>
                        <input
                          value={noteTitle}
                          onChange={(event) => setNoteTitle(event.target.value)}
                          placeholder="e.g. Observations from cylinder flow"
                          className={`${styles.field} mt-2`}
                          required
                        />

                        <label className="mt-5 block text-sm font-semibold text-slate-300">
                          Your notes
                        </label>
                        <textarea
                          value={noteBody}
                          onChange={(event) => setNoteBody(event.target.value)}
                          placeholder="Write your observations, equations, results or questions..."
                          className={`${styles.field} mt-2 min-h-56 resize-y`}
                          required
                        />

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button type="submit" className={styles.button}>
                            {editingNoteId ? "Update note" : "Save note"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNoteTitle("");
                              setNoteBody("");
                              setEditingNoteId(null);
                            }}
                            className={styles.secondary}
                          >
                            Clear form
                          </button>
                        </div>
                      </form>

                      <div>
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h3 className="font-bold text-white">Saved notes</h3>
                          <span className="text-xs text-slate-500">
                            {data.notes.length}{" "}
                            {data.notes.length === 1 ? "note" : "notes"}
                          </span>
                        </div>

                        {data.notes.length === 0 ? (
                          <EmptyState
                            title="Your notebook is empty"
                            description="Create your first note to save an observation or explain something you learned."
                          />
                        ) : (
                          <div className="space-y-3">
                            {data.notes.map((note) => (
                              <article
                                key={note.id}
                                className={`${styles.panel} p-5`}
                              >
                                <h4 className="font-bold text-white">
                                  {note.title}
                                </h4>
                                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                                  {note.body}
                                </p>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
                                  <span className="text-[11px] text-slate-500">
                                    {note.updatedAt
                                      ? "Updated"
                                      : "Created"}{" "}
                                    {new Date(
                                      note.updatedAt || note.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <div className="flex gap-3">
                                    <button
                                      type="button"
                                      onClick={() => editNote(note)}
                                      className="text-xs font-bold text-cyan-300 hover:text-cyan-200"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteNote(note.id)}
                                      className="text-xs font-bold text-rose-300 hover:text-rose-200"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "checklist" && (
                  <div>
                    <SectionHeading
                      eyebrow="Personal progress"
                      title="Study Checklist"
                      description="Break your learning into manageable steps. Add tasks, mark them complete and keep track of your study progress."
                    />

                    <div className={`${styles.panel} p-5 sm:p-7`}>
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-400">
                            Completed study tasks
                          </p>
                          <p className="mt-2 text-3xl font-black text-white">
                            {doneTaskCount}
                            <span className="text-lg font-medium text-slate-500">
                              {" "}
                              / {taskCount}
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setData((current) => ({
                              ...current,
                              tasks: current.tasks.filter(
                                (task) => !task.done
                              ),
                            }))
                          }
                          disabled={doneTaskCount === 0}
                          className={styles.secondary}
                        >
                          Clear completed
                        </button>
                      </div>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-cyan-400 transition-all"
                          style={{
                            width: `${
                              taskCount
                                ? (doneTaskCount / taskCount) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <form
                        onSubmit={addTask}
                        className="mt-7 flex flex-col gap-3 sm:flex-row"
                      >
                        <input
                          value={taskText}
                          onChange={(event) => setTaskText(event.target.value)}
                          placeholder="Add a study task..."
                          aria-label="New study task"
                          className={styles.field}
                        />
                        <button
                          type="submit"
                          disabled={!taskText.trim()}
                          className={styles.button}
                        >
                          Add task
                        </button>
                      </form>

                      <div className="mt-6 space-y-2">
                        {data.tasks.length === 0 ? (
                          <EmptyState
                            title="No tasks yet"
                            description="Add a task to plan your next study session."
                          />
                        ) : (
                          data.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#091525] px-4 py-3"
                            >
                              <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                                aria-label={`Mark ${task.text} ${
                                  task.done ? "incomplete" : "complete"
                                }`}
                                className="h-4 w-4 accent-cyan-400"
                              />
                              <span
                                className={`min-w-0 flex-1 text-sm ${
                                  task.done
                                    ? "text-slate-500 line-through"
                                    : "text-slate-200"
                                }`}
                              >
                                {task.text}
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                aria-label={`Delete task: ${task.text}`}
                                className="px-2 text-slate-500 hover:text-rose-300"
                              >
                                ×
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className={`${styles.panel} mt-5 p-5`}>
                      <h3 className="font-bold text-white">
                        Experiments you have completed
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Mark experiments as complete in the Simulation Lab.
                      </p>

                      <div className="mt-4 space-y-2">
                        {simulations
                          .filter((simulation) =>
                            data.completed.includes(simulation.href)
                          )
                          .map((simulation) => (
                            <div
                              key={simulation.href}
                              className="flex items-center gap-3 rounded-xl bg-[#091525] px-4 py-3"
                            >
                              <span className="text-emerald-300">✓</span>
                              <span className="text-sm text-slate-200">
                                {simulation.title}
                              </span>
                            </div>
                          ))}

                        {completedCount === 0 && (
                          <p className="text-sm text-slate-500">
                            No completed experiments yet. Start with one in the
                            Simulation Lab.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <footer className="mt-12 border-t border-slate-800 py-6">
              <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>Physics Lab · Student Workspace</p>
                <p>Learn at your pace. Experiment with purpose.</p>
              </div>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
