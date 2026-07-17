import Link from "next/link";
import { redirect } from "next/navigation";
import { requireClient } from "@/lib/session";
import { listProjectsForSession } from "@/lib/data/projects";
import { StageBadge } from "@/components/projects/StageBadge";

export default async function PortalLandingPage() {
  const session = await requireClient();
  const projects = await listProjectsForSession(session);

  if (projects.length === 1) {
    redirect(`/portal/projects/${projects[0].id}`);
  }

  return (
    <div>
      <h1 className="font-brand text-3xl font-semibold mb-8">Your projects</h1>
      {projects.length === 0 ? (
        <p className="text-muted">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portal/projects/${project.id}`}
              className="block border border-line p-5 hover:border-foreground transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-brand text-lg font-medium">{project.title}</div>
                <StageBadge stage={project.stage} />
              </div>
              <div className="font-meta text-xs uppercase tracking-wide text-muted">{project.city}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
