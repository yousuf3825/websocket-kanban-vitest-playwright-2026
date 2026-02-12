import { Calendar } from "@/components/ui/calendar";
import type { Task } from "@/types/kanban";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface KanbanCalendarProps {
  tasks: Task[];
  onSelectDate?: (date: Date) => void;
}

export function KanbanCalendar({ tasks, onSelectDate }: KanbanCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  // Map due dates to a Set of ISO date strings for quick lookup
  const dueDates = new Set(
    tasks
      .filter((t) => t.dueDate)
      .map((t) => new Date(t.dueDate!).toISOString().slice(0, 10))
  );

  // Highlight days with tasks due
  function modifiers(day: Date) {
    const iso = day.toISOString().slice(0, 10);
    return dueDates.has(iso) ? "has-task" : undefined;
  }

  return (
    <Card className="p-4 w-full max-w-md mx-auto mb-6">
      <h2 className="text-base font-semibold mb-2">Task Calendar</h2>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => {
          setSelected(date);
          onSelectDate?.(date!);
        }}
        modifiers={{ hasTask: (day) => modifiers(day) === "has-task" }}
        modifiersClassNames={{ hasTask: "bg-primary/20 border-primary border-2" }}
      />
    </Card>
  );
}
