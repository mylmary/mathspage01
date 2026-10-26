
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "physics_teacher_dashboard_v1";

const SIMULATIONS = [
  { title: "Cylinder Flow", href: "/physics/cylinder-flow", category: "Fluid Mechanics" },
  { title: "Lid-Driven Cavity", href: "/physics/lid-driven-cavity", category: "Fluid Mechanics" },
  { title: "Sod Shock Tube", href: "/physics/sod-shock-tube", category: "Compressible Flow" },
  { title: "Flow Lines", href: "/physics/flow-lines", category: "Fluid Mechanics" },
  { title: "Nozzle Flow", href: "/physics/nozzle", category: "Compressible Flow" },
  { title: "Flat Plate", href: "/physics/flat-plate", category: "Aerodynamics" },
  { title: "NACA 0012 Airfoil", href: "/physics/naca0012", category: "Aerodynamics" },
  { title: "Dam Break", href: "/physics/dam-break", category: "Free-Surface Flow" },
  { title: "Magic Fluids", href: "/physics/magic-fluids", category: "Fluid Mechanics" },
];

const NAVIGATION = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "simulations", label: "Simulations", icon: "◈" },
  { id: "projects", label: "PINN / PINO Projects", icon: "◇" },
  { id: "planner", label: "Calendar & Planner", icon: "▦" },
  { id: "notes", label: "Teaching Notes", icon: "▤" },
  { id: "checklist", label: "Checklist", icon: "✓" },
  { id: "backup", label: "Backup & Data", icon: "↗" },
];

