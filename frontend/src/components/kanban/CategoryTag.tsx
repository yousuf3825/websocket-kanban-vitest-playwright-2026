import type { Category } from "@/types/kanban";
import { cn } from "@/lib/utils";

const config: Record<Category, { label: string; classes: string }> = {
  bug: { label: "Bug", classes: "bg-category-bug-bg text-category-bug" },
  feature: { label: "Feature", classes: "bg-category-feature-bg text-category-feature" },
  enhancement: { label: "Enhancement", classes: "bg-category-enhancement-bg text-category-enhancement" },
};

export function CategoryTag({ category }: { category: Category }) {
  const c = config[category];
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", c.classes)}>
      {c.label}
    </span>
  );
}
