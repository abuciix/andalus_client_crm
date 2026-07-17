import type { ProjectStage } from "@/app/generated/prisma/client";

const STAGE_LABELS: Record<ProjectStage, string> = {
  LEAD: "Lead",
  CONTRACT: "Contract",
  DESIGN: "Design",
  PERMITTING: "Permitting",
  CONSTRUCTION: "Construction",
  COMPLETE: "Complete",
};

export function StageBadge({ stage }: { stage: ProjectStage }) {
  return (
    <span className="font-meta text-[10px] uppercase tracking-wide border border-line px-2 py-1">
      {STAGE_LABELS[stage]}
    </span>
  );
}

export const PROJECT_STAGES: ProjectStage[] = [
  "LEAD",
  "CONTRACT",
  "DESIGN",
  "PERMITTING",
  "CONSTRUCTION",
  "COMPLETE",
];

export { STAGE_LABELS };
