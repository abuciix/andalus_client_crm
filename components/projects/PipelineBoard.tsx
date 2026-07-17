"use client";

import { useTransition } from "react";
import Link from "next/link";
import { changeStageAction } from "@/lib/actions/pipeline";
import { PROJECT_STAGES, STAGE_LABELS } from "./StageBadge";
import type { Project, ProjectStage } from "@/app/generated/prisma/client";

export function PipelineBoard({ projects }: { projects: Project[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {PROJECT_STAGES.map((stage) => {
        const stageProjects = projects.filter((p) => p.stage === stage);
        return (
          <div key={stage} className="border border-line">
            <div className="border-b border-line px-3 py-2 font-meta text-[10px] uppercase tracking-wide text-muted">
              {STAGE_LABELS[stage]} ({stageProjects.length})
            </div>
            <div className="flex flex-col gap-2 p-2">
              {stageProjects.map((project) => (
                <div key={project.id} className="border border-line p-2 text-sm">
                  <Link href={`/staff/projects/${project.id}`} className="font-medium hover:underline">
                    {project.title}
                  </Link>
                  <div className="text-xs text-muted mb-2">{project.city}</div>
                  <select
                    value={project.stage}
                    disabled={isPending}
                    onChange={(e) => {
                      const newStage = e.target.value as ProjectStage;
                      startTransition(() => {
                        changeStageAction(project.id, newStage);
                      });
                    }}
                    className="w-full border border-line text-xs px-1 py-1"
                  >
                    {PROJECT_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {STAGE_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
