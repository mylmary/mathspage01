
"use client";

import { useEffect, useState } from "react";

const KEY = "physics_teacher_dashboard_v1";

const initialData = {
  simulations: [
    "Cylinder Flow",
    "Lid-Driven Cavity",
    "Sod Shock Tube",
    "Flow Lines",
    "Nozzle Flow",
    "Flat Plate",
    "NACA 0012 Airfoil",
    "Dam Break",
    "Magic Fluids",
  ].map((title, i) => ({
    id: `sim-${i}`,
    title,
    topic: "Physics simulation",
    status: "Needs preparation",
    notes: "",
  })),
  projects: [],
  events: [],
  notes: [],
  checklist: [
    { id: "c1", text: "Test the simulation", done: false },
    { id: "c2", text: "Prepare learning objectives", done: false },
    { id: "c3", text: "Prepare student instructions", done: false },
    { id: "c4", text: "Check the simulation on a phone", done: false },
  ],
};

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const input = {
  width: "100%",
  padding: 11,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  boxSizing: "border-box",
  fontSize: 15,
};

const button = {
  padding: "10px 13px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  background: "white",
  cursor: "pointer",
  fontWeight: 600,
};

function Panel({ title, children }) {
  return (
    <section
      style={{
        background: "white",
        padding: 16,
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        marginBottom: 16,
        minWidth: 0,
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: 19 }}>{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label
      style={{
        display: "grid",
        gap: 6,
        marginBottom: 12,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {label}
      {children}
    </label>
  );
}

export default function PhysicsTeacherDashboard() {
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [message, setMessage] = useState("");

  const [simulation, setSimulation] = useState({
    title: "",
    topic: "",
    status: "Needs preparation",
    notes: "",
  });

  const [project, setProject] = useState({
    title: "",
    type: "PINN",
    question: "",
    status: "Planning",
    nextStep: "",
  });

  const [event, setEvent] = useState({
    title: "",
    date: "",
    category: "Lab preparation",
    notes: "",
  });

  const [note, setNote] = useState({
    title: "",
    body: "",
  });

  const [task, setTask] = useState("");

  // Load saved dashboard data without requiring a sign-in.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setData({
          simulations: Array.isArray(parsed.simulations)
            ? parsed.simulations
            : initialData.simulations,
          projects: Array.isArray(parsed.projects)
            ? parsed.projects
            : [],
          events: Array.isArray(parsed.events)
            ? parsed.events
            : [],
          notes: Array.isArray(parsed.notes)
            ? parsed.notes
            : [],
          checklist: Array.isArray(parsed.checklist)
            ? parsed.checklist
            : initialData.checklist,
        });
      }
    } catch {
      setMessage("Could not load saved browser data.");
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save changes after the initial saved data has loaded.
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      setMessage("Browser storage is unavailable. Export a backup.");
    }
  }, [data, loaded]);

  function addItem(collection, item, reset) {
    setData((current) => ({
      ...current,
      [collection]: [
        { id: makeId(), ...item },
        ...current[collection],
      ],
    }));

    reset();
    setMessage("Saved successfully.");
  }

  function updateItem(collection, id, changes) {
    setData((current) => ({
      ...current,
      [collection]: current[collection].map((item) =>
        item.id === id ? { ...item, ...changes } : item
      ),
    }));
  }

  function deleteItem(collection, id) {
    if (!window.confirm("Delete this item?")) return;

    setData((current) => ({
      ...current,
      [collection]: current[collection].filter(
        (item) => item.id !== id
      ),
    }));
  }

  function exportBackup() {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "physics-lab-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);

        if (
          !Array.isArray(parsed.simulations) ||
          !Array.isArray(parsed.projects) ||
          !Array.isArray(parsed.events) ||
          !Array.isArray(parsed.notes) ||
          !Array.isArray(parsed.checklist)
        ) {
          throw new Error("Invalid backup");
        }

        if (window.confirm("Replace the current dashboard data?")) {
          setData(parsed);
          setMessage("Backup imported.");
        }
      } catch {
        setMessage("That file is not a valid dashboard backup.");
      }

      e.target.value = "";
    };

    reader.readAsText(file);
  }

  if (!loaded) {
    return (
      <main style={{ padding: 24 }}>
        Loading teacher dashboard...
      </main>
    );
  }

  const tabs = [
    "Overview",
    "Simulations",
    "PINN / PINO",
    "Calendar",
    "Teaching Notes",
    "Checklist",
  ];

  const upcoming = data.events
    .filter(
      (item) =>
        item.date >= new Date().toISOString().slice(0, 10)
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "clamp(12px,3vw,28px)",
        background: "#f1f5f9",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          padding: "clamp(20px,4vw,34px)",
          borderRadius: 18,
          color: "white",
          background: "linear-gradient(135deg,#0f172a,#075985)",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            color: "#67e8f9",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          PHYSICS SIMULATION LAB
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "clamp(26px,5vw,38px)",
          }}
        >
          Teacher Dashboard
        </h1>

        <p>
          Prepare simulations, research projects, lessons, and lab sessions.
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button style={button} onClick={exportBackup}>
            Export backup
          </button>

          <label style={{ ...button, background: "white" }}>
            Import backup
            <input
              type="file"
              accept=".json,application/json"
              onChange={importBackup}
              style={{ display: "none" }}
            />
          </label>

          <a
            href="/physics"
            style={{
              ...button,
              color: "#0f172a",
              textDecoration: "none",
            }}
          >
            Open Physics page
          </a>
        </div>
      </header>

      <nav
        style={{
          display: "flex",
          gap: 7,
          overflowX: "auto",
          paddingBottom: 12,
        }}
      >
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            style={{
              ...button,
              flexShrink: 0,
              background: tab === item ? "#0f172a" : "white",
              color: tab === item ? "white" : "#0f172a",
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {message && (
        <p
          role="status"
          style={{
            background: "#cffafe",
            padding: 10,
            borderRadius: 8,
          }}
        >
          {message}{" "}
          <button
            style={button}
            onClick={() => setMessage("")}
          >
            Dismiss
          </button>
        </p>
      )}

      {tab === "Overview" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(140px,1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              ["Simulations", data.simulations.length],
              ["PINN/PINO projects", data.projects.length],
              ["Upcoming events", upcoming.length],
              [
                "Tasks completed",
                `${data.checklist.filter((x) => x.done).length}/${data.checklist.length}`,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "white",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ color: "#64748b", fontSize: 13 }}>
                  {label}
                </div>

                <strong
                  style={{
                    display: "block",
                    fontSize: 27,
                    marginTop: 6,
                  }}
                >
                  {value}
                </strong>
              </div>
            ))}
          </div>

          <Panel title="Upcoming calendar">
            {upcoming.slice(0, 5).map((item) => (
              <p key={item.id}>
                <strong>
                  {item.date} — {item.title}
                </strong>
                <br />
                {item.category}
              </p>
            ))}

            {upcoming.length === 0 && (
              <p>No upcoming events scheduled.</p>
            )}
          </Panel>

          <Panel title="Recent teaching notes">
            {data.notes.slice(0, 5).map((item) => (
              <p key={item.id}>
                <strong>{item.title}</strong>
                <br />
                {item.body}
              </p>
            ))}

            {data.notes.length === 0 && (
              <p>No teaching notes yet.</p>
            )}
          </Panel>
        </>
      )}

      {tab === "Simulations" && (
        <>
          <Panel title="Add a simulation">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!simulation.title.trim()) return;

                addItem("simulations", simulation, () =>
                  setSimulation({
                    title: "",
                    topic: "",
                    status: "Needs preparation",
                    notes: "",
                  })
                );
              }}
            >
              <Field label="Simulation title">
                <input
                  required
                  style={input}
                  value={simulation.title}
                  onChange={(e) =>
                    setSimulation({
                      ...simulation,
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Topic">
                <input
                  style={input}
                  value={simulation.topic}
                  onChange={(e) =>
                    setSimulation({
                      ...simulation,
                      topic: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Preparation status">
                <select
                  style={input}
                  value={simulation.status}
                  onChange={(e) =>
                    setSimulation({
                      ...simulation,
                      status: e.target.value,
                    })
                  }
                >
                  {[
                    "Needs preparation",
                    "In progress",
                    "Needs testing",
                    "Ready for lesson",
                    "Archived",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>

              <Field label="Teacher notes">
                <textarea
                  style={{ ...input, minHeight: 90 }}
                  value={simulation.notes}
                  onChange={(e) =>
                    setSimulation({
                      ...simulation,
                      notes: e.target.value,
                    })
                  }
                />
              </Field>

              <button style={button}>Add simulation</button>
            </form>
          </Panel>

          <Panel title="Simulation library">
            {data.simulations.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <strong>{item.title}</strong>

                <button
                  style={{ ...button, float: "right" }}
                  onClick={() =>
                    deleteItem("simulations", item.id)
                  }
                >
                  Delete
                </button>

                <p>{item.topic}</p>

                <Field label="Status">
                  <select
                    style={input}
                    value={item.status}
                    onChange={(e) =>
                      updateItem("simulations", item.id, {
                        status: e.target.value,
                      })
                    }
                  >
                    {[
                      "Needs preparation",
                      "In progress",
                      "Needs testing",
                      "Ready for lesson",
                      "Archived",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Preparation notes">
                  <textarea
                    style={{ ...input, minHeight: 70 }}
                    value={item.notes}
                    onChange={(e) =>
                      updateItem("simulations", item.id, {
                        notes: e.target.value,
                      })
                    }
                  />
                </Field>
              </article>
            ))}
          </Panel>
        </>
      )}

      {tab === "PINN / PINO" && (
        <>
          <Panel title="Add a research project">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!project.title.trim()) return;

                addItem("projects", project, () =>
                  setProject({
                    title: "",
                    type: "PINN",
                    question: "",
                    status: "Planning",
                    nextStep: "",
                  })
                );
              }}
            >
              <Field label="Project name">
                <input
                  required
                  style={input}
                  value={project.title}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Method">
                <select
                  style={input}
                  value={project.type}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      type: e.target.value,
                    })
                  }
                >
                  <option>PINN</option>
                  <option>PINO</option>
                  <option>Other scientific ML</option>
                </select>
              </Field>

              <Field label="Research question / equation">
                <textarea
                  style={{ ...input, minHeight: 80 }}
                  value={project.question}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      question: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Status">
                <select
                  style={input}
                  value={project.status}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      status: e.target.value,
                    })
                  }
                >
                  {[
                    "Planning",
                    "Preparing data",
                    "Building model",
                    "Training",
                    "Validating",
                    "Complete",
                    "Paused",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>

              <Field label="Next step">
                <textarea
                  style={{ ...input, minHeight: 70 }}
                  value={project.nextStep}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      nextStep: e.target.value,
                    })
                  }
                />
              </Field>

              <button style={button}>Add project</button>
            </form>
          </Panel>

          <Panel title="Project board">
            {data.projects.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <strong>
                  {item.title} ({item.type})
                </strong>

                <button
                  style={{ ...button, float: "right" }}
                  onClick={() => deleteItem("projects", item.id)}
                >
                  Delete
                </button>

                <p>{item.question}</p>

                <Field label="Status">
                  <select
                    style={input}
                    value={item.status}
                    onChange={(e) =>
                      updateItem("projects", item.id, {
                        status: e.target.value,
                      })
                    }
                  >
                    {[
                      "Planning",
                      "Preparing data",
                      "Building model",
                      "Training",
                      "Validating",
                      "Complete",
                      "Paused",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Next step">
                  <textarea
                    style={input}
                    value={item.nextStep}
                    onChange={(e) =>
                      updateItem("projects", item.id, {
                        nextStep: e.target.value,
                      })
                    }
                  />
                </Field>
              </article>
            ))}

            {data.projects.length === 0 && (
              <p>No projects added yet.</p>
            )}
          </Panel>
        </>
      )}

      {tab === "Calendar" && (
        <>
          <Panel title="Add calendar event">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!event.title.trim() || !event.date) return;

                addItem("events", event, () =>
                  setEvent({
                    title: "",
                    date: "",
                    category: "Lab preparation",
                    notes: "",
                  })
                );
              }}
            >
              <Field label="Event title">
                <input
                  required
                  style={input}
                  value={event.title}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Date">
                <input
                  required
                  type="date"
                  style={input}
                  value={event.date}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      date: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Category">
                <select
                  style={input}
                  value={event.category}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      category: e.target.value,
                    })
                  }
                >
                  {[
                    "Lab preparation",
                    "Teaching session",
                    "PINN/PINO research",
                    "Assessment",
                    "Deadline",
                    "Other",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>

              <Field label="Notes">
                <textarea
                  style={input}
                  value={event.notes}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      notes: e.target.value,
                    })
                  }
                />
              </Field>

              <button style={button}>Add event</button>
            </form>
          </Panel>

          <Panel title="Scheduled events">
            {data.events
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((item) => (
                <p
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: 12,
                  }}
                >
                  <strong>
                    {item.date} — {item.title}
                  </strong>
                  <br />
                  {item.category}
                  {item.notes && (
                    <>
                      <br />
                      {item.notes}
                    </>
                  )}
                  <br />
                  <button
                    style={button}
                    onClick={() => deleteItem("events", item.id)}
                  >
                    Delete
                  </button>
                </p>
              ))}

            {data.events.length === 0 && (
              <p>No events scheduled.</p>
            )}
          </Panel>
        </>
      )}

      {tab === "Teaching Notes" && (
        <>
          <Panel title="Write a teaching note">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!note.title.trim() || !note.body.trim()) return;

                addItem("notes", note, () =>
                  setNote({ title: "", body: "" })
                );
              }}
            >
              <Field label="Title">
                <input
                  required
                  style={input}
                  value={note.title}
                  onChange={(e) =>
                    setNote({
                      ...note,
                      title: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Note content">
                <textarea
                  required
                  style={{ ...input, minHeight: 150 }}
                  value={note.body}
                  onChange={(e) =>
                    setNote({
                      ...note,
                      body: e.target.value,
                    })
                  }
                />
              </Field>

              <button style={button}>Save note</button>
            </form>
          </Panel>

          <Panel title="Saved notes">
            {data.notes.map((item) => (
              <article
                key={item.id}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  padding: "12px 0",
                }}
              >
                <strong>{item.title}</strong>

                <p style={{ whiteSpace: "pre-wrap" }}>
                  {item.body}
                </p>

                <button
                  style={button}
                  onClick={() => deleteItem("notes", item.id)}
                >
                  Delete
                </button>
              </article>
            ))}

            {data.notes.length === 0 && (
              <p>No notes saved yet.</p>
            )}
          </Panel>
        </>
      )}

      {tab === "Checklist" && (
        <Panel title="Lab preparation checklist">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!task.trim()) return;

              addItem(
                "checklist",
                { text: task.trim(), done: false },
                () => setTask("")
              );
            }}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <input
              style={input}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Add a preparation task"
            />

            <button style={button}>Add</button>
          </form>

          {data.checklist.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) =>
                  updateItem("checklist", item.id, {
                    done: e.target.checked,
                  })
                }
              />

              <span
                style={{
                  flex: 1,
                  textDecoration: item.done
                    ? "line-through"
                    : "none",
                }}
              >
                {item.text}
              </span>

              <button
                style={button}
                onClick={() =>
                  deleteItem("checklist", item.id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </Panel>
      )}

      <p
        style={{
          color: "#64748b",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        This dashboard saves data in this browser only. Export backups
        regularly. It does not yet sync data between devices or save to
        Supabase.
      </p>
    </main>
  );
}
