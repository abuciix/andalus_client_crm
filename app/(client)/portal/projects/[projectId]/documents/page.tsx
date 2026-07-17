import { notFound } from "next/navigation";
import { requireClient } from "@/lib/session";
import { getClientProject } from "@/lib/data/projects";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { DocumentViewer } from "@/components/documents/DocumentViewer";

export default async function ClientDocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await requireClient();

  let project;
  try {
    project = await getClientProject(projectId, session);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) notFound();
    throw error;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-brand text-2xl font-semibold mb-6">Documents — {project.title}</h1>
      <DocumentViewer documents={project.documents} projectId={project.id} role="CLIENT" />
    </div>
  );
}
