import { notFound } from "next/navigation";
import { getPublicProject } from "@/lib/data/projects";
import { NotFoundError } from "@/lib/errors";

export default async function PublicProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  try {
    const project = await getPublicProject(projectId);
    return (
      <div className="px-6 py-16 max-w-3xl">
        <div className="font-meta text-xs uppercase tracking-wide text-muted mb-2">
          {project.city}
        </div>
        <h1 className="font-brand text-3xl font-semibold">{project.title}</h1>
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
