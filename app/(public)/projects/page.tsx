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
    </div>
  );
}
