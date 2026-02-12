import type { Priority } from "@/types/kanban";
import { cn } from "@/lib/utils";

const config: Record<Priority, { label: string; classes: string }> = {
  low: { label: "Low", classes: "bg-priority-low-bg text-priority-low-fg" },
  medium: { label: "Medium", classes: "bg-priority-medium-bg text-priority-medium-fg" },
  high: { label: "High", classes: "bg-priority-high-bg text-priority-high-fg" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = config[priority];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", c.classes)}>
      {c.label}
    </span>
  );
}
