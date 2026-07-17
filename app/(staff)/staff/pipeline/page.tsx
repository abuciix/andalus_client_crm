import { prisma } from "@/lib/prisma";
import { PipelineBoard } from "@/components/projects/PipelineBoard";

export default async function PipelinePage() {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <h1 className="font-brand text-3xl font-semibold mb-8">Pipeline</h1>
      <PipelineBoard projects={projects} />
    </div>
  );
}
