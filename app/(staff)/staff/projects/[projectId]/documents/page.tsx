import { notFound } from "next/navigation";
import { getStaffProject } from "@/lib/data/projects";
import { requireStaff } from "@/lib/session";
import { NotFoundError } from "@/lib/errors";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { UploadDocumentForm } from "./DocumentActions";

export default async function StaffDocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await requireStaff();

  let project;
  try {
    project = await getStaffProject(projectId, session);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-brand text-2xl font-semibold mb-6">Documents — {project.title}</h1>
      <div className="mb-8">
        <UploadDocumentForm projectId={project.id} />
      </div>
      <DocumentViewer documents={project.documents} projectId={project.id} role="STAFF" />
    </div>
  );
}