const INITIAL_DATA = {
  projects: [],
  events: [],
  notes: [],
  tasks: [],
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function localDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

function Panel({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(INITIAL_DATA);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [projectForm, setProjectForm] = useState({
    title: "",
    method: "PINN",
    status: "Planning",
    description: "",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    date: localDate(),
    type: "Lesson",
  });
  const [noteForm, setNoteForm] = useState({
    title: "",
    body: "",
  });
  const [taskForm, setTaskForm] = useState({ title: "" });
  const [editingNote, setEditingNote] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({
          ...INITIAL_DATA,
          ...parsed,
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          events: Array.isArray(parsed.events) ? parsed.events : [],
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        });
      }
    } catch (error) {
      console.error("Could not load teacher workspace:", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setMessage("Saved locally");
    } catch (error) {
      console.error("Could not save teacher workspace:", error);
      setMessage("Storage unavailable — export a backup");
    }
  }, [data, ready]);

  function updateData(key, updater) {
    setData((previous) => ({
      ...previous,
      [key]:
        typeof updater === "function"
          ? updater(previous[key])
          : updater,
    }));
  }

  function addProject(event) {
    event.preventDefault();
    if (!projectForm.title.trim()) return;

    if (editingProject) {
      updateData("projects", (items) =>
        items.map((item) =>
          item.id === editingProject
            ? { ...item, ...projectForm, title: projectForm.title.trim() }
            : item
        )
      );
    } else {
      updateData("projects", (items) => [
        {
          id: makeId(),
          ...projectForm,
          title: projectForm.title.trim(),
          createdAt: new Date().toISOString(),
        },
        ...items,
      ]);
    }

    setProjectForm({
      title: "",
      method: "PINN",
      status: "Planning",
      description: "",
    });
    setEditingProject(null);
  }

  function addEvent(event) {
    event.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date) return;

    if (editingEvent) {
      updateData("events", (items) =>
        items.map((item) =>
          item.id === editingEvent
            ? { ...item, ...eventForm, title: eventForm.title.trim() }
            : item
        )
      );
    } else {
      updateData("events", (items) => [
        {
          id: makeId(),
          ...eventForm,
          title: eventForm.title.trim(),
        },
        ...items,
      ]);
    }

    setEventForm({ title: "", date: localDate(), type: "Lesson" });
    setEditingEvent(null);
  }

  function addNote(event) {
    event.preventDefault();
    if (!noteForm.title.trim() && !noteForm.body.trim()) return;

    if (editingNote) {
      updateData("notes", (items) =>
        items.map((item) =>
          item.id === editingNote
            ? {
                ...item,
                ...noteForm,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } else {
      updateData("notes", (items) => [
        {
          id: makeId(),
          ...noteForm,
          createdAt: new Date().toISOString(),
        },
        ...items,
      ]);
    }

    setNoteForm({ title: "", body: "" });
    setEditingNote(null);
  }

  function addTask(event) {
    event.preventDefault();
    if (!taskForm.title.trim()) return;

    updateData("tasks", (items) => [
      {
        id: makeId(),
        title: taskForm.title.trim(),
        completed: false,
      },
      ...items,
    ]);
    setTaskForm({ title: "" });
  }

  function exportBackup() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: "ReactFlow3D teacher workspace",
            version: 1,
            exportedAt: new Date().toISOString(),
            data,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reactflow3d-teacher-backup-${localDate()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const imported = parsed.data ?? parsed;

      for (const key of ["projects", "events", "notes", "tasks"]) {
        if (!Array.isArray(imported[key])) {
          throw new Error(`Invalid or missing "${key}" data`);
        }
      }

      const confirmed = window.confirm(
        "Import this backup and replace the current workspace data? Export a backup first if you want to preserve the current version."
      );

      if (confirmed) {
        setData({
          projects: imported.projects,
          events: imported.events,
          notes: imported.notes,
          tasks: imported.tasks,
        });
        setMessage("Backup imported");
      }
    } catch (error) {
      window.alert(`Could not import backup: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  }

  function removeItem(key, id) {
    if (!window.confirm("Delete this item? This cannot be undone unless you have a backup.")) {
      return;
    }
    updateData(key, (items) => items.filter((item) => item.id !== id));
  }

  const today = localDate();
  const upcomingEvents = [...data.events]
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const pendingTasks = data.tasks.filter((task) => !task.completed).length;

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50";
  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-400 hover:text-blue-700";
  const smallDanger =
    "rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/physics" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-lg font-black text-white">
              R
            </span>
            <span className="text-lg font-bold tracking-tight">
              ReactFlow<span className="text-blue-600">3D</span>
              <span className="ml-2 hidden text-xs font-medium text-slate-400 sm:inline">
                TEACHER
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {ready ? message || "Ready" : "Loading workspace…"}
            </span>
            <Link href="/physics/student" className={secondaryButton}>
              Student Lab <span>↗</span>
            </Link>
            <button
              type="button"
              className={`${secondaryButton} lg:hidden`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              {menuOpen ? "Close" : "Menu"} ☰
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-9">
        <aside
          className={`${menuOpen ? "block" : "hidden"} h-fit lg:sticky lg:top-24 lg:block`}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1">
              {NAVIGATION.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                    activeTab === item.id
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="w-5 text-center text-base">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <Link
                href="/physics"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="w-5 text-center">←</span>
                Physics homepage
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-cyan-50 p-4">
            <p className="text-sm font-semibold text-cyan-950">
              Your workspace
            </p>
            <p className="mt-1 text-xs leading-5 text-cyan-900/70">
              Changes are saved in this browser. Export backups regularly.
            </p>
          </div>
        </aside>

        <section className="min-w-0">
          {!ready ? (
            <Panel>
              <p className="text-sm text-slate-500">Loading your workspace…</p>
            </Panel>
          ) : null}

          {ready && activeTab === "overview" && (
            <>
              <SectionTitle
                eyebrow="Your workspace"
                title="Good to see you."
                description="Your teaching tools, research projects and lesson planning in one calm workspace."
                action={
                  <button
                    type="button"
                    onClick={exportBackup}
                    className={secondaryButton}
                  >
                    Export backup ↗
                  </button>
                }
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Simulations", value: SIMULATIONS.length, icon: "◈", tab: "simulations" },
                  { label: "Research projects", value: data.projects.length, icon: "◇", tab: "projects" },
                  { label: "Upcoming events", value: upcomingEvents.length, icon: "▦", tab: "planner" },
                  { label: "Pending tasks", value: pendingTasks, icon: "✓", tab: "checklist" },
                ].map((stat) => (
                  <button
                    type="button"
                    key={stat.label}
                    onClick={() => setActiveTab(stat.tab)}
                    className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{stat.label}</span>
                      <span className="text-lg text-cyan-700">{stat.icon}</span>
                    </div>
                    <p className="mt-4 text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs font-medium text-blue-700">
                      Open section →
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <Panel>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">Upcoming</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Your next scheduled events
                      </p>
                    </div>
                    <button
                      type="button"
                      className={secondaryButton}
                      onClick={() => setActiveTab("planner")}
                    >
                      Planner →
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {upcomingEvents.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                        <div className="min-w-14 rounded-lg bg-white p-2 text-center">
                          <p className="text-xs font-bold text-cyan-700">
                            {item.date.slice(5)}
                          </p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.type}</p>
                        </div>
                      </div>
                    ))}
                    {upcomingEvents.length === 0 && (
                      <p className="py-5 text-sm text-slate-500">
                        Nothing scheduled yet. Add a lesson or deadline in your planner.
                      </p>
                    )}
                  </div>
                </Panel>

                <Panel>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">Your next tasks</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        A short list keeps the day focused
                      </p>
                    </div>
                    <button
                      type="button"
                      className={secondaryButton}
                      onClick={() => setActiveTab("checklist")}
                    >
                      Checklist →
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {data.tasks.filter((task) => !task.completed).slice(0, 5).map((task) => (
                      <label key={task.id} className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(event) =>
                            updateData("tasks", (items) =>
                              items.map((item) =>
                                item.id === task.id
                                  ? { ...item, completed: event.target.checked }
                                  : item
                              )
                            )
                          }
                          className="mt-1 accent-cyan-600"
                        />
                        <span className="text-sm">{task.title}</span>
                      </label>
                    ))}
                    {pendingTasks === 0 && (
                      <p className="py-5 text-sm text-slate-500">
                        You're all caught up. Add a task whenever you need one.
                      </p>
                    )}
                  </div>
                </Panel>
              </div>

              <Panel className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold">Continue your work</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Jump straight into a tool.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className={secondaryButton} onClick={() => setActiveTab("projects")}>Research projects</button>
                    <button className={secondaryButton} onClick={() => setActiveTab("notes")}>Teaching notes</button>
                    <button className={secondaryButton} onClick={() => setActiveTab("planner")}>Calendar</button>
                  </div>
                </div>
              </Panel>
            </>
          )}

          {ready && activeTab === "simulations" && (
            <>
              <SectionTitle
                eyebrow="Experiment library"
                title="Physics simulations"
                description="Open your existing simulation pages. Their routes remain separate from this dashboard."
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {SIMULATIONS.map((simulation, index) => (
                  <Link
                    key={simulation.href}
                    href={simulation.href}
                    className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-cyan-700">
                        EXPERIMENT {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700">↗</span>
                    </div>
                    <h3 className="mt-4 font-bold group-hover:text-blue-700">
                      {simulation.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500">
                      {simulation.category}
                    </p>
                    <p className="mt-4 text-sm font-medium text-blue-700">
                      Open simulation →
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {ready && activeTab === "projects" && (
            <>
              <SectionTitle
                eyebrow="Research workspace"
                title="PINN / PINO projects"
                description="Keep track of your physics-informed machine learning research, milestones and progress."
              />

              <Panel>
                <form onSubmit={addProject} className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold">
                      {editingProject ? "Edit project" : "New research project"}
                    </h3>
                    {editingProject && (
                      <button
                        type="button"
                        className={secondaryButton}
                        onClick={() => {
                          setEditingProject(null);
                          setProjectForm({ title: "", method: "PINN", status: "Planning", description: "" });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Project name">
                      <input
                        className={inputClass}
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. PINN for cylinder flow"
                        required
                      />
                    </Field>
                    <Field label="Method">
                      <select className={inputClass} value={projectForm.method} onChange={(e) => setProjectForm({ ...projectForm, method: e.target.value })}>
                        <option>PINN</option>
                        <option>PINO</option>
                        <option>PINN + PINO</option>
                        <option>Other</option>
                      </select>
                    </Field>
                    <Field label="Status">
                      <select className={inputClass} value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}>
                        <option>Planning</option>
                        <option>In progress</option>
                        <option>Testing</option>
                        <option>Completed</option>
                        <option>On hold</option>
                      </select>
                    </Field>
                    <Field label="Research question / next milestone">
                      <input
                        className={inputClass}
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="What are you investigating?"
                      />
                    </Field>
                  </div>

                  <button className={buttonClass} type="submit">
                    {editingProject ? "Save changes" : "Add project"} <span>→</span>
                  </button>
                </form>
              </Panel>

              <div className="mt-5 space-y-3">
                {data.projects.map((project) => (
                  <Panel key={project.id}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">{project.title}</h3>
                          <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800">{project.method}</span>
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{project.status}</span>
                        </div>
                        {project.description && (
                          <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className={secondaryButton}
                          onClick={() => {
                            setEditingProject(project.id);
                            setProjectForm({
                              title: project.title,
                              method: project.method,
                              status: project.status,
                              description: project.description || "",
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          Edit
                        </button>
                        <button className={smallDanger} onClick={() => removeItem("projects", project.id)}>Delete</button>
                      </div>
                    </div>
                  </Panel>
                ))}
                {data.projects.length === 0 && (
                  <EmptyState title="No research projects yet" description="Add your first PINN or PINO project above." />
                )}
              </div>
            </>
          )}

          {ready && activeTab === "planner" && (
            <>
              <SectionTitle
                eyebrow="Planning"
                title="Calendar & deadlines"
                description="Record lessons, meetings, research milestones and other important dates."
              />

              <Panel>
                <form onSubmit={addEvent} className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold">
                      {editingEvent ? "Edit event" : "Add an event"}
                    </h3>
                    {editingEvent && (
                      <button
                        type="button"
                        className={secondaryButton}
                        onClick={() => {
                          setEditingEvent(null);
                          setEventForm({ title: "", date: localDate(), type: "Lesson" });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1fr_170px_170px]">
                    <Field label="Event name">
                      <input className={inputClass} value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g. Prepare fluid mechanics lesson" required />
                    </Field>
                    <Field label="Date">
                      <input className={inputClass} type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                    </Field>
                    <Field label="Type">
                      <select className={inputClass} value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
                        <option>Lesson</option>
                        <option>Meeting</option>
                        <option>Deadline</option>
                        <option>Research</option>
                        <option>Personal reminder</option>
                      </select>
                    </Field>
                  </div>
                  <button type="submit" className={buttonClass}>
                    {editingEvent ? "Save event" : "Add to planner"} →
                  </button>
                </form>
              </Panel>

              <div className="mb-3 mt-7 flex items-center justify-between">
                <h3 className="font-bold">Scheduled events</h3>
                <span className="text-xs text-slate-500">{data.events.length} total</span>
              </div>

              <div className="space-y-3">
                {[...data.events].sort((a, b) => a.date.localeCompare(b.date)).map((item) => (
                  <Panel key={item.id}>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="min-w-20 rounded-xl bg-slate-50 px-3 py-3 text-center">
                        <p className="text-xs font-bold uppercase text-cyan-700">{item.date.slice(5)}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.date.slice(0, 4)}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <span className="mt-1 inline-block text-xs text-slate-500">{item.type}</span>
                        {item.date < today && (
                          <span className="ml-2 text-xs text-amber-700">Past event</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className={secondaryButton} onClick={() => {
                          setEditingEvent(item.id);
                          setEventForm({ title: item.title, date: item.date, type: item.type });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}>Edit</button>
                        <button className={smallDanger} onClick={() => removeItem("events", item.id)}>Delete</button>
                      </div>
                    </div>
                  </Panel>
                ))}
                {data.events.length === 0 && (
                  <EmptyState title="Your calendar is clear" description="Add your first lesson, meeting or deadline above." />
                )}
              </div>
            </>
          )}

          {ready && activeTab === "notes" && (
            <>
              <SectionTitle
                eyebrow="Knowledge space"
                title="Teaching notes"
                description="Keep lesson ideas, explanations, preparation notes and research thoughts together."
              />

              <Panel>
                <form onSubmit={addNote} className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold">
                      {editingNote ? "Edit note" : "Write a note"}
                    </h3>
                    {editingNote && (
                      <button
                        type="button"
                        className={secondaryButton}
                        onClick={() => {
                          setEditingNote(null);
                          setNoteForm({ title: "", body: "" });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <Field label="Title">
                    <input className={inputClass} value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="e.g. Introduction to boundary layers" />
                  </Field>
                  <Field label="Notes">
                    <textarea className={`${inputClass} min-h-36 resize-y`} value={noteForm.body} onChange={(e) => setNoteForm({ ...noteForm, body: e.target.value })} placeholder="Write your lesson outline, explanations, equations or ideas..." rows={5} />
                  </Field>
                  <button type="submit" className={buttonClass}>
                    {editingNote ? "Save changes" : "Save note"} →
                  </button>
                </form>
              </Panel>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {data.notes.map((note) => (
                  <Panel key={note.id}>
                    <h3 className="font-bold">{note.title || "Untitled note"}</h3>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{note.body}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-400">
                        {note.updatedAt ? "Updated" : "Created"}{" "}
                        {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button className={secondaryButton} onClick={() => {
                          setEditingNote(note.id);
                          setNoteForm({ title: note.title || "", body: note.body || "" });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}>Edit</button>
                        <button className={smallDanger} onClick={() => removeItem("notes", note.id)}>Delete</button>
                      </div>
                    </div>
                  </Panel>
                ))}
                {data.notes.length === 0 && (
                  <div className="md:col-span-2">
                    <EmptyState title="Your notebook is ready" description="Save your first teaching note using the form above." />
                  </div>
                )}
              </div>
            </>
          )}

          {ready && activeTab === "checklist" && (
            <>
              <SectionTitle
                eyebrow="Daily focus"
                title="Your checklist"
                description="Break preparation and research into manageable tasks. Tick items off as you finish."
              />

              <Panel>
                <form onSubmit={addTask} className="flex flex-col gap-3 sm:flex-row">
                  <input className={`${inputClass} flex-1`} value={taskForm.title} onChange={(e) => setTaskForm({ title: e.target.value })} placeholder="Add a task..." required />
                  <button className={buttonClass} type="submit">Add task +</button>
                </form>

                <div className="mt-5 flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">
                    {data.tasks.length - pendingTasks} of {data.tasks.length} completed
                  </span>
                  <button
                    className={secondaryButton}
                    onClick={() => {
                      if (window.confirm("Delete all completed tasks?")) {
                        updateData("tasks", (items) => items.filter((item) => !item.completed));
                      }
                    }}
                  >
                    Clear completed
                  </button>
                </div>

                {data.tasks.length > 0 && (
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-cyan-500 transition-all"
                      style={{ width: `${(data.tasks.filter((task) => task.completed).length / data.tasks.length) * 100}%` }}
                    />
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {data.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-3 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => updateData("tasks", (items) => items.map((item) => item.id === task.id ? { ...item, completed: e.target.checked } : item))}
                        className="h-4 w-4 accent-cyan-600"
                      />
                      <span className={`min-w-0 flex-1 break-words text-sm ${task.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {task.title}
                      </span>
                      <button className={smallDanger} onClick={() => removeItem("tasks", task.id)}>Delete</button>
                    </div>
                  ))}
                  {data.tasks.length === 0 && (
                    <EmptyState title="Nothing on your list" description="Add the next thing you need to prepare or complete." />
                  )}
                </div>
              </Panel>
            </>
          )}

          {ready && activeTab === "backup" && (
            <>
              <SectionTitle
                eyebrow="Your data"
                title="Backup & restore"
                description="Export a copy of your workspace or restore a previously exported JSON backup."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Panel>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-xl text-cyan-800">↗</div>
                  <h3 className="mt-4 font-bold">Export your workspace</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Download your projects, events, teaching notes and checklist in one JSON file.
                  </p>
                  <button type="button" onClick={exportBackup} className={`${buttonClass} mt-5 w-full`}>
                    Download backup ↓
                  </button>
                </Panel>

                <Panel>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-800">↑</div>
                  <h3 className="mt-4 font-bold">Restore a backup</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose a previously exported backup file. Restoring replaces the workspace data currently saved in this browser.
                  </p>
                  <label className={`${secondaryButton} mt-5 w-full cursor-pointer`}>
                    Choose JSON file ↑
                    <input className="sr-only" type="file" accept=".json,application/json" onChange={importBackup} />
                  </label>
                </Panel>
              </div>

              <Panel className="mt-5">
                <h3 className="font-bold">Workspace information</h3>
                <div className="mt-4 divide-y divide-slate-100">
                  {[
                    ["Research projects", data.projects.length],
                    ["Calendar events", data.events.length],
                    ["Teaching notes", data.notes.length],
                    ["Checklist items", data.tasks.length],
                    ["Simulations", SIMULATIONS.length],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-slate-600">{label}</span>
                      <span className="font-semibold tabular-nums">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-amber-800">
                  Browser storage is local to this browser and device. Clearing site data or using another device may make it unavailable. Export backups regularly.
                </p>
              </Panel>
            </>
          )}
        </section>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>ReactFlow3D · Teacher Workspace</span>
          <Link href="/physics" className="font-medium text-blue-700 hover:text-blue-900">
            ← Back to Physics Homepage
          </Link>
        </div>
      </footer>
    </main>
  );
}
