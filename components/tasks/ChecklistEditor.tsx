"use client";

import { useTransition } from "react";
import { toggleChecklistItemAction } from "@/lib/actions/tasks";

type ChecklistItem = { id: string; label: string; required: boolean; done: boolean };

export function ChecklistEditor({
  items,
  projectId,
  taskId,
  editable,
}: {
  items: ChecklistItem[];
  projectId: string;
  taskId: string;
  editable: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={item.done}
            disabled={!editable || isPending}
            onChange={() => startTransition(() => toggleChecklistItemAction(item.id, projectId, taskId))}
          />
          <span className={item.done ? "line-through text-muted" : ""}>{item.label}</span>
          {item.required && <span className="font-meta text-[10px] text-muted uppercase">required</span>}
        </li>
      ))}
    </ul>
  );
}
