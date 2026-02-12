import { useState } from "react";
import { KanbanCalendar } from "./KanbanCalendar";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import type { Task, ColumnId } from "@/types/kanban";
import { COLUMNS } from "@/types/kanban";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { KanbanColumn } from "./KanbanColumn";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { ProgressChart } from "./ProgressChart";
import { LayoutDashboard } from "lucide-react";

export function KanbanBoard() {
  const { addTask, updateTask, moveTask, deleteTask, addAttachment, getTasksByColumn, stats, tasks } =
    useKanbanStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Calendar state: selected date for filtering
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    moveTask(draggableId, destination.droppableId as ColumnId, destination.index);
  };

  // Keep selected task in sync with store
  const liveSelected = selectedTask ? tasks.find((t) => t.id === selectedTask.id) ?? null : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">Kanban Board</h1>
        </div>
        <CreateTaskDialog onCreateTask={addTask} />
      </header>

      {/* Calendar */}
      <div className="px-6 pt-4">
        <KanbanCalendar
          tasks={tasks}
          onSelectDate={(date) => setCalendarDate(date)}
        />
      </div>

      {/* Stats bar */}
      <div className="px-6 py-4">
        <ProgressChart stats={stats} />
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full">
            {COLUMNS.map((col) => {
              // If a calendar date is selected, filter tasks for that date
              const filteredTasks = calendarDate
                ? getTasksByColumn(col.id).filter((t) => {
                    if (!t.dueDate) return false;
                    const due = new Date(t.dueDate);
                    return (
                      due.getFullYear() === calendarDate.getFullYear() &&
                      due.getMonth() === calendarDate.getMonth() &&
                      due.getDate() === calendarDate.getDate()
                    );
                  })
                : getTasksByColumn(col.id);
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={filteredTasks}
                  onDeleteTask={deleteTask}
                  onSelectTask={setSelectedTask}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Detail dialog */}
      <TaskDetailDialog
        task={liveSelected}
        open={!!liveSelected}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
        onAddAttachment={addAttachment}
      />
    </div>
  );
}
