import { Droppable } from "@hello-pangea/dnd";
import type { Column, Task } from "@/types/kanban";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
}

export function KanbanColumn({ column, tasks, onDeleteTask, onSelectTask }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[300px] w-[340px] shrink-0">
      <div className="flex items-center justify-between px-2 mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {column.title}
        </h3>
        <span className="text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-xl p-2 space-y-2 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? "bg-primary/5" : "bg-column"
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={onDeleteTask}
                onSelect={onSelectTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
