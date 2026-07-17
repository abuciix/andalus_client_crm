import Link from "next/link";
import { listPublicProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await listPublicProjects();

  return (
    <div>
      <section className="border-b border-line px-6 py-24">
        <h1 className="font-brand text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
          Architecture for Ethiopia, built to last.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          ANDALUS designs and delivers residential, commercial, and institutional projects across
          Addis Ababa and beyond — from concept through permitting and construction.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block border border-foreground px-5 py-2.5 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background"
        >
          Start a project
        </Link>
      </section>

      <section className="px-6 py-16">
        <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-6">
          Featured Projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-muted">More projects coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block border border-line p-5 hover:border-foreground transition-colors"
              >
                <div className="font-brand text-lg font-medium">{project.title}</div>
                <div className="font-meta text-xs uppercase tracking-wide text-muted mt-1">
                  {project.city}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-line px-6 py-16">
        <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-6">Insights</h2>
        <p className="text-muted">
          Notes on design, permitting, and building in Ethiopia —{" "}
          <Link href="/insights" className="underline hover:text-foreground">
            coming soon
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
