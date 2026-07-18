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
      <div className="px-6 py-16 max-w-4xl">
        <div className="font-meta text-xs uppercase tracking-wide text-muted mb-2">
          {project.city}
        </div>
        <h1 className="font-brand text-3xl font-semibold mb-8">{project.title}</h1>

        {project.galleryImageUrls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.galleryImageUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={project.title}
                className="w-full border border-line object-cover"
              />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
