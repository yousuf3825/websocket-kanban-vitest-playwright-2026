import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@/types/kanban";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryTag } from "./CategoryTag";
import { Paperclip, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
}

export function TaskCard({ task, index, onDelete, onSelect }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded-lg bg-card p-3.5 shadow-sm border border-border cursor-grab transition-shadow ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : "hover:shadow-md"
          }`}
          onClick={() => onSelect(task)}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-sm font-semibold text-card-foreground leading-snug line-clamp-2">
              {task.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="shrink-0 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
          )}
          {task.attachments.length > 0 && task.attachments[0].type.startsWith("image/") && (
            <img
              src={task.attachments[0].url}
              alt={task.attachments[0].name}
              className="w-full h-24 object-cover rounded-md mb-3"
            />
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge priority={task.priority} />
            <CategoryTag category={task.category} />
            {task.dueDate && (
              <span className="inline-flex items-center gap-0.5 text-xs text-blue-600 ml-auto">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.attachments.length > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground ml-auto">
                <Paperclip className="h-3 w-3" />
                {task.attachments.length}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
