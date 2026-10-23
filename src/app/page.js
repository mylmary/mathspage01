
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">

        {/* Introduction */}
        <header className="mb-16 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            ReactFlow3D · Interactive Learning Lab
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Learn science by seeing what happens.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            How does water move around an obstacle? What happens when a dam
            breaks? How does the shape of an object change the flow of air
            around it? ReactFlow3D is being developed to help learners
            investigate questions like these through interactive mathematics
            and physics experiments.
          </p>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Start with a subject below and explore the experiments currently
            available on the platform.
          </p>
        </header>

        {/* Subject selection */}
        <section id="learning-labs">
          <div className="mb-7">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Learning labs
            </h2>
            <p className="mt-2 leading-7 text-slate-400">
              Choose a subject to practise concepts, answer questions, and
              investigate how things work.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link
              href="/math"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-cyan-500"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-950 text-3xl">
                ∑
              </div>

              <h3 className="text-2xl font-bold group-hover:text-cyan-300">
                Mathematics
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Practise mathematical concepts, work through questions, and
                understand how mathematical ideas are used to solve problems.
              </p>

              <p className="mt-7 font-medium text-cyan-400">
                Enter Maths Lab →
              </p>
            </Link>

            <Link
              href="/physics"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-cyan-500"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-950 text-3xl">
                ⚛
              </div>

              <h3 className="text-2xl font-bold group-hover:text-cyan-300">
                Physics
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Investigate fluid mechanics, aerodynamics, shock waves,
                and other physical phenomena through interactive
                computational physics experiments.
              </p>

              <p className="mt-7 font-medium text-cyan-400">
                Enter Physics Lab →
              </p>
            </Link>
          </div>
        </section>

        {/* About ReactFlow3D */}
        <section className="mt-24 border-t border-slate-800 pt-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                About ReactFlow3D
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Making physical phenomena easier to explore.
              </h2>
            </div>

            <div className="space-y-5 leading-8 text-slate-300">
              <p>
                ReactFlow3D grew out of an interest in computational fluid
                dynamics (CFD), the study of how fluids such as water and
                air move. It also grew out of a practical question: how can
                we make the physics behind these movements easier for
                students to understand?
              </p>

              <p>
                In a textbook, a flow pattern may appear as a diagram or a
                set of equations. In an experiment, the same phenomenon
                can be investigated by changing conditions and observing
                the result. We want to bring more of that experience into
                science learning.
              </p>

              <p>
                The platform is being developed around interactive
                experiments, mathematical questions, and visual explanations.
                The aim is to help learners connect what they calculate
                with what happens in a physical system.
              </p>
            </div>
          </div>
        </section>

        {/* How the platform works */}
        <section className="mt-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">
              What can you do here?
            </h2>

            <p className="mt-4 leading-8 text-slate-400">
              The idea is to give learners something to investigate, not
              just something to read. The activities combine scientific
              concepts with questions and opportunities to examine results.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="mb-4 text-2xl">〰️</div>
              <h3 className="text-lg font-semibold">
                Observe physical behaviour
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Explore examples of fluid motion and other physics concepts
                through visual experiments.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="mb-4 text-2xl">⚙️</div>
              <h3 className="text-lg font-semibold">
                Investigate the conditions
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Where an experiment supports it, change its parameters,
                compare outcomes, and examine how the system responds.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 text-2xl">∑</div>
              <h3 className="text-lg font-semibold">
                Work through the questions
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Apply mathematical and physical principles to questions
                related to the concepts being studied.
              </p>
            </article>
          </div>
        </section>

        {/* Why we are building it */}
        <section className="mt-20 rounded-2xl border border-slate-800 bg-slate-900 p-7 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Why we are building it
          </p>

          <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-12">
            <h2 className="text-3xl font-bold leading-tight">
              Some things are easier to understand when you can investigate
              them yourself.
            </h2>

            <div className="space-y-4 leading-8 text-slate-300">
              <p>
                Access to specialised laboratory equipment is limited in
                many learning environments. Some scientific processes are
                also difficult to observe directly, even when the equipment
                is available.
              </p>

              <p>
                Computer-based experiments offer another way to study
                these processes. They can help learners examine a system,
                compare different conditions, and ask questions that go
                beyond memorising a definition or formula.
              </p>

              <p>
                ReactFlow3D aims to make these experiences easier to access,
                starting with mathematics and physics and with a particular
                interest in fluid mechanics.
              </p>
            </div>
          </div>
        </section>

        {/* Students and teachers */}
        <section className="mt-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">
              For learners and teachers
            </h2>

            <p className="mt-4 leading-8 text-slate-400">
              The platform is intended to support both independent study
              and classroom teaching. Each has different needs, and we
              want the tools to reflect that.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 p-7">
              <h3 className="text-xl font-bold text-cyan-300">
                For students
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                Explore a topic at your own pace, practise questions,
                revisit concepts you find difficult, and use experiments
                to connect equations with physical behaviour.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 p-7">
              <h3 className="text-xl font-bold text-cyan-300">
                For teachers
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                Use interactive examples to introduce concepts and give
                students questions to work through. As the teaching tools
                develop, the aim is to make it easier to prepare learning
                activities and organise questions for classroom use.
              </p>
            </article>
          </div>
        </section>

        {/* Where ReactFlow3D is heading */}
        <section className="mt-20 border-t border-slate-800 pt-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Where we are heading
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                From interactive examples to more advanced simulations.
              </h2>
            </div>

            <div className="space-y-5 leading-8 text-slate-300">
              <p>
                We are starting with accessible, browser-based learning
                activities. Over time, we want to develop more detailed
                simulations in which learners can investigate how changing
                an object's shape or the conditions around it affects the
                flow of water or air.
              </p>

              <p>
                Another area of development is AI-assisted learning.
                We are interested in how learning tools could respond to
                a student's progress, help identify misunderstandings,
                and provide relevant practice rather than giving every
                learner the same experience.
              </p>

              <p>
                Further development may include geometry-based flow
                prediction, more advanced three-dimensional visualisation,
                and virtual reality experiments. These are longer-term
                directions, not features we claim are already complete.
              </p>
            </div>
          </div>
        </section>

        {/* Closing section */}
        <section className="mt-20 rounded-2xl border border-cyan-900/70 bg-cyan-950/30 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Start with a question.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Choose a mathematics or physics topic, work through an
            experiment, and see which questions it raises for you.
          </p>

          <Link
            href="/physics"
            className="mt-7 inline-flex rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Browse physics experiments →
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 pt-6 text-center text-sm leading-6 text-slate-500">
          <p className="font-medium text-slate-300">ReactFlow3D</p>
          <p className="mt-2">
            Interactive learning in mathematics, physics, and computational
            science.
          </p>
        </footer>

      </div>
    </main>
  );
}
