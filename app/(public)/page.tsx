import Link from "next/link";
import { listPublicProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await listPublicProjects();
  const heroProject = projects.find((p) => p.coverImageUrl) ?? null;

  return (
    <div>
      <section className="relative border-b border-line px-6 py-24 md:py-40 overflow-hidden">
        {heroProject?.coverImageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroProject.coverImageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
          </>
        )}
        <div className="relative">
          <h1
            className={`font-brand text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl ${
              heroProject ? "text-white" : ""
            }`}
          >
            Architecture for Ethiopia, built to last.
          </h1>
          <p className={`mt-4 max-w-xl ${heroProject ? "text-white/85" : "text-muted"}`}>
            ANDALUS designs and delivers residential, commercial, and institutional projects across
            Addis Ababa and beyond — from concept through permitting and construction.
          </p>
          <Link
            href="/contact"
            className={`mt-8 inline-block border px-5 py-2.5 font-meta text-xs uppercase tracking-wide transition-colors ${
              heroProject
                ? "border-white text-white hover:bg-white hover:text-black"
                : "border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            Start a project
          </Link>
        </div>
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
                className="block border border-line overflow-hidden hover:border-foreground transition-colors"
              >
                {project.coverImageUrl && (
                  <div className="aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="font-brand text-lg font-medium">{project.title}</div>
                  <div className="font-meta text-xs uppercase tracking-wide text-muted mt-1">
                    {project.city}
                  </div>
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
