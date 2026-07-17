import Link from "next/link";
import { listPublicProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function ProjectGalleryPage() {
  const projects = await listPublicProjects();

  return (
    <div className="px-6 py-16">
      <h1 className="font-brand text-3xl font-semibold mb-8">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-muted">More projects coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
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
    </div>
  );
}
